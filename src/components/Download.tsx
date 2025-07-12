import React from 'react';
import { Download, Star, Users, Shield, Zap, ArrowRight, Play } from 'lucide-react';

const Download: React.FC = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: Star, value: '4.9', label: 'App Rating' },
    { icon: Shield, value: '100%', label: 'Secure' },
    { icon: Zap, value: '99.9%', label: 'Uptime' },
  ];

  const features = [
    'Voice-powered reminders',
    'Smart AI assistance',
    'Calendar integration',
    'Cross-platform sync',
    'Offline functionality',
    'Privacy-first design'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-orange-900 to-red-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Download className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium">Available Now</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                <span className="block">Download</span>
                <span className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                  TimeTuneAI
                </span>
                <span className="block">Today!</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                Join thousands who have transformed their productivity. Get the app and never miss anything important again.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <IconComponent className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="https://play.google.com/store" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <Download className="w-6 h-6" />
                  <span className="text-lg">Download for Android</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </a>
              
              <button className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3">
                <Play className="w-5 h-5 text-orange-400" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-300">100% Secure Download</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-300">No Ads or Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">Instant Setup</span>
              </div>
            </div>
          </div>

          {/* Right Side - App Preview */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-[3rem] blur-2xl opacity-30 scale-110 animate-pulse"></div>
              
              {/* Phone Frame */}
              <div className="relative bg-gradient-to-b from-gray-800 to-black rounded-[3rem] shadow-2xl p-3 border-4 border-gray-700 transform hover:scale-105 transition-transform duration-500">
                {/* Screen */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden h-[600px] flex flex-col relative">
                  
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10"></div>
                  
                  {/* App Store Preview */}
                  <div className="flex-1 bg-gradient-to-b from-orange-50 to-red-50 p-6 pt-12">
                    {/* App Icon */}
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl">
                        <Download className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">TimeTuneAI</h3>
                      <p className="text-gray-600">Productivity</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-2 mb-6">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-gray-700 font-semibold">4.9</span>
                      <span className="text-gray-500">(2,847 reviews)</span>
                    </div>

                    {/* Download Button */}
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                      GET
                    </button>

                    {/* Screenshots Preview */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Screenshots</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="aspect-[9/16] bg-gradient-to-b from-orange-100 to-red-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <div className="text-gray-400 text-xs">Preview {i}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* App Info */}
                    <div className="mt-6 space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Size</span>
                        <span>12.4 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category</span>
                        <span>Productivity</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compatibility</span>
                        <span>Android 6.0+</span>
                      </div>
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
    </section>
  );
};

export default Download;