import React, { useState } from 'react';
import { Trash2, AlertTriangle, Shield, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const RequestDelete: React.FC = () => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !confirmDelete) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
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
                Request Submitted Successfully
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We've received your data deletion request for <strong>{email}</strong>. 
                You'll receive a confirmation email within 24 hours with next steps.
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
                    <span>Your account will be deactivated within 48 hours</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>All personal data will be permanently deleted within 30 days</span>
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              Delete Your <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Account</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              We're sorry to see you go. This action will permanently delete all your data.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">This action cannot be undone</h3>
                <p className="text-red-800 text-sm leading-relaxed">
                  Deleting your account will permanently remove all your reminders, settings, and personal data. 
                  This process cannot be reversed.
                </p>
              </div>
            </div>
          </div>

          {/* What will be deleted */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-orange-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 text-orange-500 mr-2" />
              What will be deleted:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Your account and profile information</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>All reminders and scheduled tasks</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>App settings and preferences</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Calendar integration data</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Usage analytics and history</span>
              </li>
            </ul>
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
                <label htmlFor="reason" className="block text-sm font-semibold text-gray-900 mb-2">
                  Reason for leaving (optional)
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Help us improve by sharing why you're leaving..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="confirm"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  required
                />
                <label htmlFor="confirm" className="text-sm text-gray-700 leading-relaxed">
                  I understand that this action is permanent and cannot be undone. I want to delete my TimeTuneAI account and all associated data.
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={!email || !confirmDelete || isLoading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete My Account</span>
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
              Need help or have questions about data deletion?
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

export default RequestDelete;