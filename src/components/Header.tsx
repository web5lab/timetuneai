import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import logo from '../assets/logo.png'
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg transition-colors duration-200">
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Responsive sizing */}
          <a href="#" className="flex items-center group">
            <div className="rounded-full flex items-center justify-center text-white">
              <img src={logo} className="w-10 h-10 " />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-500">
              TimeTuneAI
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6 xl:space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition duration-200 font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition duration-200 font-medium">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition duration-200 font-medium">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition duration-200 font-medium">
              Testimonials
            </a>
            <a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition duration-200 font-medium">
              FAQ
            </a>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
          
            <a 
              href="/app" 
              className="px-4 py-2 xl:px-6 xl:py-2 bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-medium rounded-full hover:from-yellow-600 hover:to-orange-700 transition duration-300 shadow-xl text-sm xl:text-base"
            >
              Get the App
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2 sm:space-x-3">
          
            {/* Get App Button - Mobile */}
            <a 
              href="/app" 
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-medium rounded-full hover:from-yellow-600 hover:to-orange-700 transition duration-300 shadow-lg text-xs sm:text-sm"
            >
              Get App
            </a>

          
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-40 transition-all duration-300 ease-in-out">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <a href="#" className="flex items-center" onClick={closeMenu}>
              <div className="p-1.5 sm:p-2 mr-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-primary-500">
                TimeTuneAI
              </span>
            </a>
            <button
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex flex-col h-full">
            {/* Navigation Links */}
            <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
              <a 
                href="#features" 
                className="block text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors py-2" 
                onClick={closeMenu}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="block text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors py-2" 
                onClick={closeMenu}
              >
                How It Works
              </a>
              <a 
                href="#pricing" 
                className="block text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors py-2" 
                onClick={closeMenu}
              >
                Pricing
              </a>
              <a 
                href="#testimonials" 
                className="block text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors py-2" 
                onClick={closeMenu}
              >
                Testimonials
              </a>
              <a 
                href="#faq" 
                className="block text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors py-2" 
                onClick={closeMenu}
              >
                FAQ
              </a>
            </div>

            {/* Mobile Menu Footer */}
            <div className="px-4 sm:px-6 py-6 sm:py-8 border-t border-gray-200 dark:border-gray-700 space-y-4">
            
              {/* Get App Button - Mobile Menu */}
              <a 
                href="/app" 
                className="block w-full px-6 py-4 bg-gradient-to-br from-yellow-500 to-orange-600 text-white text-lg sm:text-xl font-medium rounded-2xl shadow-lg text-center hover:from-yellow-600 hover:to-orange-700 transition-all duration-300"
                onClick={closeMenu}
              >
                Get the App
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;