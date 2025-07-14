import React, { useEffect, useState } from 'react';
import { Shield, Smartphone, Lock, CheckCircle, Star, Sparkles, Clock, ArrowRight, Bot } from 'lucide-react';
import { useAuth } from '../auth/auth';
import { useSelector } from 'react-redux';
import { userSelector } from '../store/global.Selctor';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth(); 
  const user = useSelector(userSelector);
  const navigate = useNavigate();

  useEffect(() => {
   if (user) {
      navigate('/');
   }
  }, [user])
  

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await login(); 
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 relative overflow-hidden">
     

      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Side - Welcome Content */}
            <div className="text-center hidden md:block lg:text-left space-y-6 lg:space-y-8 order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-orange-200">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700">Trusted by 50,000+ users</span>
              </div>

              {/* Welcome Message */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                  <span className="block text-gray-900">Welcome to</span>
                  <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                    TimeTuneAI
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">
                  Your intelligent reminder assistant that keeps everything organized and secure on your device.
                </p>
              </div>

              {/* Privacy Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center lg:justify-start">
                  <Shield className="w-5 h-5 text-green-500 mr-2" />
                  Your Privacy, Our Priority
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 text-sm">Local Storage</div>
                      <div className="text-xs text-gray-600">Stored on your device</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 text-sm">No Cloud Sync</div>
                      <div className="text-xs text-gray-600">Never leaves your phone</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Features Preview */}
              <div className="hidden lg:block space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">What you'll get:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Natural language reminders</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Smart scheduling with AI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Voice command support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Complete offline functionality</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center order-1 lg:order-2">
              <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 p-6 sm:p-8 relative overflow-hidden">
                  {/* Card Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 rounded-3xl"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <Bot className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Get Started</h2>
                      <p className="text-gray-600">Sign in to access your personal AI assistant</p>
                    </div>

                    {/* Privacy Notice */}
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800 text-sm">100% Private & Secure</span>
                      </div>
                      <p className="text-green-700 text-xs leading-relaxed">
                        All your reminders are stored locally on your device. We never access, store, or share your personal data.
                      </p>
                    </div>

                    {/* Google Login Button */}
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="group relative w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                      {/* Button Background Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10 flex items-center space-x-3">
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="font-medium text-gray-700 group-hover:text-gray-900">Continue with Google</span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
                          </>
                        )}
                      </div>
                    </button>

                    {/* Terms */}
                    <p className="text-center text-xs text-gray-500 leading-relaxed">
                      By continuing, you agree to our{' '}
                      <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">Privacy Policy</a>
                    </p>

                    {/* Loading State */}
                    {isLoading && (
                      <div className="text-center">
                        <div className="inline-flex items-center space-x-2 text-orange-600">
                          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">Signing you in...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Trust Indicators */}
                <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Private</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Local Storage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;