import React from 'react';
import { Clock, MessageCircle, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'white':
        return {
          bg: 'bg-white/20 backdrop-blur-sm',
          text: 'text-white',
          icon: 'text-white'
        };
      case 'dark':
        return {
          bg: 'bg-slate-800 dark:bg-slate-700',
          text: 'text-slate-800 dark:text-white',
          icon: 'text-orange-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-orange-500 to-red-500',
          text: 'text-slate-800 dark:text-white',
          icon: 'text-white'
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} ${variantClasses.bg} rounded-2xl flex items-center justify-center relative shadow-lg`}>
        {/* Main Chat Icon */}
        <MessageCircle className={`${iconSizes[size]} ${variantClasses.icon} relative z-10`} />
        
        {/* Floating Elements */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
          <Clock className="w-1.5 h-1.5 text-yellow-800" />
        </div>
        
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-400 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="w-1 h-1 text-blue-800" />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-2xl"></div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizes[size]} font-bold ${variantClasses.text} tracking-tight`}>
            TimeTune<span className="text-orange-500">AI</span>
          </h1>
          {size !== 'sm' && (
            <p className={`text-xs ${variantClasses.text} opacity-70 font-medium`}>
              Smart Reminders
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;