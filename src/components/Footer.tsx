import React from 'react';
import { Bell } from 'lucide-react';
import logo from '../assets/logo.png'

const Footer: React.FC = () => {
  return (
    <footer className="bg-yellow-900 text-white py-12">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <a href="#" className="flex items-center text-2xl font-bold text-white mb-6 md:mb-0">
          <img src={logo} className="w-10 h-10 " />
            TimeTuneAI
          </a>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="/privacy" className="text-gray-300 hover:text-white transition duration-200">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white transition duration-200">Terms of Service</a>
            <a href="/request-data" className="text-gray-300 hover:text-white transition duration-200">Request Data</a>
            <a href="/request-delete" className="text-gray-300 hover:text-white transition duration-200">Delete Account</a>
            <a href="mailto:support@timetuneai.com" className="text-gray-300 hover:text-white transition duration-200">Contact Us</a>
          </div>
        </div>
        <div className="border-t border-yellow-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div className="mb-4 md:mb-0">
              &copy; 2025 TimeTuneAI. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <span>🔒 Your privacy is protected</span>
              <span>•</span>
              <span>📧 GDPR Compliant</span>
              <span>•</span>
              <span>🛡️ Secure by design</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;