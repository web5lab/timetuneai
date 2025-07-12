import React, { useState } from 'react';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, Edit3, Camera, Award, TrendingUp, Crown, Zap, Calendar, Target } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    avatar: '',
    joinDate: '2023-06-15',
    plan: 'Pro',
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
  });

  const [stats] = useState({
    totalReminders: 156,
    completedReminders: 142,
    successRate: 91,
    streakDays: 12,
    weeklyGoal: 25,
    weeklyCompleted: 18,
  });

  const achievements = [
    { id: 1, title: 'Early Bird', description: 'Set 10 morning reminders', icon: '🌅', unlocked: true, date: '2023-12-15' },
    { id: 2, title: 'Consistent', description: '7-day streak', icon: '🔥', unlocked: true, date: '2023-12-20' },
    { id: 3, title: 'Productive', description: 'Complete 50 reminders', icon: '⚡', unlocked: true, date: '2023-12-25' },
    { id: 4, title: 'Master', description: 'Complete 100 reminders', icon: '🏆', unlocked: true, date: '2024-01-05' },
    { id: 5, title: 'Perfectionist', description: '95% success rate', icon: '💎', unlocked: false, progress: 91 },
    { id: 6, title: 'Marathon', description: '30-day streak', icon: '🎯', unlocked: false, progress: 12 },
  ];

  const recentActivity = [
    { id: 1, action: 'Completed', item: 'Morning workout', time: '2 hours ago', type: 'completed' },
    { id: 2, action: 'Created', item: 'Team meeting reminder', time: '4 hours ago', type: 'created' },
    { id: 3, action: 'Achieved', item: 'Master badge', time: '1 day ago', type: 'achievement' },
    { id: 4, action: 'Updated', item: 'Profile settings', time: '2 days ago', type: 'updated' },
  ];

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', action: () => {}, description: 'Update your profile details' },
        { icon: Bell, label: 'Notifications', action: () => {}, description: 'Manage notification preferences' },
        { icon: Settings, label: 'App Settings', action: () => {}, description: 'Customize your experience' },
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: Shield, label: 'Privacy Settings', action: () => {}, description: 'Control your data and privacy' },
        { icon: Crown, label: 'Subscription', action: () => {}, description: 'Manage your Pro plan' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', action: () => {}, description: 'Get help and support' },
        { icon: LogOut, label: 'Sign Out', action: () => {}, danger: true, description: 'Sign out of your account' },
      ]
    }
  ];

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-white/30">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 bg-white text-orange-500 p-2 rounded-full shadow-lg hover:shadow-xl transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                <p className="text-orange-100 mb-2">{user.email}</p>
                <div className="flex items-center space-x-4 text-sm text-orange-200">
                  <span>{user.location}</span>
                  <span>•</span>
                  <span>{user.timezone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-300" />
                <span className="font-medium">{user.plan} Plan</span>
              </div>
              <div className="text-sm text-orange-200">
                Member since {new Date(user.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalReminders}</div>
            <div className="text-sm text-gray-600">Total Reminders</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.successRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.streakDays}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.weeklyCompleted}/{stats.weeklyGoal}</div>
            <div className="text-sm text-gray-600">This Week</div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
            <div className="text-sm text-gray-600">
              {Math.round((stats.weeklyCompleted / stats.weeklyGoal) * 100)}% of goal
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{stats.weeklyCompleted} completed</span>
              <span>{stats.weeklyGoal} goal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(stats.weeklyCompleted / stats.weeklyGoal) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const completed = Math.floor(Math.random() * 5) + 1;
              const total = 5;
              const percentage = (completed / total) * 100;
              
              return (
                <div key={day} className="text-center">
                  <div className="text-xs text-gray-600 mb-2">{day}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{completed}/{total}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
            <Award className="w-5 h-5 text-orange-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  achievement.unlocked
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  {achievement.unlocked && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">{achievement.title}</div>
                <div className="text-xs text-gray-600 mb-3">{achievement.description}</div>
                
                {achievement.unlocked ? (
                  <div className="text-xs text-green-600 font-medium">
                    Unlocked {new Date(achievement.date!).toLocaleDateString()}
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'completed' ? 'bg-green-100' :
                  activity.type === 'created' ? 'bg-blue-100' :
                  activity.type === 'achievement' ? 'bg-yellow-100' :
                  'bg-gray-100'
                }`}>
                  {activity.type === 'completed' && '✅'}
                  {activity.type === 'created' && '➕'}
                  {activity.type === 'achievement' && '🏆'}
                  {activity.type === 'updated' && '⚙️'}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.action} {activity.item}
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Menu */}
        <div className="space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {section.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left ${
                      item.danger ? 'text-red-600' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        item.danger ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    <div className="w-5 h-5 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;