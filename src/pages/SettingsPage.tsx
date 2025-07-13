import React, { useState } from 'react';
import { Settings, Bell, Moon, Sun, Volume2, VolumeX, Smartphone, Mail, Globe, Shield, Trash2 } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';
import CalendarSync from '../components/CalendarSync';
import { useTheme } from '../contexts/ThemeContext';

const SettingsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: false,
      sound: true,
      vibration: true,
    },
    appearance: {
      theme: theme,
      fontSize: 'medium',
    },
    privacy: {
      dataCollection: true,
      analytics: false,
    },
    reminders: {
      defaultTime: '09:00',
      snoozeTime: '5',
      autoComplete: false,
    },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
    
    // Update theme when appearance.theme changes
    if (category === 'appearance' && key === 'theme') {
      setTheme(value);
    }
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (value: boolean) => void }> = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-orange-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-hidden flex flex-col transition-colors duration-200">
      <AppHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
     
      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Notifications Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications on your device</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.push}
                  onChange={(value) => updateSetting('notifications', 'push', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get reminders via email</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.email}
                  onChange={(value) => updateSetting('notifications', 'email', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Sound</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Play sound for notifications</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.sound}
                  onChange={(value) => updateSetting('notifications', 'sound', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Vibration</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vibrate for notifications</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.vibration}
                  onChange={(value) => updateSetting('notifications', 'vibration', value)}
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <Sun className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Theme</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => updateSetting('appearance', 'theme', 'light')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      settings.appearance.theme === 'light'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => updateSetting('appearance', 'theme', 'dark')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      settings.appearance.theme === 'dark'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Font Size</h3>
                <select
                  value={settings.appearance.fontSize}
                  onChange={(e) => updateSetting('appearance', 'fontSize', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Reminder Defaults</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Default Reminder Time</h3>
                <input
                  type="time"
                  value={settings.reminders.defaultTime}
                  onChange={(e) => updateSetting('reminders', 'defaultTime', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Snooze Duration (minutes)</h3>
                <select
                  value={settings.reminders.snoozeTime}
                  onChange={(e) => updateSetting('reminders', 'snoozeTime', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                >
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Auto-complete recurring reminders</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically mark recurring reminders as complete</p>
                </div>
                <ToggleSwitch
                  enabled={settings.reminders.autoComplete}
                  onChange={(value) => updateSetting('reminders', 'autoComplete', value)}
                />
              </div>
            </div>
          </div>

          {/* Calendar Sync */}
          <CalendarSync />

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Privacy & Data</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Data Collection</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Allow data collection to improve the app</p>
                </div>
                <ToggleSwitch
                  enabled={settings.privacy.dataCollection}
                  onChange={(value) => updateSetting('privacy', 'dataCollection', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Share usage analytics</p>
                </div>
                <ToggleSwitch
                  enabled={settings.privacy.analytics}
                  onChange={(value) => updateSetting('privacy', 'analytics', value)}
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6 transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <Trash2 className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold text-red-900 dark:text-red-400">Danger Zone</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium">
                Clear All Reminders
              </button>
              <button className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;