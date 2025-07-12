import React, { useState } from 'react';
import { Bell, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg transition-colors duration-200">
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Responsive sizing */}
          <a href="#" className="flex items-center group">
            <div className="p-1.5 sm:p-2 mr-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
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
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <a 
              href="/app" 
              className="px-4 py-2 xl:px-6 xl:py-2 bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-medium rounded-full hover:from-yellow-600 hover:to-orange-700 transition duration-300 shadow-xl text-sm xl:text-base"
            >
              Get the App
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Get App Button - Mobile */}
            <a 
              href="/app" 
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-medium rounded-full hover:from-yellow-600 hover:to-orange-700 transition duration-300 shadow-lg text-xs sm:text-sm"
            >
              Get App
            </a>

            {/* Mobile Menu Button */}
            <button 
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
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
              {/* Theme Toggle - Mobile Menu */}
              <button
                onClick={() => {
                  toggleTheme();
                  closeMenu();
                }}
                className="flex items-center justify-center w-full space-x-3 text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200 hover:text-primary-500 transition-colors py-3"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>

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