import { useState, useEffect, useRef } from 'react';

const TextToSpeech = ({ enabled = true }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const queueRef = useRef([]);
  const currentUtteranceRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setIsSupported(false);
      console.warn('Speech synthesis not supported in this browser');
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text, options = {}) => {
    if (!isSupported || !enabled || !text) return Promise.resolve();

    return new Promise((resolve, reject) => {
      // Cancel current speech if interrupting
      if (options.interrupt && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        queueRef.current = [];
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Voice selection - prefer male British voice for Jarvis-like quality
      const preferredVoices = [
        'Google UK English Male',
        'Microsoft David Desktop',
        'Alex',
        'Daniel'
      ];

      let selectedVoice = null;
      for (const preferred of preferredVoices) {
        selectedVoice = voices.find(v => v.name.includes(preferred));
        if (selectedVoice) break;
      }

      // Fallback to any English male voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david'))
        );
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Jarvis-like parameters
      utterance.pitch = options.pitch || 0.9; // Slightly lower pitch
      utterance.rate = options.rate || 1.1; // Slightly faster, more efficient
      utterance.volume = options.volume || 0.8;

      utterance.onstart = () => {
        setIsSpeaking(true);
        currentUtteranceRef.current = utterance;
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        resolve();
        
        // Process queue
        if (queueRef.current.length > 0) {
          const next = queueRef.current.shift();
          speak(next.text, next.options);
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        reject(event);
      };

      // If already speaking and not interrupting, add to queue
      if (window.speechSynthesis.speaking && !options.interrupt) {
        queueRef.current.push({ text, options });
      } else {
        window.speechSynthesis.speak(utterance);
      }
    });
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      queueRef.current = [];
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    }
  };

  const pause = () => {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported
  };
};

export default TextToSpeech;
