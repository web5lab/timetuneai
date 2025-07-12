import React, { useState, useEffect } from 'react';
import { Download, Lightbulb, Send, Mic, User, Bot } from 'lucide-react';

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

const Hero: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      message: "Hi! I'm TimeTuneAI. I can help you set reminders using natural language. Just tell me what you need to remember!",
      timestamp: "10:30 AM"
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const demoConversation = [
    {
      user: "Remind me to call mom tomorrow at 3 PM",
      ai: "Perfect! I've set a reminder for you to call mom tomorrow at 3:00 PM. Would you like me to add a 15-minute heads up notification as well?",
      delay: 2000
    },
    {
      user: "Yes, that would be great",
      ai: "Done! You'll get a notification at 2:45 PM and another at 3:00 PM tomorrow. I've also added this to your calendar. Is there anything else you'd like me to help you remember?",
      delay: 1500
    },
    {
      user: "Set a daily reminder to drink water every 2 hours",
      ai: "Excellent! I've created a recurring reminder for you to drink water every 2 hours during your active hours (8 AM - 8 PM). You'll get gentle notifications throughout the day. Stay hydrated! 💧",
      delay: 2500
    }
  ];

  useEffect(() => {
    if (demoStep < demoConversation.length) {
      const timer = setTimeout(() => {
        // Add user message
        const userMessage: ChatMessage = {
          id: messages.length + 1,
          type: 'user',
          message: demoConversation[demoStep].user,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        
        // Add AI response after delay
        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: messages.length + 2,
            type: 'ai',
            message: demoConversation[demoStep].ai,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
          setDemoStep(prev => prev + 1);
        }, demoConversation[demoStep].delay);
        
      }, demoStep === 0 ? 3000 : 4000);
      
      return () => clearTimeout(timer);
    } else {
      // Reset demo after completion
      const resetTimer = setTimeout(() => {
        setMessages([{
          id: 1,
          type: 'ai',
          message: "Hi! I'm TimeTuneAI. I can help you set reminders using natural language. Just tell me what you need to remember!",
          timestamp: "10:30 AM"
        }]);
        setDemoStep(0);
      }, 8000);
      
      return () => clearTimeout(resetTimer);
    }
  }, [demoStep, messages.length]);

  return (
    <section className="gradient-light-yellow-to-peach relative pt-20 pb-20 overflow-hidden min-h-screen">
      <div className="container mx-auto px-6 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Left Side - Main Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8 text-gray-900">
              Never Miss a Beat with <span className="hero-gradient-text-light">TimeTuneAI</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 max-w-2xl">
              Your intelligent AI assistant for effortless reminders and a perfectly organized life. Simply speak or type, and stay on track.
            </p>
            
            {/* Feature Highlights */}
            <div className="mb-10 space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Natural language processing</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Smart scheduling & calendar sync</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Voice & text input support</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
              <a href="#" className="px-8 py-4 bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-semibold rounded-full shadow-xl hover:from-yellow-600 hover:to-orange-700 transition duration-300 flex items-center justify-center text-lg">
                <Download className="w-6 h-6 mr-3" /> Get Started Free
              </a>
              <a href="#features" className="px-8 py-4 border-2 border-orange-500 text-orange-600 font-semibold rounded-full hover:bg-orange-100 hover:text-orange-700 transition duration-300 flex items-center justify-center text-lg">
                <Lightbulb className="w-6 h-6 mr-3" /> Discover Features
              </a>
            </div>
          </div>

          {/* Right Side - Enhanced Phone Mockup */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 -left-12 w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
              
              {/* Phone Frame */}
              <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl p-2 border-4 border-gray-700 transform hover:scale-105 transition-transform duration-500">
                {/* Screen Bezel */}
                <div className="bg-black rounded-[2.5rem] p-1">
                  {/* Screen */}
                  <div className="bg-white rounded-[2rem] overflow-hidden h-[650px] flex flex-col relative">
                    
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10"></div>
                    
                    {/* Status Bar */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 pt-8 flex items-center justify-between relative">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base">TimeTuneAI</h3>
                          <p className="text-xs opacity-90 flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                            Online
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-3 bg-white rounded-full opacity-60"></div>
                          <div className="w-1 h-3 bg-white rounded-full opacity-80"></div>
                          <div className="w-1 h-3 bg-white rounded-full"></div>
                        </div>
                        <div className="ml-2 text-xs font-medium">100%</div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 relative">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="w-full h-full" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                      </div>
                      
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
                        >
                          <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-md ${
                            message.type === 'user'
                              ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-br-md transform hover:scale-105 transition-transform'
                              : 'bg-white text-gray-800 rounded-bl-md border border-gray-200 shadow-lg'
                          }`}>
                            <p className="text-sm leading-relaxed font-medium">{message.message}</p>
                            <p className={`text-xs mt-2 ${
                              message.type === 'user' ? 'text-orange-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start relative z-10">
                          <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-lg border border-gray-200 px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <Bot className="w-4 h-4 text-orange-500" />
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-200 relative">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 flex items-center space-x-3 shadow-inner">
                          <input
                            type="text"
                            placeholder="Type your reminder..."
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
                          />
                          <Mic className="w-5 h-5 text-orange-500 cursor-pointer hover:text-orange-600 transition-colors animate-pulse" />
                        </div>
                        <button className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg transform hover:scale-110">
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;