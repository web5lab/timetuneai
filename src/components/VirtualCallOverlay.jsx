import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Clock, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { Capacitor } from '@capacitor/core';

const VirtualCallOverlay = ({ 
  isVisible, 
  reminder, 
  onAnswer, 
  onDismiss, 
  onSnooze 
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const { speak, stopSpeaking, isSpeaking } = useVoice();

  useEffect(() => {
    let interval;
    if (isVisible && isAnswered) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVisible, isAnswered]);

  useEffect(() => {
    if (isVisible && !isAnswered) {
      // Start speaking the reminder when call appears
      if (reminder && isSpeakerOn) {
        const message = `Hello! This is your TimeTuneAI assistant calling to remind you about: ${reminder.title}. ${reminder.description ? reminder.description : ''}`;
        speak(message);
      }
      
      // For Android, ensure screen stays on during call
      if (Capacitor.isNativePlatform() && isVisible) {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        
        // Prevent Android back button
        const handleBackButton = (e) => {
          e.preventDefault();
          return false;
        };
        
        document.addEventListener('backbutton', handleBackButton);
        
        return () => {
          document.removeEventListener('backbutton', handleBackButton);
          document.body.style.userSelect = '';
          document.body.style.webkitUserSelect = '';
        };
      }
    }
  }, [isVisible, reminder, isSpeakerOn, speak, isAnswered]);

  // Expose trigger function globally for Android integration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.triggerVirtualCall = (reminderData) => {
        console.log('Virtual call triggered from Android:', reminderData);
        // This would be called by the Android WebView
        // The parent component should handle this through props
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.triggerVirtualCall;
      }
    };
  }, []);
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = () => {
    setIsAnswered(true);
    setCallDuration(0);
    onAnswer();
    
    // Speak a greeting when answered
    if (isSpeakerOn) {
      const greeting = `Hi! I'm calling to remind you about ${reminder?.title}. Would you like me to mark this as complete or snooze it for later?`;
      speak(greeting);
    }
  };

  const handleDismiss = () => {
    stopSpeaking();
    setIsAnswered(false);
    setCallDuration(0);
    onDismiss();
  };

  const handleSnooze = () => {
    stopSpeaking();
    setIsAnswered(false);
    setCallDuration(0);
    onSnooze();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopSpeaking();
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    if (!isSpeakerOn) {
      stopSpeaking();
    }
  };

  if (!isVisible || !reminder) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-white text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span>TimeTuneAI</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm opacity-60"></div>
          <div className="w-4 h-2 bg-white rounded-sm opacity-80"></div>
          <div className="w-4 h-2 bg-white rounded-sm"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-white relative z-10">
        {/* Call Status */}
        <div className="text-center mb-8">
          <p className="text-lg opacity-90 mb-2">
            {isAnswered ? 'Connected' : 'Incoming call from'}
          </p>
          <h1 className="text-3xl font-bold mb-4">TimeTuneAI Assistant</h1>
          {isAnswered && (
            <p className="text-xl opacity-80">{formatDuration(callDuration)}</p>
          )}
        </div>

        {/* Avatar */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
            <User className="w-16 h-16 text-white" />
          </div>
          {!isAnswered && (
            <>
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-white/20 animate-ping"></div>
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-white/10 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>

        {/* Reminder Details */}
        <div className="text-center mb-8 max-w-sm">
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-lg">Reminder Alert</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">{reminder.title}</h2>
          {reminder.description && (
            <p className="text-white/80 text-sm leading-relaxed">{reminder.description}</p>
          )}
          <div className="flex items-center justify-center mt-3 text-sm opacity-75">
            <span>{reminder.time} • {new Date(reminder.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Call Controls */}
        {!isAnswered ? (
          /* Incoming Call Controls */
          <div className="flex items-center justify-center space-x-8">
            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>

            {/* Answer */}
            <button
              onClick={handleAnswer}
              className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
            >
              <Phone className="w-10 h-10 text-white" />
            </button>

            {/* Snooze */}
            <button
              onClick={handleSnooze}
              className="w-16 h-16 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Clock className="w-8 h-8 text-white" />
            </button>
          </div>
        ) : (
          /* Active Call Controls */
          <div className="flex items-center justify-center space-x-6">
            {/* Mute */}
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Speaker */}
            <button
              onClick={toggleSpeaker}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 ${
                isSpeakerOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {isSpeakerOn ? (
                <Volume2 className="w-6 h-6 text-white" />
              ) : (
                <VolumeX className="w-6 h-6 text-white" />
              )}
            </button>

            {/* End Call */}
            <button
              onClick={handleDismiss}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>
          </div>
        )}

        {/* Action Labels */}
        <div className="flex items-center justify-center space-x-8 mt-4 text-xs opacity-75">
          {!isAnswered ? (
            <>
              <span>Dismiss</span>
              <span>Answer</span>
              <span>Snooze</span>
            </>
          ) : (
            <>
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              <span>{isSpeakerOn ? 'Speaker On' : 'Speaker Off'}</span>
              <span>End Call</span>
            </>
          )}
        </div>
      </div>

      {/* Bottom Actions (when answered) */}
      {isAnswered && (
        <div className="p-6 space-y-3">
          <div className="flex space-x-3">
            <button
              onClick={() => {
                // Mark as complete
                handleDismiss();
              }}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
            >
              Mark Complete
            </button>
            <button
              onClick={handleSnooze}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
            >
              Snooze 5 min
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl font-medium transition-colors backdrop-blur-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Speaking Indicator */}
      {isSpeaking && isSpeakerOn && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-white text-sm">Speaking...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualCallOverlay;