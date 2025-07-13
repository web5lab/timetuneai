import React, { useState } from 'react';
import { Calendar, Check, X, Settings, Sync, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { useCalendar } from '../contexts/CalendarContext';

const CalendarSync: React.FC = () => {
  const {
    providers,
    syncSettings,
    isConnecting,
    lastSyncTime,
    connectGoogle,
    connectOutlook,
    connectApple,
    disconnectProvider,
    updateSyncSettings,
    syncAllReminders,
  } = useCalendar();

  const [showSettings, setShowSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async (providerId: string) => {
    let success = false;
    
    switch (providerId) {
      case 'google':
        success = await connectGoogle();
        break;
      case 'outlook':
        success = await connectOutlook();
        break;
      case 'apple':
        success = await connectApple();
        break;
    }

    if (success) {
      // Auto-sync after successful connection
      handleSyncAll();
    }
  };

  const handleDisconnect = async (providerId: string) => {
    await disconnectProvider(providerId);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await syncAllReminders();
    } finally {
      setIsSyncing(false);
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'google':
        return '📅';
      case 'outlook':
        return '📧';
      case 'apple':
        return '🍎';
      default:
        return '📅';
    }
  };

  const connectedProviders = providers.filter(p => p.connected);
  const availableProviders = providers.filter(p => !p.connected);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Calendar Sync</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
          {connectedProviders.length > 0 && (
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <Sync className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Connected Providers */}
      {connectedProviders.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Connected Calendars</h3>
          <div className="space-y-3">
            {connectedProviders.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getProviderIcon(provider.type)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{provider.name}</h4>
                    {provider.email && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{provider.email}</p>
                    )}
                  </div>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <button
                  onClick={() => handleDisconnect(provider.id)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                >
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Providers */}
      {availableProviders.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Available Calendars</h3>
          <div className="space-y-3">
            {availableProviders.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getProviderIcon(provider.type)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{provider.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sync your reminders automatically
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleConnect(provider.id)}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sync Settings */}
      {showSettings && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Sync Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Auto Sync</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically sync new reminders</p>
              </div>
              <button
                onClick={() => updateSyncSettings({ autoSync: !syncSettings.autoSync })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  syncSettings.autoSync ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    syncSettings.autoSync ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Sync Categories</h4>
              <div className="space-y-2">
                {['work', 'personal', 'health', 'other'].map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={syncSettings.syncCategories.includes(category)}
                      onChange={(e) => {
                        const categories = e.target.checked
                          ? [...syncSettings.syncCategories, category]
                          : syncSettings.syncCategories.filter(c => c !== category);
                        updateSyncSettings({ syncCategories: categories });
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Reminder Offset</h4>
              <select
                value={syncSettings.reminderOffset}
                onChange={(e) => updateSyncSettings({ reminderOffset: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={60}>1 hour before</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sync Status */}
      {lastSyncTime && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Clock className="w-4 h-4" />
          <span>Last synced: {lastSyncTime.toLocaleString()}</span>
        </div>
      )}

      {/* Setup Instructions */}
      {connectedProviders.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Setup Calendar Sync</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Connect your calendar to automatically sync reminders and never miss important events.
              </p>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <span>Setup Google Calendar API</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSync;