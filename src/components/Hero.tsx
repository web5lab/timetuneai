import React, { useState, useEffect } from 'react';
import { Download, Play, ArrowRight, Sparkles, Clock, CheckCircle, Mic, Send, Bot, Star } from 'lucide-react';

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
      message: "Hi! I'm TimeTuneAI. Ready to transform how you manage reminders?",
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
      ai: "Done! You'll get notifications at 2:45 PM and 3:00 PM tomorrow. I've also added this to your calendar. Anything else?",
      delay: 1500
    },
    {
      user: "Set a daily reminder to drink water every 2 hours",
      ai: "Excellent! I've created a recurring reminder for you to drink water every 2 hours during your active hours (8 AM - 8 PM). Stay hydrated! 💧",
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
          message: "Hi! I'm TimeTuneAI. Ready to transform how you manage reminders?",
          timestamp: "10:30 AM"
        }]);
        setDemoStep(0);
      }, 8000);
      
      return () => clearTimeout(resetTimer);
    }
  }, [demoStep, messages.length]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Background Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }}></div>
        
        {/* Floating Icons */}
        <div className="absolute top-32 right-1/4 animate-float">
          <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
        </div>
        <div className="absolute bottom-1/3 left-1/4 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <div className="absolute top-1/2 right-12 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Left Side - Enhanced Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-orange-200">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">Trusted by 50,000+ users</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="block text-gray-900">Never Miss</span>
                <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Anything Again
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
                Your AI-powered reminder assistant that understands natural language and keeps you perfectly organized.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
              <div className="flex items-center justify-center lg:justify-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Voice Control</div>
                  <div className="text-sm text-gray-600">Just speak naturally</div>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Smart AI</div>
                  <div className="text-sm text-gray-600">Learns your habits</div>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Never Forget</div>
                  <div className="text-sm text-gray-600">100% reliable</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <Download className="w-6 h-6" />
                  <span className="text-lg">Download Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
              
              <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 font-semibold rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:bg-white transition-all duration-300 flex items-center justify-center space-x-3">
                <Play className="w-5 h-5 text-orange-500" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-sm text-gray-600">4.9/5 from 2,000+ reviews</div>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-[3rem] blur-2xl opacity-20 scale-110"></div>
              
              {/* Phone Frame */}
              <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-[3rem] shadow-2xl p-2 border-4 border-gray-800 transform hover:scale-105 transition-transform duration-500">
                {/* Screen Bezel */}
                <div className="bg-black rounded-[2.5rem] p-1">
                  {/* Screen */}
                  <div className="bg-white rounded-[2rem] overflow-hidden h-[650px] flex flex-col relative">
                    
                    {/* Dynamic Island */}
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