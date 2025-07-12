import React, { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 bg-opacity-90 backdrop-blur-md shadow-lg py-4">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center text-2xl font-bold text-orange-500 group">
          <div className="p-2 mr-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white">
            <Bell className="w-6 h-6" />
          </div>
          TimeTuneAI
        </a>
        
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-orange-500 transition duration-200">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-orange-500 transition duration-200">How It Works</a>
          <a href="#pricing" className="text-gray-600 hover:text-orange-500 transition duration-200">Pricing</a>
          <a href="#testimonials" className="text-gray-600 hover:text-orange-500 transition duration-200">Testimonials</a>
          <a href="#faq" className="text-gray-600 hover:text-orange-500 transition duration-200">FAQ</a>
        </div>
        
        <a href="#" className="hidden md:block px-6 py-2 bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-medium rounded-full hover:from-yellow-600 hover:to-orange-700 transition duration-300 shadow-xl">
          Get the App
        </a>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-yellow-50 bg-opacity-95 backdrop-blur-md z-40 transition-all duration-300 ease-in-out">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <a href="#features" className="text-2xl text-gray-800 hover:text-orange-500" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" className="text-2xl text-gray-800 hover:text-orange-500" onClick={closeMenu}>How It Works</a>
            <a href="#pricing" className="text-2xl text-gray-800 hover:text-orange-500" onClick={closeMenu}>Pricing</a>
            <a href="#testimonials" className="text-2xl text-gray-800 hover:text-orange-500" onClick={closeMenu}>Testimonials</a>
            <a href="#faq" className="text-2xl text-gray-800 hover:text-orange-500" onClick={closeMenu}>FAQ</a>
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