import React, { useState, useEffect, useCallback, useRef } from 'react';
import VoiceCommandManager from './VoiceCommandManager';
import { GoogleGenAI } from '@google/genai';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import './JarvisCore.css';

const JarvisCore = ({ 
  onLayerToggle, 
  onRobotSelect, 
  onPlaybackControl,
  onGapAnalysis,
  onResourcePool,
  onVideoGenerate,
  onStatusReport,
  robots = [],
  currentStatus = {}
}) => {
  const [enabled, setEnabled] = useState(import.meta.env.VITE_ENABLE_VOICE === 'true');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [geminiClient, setGeminiClient] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  const voiceCommand = enabled ? VoiceCommandManager({ 
    onCommand: handleCommand, 
    enabled 
  }) : { isListening: false, isSupported: false };

  // Initialize speech synthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        console.log('Loaded voices:', availableVoices.length);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
    console.log('Checking API key...', apiKey ? 'Found' : 'Missing');
    if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
      try {
        const client = new GoogleGenAI({ apiKey });
        setGeminiClient(client);
        console.log('Gemini client initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Gemini client:', error);
      }
    } else {
      console.warn('Gemini API key not configured or is placeholder');
    }
  }, []);

  const jarvisSpeak = useCallback((text, options = {}) => {
    if (!voiceEnabled || !text) {
      console.log('Speech disabled or no text:', { voiceEnabled, text });
      return;
    }

    console.log('Jarvis speaking:', text);

    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a good voice
    const preferredVoices = [
      'Google UK English Male',
      'Microsoft David Desktop',
      'Microsoft David',
      'Google US English',
      'Alex',
      'Daniel'
    ];

    let selectedVoice = null;
    for (const preferred of preferredVoices) {
      selectedVoice = voices.find(v => v.name.includes(preferred));
      if (selectedVoice) break;
    }

    // Fallback to any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log('Using voice:', selectedVoice.name);
    } else {
      console.log('Using default voice');
    }

    // Jarvis-like parameters
    utterance.pitch = options.pitch || 0.9;
    utterance.rate = options.rate || 1.1;
    utterance.volume = options.volume || 0.9;

    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled, voices]);

  async function handleCommand(command) {
    setLastCommand(command.raw);
    setIsProcessing(true);

    try {
      switch (command.type) {
        case 'showLayer':
          handleLayerCommand(command, true);
          break;
        case 'hideLayer':
          handleLayerCommand(command, false);
          break;
        case 'focusRobot':
        case 'selectRobot':
          handleRobotSelect(command);
          break;
        case 'play':
          onPlaybackControl?.('play');
          jarvisSpeak('Initiating playback, sir.');
          break;
        case 'pause':
          onPlaybackControl?.('pause');
          jarvisSpeak('Playback paused.');
          break;
        case 'restart':
          onPlaybackControl?.('restart');
          jarvisSpeak('Resetting simulation.');
          break;
        case 'speedUp':
          onPlaybackControl?.('speedUp');
          jarvisSpeak('Increasing playback speed.');
          break;
        case 'slowDown':
          onPlaybackControl?.('slowDown');
          jarvisSpeak('Reducing playback speed.');
          break;
        case 'statusReport':
          handleStatusReport();
          break;
        case 'gapAnalysis':
          onGapAnalysis?.();
          jarvisSpeak('Running gap analysis. Analyzing terrain conditions and equipment capabilities.');
          break;
        case 'poolResources':
          onResourcePool?.();
          jarvisSpeak('Pooling resources from all available agencies.');
          break;
        case 'generateHardware':
          jarvisSpeak('Initiating generative hardware design protocol.');
          onGapAnalysis?.();
          break;
        case 'generateVideo':
          onVideoGenerate?.();
          jarvisSpeak('Preparing video generation. This will take approximately two to three minutes.');
          break;
        case 'generateNanaBanana':
          onVideoGenerate?.('nanoBanana');
          jarvisSpeak('Generating nano banana cinematography.');
          break;
        case 'help':
          handleHelp();
          break;
        case 'query':
          await handleGeminiQuery(command.raw);
          break;
        default:
          jarvisSpeak('Command not recognized, sir. Try saying "help" for available commands.');
      }
    } catch (error) {
      console.error('Command execution error:', error);
      jarvisSpeak('I apologize, sir. There was an error processing that command.');
    } finally {
      setIsProcessing(false);
    }
  }

  function handleLayerCommand(command, show) {
    const layerMap = {
      'flood': 'floodZones',
      'hazard': 'hazards',
      'target': 'targets',
      'resource': 'resources',
      'route': 'plannedRoute',
      'planned': 'plannedRoute'
    };

    let layerName = null;
    for (const [key, value] of Object.entries(layerMap)) {
      if (command.raw.includes(key)) {
        layerName = value;
        break;
      }
    }

    if (layerName) {
      onLayerToggle?.(layerName, show);
      const action = show ? 'Displaying' : 'Hiding';
      jarvisSpeak(`${action} ${layerName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
    }
  }

  function handleRobotSelect(command) {
    const robotNames = {
      'alpha': 'RBT-Alpha',
      'beta': 'RBT-Beta',
      'gamma': 'RBT-Gamma'
    };

    for (const [key, value] of Object.entries(robotNames)) {
      if (command.raw.includes(key)) {
        onRobotSelect?.(value);
        jarvisSpeak(`Focusing on ${key} robot.`);
        break;
      }
    }
  }

  function handleStatusReport() {
    const activeRobots = robots.filter(r => r.status === 'active').length;
    const totalRobots = robots.length;
    
    let report = `Status report: ${activeRobots} of ${totalRobots} robots are currently active.`;
    
    if (currentStatus.criticalAlerts) {
      report += ` ${currentStatus.criticalAlerts} critical alerts detected.`;
    }
    
    if (onStatusReport) {
      onStatusReport();
    }
    
    jarvisSpeak(report);
  }

  function handleHelp() {
    const helpText = `Available commands: Show or hide map layers. Select robots alpha, beta, or gamma. 
      Control playback with play, pause, or restart. Request status reports. Run gap analysis. 
      Pool resources. Generate videos. Ask me any question about the mission.`;
    jarvisSpeak(helpText);
  }

  async function handleGeminiQuery(query) {
    if (!geminiClient) {
      jarvisSpeak('I apologize, sir. AI services are not configured.');
      return;
    }

    try {
      jarvisSpeak('Analyzing your query.');
      
      const context = `You are JARVIS, the AI assistant for AEGIS disaster response system. 
        You are helping coordinate disaster response operations. 
        Be concise, professional, and helpful. Keep responses under 50 words.
        Current mission context: ${JSON.stringify(currentStatus)}
        
        User query: ${query}`;
      
      const response = await geminiClient.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: context,
      });
      
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || 
                   response.response?.text?.() || 
                   'I was unable to process that query, sir.';
      
      console.log('Gemini response:', text);
      jarvisSpeak(text);
    } catch (error) {
      console.error('Gemini query error:', error);
      jarvisSpeak('I encountered an error processing that query, sir. Please check the console for details.');
    }
  }

  return (
    <div className="jarvis-core">
      <div className="jarvis-indicator">
        <div className={`jarvis-arc ${voiceCommand.isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}>
          <svg viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeDasharray="282.7"
              strokeDashoffset={voiceCommand.isListening ? "70" : "282.7"}
              className="arc-circle"
            />
          </svg>
        </div>
        <div className="jarvis-icon">
          {voiceCommand.isListening ? (
            <Mic size={24} />
          ) : (
            <MicOff size={24} />
          )}
        </div>
      </div>

      <div className="jarvis-controls">
        <button 
          onClick={() => setEnabled(!enabled)}
          className={`jarvis-btn ${enabled ? 'active' : ''}`}
          title="Toggle voice commands"
        >
          {enabled ? <Mic size={18} /> : <MicOff size={18} />}
          <span>Voice</span>
        </button>
        
        <button 
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`jarvis-btn ${voiceEnabled ? 'active' : ''}`}
          title="Toggle voice feedback"
        >
          {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>Audio</span>
        </button>

        <button 
          onClick={() => jarvisSpeak('Audio test. Systems operational, sir.')}
          className="jarvis-btn"
          title="Test audio output"
        >
          <Volume2 size={18} />
          <span>Test</span>
        </button>
      </div>

      {lastCommand && (
        <div className="jarvis-transcript">
          <div className="transcript-label">Last Command:</div>
          <div className="transcript-text">{lastCommand}</div>
          {isSpeaking && (
            <div className="transcript-label" style={{ color: '#10b981', marginTop: '4px' }}>
              🔊 Speaking...
            </div>
          )}
        </div>
      )}

      {voiceEnabled && voices.length === 0 && (
        <div className="jarvis-warning" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#fbbf24' }}>
          Loading voices... If this persists, try clicking the Test button.
        </div>
      )}

      {!voiceEnabled && (
        <div className="jarvis-warning" style={{ background: 'rgba(100, 116, 139, 0.1)', borderColor: 'rgba(100, 116, 139, 0.3)', color: '#94a3b8' }}>
          Audio feedback disabled. Enable to hear Jarvis respond.
        </div>
      )}

      {!voiceCommand.isSupported && enabled && (
        <div className="jarvis-warning">
          Voice recognition not supported in this browser. Please use Chrome or Edge.
        </div>
      )}
    </div>
  );
};

export default JarvisCore;
