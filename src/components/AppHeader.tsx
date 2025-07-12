import React, { useState } from 'react';
import { Bell, Settings, User, Menu, X } from 'lucide-react';

interface AppHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, title: 'Team Meeting', message: 'Starting in 15 minutes', time: '2 min ago', unread: true },
    { id: 2, title: 'Call Dentist', message: 'Reminder set for 3 PM', time: '1 hour ago', unread: true },
    { id: 3, title: 'Daily Goal', message: 'You completed 8/10 tasks', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="lg:left-64 z-30 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors mr-3"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            {/* Header Actions */}
            <div className="flex items-center space-x-2">
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
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                          AJ
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Alex Johnson</h3>
                          <p className="text-sm text-gray-600">alex@example.com</p>
                          <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full mt-1">
                            Pro Plan
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <User className="w-4 h-4 text-gray-600" />
                        <a href="/app/profile" className="text-gray-900">View Profile</a>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <Settings className="w-4 h-4 text-gray-600" />
                        <a href="/app/settings" className="text-gray-900">Account Settings</a>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <Bell className="w-4 h-4 text-gray-600" />
                        <a href="/app/subscription" className="text-gray-900">Subscription</a>
                      </button>
                    </div>
                    <div className="p-3 border-t border-gray-200">
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