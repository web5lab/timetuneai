import React, { useState } from 'react';
import { Download, Shield, CheckCircle, ArrowLeft, Mail, FileText, Calendar, User, Settings } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const RequestData: React.FC = () => {
  const [email, setEmail] = useState('');
  const [dataTypes, setDataTypes] = useState({
    profile: true,
    reminders: true,
    settings: true,
    analytics: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleDataTypeChange = (type: keyof typeof dataTypes) => {
    setDataTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Data Request Submitted
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We've received your data request for <strong>{email}</strong>. 
                Your data export will be ready within 48 hours.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-2 text-left">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>We'll verify your identity via email</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Your data will be compiled into a secure download package</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>You'll receive a download link valid for 7 days</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                >
                  Return to Home
                </a>
                <a 
                  href="/privacy"
                  className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Back Button */}
          <a 
            href="/privacy"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Privacy Policy</span>
          </a>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              Request Your <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Data</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Download a copy of all your personal data stored in TimeTuneAI.
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Your data, your rights</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  You have the right to access and download your personal data. We'll provide it in a 
                  machine-readable format that you can use with other services.
                </p>
              </div>
            </div>
          </div>

          {/* What's included */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-orange-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 text-orange-500 mr-2" />
              What's included in your data export:
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Profile Information</div>
                  <div className="text-sm text-gray-600">Name, email, account settings</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Reminders & Tasks</div>
                  <div className="text-sm text-gray-600">All your reminders and schedules</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Settings className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">App Preferences</div>
                  <div className="text-sm text-gray-600">Notification settings, themes</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Usage Analytics</div>
                  <div className="text-sm text-gray-600">App usage patterns (optional)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-orange-100">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your account email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This must match the email address associated with your TimeTuneAI account
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Select data to include:
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataTypes.profile}
                      onChange={() => handleDataTypeChange('profile')}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Profile Information</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataTypes.reminders}
                      onChange={() => handleDataTypeChange('reminders')}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Reminders & Tasks</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataTypes.settings}
                      onChange={() => handleDataTypeChange('settings')}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">App Settings & Preferences</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataTypes.analytics}
                      onChange={() => handleDataTypeChange('analytics')}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Usage Analytics (anonymized)</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Data Format</h4>
                <p className="text-sm text-gray-600">
                  Your data will be provided in JSON format, which can be easily imported into other applications. 
                  The download will be a secure ZIP file containing all requested data.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={!email || isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Request My Data</span>
                    </>
                  )}
                </button>
                
                <a 
                  href="/privacy"
                  className="flex-1 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 text-center"
                >
                  Cancel
                </a>
              </div>
            </div>
          </form>

          {/* Support */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Questions about your data or need help?
            </p>
            <a 
              href="mailto:privacy@timetuneai.com"
              className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              <Mail className="w-4 h-4" />
              <span>Contact our privacy team</span>
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RequestData;