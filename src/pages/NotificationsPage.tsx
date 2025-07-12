import React, { useState } from 'react';
import { Bell, BellOff, Settings, Check, X, Clock, Calendar, Filter, Search, MoreVertical } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'reminder' | 'system' | 'achievement' | 'social';
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionRequired?: boolean;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Team Meeting Reminder',
      message: 'Your team meeting starts in 15 minutes. Join the video call now.',
      time: '2 min ago',
      type: 'reminder',
      read: false,
      priority: 'high',
      category: 'work',
      actionRequired: true,
    },
    {
      id: 2,
      title: 'Daily Goal Achieved! 🎉',
      message: 'Congratulations! You completed all 8 reminders today. Keep up the great work!',
      time: '1 hour ago',
      type: 'achievement',
      read: false,
      priority: 'medium',
      category: 'achievement',
    },
    {
      id: 3,
      title: 'Call Dentist',
      message: 'Don\'t forget to call your dentist to schedule your checkup appointment.',
      time: '2 hours ago',
      type: 'reminder',
      read: true,
      priority: 'medium',
      category: 'health',
    },
    {
      id: 4,
      title: 'Weekly Report Available',
      message: 'Your productivity report for this week is ready to view.',
      time: '1 day ago',
      type: 'system',
      read: true,
      priority: 'low',
      category: 'system',
    },
    {
      id: 5,
      title: 'Workout Reminder',
      message: 'Time for your evening workout! You\'ve got this! 💪',
      time: '2 days ago',
      type: 'reminder',
      read: true,
      priority: 'medium',
      category: 'health',
    },
  ]);

  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: true,
    quietStart: '22:00',
    quietEnd: '07:00',
    reminderNotifications: true,
    achievementNotifications: true,
    systemNotifications: true,
  });

  const [filterType, setFilterType] = useState<'all' | 'unread' | 'reminder' | 'achievement' | 'system'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return '⏰';
      case 'achievement': return '🏆';
      case 'system': return '⚙️';
      case 'social': return '👥';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && !notification.read) ||
                         notification.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const filterOptions = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'reminder', label: 'Reminders', count: notifications.filter(n => n.type === 'reminder').length },
    { id: 'achievement', label: 'Achievements', count: notifications.filter(n => n.type === 'achievement').length },
    { id: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
  ];

  return (
    <div className="h-full bg-gray-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Mark all as read
              </button>
            )}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilterType(option.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterType === option.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span>{option.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filterType === option.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${
                  getPriorityColor(notification.priority)
                } ${!notification.read ? 'ring-2 ring-orange-100' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-2xl mt-1">{getNotificationIcon(notification.type)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`font-semibold text-gray-900 ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                        )}
                        {notification.actionRequired && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                            Action Required
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{notification.time}</span>
                          <span className="capitalize">{notification.category}</span>
                          <span className={`px-2 py-1 rounded-full font-medium ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {notification.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete notification"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {notification.actionRequired && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-3">
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                              Take Action
                            </button>
                            <button className="text-gray-600 text-sm hover:text-gray-800 transition-colors">
                              Remind me later
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' ? 'No notifications found' : 'No notifications'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'You\'re all caught up! New notifications will appear here.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Quick Settings Panel */}
      <div className="bg-white border-t border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Settings</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-800">Push</span>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
              className={`w-8 h-4 rounded-full transition-colors ${
                settings.pushNotifications ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                settings.pushNotifications ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🔊</span>
              <span className="text-sm text-gray-800">Sound</span>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className={`w-8 h-4 rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                settings.soundEnabled ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm">📳</span>
              <span className="text-sm text-gray-800">Vibrate</span>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }))}
              className={`w-8 h-4 rounded-full transition-colors ${
                settings.vibrationEnabled ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                settings.vibrationEnabled ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🌙</span>
              <span className="text-sm text-gray-800">Quiet</span>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, quietHours: !prev.quietHours }))}
              className={`w-8 h-4 rounded-full transition-colors ${
                settings.quietHours ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                settings.quietHours ? 'translate-x-4' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;