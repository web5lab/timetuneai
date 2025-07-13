import React, { useState } from 'react';
import { User, Camera, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'January 2024',
    bio: 'Productivity enthusiast who loves staying organized with TimeTuneAI. Always looking for ways to optimize my daily routine.',
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-hidden flex flex-col transition-colors duration-200">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 transition-colors duration-200 pt-safe">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Profile Information Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-700 px-4 py-3 rounded-lg">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-700 px-4 py-3 rounded-lg flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    {profileData.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-700 px-4 py-3 rounded-lg flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    {profileData.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-700 px-4 py-3 rounded-lg flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    {profileData.location}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition-colors duration-200"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-700 px-4 py-3 rounded-lg">{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Account Statistics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">127</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Reminders</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">23</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Reminders</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">45</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Days Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;