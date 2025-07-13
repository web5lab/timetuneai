import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Sparkles, Clock, RotateCcw, Zap } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';
import { useChat } from '../hooks/useChat';
import ApiKeySetup from '../components/ApiKeySetup';

const HomePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if API key is available
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const storedKey = localStorage.getItem('gemini_api_key');
    setApiKeySet(!!(envKey && envKey !== 'your_gemini_api_key_here') || !!storedKey);
  }, []);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim() || isLoading) return;
    
    setInputText('');
    await sendMessage(messageText);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real app, this would integrate with speech recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputText("Remind me about the team meeting tomorrow at 2 PM");
      }, 2000);
    }
  };

  const handleClearChat = () => {
    clearChat();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

 

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-200">
      <AppHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Chat Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">TimeTuneAI Assistant</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                {isLoading ? 'Thinking...' : 'Ready to help'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* API Key Setup */}
          {!apiKeySet && (
            <ApiKeySetup onApiKeySet={() => setApiKeySet(true)} />
          )}
          
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
            <button
              onClick={toggleListening}
              className={`p-3 sm:p-4 rounded-full transition-all duration-300 shadow-lg flex-shrink-0 ${isListening
                  ? 'bg-red-500 text-white animate-pulse scale-110 ring-4 ring-red-200'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105'
                }`}
            >
              {isListening ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

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
                  const target = e.target as HTMLTextAreaElement;
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

          {isListening && (
            <div className="text-center mt-2 sm:mt-3">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></div>
                🎤 Listening... Speak your reminder
              </p>
            </div>
          )}
          
          {/* Quick action buttons for mobile */}
          <div className="flex sm:hidden justify-center space-x-2 mt-3">
            <button
              onClick={() => !isLoading && handleSendMessage("Remind me to drink water at 3 PM today")}
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
            >
              💧 Drink water
            </button>
            <button
              onClick={() => !isLoading && handleSendMessage("Remind me daily to drink water at 9 AM")}
              disabled={isLoading}
              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors"
            >
              🔄 Daily water
            </button>
            <button
              onClick={() => !isLoading && handleSendMessage("Remind me about lunch at 12 PM today")}
              disabled={isLoading}
              className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium hover:bg-yellow-200 transition-colors"
            >
              🍽️ Lunch
            </button>
            <button
              onClick={() => !isLoading && handleSendMessage("Remind me to call mom tomorrow")}
              disabled={isLoading}
              className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
            >
              📞 Call mom
            </button>
            <button
              onClick={() => !isLoading && handleSendMessage("Show me my reminders")}
              disabled={isLoading}
              className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-200 transition-colors"
            >
              📋 My reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;