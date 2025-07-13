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
          <div className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition duration-200">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white transition duration-200">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-white transition duration-200">Contact Us</a>
          </div>
        </div>
        <div className="border-t border-yellow-800 pt-8 text-gray-400 text-sm">
          &copy; 2023 TimeTuneAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;