import React, { useState } from 'react';
import { Bell, Settings, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

const AppHeader: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { theme, toggleTheme } = useTheme();



  return (
    <>
      <header className="z-30 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-1">
              <Logo size="sm" variant="white" showText={true} />
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfile(!showProfile);
                    setShowNotifications(false);
                    setShowSettings(false);
                  }}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                          AJ
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Alex Johnson</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">alex@example.com</p>
                          <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full mt-1">
                            Pro Plan
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <a href="#/profile" className="text-gray-900 dark:text-gray-100">View Profile</a>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                        <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <a href="#/settings" className="text-gray-900 dark:text-gray-100">Account Settings</a>
                      </button>
                      {/* <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                        <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <a href="#/subscription" className="text-gray-900 dark:text-gray-100">Subscription</a>
                      </button> */}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button className="w-full text-center text-red-600 hover:text-red-700 font-medium text-sm">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for dropdowns */}
      {(showNotifications || showSettings || showProfile) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowNotifications(false);
            setShowSettings(false);
            setShowProfile(false);
          }}
        />
      )}
    </>
  );
};

export default AppHeader;