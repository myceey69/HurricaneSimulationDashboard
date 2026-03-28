import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Buffer } from 'buffer';

const LyriaAudioEngine = ({ enabled = true, theme = 'planning', onError, onReady }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  
  const audioContextRef = useRef(null);
  const sessionRef = useRef(null);
  const sourceNodesRef = useRef([]);
  const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

  // Musical themes for different mission states
  const themes = {
    planning: {
      prompt: 'Minimal ambient electronic music with deep bass, sparse percussion, atmospheric pads, and subtle synth textures. Calm and focused.',
      bpm: 85,
      temperature: 0.8
    },
    deployment: {
      prompt: 'Mid-tempo electronic music with steady percussion, layered synths, and driving bass. Purposeful and energetic.',
      bpm: 105,
      temperature: 0.9
    },
    critical: {
      prompt: 'Intense electronic music with fast percussion, urgent synths, heavy bass, and dramatic tension. High energy.',
      bpm: 125,
      temperature: 1.0
    },
    success: {
      prompt: 'Uplifting electronic music with warm harmonies, bright synths, and positive melodic progressions. Triumphant.',
      bpm: 110,
      temperature: 0.85
    },
    emergency: {
      prompt: 'Dark urgent electronic music with aggressive percussion, dissonant synths, and pulsing bass. Maximum tension.',
      bpm: 135,
      temperature: 1.1
    }
  };

  useEffect(() => {
    if (!enabled) {
      disconnect();
      return;
    }

    initializeAudio();

    return () => {
      disconnect();
    };
  }, [enabled]);

  useEffect(() => {
    if (enabled && isConnected && theme !== currentTheme) {
      changeTheme(theme);
    }
  }, [theme, enabled, isConnected, currentTheme]);

  const initializeAudio = async () => {
    try {
      // Create Web Audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 44100
        });
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      onReady?.();
    } catch (error) {
      console.error('Audio initialization error:', error);
      onError?.(error);
    }
  };

  const connect = async () => {
    if (!apiKey || !audioContextRef.current) {
      console.error('API key or audio context not available');
      return;
    }

    try {
      const client = new GoogleGenAI({
        apiKey: apiKey,
        apiVersion: 'v1alpha'
      });

      const session = await client.live.music.connect({
        model: 'models/lyria-realtime-exp',
        callbacks: {
          onmessage: handleAudioMessage,
          onerror: handleLyriaError,
          onclose: () => {
            console.log('Lyria session closed');
            setIsConnected(false);
            setIsPlaying(false);
          }
        }
      });

      sessionRef.current = session;
      setIsConnected(true);

      // Set initial theme
      const themeConfig = themes[currentTheme] || themes.planning;
      
      await session.setWeightedPrompts({
        weightedPrompts: [
          { text: themeConfig.prompt, weight: 1.0 }
        ]
      });

      await session.setMusicGenerationConfig({
        musicGenerationConfig: {
          bpm: themeConfig.bpm,
          temperature: themeConfig.temperature,
          audioFormat: 'pcm16',
          sampleRateHz: 44100
        }
      });

      await session.play();
      setIsPlaying(true);

    } catch (error) {
      console.error('Lyria connection error:', error);
      onError?.(error);
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    if (sessionRef.current) {
      try {
        sessionRef.current.stop?.();
      } catch (e) {
        console.error('Error stopping session:', e);
      }
      sessionRef.current = null;
    }

    // Clean up source nodes
    sourceNodesRef.current.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // Node might already be stopped
      }
    });
    sourceNodesRef.current = [];

    setIsConnected(false);
    setIsPlaying(false);
  };

  const handleAudioMessage = (message) => {
    if (!message.serverContent?.audioChunks || !audioContextRef.current) {
      return;
    }

    try {
      for (const chunk of message.serverContent.audioChunks) {
        // Decode base64 to ArrayBuffer
        const binaryString = atob(chunk.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Convert PCM16 to Float32 for Web Audio
        const pcm16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
          float32[i] = pcm16[i] / 32768.0; // Convert to -1.0 to 1.0 range
        }

        // Create audio buffer (stereo)
        const audioBuffer = audioContextRef.current.createBuffer(
          2, // stereo
          float32.length / 2,
          44100
        );

        // Split interleaved stereo data
        const leftChannel = audioBuffer.getChannelData(0);
        const rightChannel = audioBuffer.getChannelData(1);
        
        for (let i = 0; i < float32.length / 2; i++) {
          leftChannel[i] = float32[i * 2];
          rightChannel[i] = float32[i * 2 + 1];
        }

        // Play the buffer
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();

        // Store reference for cleanup
        sourceNodesRef.current.push(source);

        // Clean up old nodes
        source.onended = () => {
          const index = sourceNodesRef.current.indexOf(source);
          if (index > -1) {
            sourceNodesRef.current.splice(index, 1);
          }
        };
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleLyriaError = (error) => {
    console.error('Lyria error:', error);
    onError?.(error);
  };

  const changeTheme = async (newTheme) => {
    if (!sessionRef.current || !themes[newTheme]) {
      return;
    }

    try {
      const themeConfig = themes[newTheme];
      
      await sessionRef.current.setWeightedPrompts({
        weightedPrompts: [
          { text: themeConfig.prompt, weight: 1.0 }
        ]
      });

      await sessionRef.current.setMusicGenerationConfig({
        musicGenerationConfig: {
          bpm: themeConfig.bpm,
          temperature: themeConfig.temperature,
          audioFormat: 'pcm16',
          sampleRateHz: 44100
        }
      });

      setCurrentTheme(newTheme);
    } catch (error) {
      console.error('Theme change error:', error);
    }
  };

  const pause = async () => {
    if (sessionRef.current) {
      try {
        await sessionRef.current.pause?.();
        setIsPlaying(false);
      } catch (error) {
        console.error('Pause error:', error);
      }
    }
  };

  const resume = async () => {
    if (sessionRef.current) {
      try {
        await sessionRef.current.play?.();
        setIsPlaying(true);
      } catch (error) {
        console.error('Resume error:', error);
      }
    }
  };

  return {
    connect,
    disconnect,
    pause,
    resume,
    changeTheme,
    isPlaying,
    isConnected,
    currentTheme,
    availableThemes: Object.keys(themes)
  };
};

export default LyriaAudioEngine;
