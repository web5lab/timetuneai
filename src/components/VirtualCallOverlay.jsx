import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Clock, User, Mic, MicOff, Volume2, VolumeX, CheckCircle, RotateCcw } from 'lucide-react';
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
  const [activeCall, setActiveCall] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isCallVisible, setIsCallVisible] = useState(false);
  const [isRinging, setIsRinging] = useState(true);
  const { speak, stopSpeaking, isSpeaking } = useVoice();

  // Update visibility state
  useEffect(() => {
    setIsCallVisible(isVisible && reminder);
    if (isVisible && reminder) {
      setIsRinging(true);
    }
  }, [isVisible, reminder]);

  useEffect(() => {
    let interval;
    if (isCallVisible && isAnswered) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallVisible, isAnswered]);

  useEffect(() => {
    if (isCallVisible && !isAnswered && reminder) {
      // Start speaking the reminder when call appears
      if (reminder && isSpeakerOn) {
        const message = `Hello! This is your TimeTuneAI assistant calling to remind you about: ${reminder.title}. ${reminder.description ? reminder.description : ''}`;
        // Delay speaking to ensure overlay is fully visible
        setTimeout(() => {
          speak(message);
        }, 1000);
      }
      
      // For Android, ensure screen stays on during call
      if (Capacitor.isNativePlatform()) {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        
        // Prevent Android back button
        const handleBackButton = (e) => {
          e.preventDefault();
          handleDismiss();
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
  }, [isCallVisible, reminder, isSpeakerOn, speak, isAnswered]);

  // Expose trigger function globally for Android integration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.triggerVirtualCall = (reminderData) => {
        console.log('Virtual call triggered from Android:', reminderData);
        
        // Set the reminder data and show the call
        if (reminderData && !activeCall) {
          setActiveCall(reminderData);
          setIsCallVisible(true);
          setIsAnswered(false);
          setCallDuration(0);
          setIsRinging(true);
        }
      };
      
      // Also expose functions to control overlay from Android
      window.dismissVirtualCall = () => {
        console.log('Dismissing virtual call from Android');
        handleDismiss();
      };
      
      window.answerVirtualCall = () => {
        console.log('Answering virtual call from Android');
        handleAnswer();
      };
      
      window.snoozeVirtualCall = () => {
        console.log('Snoozing virtual call from Android');
        handleSnooze();
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.triggerVirtualCall;
        delete window.dismissVirtualCall;
        delete window.answerVirtualCall;
        delete window.snoozeVirtualCall;
      }
    };
  }, [activeCall]);
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = () => {
    console.log('Call answered');
    setIsAnswered(true);
    setIsRinging(false);
    setCallDuration(0);
    
    if (onAnswer) {
      onAnswer();
    }
    
    // Speak a greeting when answered
    if (isSpeakerOn) {
      const currentReminder = reminder || activeCall;
      const greeting = `Hi! I'm calling to remind you about ${currentReminder?.title}. Would you like me to mark this as complete or snooze it for later?`;
      speak(greeting);
    }
  };

  const handleDismiss = () => {
    console.log('Call dismissed');
    stopSpeaking();
    setIsAnswered(false);
    setCallDuration(0);
    setIsCallVisible(false);
    setActiveCall(null);
    setIsRinging(false);
    
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleSnooze = () => {
    console.log('Call snoozed');
    stopSpeaking();
    setIsAnswered(false);
    setCallDuration(0);
    setIsCallVisible(false);
    setActiveCall(null);
    setIsRinging(false);
    
    if (onSnooze) {
      onSnooze();
    }
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

  // Use activeCall if available, otherwise use reminder prop
  const currentReminder = activeCall || reminder;
  
  if (!isCallVisible || !currentReminder) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" style={{ zIndex: 2147483647 }}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600">
        {/* Animated Circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-24 h-24 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 right-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
      </div>

      {/* Status Bar */}
      <div className="relative z-10 flex justify-between items-center p-4 pt-8 text-white">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="font-medium">TimeTuneAI</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-3 bg-white/60 rounded-full"></div>
          <div className="w-1 h-4 bg-white/80 rounded-full"></div>
          <div className="w-1 h-5 bg-white rounded-full"></div>
          <div className="w-1 h-4 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-white min-h-screen">
        {/* Call Status */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center mb-3">
            {isRinging && (
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
            )}
            <p className="text-lg font-medium opacity-90">
              {isAnswered ? 'Connected' : 'Incoming Reminder Call'}
            </p>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
            TimeTuneAI Assistant
          </h1>
          {isAnswered && (
            <div className="flex items-center justify-center">
              <Clock className="w-4 h-4 mr-2" />
              <p className="text-xl font-mono">{formatDuration(callDuration)}</p>
            </div>
          )}
        </div>

        {/* Avatar with Enhanced Animation */}
        <div className="relative mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            {/* Main Avatar */}
            <div className="w-40 h-40 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/40 shadow-2xl">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-inner">
                <User className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
            </div>
            
            {/* Pulsing Rings for Incoming Call */}
            {!isAnswered && isRinging && (
              <>
                <div className="absolute inset-0 w-40 h-40 rounded-full border-4 border-white/30 animate-ping"></div>
                <div className="absolute inset-0 w-40 h-40 rounded-full border-2 border-white/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-0 w-40 h-40 rounded-full border border-white/10 animate-ping" style={{ animationDelay: '1s' }}></div>
              </>
            )}
            
            {/* Connected Indicator */}
            {isAnswered && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Reminder Details Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 max-w-sm w-full border border-white/20 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-3">
                <Clock className="w-6 h-6 text-orange-200" />
              </div>
              <div className="text-left">
                <p className="text-orange-200 text-sm font-medium">Reminder Alert</p>
                <p className="text-white/80 text-xs">{currentReminder.time} • {new Date(currentReminder.date).toLocaleDateString()}</p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-3 text-white leading-tight">{currentReminder.title}</h2>
            
            {currentReminder.description && (
              <p className="text-white/80 text-sm leading-relaxed mb-4 bg-white/5 rounded-xl p-3">
                {currentReminder.description}
              </p>
            )}
            
            {/* Priority Badge */}
            <div className="flex items-center justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentReminder.priority === 'high' 
                  ? 'bg-red-500/20 text-red-200 border border-red-400/30' 
                  : currentReminder.priority === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                  : 'bg-green-500/20 text-green-200 border border-green-400/30'
              }`}>
                {currentReminder.priority?.toUpperCase()} PRIORITY
              </span>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        {!isAnswered ? (
          /* Incoming Call Controls */
          <div className="flex items-center justify-center space-x-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {/* Dismiss */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleDismiss}
                className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-red-400/30"
              >
                <PhoneOff className="w-8 h-8 text-white" />
              </button>
              <span className="text-xs mt-2 opacity-75 font-medium">Dismiss</span>
            </div>

            {/* Answer */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleAnswer}
                className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse border-4 border-green-400/30"
              >
                <Phone className="w-10 h-10 text-white" />
              </button>
              <span className="text-xs mt-2 opacity-75 font-medium">Answer</span>
            </div>

            {/* Snooze */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleSnooze}
                className="w-16 h-16 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-yellow-400/30"
              >
                <RotateCcw className="w-8 h-8 text-white" />
              </button>
              <span className="text-xs mt-2 opacity-75 font-medium">Snooze</span>
            </div>
          </div>
        ) : (
          /* Active Call Controls */
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {/* Primary Controls */}
            <div className="flex items-center justify-center space-x-6">
              {/* Mute */}
              <div className="flex flex-col items-center">
                <button
                  onClick={toggleMute}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 border-2 ${
                    isMuted 
                      ? 'bg-red-500 hover:bg-red-600 border-red-400/50' 
                      : 'bg-white/20 hover:bg-white/30 border-white/30'
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </button>
                <span className="text-xs mt-1 opacity-75">{isMuted ? 'Unmute' : 'Mute'}</span>
              </div>

              {/* Speaker */}
              <div className="flex flex-col items-center">
                <button
                  onClick={toggleSpeaker}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 border-2 ${
                    isSpeakerOn 
                      ? 'bg-blue-500 hover:bg-blue-600 border-blue-400/50' 
                      : 'bg-white/20 hover:bg-white/30 border-white/30'
                  }`}
                >
                  {isSpeakerOn ? (
                    <Volume2 className="w-6 h-6 text-white" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-white" />
                  )}
                </button>
                <span className="text-xs mt-1 opacity-75">Speaker</span>
              </div>

              {/* End Call */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handleDismiss}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-red-400/50"
                >
                  <PhoneOff className="w-8 h-8 text-white" />
                </button>
                <span className="text-xs mt-1 opacity-75">End Call</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 w-full max-w-sm">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    // Mark as complete
                    handleDismiss();
                  }}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm text-white py-4 px-6 rounded-2xl font-medium transition-all duration-300 border border-green-400/30 flex items-center justify-center space-x-2 transform hover:scale-105"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark Complete</span>
                </button>
                <button
                  onClick={handleSnooze}
                  className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 backdrop-blur-sm text-white py-4 px-6 rounded-2xl font-medium transition-all duration-300 border border-yellow-400/30 flex items-center justify-center space-x-2 transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Snooze 5m</span>
                </button>
              </div>
              <button
                onClick={handleDismiss}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-4 px-6 rounded-2xl font-medium transition-all duration-300 border border-white/20 transform hover:scale-105"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Speaking Indicator */}
        {isSpeaking && isSpeakerOn && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-white text-sm font-medium">AI Speaking...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualCallOverlay;