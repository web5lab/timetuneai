import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

export class VoiceService {
  private static instance: VoiceService;
  private isInitialized = false;
  private isListening = false;

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Check if running on native platform
      if (!Capacitor.isNativePlatform()) {
        console.log('Voice services not available on web platform');
        return false;
      }

      // Request speech recognition permissions
      const speechPermission = await SpeechRecognition.requestPermissions();
      
      if (speechPermission.speechRecognition === 'granted') {
        this.isInitialized = true;
        console.log('Voice services initialized successfully');
        return true;
      } else {
        console.log('Speech recognition permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error initializing voice services:', error);
      return false;
    }
  }

  async startListening(onResult: (text: string) => void, onError?: (error: string) => void): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) return false;
      }

      if (this.isListening) {
        await this.stopListening();
      }

      // Check if speech recognition is available
      const available = await SpeechRecognition.available();
      if (!available.available) {
        onError?.('Speech recognition not available');
        return false;
      }

      // Clear any existing listeners to prevent duplicates
      this.removeAllListeners();

      this.isListening = true;
      let hasReceivedFinalResult = false;

      // Start speech recognition
      await SpeechRecognition.start({
        language: 'en-US',
        maxResults: 1,
        prompt: 'Speak your reminder...',
        partialResults: false, // Disable partial results to prevent multiple triggers
        popup: false,
      });

      // Listen for results
      SpeechRecognition.addListener('finalResults', (data) => {
        if (hasReceivedFinalResult) return; // Prevent duplicate final results
        hasReceivedFinalResult = true;
        
        this.isListening = false;
        if (data.matches && data.matches.length > 0) {
          console.log('Voice recognition final result:', data.matches[0]);
          onResult(data.matches[0]);
        }
        
        // Clean up listeners after getting result
        setTimeout(() => {
          this.removeAllListeners();
        }, 100);
      });

      SpeechRecognition.addListener('speechError', (error) => {
        if (hasReceivedFinalResult) return; // Prevent error after successful result
        
        this.isListening = false;
        console.error('Voice recognition error:', error);
        onError?.(error.message || 'Speech recognition error');
        
        // Clean up listeners after error
        setTimeout(() => {
          this.removeAllListeners();
        }, 100);
      });

      return true;
    } catch (error) {
      this.isListening = false;
      console.error('Error starting speech recognition:', error);
      onError?.('Failed to start speech recognition');
      return false;
    }
  }

  async stopListening(): Promise<void> {
    try {
      if (this.isListening) {
        await SpeechRecognition.stop();
        this.isListening = false;
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }

  async speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Fallback to web speech synthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = options?.rate || 1;
          utterance.pitch = options?.pitch || 1;
          utterance.volume = options?.volume || 1;
          window.speechSynthesis.speak(utterance);
          return true;
        }
        return false;
      }

      await TextToSpeech.speak({
        text,
        lang: 'en-US',
        rate: options?.rate || 1.0,
        pitch: options?.pitch || 1.0,
        volume: options?.volume || 1.0,
        category: 'ambient',
      });

      return true;
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      return false;
    }
  }

  async stopSpeaking(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.stop();
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  async getSupportedLanguages(): Promise<string[]> {
    try {
      if (Capacitor.isNativePlatform()) {
        const languages = await SpeechRecognition.getSupportedLanguages();
        return languages.languages || ['en-US'];
      }
      return ['en-US'];
    } catch (error) {
      console.error('Error getting supported languages:', error);
      return ['en-US'];
    }
  }

  // Clean up listeners
  removeAllListeners(): void {
    try {
      SpeechRecognition.removeAllListeners();
    } catch (error) {
      console.error('Error removing listeners:', error);
    }
  }
}

export const voiceService = VoiceService.getInstance();