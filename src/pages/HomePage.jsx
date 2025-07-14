import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Sparkles, Clock, RotateCcw, Zap, Volume2, VolumeX, Moon, Sun, Menu, Calendar } from 'lucide-react';
import VoiceInputModal from '../components/VoiceInputModal';
import { useChat } from '../hooks/useChat';
import { useVoice } from '../hooks/useVoice';
import { useTheme } from '../contexts/ThemeContext';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../store/global.Slice';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const { theme, toggleTheme } = useTheme();
  const {
    isListening,
    isSpeaking,
    isVoiceSupported,
    transcribedText,
    error: voiceError,
    toggleListening,
    speak,
    stopSpeaking
  } = useVoice();
  const [inputText, setInputText] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();

    // Auto-speak AI responses if enabled
    if (autoSpeak && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai' && !isLoading) {
        speak(lastMessage.text);
      }
    }
  }, [messages, autoSpeak, speak, isLoading]);

  // Update input text when voice transcription changes
  useEffect(() => {
    if (transcribedText) {
      setInputText(transcribedText);
    }
  }, [transcribedText]);

  // Handle voice errors
  useEffect(() => {
    if (voiceError) {
      console.error('Voice error:', voiceError);
    }
  }, [voiceError]);

  const handleSendMessage = async (text) => {
    const messageText = text || inputText;
    if (!messageText.trim() || isLoading) return;

    setInputText('');
    await sendMessage(messageText);
  };

  const handleVoiceToggle = async () => {
    setShowVoiceModal(true);
  };

  const handleVoiceModalClose = () => {
    setShowVoiceModal(false);
    if (isListening) {
      toggleListening();
    }
  };

  const handleVoiceModalSend = (text) => {
    handleSendMessage(text);
    setShowVoiceModal(false);
  };

  const handleStartListening = () => {
    toggleListening();
  };

  const handleStopListening = () => {
    if (isListening) {
      toggleListening();
    }
  };

  const handleSpeakToggle = async () => {
    if (isSpeaking) {
      await stopSpeaking();
    } else {
      setAutoSpeak(!autoSpeak);
    }
  };

  const handleClearChat = () => {
    clearChat();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  return (
    <div className="flex flex-col  h-full bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-200">
      <div className="flex flex-col h-full  flex-1 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white    px-4 py-3 shadow-sm transition-colors duration-200">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  dispatch(toggleSidebar())
                }}
                className="p-2 rounded-lg "
              >
                <Menu className="w-6 h-6 text-gray-100 dark:text-gray-200" />
              </button>
              <div>
                <h2 className="font-semibold ">TimeTuneAI Assistant</h2>
                <p className="text-xs text-gray-100 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  {isLoading ? 'Thinking...' : isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Voice/TTS Toggle */}
              {isVoiceSupported && (
                <button
                  onClick={handleSpeakToggle}
                  className={`p-2 rounded-lg transition-all duration-200 ${autoSpeak
                    ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                    }`}
                  title={autoSpeak ? 'Disable auto-speak' : 'Enable auto-speak'}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4" />
                  ) : autoSpeak ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  navigate('/reminders');
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button
                onClick={handleClearChat}
                className="p-2 text-gray-100  hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200"
                title="Clear chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${message.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-md'
                    : message.type === 'confirmation'
                      ? 'bg-green-50 dark:bg-green-900/20 text-gray-800 dark:text-gray-200 border border-green-200 dark:border-green-800 rounded-bl-md'
                      : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-md'
                    }`}
                >
                  {message.sender === 'ai' && message.type === 'confirmation' && (
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">Reminder Set!</span>
                    </div>
                  )}
                  {message.sender === 'ai' && message.type === 'reminder' && (
                    <div className="flex items-center mb-2">
                      <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Processing...</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-2 ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                      }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 shadow-md px-4 py-3 rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>


        {/* Input Area */}
        <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg transition-colors duration-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-2 sm:space-x-3">
              {/* Voice Input Button */}
              {isVoiceSupported && (
                <button
                  onClick={handleVoiceToggle}
                  disabled={isLoading}
                  className={`p-3 sm:p-4 rounded-full transition-all duration-300 shadow-lg flex-shrink-0 ${isListening
                    ? 'bg-red-500 text-white animate-pulse scale-110 ring-4 ring-red-200'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
              )}

              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your reminder or use voice..."
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none shadow-sm text-sm sm:text-base min-h-[48px] max-h-32 transition-colors duration-200"
                  rows={1}
                  style={{
                    height: 'auto',
                    minHeight: '48px'
                  }}
                  onInput={(e) => {
                    const target = e.target;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                />

                {/* Character count for mobile */}
                {inputText.length > 0 && (
                  <div className="absolute bottom-1 right-2 text-xs text-gray-400 dark:text-gray-500">
                    {inputText.length}/500
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 flex-shrink-0 relative"
              >
                {isLoading ? (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>


        {/* Voice Input Modal */}
        <VoiceInputModal
          isOpen={showVoiceModal}
          isListening={isListening}
          transcribedText={transcribedText}
          onClose={handleVoiceModalClose}
          onSend={handleVoiceModalSend}
          onStartListening={handleStartListening}
          onStopListening={handleStopListening}
        />
      </div>
    </div>
  );
};

export default HomePage;