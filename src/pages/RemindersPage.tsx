import React, { useState } from 'react';
import { Plus, Search, Filter, Clock, CheckCircle, Trash2, Edit3, Calendar, Bell, MoreVertical, Star, X } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';

interface Reminder {
  id: number;
  title: string;
  description: string;
  time: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  recurring: boolean;
}

const RemindersPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: 'Team Meeting',
      description: 'Weekly team sync meeting with product updates',
      time: '2:00 PM',
      date: '2024-01-15',
      priority: 'high',
      category: 'work',
      completed: false,
      recurring: true,
    },
    {
      id: 2,
      title: 'Call Dentist',
      description: 'Schedule dental checkup appointment',
      time: '4:30 PM',
      date: '2024-01-15',
      priority: 'medium',
      category: 'health',
      completed: false,
      recurring: false,
    },
    {
      id: 3,
      title: 'Buy Groceries',
      description: 'Weekly grocery shopping - milk, bread, fruits',
      time: '6:00 PM',
      date: '2024-01-15',
      priority: 'low',
      category: 'personal',
      completed: false,
      recurring: true,
    },
    {
      id: 4,
      title: 'Morning Workout',
      description: 'Gym session - chest and triceps',
      time: '7:00 AM',
      date: '2024-01-15',
      priority: 'medium',
      category: 'health',
      completed: true,
      recurring: true,
    },
  ]);

  const categories = [
    { id: 'all', name: 'All', count: reminders.length, color: 'bg-gray-500' },
    { id: 'work', name: 'Work', count: reminders.filter(r => r.category === 'work').length, color: 'bg-blue-500' },
    { id: 'personal', name: 'Personal', count: reminders.filter(r => r.category === 'personal').length, color: 'bg-green-500' },
    { id: 'health', name: 'Health', count: reminders.filter(r => r.category === 'health').length, color: 'bg-red-500' },
  ];

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || reminder.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleComplete = (id: number) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const deleteReminder = (id: number) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const upcomingReminders = filteredReminders.filter(r => !r.completed);
  const completedReminders = filteredReminders.filter(r => r.completed);

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-hidden flex flex-col transition-colors duration-200">
      <AppHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Special Reminders Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white shadow-lg">
        <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          {/* Header Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">My Reminders</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-orange-100">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{upcomingReminders.length} upcoming</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">{completedReminders.length} completed</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Today: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {/* Add Reminder Button */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-white text-orange-600 px-6 py-3 rounded-xl hover:bg-orange-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg font-semibold text-sm sm:text-base group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              <span>Add Reminder</span>
            </button>
          </div>
          
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
            <div className="bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
              <div className="text-base sm:text-lg lg:text-2xl font-bold">{reminders.filter(r => r.priority === 'high' && !r.completed).length}</div>
              <div className="text-xs sm:text-sm text-orange-100 dark:text-orange-200">High Priority</div>
            </div>
            <div className="bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
              <div className="text-base sm:text-lg lg:text-2xl font-bold">{reminders.filter(r => r.recurring).length}</div>
              <div className="text-xs sm:text-sm text-orange-100 dark:text-orange-200">Recurring</div>
            </div>
            <div className="bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
              <div className="text-base sm:text-lg lg:text-2xl font-bold">{new Set(reminders.map(r => r.category)).size}</div>
              <div className="text-xs sm:text-sm text-orange-100 dark:text-orange-200">Categories</div>
            </div>
            <div className="bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
              <div className="text-base sm:text-lg lg:text-2xl font-bold">{Math.round((completedReminders.length / reminders.length) * 100) || 0}%</div>
              <div className="text-xs sm:text-sm text-orange-100 dark:text-orange-200">Completed</div>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white dark:focus:bg-slate-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-white/10 dark:bg-white/20 backdrop-blur-sm rounded-xl p-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' 
                    : 'text-white hover:bg-white/10 dark:hover:bg-white/20'
                }`}
              >
                <div className="w-4 h-4 flex flex-col space-y-1">
                  <div className="h-0.5 bg-current rounded"></div>
                  <div className="h-0.5 bg-current rounded"></div>
                  <div className="h-0.5 bg-current rounded"></div>
                </div>
                <span className="text-sm font-medium">List</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' 
                    : 'text-white hover:bg-white/10 dark:hover:bg-white/20'
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
                <span className="text-sm font-medium">Grid</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
                        onClick={() => toggleComplete(reminder.id)}
                        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 transition-colors flex items-center justify-center flex-shrink-0"
                      >
                        {reminder.completed && <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-green-500" />}
                      </button>
                      <span className="text-base sm:text-lg lg:text-2xl">{getCategoryIcon(reminder.category)}</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all">
                        <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-500" />
                      </button>
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
                    {reminder.recurring && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium self-start sm:self-auto">
                        Recurring
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button className="p-1 sm:p-1.5 lg:p-2 text-gray-400 dark:text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all">
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button className="p-1 sm:p-1.5 lg:p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                        <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
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
                      onClick={() => deleteReminder(reminder.id)}
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
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 mx-auto text-sm sm:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Create your first reminder</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transition-colors duration-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Reminder</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="What do you want to be reminded about?"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Description</label>
                  <textarea
                    placeholder="Add more details (optional)"
                    rows={2}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm sm:text-base transition-colors duration-200"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Time</label>
                    <input
                      type="time"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Category</label>
                  <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base transition-colors duration-200">
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Priority</label>
                  <div className="flex space-x-2 sm:space-x-3">
                    {['low', 'medium', 'high'].map((priority) => (
                      <button
                        key={priority}
                        className={`flex-1 px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl border transition-all duration-200 ${
                          priority === 'high' 
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : priority === 'medium'
                            ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                            : 'border-green-300 bg-green-50 text-green-700'
                        }`}
                      >
                        <span className="capitalize text-xs sm:text-sm font-medium">{priority}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <input
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
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Create Reminder
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