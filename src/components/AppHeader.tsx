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
      <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors mr-3"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Bell className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold">TimeTuneAI</h1>
                <p className="text-xs opacity-90">Your AI Assistant</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowSettings(false);
                    setShowProfile(false);
                  }}
                  className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <span className="text-sm text-gray-500">{unreadCount} unread</span>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            notification.unread ? 'bg-orange-50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                              <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="w-full text-center text-orange-600 hover:text-orange-700 font-medium text-sm">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setShowNotifications(false);
                    setShowProfile(false);
                  }}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Settings Dropdown */}
                {showSettings && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Quick Settings</h3>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <Bell className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">Notification Settings</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <Settings className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">App Preferences</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">Account Settings</span>
                      </button>
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Dark Mode</span>
                        <button className="w-10 h-6 bg-gray-300 rounded-full relative transition-colors">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
                        <span className="text-gray-900">View Profile</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <Settings className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">Account Settings</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <Bell className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">Subscription</span>
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