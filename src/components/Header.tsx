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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg py-4 transition-colors duration-200">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center text-2xl font-bold text-primary-500 group">
          <div className="p-2 mr-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white">
            <Bell className="w-6 h-6" />
          </div>
          TimeTuneAI
        </a>
        
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition duration-200">Features</a>
          <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition duration-200">How It Works</a>
          <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition duration-200">Pricing</a>
          <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition duration-200">Testimonials</a>
          <a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition duration-200">FAQ</a>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <a href="#" className="px-6 py-2 bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-medium rounded-full hover:from-yellow-600 hover:to-orange-700 transition duration-300 shadow-xl">
            Get the App
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-40 transition-all duration-300 ease-in-out">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <a href="#features" className="text-2xl text-gray-800 dark:text-gray-200 hover:text-primary-500" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" className="text-2xl text-gray-800 dark:text-gray-200 hover:text-primary-500" onClick={closeMenu}>How It Works</a>
            <a href="#pricing" className="text-2xl text-gray-800 dark:text-gray-200 hover:text-primary-500" onClick={closeMenu}>Pricing</a>
            <a href="#testimonials" className="text-2xl text-gray-800 dark:text-gray-200 hover:text-primary-500" onClick={closeMenu}>Testimonials</a>
            <a href="#faq" className="text-2xl text-gray-800 dark:text-gray-200 hover:text-primary-500" onClick={closeMenu}>FAQ</a>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 text-2xl text-gray-800 dark:text-gray-200 hover:text-primary-500"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-6 h-6" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-6 h-6" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
            <a href="#" className="px-8 py-3 bg-gradient-to-br from-yellow-500 to-orange-600 text-white text-xl font-medium rounded-full shadow-lg">
              Get the App
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;