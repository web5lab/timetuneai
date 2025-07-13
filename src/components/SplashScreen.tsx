import React, { useEffect, useState } from 'react';
import { MessageCircle, Clock, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing...');

  const loadingTexts = [
    'Initializing TimeTuneAI...',
    'Loading your reminders...',
    'Setting up voice recognition...',
    'Preparing notifications...',
    'Almost ready...'
  ];

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let textIndex = 0;

    const startLoading = () => {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          
          // Update text based on progress
          const textProgress = Math.floor(newProgress / 20);
          if (textProgress < loadingTexts.length && textProgress !== textIndex) {
            textIndex = textProgress;
            setCurrentText(loadingTexts[textIndex]);
          }
          
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              onComplete();
            }, 500);
            return 100;
          }
          
          return newProgress;
        });
      }, 50);
    };

    // Start loading after a brief delay
    const timer = setTimeout(startLoading, 300);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="text-center text-white z-10 px-8">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 animate-bounce">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          
          {/* Floating Icons */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/30 rounded-full flex items-center justify-center animate-float">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center animate-float delay-300">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold mb-2 tracking-wide">
          TimeTuneAI
        </h1>
        <p className="text-xl text-white/90 mb-12 font-light">
          Your Intelligent Reminder Assistant
        </p>

        {/* Loading Progress */}
        <div className="w-64 mx-auto mb-6">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div 
              className="bg-white h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-white/80 text-sm animate-pulse">
          {currentText}
        </p>

        {/* Version */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-white/60 text-xs">
            Version 1.0.0
          </p>
        </div>
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
};

export default SplashScreen;