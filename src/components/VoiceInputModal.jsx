import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Send, X, Volume2 } from 'lucide-react';


const VoiceInputModal = ({
  isOpen,
  isListening,
  transcribedText,
  onClose,
  onSend,
  onStartListening,
  onStopListening,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editableText, setEditableText] = useState('');

  useEffect(() => {
    if (transcribedText && !isListening) {
      setShowConfirmation(true);
      setEditableText(transcribedText);
    }
  }, [transcribedText, isListening]);

  useEffect(() => {
    if (!isOpen) {
      setShowConfirmation(false);
      setEditableText('');
    }
  }, [isOpen]);

  const handleSend = () => {
    if (editableText.trim()) {
      onSend(editableText.trim());
      onClose();
    }
  };

  const handleRetry = () => {
    setShowConfirmation(false);
    setEditableText('');
    onStartListening();
  };

  const handleClose = () => {
    if (isListening) {
      onStopListening();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-colors duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center mb-2">
            <Volume2 className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">Voice Input</h2>
          </div>
          
          <p className="text-orange-100 text-sm">
            {isListening ? 'Listening...' : showConfirmation ? 'Review your message' : 'Tap to start speaking'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showConfirmation ? (
            /* Listening State */
            <div className="text-center">
              {/* Animated Microphone */}
              <div className="relative mb-6">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 animate-pulse scale-110' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105'
                }`}>
                  {isListening ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </div>
                
                {/* Pulse Animation */}
                {isListening && (
                  <>
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-red-400 animate-ping opacity-20"></div>
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-red-300 animate-ping opacity-10" style={{ animationDelay: '0.5s' }}></div>
                  </>
                )}
              </div>

              {/* Instructions */}
              <div className="mb-6">
                {isListening ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      I'm listening...
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Speak clearly and tap the microphone when you're done
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Ready to listen
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Tap the microphone and speak your reminder
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={isListening ? onStopListening : onStartListening}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                }`}
              >
                {isListening ? 'Stop Listening' : 'Start Speaking'}
              </button>
            </div>
          ) : (
            /* Confirmation State */
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Review Your Message
              </h3>
              
              {/* Editable Text */}
              <div className="mb-6">
                <textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-colors duration-200"
                  rows={4}
                  placeholder="Your transcribed message will appear here..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  You can edit the text above before sending
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium flex items-center justify-center"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                <button
                  onClick={handleSend}
                  disabled={!editableText.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Tips */}
        <div className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>💡 Tip: Speak clearly for better recognition</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInputModal;