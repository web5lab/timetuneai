import { useState, useEffect, useCallback } from 'react';
import { voiceService } from '../services/voiceService';

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize voice service
    const initializeVoice = async () => {
      const supported = await voiceService.initialize();
      setIsVoiceSupported(supported);
    };

    initializeVoice();

    // Cleanup on unmount
    return () => {
      voiceService.removeAllListeners();
      voiceService.stopListening();
      voiceService.stopSpeaking();
    };
  }, []);

  const startListening = useCallback(async (onResult?: (text: string) => void) => {
    setError(null);
    setTranscribedText('');
    
    const success = await voiceService.startListening(
      (text) => {
        setTranscribedText(text);
        onResult?.(text);
      },
      (errorMessage) => {
        setError(errorMessage);
        setIsListening(false);
      }
    );

    if (success) {
      setIsListening(true);
    } else {
      setError('Failed to start voice recognition');
    }

    return success;
  }, []);

  const stopListening = useCallback(async () => {
    await voiceService.stopListening();
    setIsListening(false);
  }, []);

  const speak = useCallback(async (text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
    setIsSpeaking(true);
    const success = await voiceService.speak(text, options);
    
    // Set speaking to false after a delay (estimate based on text length)
    const estimatedDuration = (text.length / 10) * 1000; // Rough estimate
    setTimeout(() => {
      setIsSpeaking(false);
    }, Math.max(estimatedDuration, 1000));

    return success;
  }, []);

  const stopSpeaking = useCallback(async () => {
    await voiceService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  const toggleListening = useCallback(async (onResult?: (text: string) => void) => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening(onResult);
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSpeaking,
    isVoiceSupported,
    transcribedText,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    toggleListening,
  };
};