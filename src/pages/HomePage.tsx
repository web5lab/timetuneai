import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Sparkles,  Clock,  } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'reminder' | 'confirmation' | 'suggestion';
}

const HomePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm TimeTuneAI, your personal reminder assistant. I can help you set reminders using natural language. Try saying something like 'Remind me to call mom at 3 PM tomorrow' or just type it!",
      sender: 'ai',
      timestamp: new Date(),
      type: 'suggestion'
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText);
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        type: aiResponse.type
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): { text: string; type: 'reminder' | 'confirmation' | 'suggestion' } => {
    const input = userInput.toLowerCase();

    if (input.includes('remind') && (input.includes('meeting') || input.includes('call') || input.includes('appointment'))) {
      return {
        text: "Perfect! I've set that reminder for you. You'll get a notification at the specified time. Would you like me to add a 15-minute heads-up notification as well?",
        type: 'confirmation'
      };
    } else if (input.includes('daily') || input.includes('every day') || input.includes('recurring')) {
      return {
        text: "Great! I've created a recurring daily reminder for you. You can manage all your recurring reminders in the Reminders tab. Is there a specific time you'd prefer?",
        type: 'confirmation'
      };
    } else if (input.includes('water') || input.includes('drink')) {
      return {
        text: "Excellent choice for staying healthy! I've set your water reminder. Staying hydrated is so important. Would you like me to set up multiple reminders throughout the day?",
        type: 'confirmation'
      };
    } else if (input.includes('exercise') || input.includes('workout') || input.includes('gym')) {
      return {
        text: "Love the commitment to fitness! I've scheduled your workout reminder. Regular exercise is key to a healthy lifestyle. Should I make this a recurring reminder?",
        type: 'confirmation'
      };
    } else if (input.includes('tomorrow') || input.includes('next week') || input.includes('monday') || input.includes('tuesday')) {
      return {
        text: "Got it! I've scheduled that reminder for the date you specified. You'll receive a notification at the right time. Anything else you'd like me to help you remember?",
        type: 'confirmation'
      };
    } else {
      return {
        text: "I understand! I've processed your request and set up the reminder. You can view and manage all your reminders in the Reminders tab. Is there anything else you'd like me to help you remember?",
        type: 'confirmation'
      };
    }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

 

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-yellow-50 to-orange-50">
      <AppHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
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
                      ? 'bg-green-50 text-gray-800 border border-green-200 rounded-bl-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}
              >
                {message.sender === 'ai' && message.type === 'confirmation' && (
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-xs font-semibold text-green-600">Reminder Set!</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-2 ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                    }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-md px-4 py-3 rounded-2xl rounded-bl-md border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleListening}
              className={`p-4 rounded-full transition-all duration-300 shadow-lg ${isListening
                  ? 'bg-red-500 text-white animate-pulse scale-110'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105'
                }`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your reminder or use voice..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none shadow-sm"
                rows={1}
              />
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>

          {isListening && (
            <div className="text-center mt-3">
              <p className="text-sm text-gray-500 animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></div>
                🎤 Listening... Speak your reminder
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;