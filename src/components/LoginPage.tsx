import React from 'react';
import { Chrome, Shield, Zap, Clock, MessageCircle } from 'lucide-react';
import Logo from './Logo';

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    // This will redirect to the backend Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-red-500 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-pink-500 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-orange-400 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to TimeTune<span className="text-orange-500">AI</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your intelligent reminder assistant powered by AI
            </p>
          </div>

          {/* Features Preview */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <MessageCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span>Natural language reminder creation</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <Zap className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span>Smart AI-powered scheduling</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span>Never miss important tasks</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span>Secure cloud synchronization</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md group"
          >
            <Chrome className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">Instant Account Creation</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Benefits */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get started in seconds with your Google account
            </p>
            <div className="flex justify-center space-x-6 text-xs text-gray-500 dark:text-gray-500">
              <span>✓ No setup required</span>
              <span>✓ Secure & private</span>
              <span>✓ Free to start</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By continuing, you agree to our{' '}
            <a href="#" className="text-orange-500 hover:text-orange-600 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-orange-500 hover:text-orange-600 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;