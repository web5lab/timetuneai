import React from 'react';
import { Mic, CheckCircle, Bell, ArrowRight, Sparkles, Clock, Bot, MessageSquare, Calendar, Zap } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Speak Naturally",
      subtitle: "Just talk to TimeTuneAI",
      description: "Simply speak or type your reminder in natural language. No complex commands or rigid formats - just tell TimeTuneAI what you need to remember.",
      example: "Remind me about the presentation tomorrow at 10 AM",
      icon: Mic,
      color: "from-blue-500 to-purple-600",
      bgColor: "from-blue-50 to-purple-50",
      features: ["Natural language processing", "Voice recognition", "Smart context understanding"]
    },
    {
      number: 2,
      title: "AI Understands",
      subtitle: "Intelligent processing in seconds",
      description: "Our advanced AI instantly processes your request, extracts key details, and confirms everything with you before setting the reminder.",
      example: "✓ Presentation reminder set for Tomorrow, 10:00 AM",
      icon: Bot,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      features: ["Smart date parsing", "Context awareness", "Automatic categorization"]
    },
    {
      number: 3,
      title: "Never Miss Again",
      subtitle: "Perfect timing, every time",
      description: "Receive perfectly timed notifications exactly when you need them. Smart alerts adapt to your schedule and preferences.",
      example: "🔔 Presentation in 15 minutes!",
      icon: Bell,
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      features: ["Smart notifications", "Multiple alert types", "Calendar integration"]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-red-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-orange-200 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">How It Works</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            <span className="block">Transform Your Day</span>
            <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
              In 3 Simple Steps
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of personal organization with AI that understands you naturally
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-orange-200 to-green-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="group">
                  {/* Step Card */}
                  <div className={`relative bg-gradient-to-br ${step.bgColor} rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}></div>
                    </div>

                    {/* Step Number */}
                    <div className={`absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white`}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 mt-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-sm font-medium text-gray-600 mb-4">{step.subtitle}</p>
                        <p className="text-gray-700 leading-relaxed">{step.description}</p>
                      </div>

                      {/* Example */}
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Example</span>
                        </div>
                        <p className="font-medium text-gray-900 text-sm">{step.example}</p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow for desktop */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-20">
                        <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-100">
                          <ArrowRight className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">Join thousands who have transformed their productivity with TimeTuneAI</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3">
                <span>Download Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 flex items-center justify-center space-x-3">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                <span>Try Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;