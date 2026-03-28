import { useState, useEffect, useRef, useCallback } from 'react';

const VoiceCommandManager = ({ onCommand, enabled = true }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  const wakeWord = import.meta.env.VITE_JARVIS_WAKE_WORD || 'Jarvis';

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Voice recognition started');
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.trim().toLowerCase();
        const isFinal = event.results[current].isFinal;

        setTranscript(transcript);

        if (isFinal) {
          handleTranscript(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech' || event.error === 'aborted') {
          // Restart on common errors
          setTimeout(() => {
            if (enabled && isListening) {
              try {
                recognition.start();
              } catch (e) {
                // Already started
              }
            }
          }, 100);
        }
      };

      recognition.onend = () => {
        if (enabled && isListening) {
          try {
            recognition.start();
          } catch (e) {
            // Already started
          }
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleTranscript = (text) => {
    // Check for wake word
    if (text.includes(wakeWord.toLowerCase())) {
      const command = text.replace(wakeWord.toLowerCase(), '').trim();
      if (command) {
        parseCommand(command);
      }
    }
  };

  const parseCommand = (command) => {
    console.log('Received command:', command);
    
    // Command patterns
    const patterns = {
      // Navigation commands
      showLayer: /show (flood zones?|hazards?|targets?|resources?|planned routes?)/i,
      hideLayer: /hide (flood zones?|hazards?|targets?|resources?|planned routes?)/i,
      focusRobot: /focus on (robot )?(alpha|beta|gamma)/i,
      selectRobot: /select (robot )?(alpha|beta|gamma)/i,
      
      // Playback commands
      play: /play|start (playback|replay|simulation)?/i,
      pause: /pause|stop (playback|replay|simulation)?/i,
      restart: /restart|reset (playback|replay|simulation)?/i,
      speedUp: /speed up|faster|increase speed/i,
      slowDown: /slow down|slower|decrease speed/i,
      
      // Analysis commands
      statusReport: /status report|what's the status|current status/i,
      gapAnalysis: /identify gaps?|gap analysis|what's missing/i,
      poolResources: /pool resources|sync resources/i,
      generateHardware: /generate (hardware|bot|robot)|design (hardware|bot|robot)/i,
      
      // Video generation
      generateVideo: /generate video|create video|make video/i,
      generateNanaBanana: /nano banana|banana video/i,
      
      // Mission commands
      deployRobot: /deploy (robot )?(alpha|beta|gamma)/i,
      
      // Help
      help: /help|what can (you|I) do/i,
    };

    let matched = false;

    // Match command patterns
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = command.match(pattern);
      if (match) {
        matched = true;
        onCommand({
          type: key,
          raw: command,
          params: match.slice(1).filter(Boolean)
        });
        break;
      }
    }

    // If no pattern matched, send to Gemini for interpretation
    if (!matched) {
      onCommand({
        type: 'query',
        raw: command,
        params: []
      });
    }
  };

  const startListening = useCallback(() => {
    if (recognitionRef.current && enabled && isSupported) {
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log('Recognition already started');
      }
    }
  }, [enabled, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  }, []);

  useEffect(() => {
    if (enabled && isSupported) {
      startListening();
    } else {
      stopListening();
    }
  }, [enabled, isSupported, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening
  };
};

export default VoiceCommandManager;
