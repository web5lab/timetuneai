import React from 'react';
import { Download as DownloadIcon, Star, Users, Shield, Zap, ArrowRight, Play, Quote } from 'lucide-react';
import logo from '../assets/logo.png'

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

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Manager",
      avatar: "SJ",
      rating: 5,
      text: "TimeTuneAI has completely transformed how I manage my daily tasks. The voice commands are incredibly intuitive!"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Software Developer",
      avatar: "MC",
      rating: 5,
      text: "Finally, an AI assistant that actually understands natural language. Setting reminders has never been easier."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Project Manager",
      avatar: "ER",
      rating: 5,
      text: "The smart scheduling feature saved me countless hours. It learns my preferences and suggests optimal times."
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Entrepreneur",
      avatar: "DT",
      rating: 5,
      text: "I've tried dozens of reminder apps, but TimeTuneAI is the only one that feels truly intelligent and helpful."
    },
    {
      id: 5,
      name: "Jessica Lee",
      role: "Designer",
      avatar: "JL",
      rating: 5,
      text: "The UI is beautiful and the AI actually helps me stay organized. Worth every penny!"
    },
    {
      id: 6,
      name: "Alex Kumar",
      role: "Student",
      avatar: "AK",
      rating: 5,
      text: "Perfect for managing my study schedule and deadlines. The natural language processing is amazing!"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200 shadow-lg">
              <DownloadIcon className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Available Now</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                <span className="block text-gray-900">Download</span>
                <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  TimeTuneAI
                </span>
                <span className="block text-gray-900">Today!</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
                Join thousands who have transformed their productivity. Get the app and never miss anything important again.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100 hover:bg-white/80 transition-all duration-300 shadow-lg">
                    <IconComponent className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
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
                  <DownloadIcon className="w-6 h-6" />
                  <span className="text-lg">Download for Android</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </a>
              
              <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 font-semibold rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:bg-white transition-all duration-300 flex items-center justify-center space-x-3">
                <Play className="w-5 h-5 text-orange-500" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">100% Secure Download</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">No Ads or Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">Instant Setup</span>
              </div>
            </div>
          </div>

          {/* Right Side - Testimonials */}
          <div className="space-y-6">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">What Our Users Say</h3>
              <p className="text-gray-600">Join thousands of satisfied users who love TimeTuneAI</p>
            </div>

               {/* App Store Badge */}
               <div className="text-center mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-lg">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  <img src={logo} className="w-16 h-16" alt="TimeTuneAI Logo" />
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold text-gray-900">TimeTuneAI</h4>
                  <p className="text-gray-600">Productivity App</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="text-gray-900 font-semibold">4.9</span>
                <span className="text-gray-600">(2,847 reviews)</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">12.4 MB</div>
                  <div>Size</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Productivity</div>
                  <div>Category</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Android 6.0+</div>
                  <div>Compatibility</div>
                </div>
              </div>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {/* Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="w-6 h-6 text-orange-500" />
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                      <div className="text-gray-600 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

         
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;