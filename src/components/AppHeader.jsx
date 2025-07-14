import React, { useState } from 'react';
import { User ,Menu, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../store/global.Slice';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  return (
    <>
      <header className="z-30 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => {
                dispatch(toggleSidebar())
              }}
              className="p-2 rounded-lg "
            >
              <Menu className="w-6 h-6 text-gray-100 dark:text-gray-200" />
            </button>
            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={() => {
                  navigate('/profile')
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => {
                    navigate('/')
                  }}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
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