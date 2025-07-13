import React, { useState } from 'react';
import { Plus, Search, Filter, Clock, CheckCircle, Trash2, Edit3, Calendar, Bell, MoreVertical, Star, X, Save } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { useReminders } from '../contexts/RemindersContext';
import { useNotifications } from '../hooks/useNotifications';

const RemindersPage: React.FC = () => {
  const { isPermissionGranted, requestPermission } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    category: 'personal' as 'personal' | 'work' | 'health' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high',
    isRecurring: false,
  });
  const { reminders, toggleComplete, deleteReminder: removeReminder, addReminder, updateReminder } = useReminders();

  const categories = [
    { id: 'all', name: 'All', count: reminders.length, color: 'bg-gray-500' },
    { id: 'work', name: 'Work', count: reminders.filter(r => r.category === 'work').length, color: 'bg-blue-500' },
    { id: 'personal', name: 'Personal', count: reminders.filter(r => r.category === 'personal').length, color: 'bg-green-500' },
    { id: 'health', name: 'Health', count: reminders.filter(r => r.category === 'health').length, color: 'bg-red-500' },
  ];

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || reminder.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleComplete = (id: string) => {
    console.log('Toggling complete for reminder:', id);
    toggleComplete(id);
  };

  const handleDeleteReminder = (id: string) => {
    console.log('Deleting reminder:', id);
    removeReminder(id);
    setShowDeleteConfirm(null);
  };

  const handleEditReminder = (reminder: any) => {
    console.log('Editing reminder:', reminder);
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      date: reminder.date,
      time: reminder.time,
      category: reminder.category,
      priority: reminder.priority,
      isRecurring: reminder.isRecurring,
    });
    setShowEditModal(true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateReminder = () => {
    if (!formData.title.trim()) {
      alert('Please enter a reminder title');
      return;
    }

    const reminderData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      time: formData.time,
      category: formData.category,
      priority: formData.priority,
      isCompleted: false,
      isRecurring: formData.isRecurring,
      recurrencePattern: formData.isRecurring ? 'daily' : '',
    };

    console.log('Creating reminder:', reminderData);
    const id = addReminder(reminderData);
    console.log('Reminder created with ID:', id);

    // Reset form and close modal
    resetForm();
    setShowAddModal(false);
  };

  const handleUpdateReminder = () => {
    if (!formData.title.trim()) {
      alert('Please enter a reminder title');
      return;
    }

    if (!editingReminder) return;

    const updates = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      time: formData.time,
      category: formData.category,
      priority: formData.priority,
      isRecurring: formData.isRecurring,
      recurrencePattern: formData.isRecurring ? 'daily' : '',
    };

    console.log('Updating reminder:', editingReminder.id, updates);
    updateReminder(editingReminder.id, updates);

    // Reset form and close modal
    resetForm();
    setShowEditModal(false);
    setEditingReminder(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      category: 'personal',
      priority: 'medium',
      isRecurring: false,
    });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingReminder(null);
    resetForm();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return '💼';
      case 'personal': return '👤';
      case 'health': return '🏥';
      default: return '📝';
    }
  };

  const upcomingReminders = filteredReminders.filter(r => !r.isCompleted);
  const completedReminders = filteredReminders.filter(r => r.isCompleted);

  // Show notification permission banner if not granted
  const showNotificationBanner = !isPermissionGranted && upcomingReminders.length > 0;

  const ReminderModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isEdit ? 'Edit Reminder' : 'Add New Reminder'}
            </h2>
            <button
              onClick={handleCloseModal}
              className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Title</label>
              <input
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                type="text"
                placeholder="What do you want to be reminded about?"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Add more details (optional)"
                rows={2}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm sm:text-base transition-colors duration-200"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Date</label>
                <input
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  type="date"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Time</label>
                <input
                  value={formData.time}
                  onChange={(e) => handleFormChange('time', e.target.value)}
                  type="time"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Priority</label>
              <div className="flex space-x-2 sm:space-x-3">
                {['low', 'medium', 'high'].map((priority) => (
                  <button
                    onClick={() => handleFormChange('priority', priority)}
                    key={priority}
                    className={`flex-1 px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border transition-all duration-200 ${
                      formData.priority === priority
                        ? priority === 'high' 
                          ? 'border-red-500 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : priority === 'medium'
                          ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : 'border-green-500 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span className="capitalize text-xs sm:text-sm font-medium">{priority}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <input
                checked={formData.isRecurring}
                onChange={(e) => handleFormChange('isRecurring', e.target.checked)}
                type="checkbox"
                id="recurring"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 rounded focus:ring-orange-500"
              />
              <label htmlFor="recurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Make this a recurring reminder
              </label>
            </div>
          </div>
          
          <div className="flex space-x-2 sm:space-x-3 mt-6 sm:mt-8">
            <button
              onClick={handleCloseModal}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={isEdit ? handleUpdateReminder : handleCreateReminder}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium text-sm sm:text-base"
            >
              {isEdit ? 'Update Reminder' : 'Create Reminder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-hidden flex flex-col transition-colors duration-200">
      <AppHeader />
      
      {/* Special Reminders Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reminders</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {upcomingReminders.length} upcoming • {completedReminders.length} completed
            </p>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Reminder</span>
          </button>
        </div>
      </div>

      {/* Notification Permission Banner */}
      {showNotificationBanner && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800 px-4 lg:px-6 py-3 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Enable notifications to get reminded on time
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  You'll receive alerts when your reminders are due
                </p>
              </div>
            </div>
            <button
              onClick={requestPermission}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 transition-colors duration-200">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilterCategory(category.id)}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                filterCategory === category.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
              <span className="text-xs sm:text-sm font-medium">{category.name}</span>
              <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                filterCategory === category.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-400'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area - Responsive */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" />
              Upcoming ({upcomingReminders.length})
            </h2>
            <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button
                        onClick={() => handleToggleComplete(reminder.id)}
                        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 transition-colors flex items-center justify-center flex-shrink-0"
                      >
                        {reminder.isCompleted && <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-green-500" />}
                      </button>
                      <span className="text-base sm:text-lg lg:text-2xl">{getCategoryIcon(reminder.category)}</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg">{reminder.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 line-clamp-2">{reminder.description}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2 sm:gap-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        <span>{reminder.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        <span>{new Date(reminder.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {reminder.isRecurring && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium self-start sm:self-auto">
                        Recurring
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button 
                        onClick={() => handleEditReminder(reminder)}
                        className="p-1 sm:p-1.5 lg:p-2 text-gray-400 dark:text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button className="p-1 sm:p-1.5 lg:p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                        <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(reminder.id)}
                      className="p-1 sm:p-1.5 lg:p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Reminders - Responsive */}
        {completedReminders.length > 0 && (
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
              Completed ({completedReminders.length})
            </h2>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              {completedReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700 opacity-75 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base lg:text-lg flex-shrink-0">{getCategoryIcon(reminder.category)}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-through text-sm sm:text-base lg:text-lg truncate">{reminder.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {reminder.time} • {new Date(reminder.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(reminder.id)}
                      className="p-1 sm:p-1.5 lg:p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Responsive */}
        {filteredReminders.length === 0 && (
          <div className="text-center py-6 sm:py-8 lg:py-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No reminders found</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-4">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 mx-auto text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Create your first reminder</span>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Reminder Modal */}
      {(showAddModal || showEditModal) && <ReminderModal isEdit={showEditModal} />}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full p-6 transition-colors duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete Reminder</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this reminder? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReminder(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemindersPage;