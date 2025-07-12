import React, { useState } from 'react';
import { Plus, Search, Filter, Clock, CheckCircle, Trash2, Edit3, Calendar, Bell, MoreVertical, Star } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
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
    <div className="h-full bg-gray-50 overflow-hidden flex flex-col">
      {/* Header Section - Responsive */}
      <div className="bg-white border-b border-gray-200 p-3 ">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Reminders</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {upcomingReminders.length} upcoming, {completedReminders.length} completed
            </p>
          </div>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg text-sm sm:text-base">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">New Reminder</span>
          </button>
        </div>
      </div>

      {/* Content Area - Responsive */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" />
              Upcoming ({upcomingReminders.length})
            </h2>
            <div className={`grid gap-3 sm:gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button
                        onClick={() => toggleComplete(reminder.id)}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 hover:border-orange-500 transition-colors flex items-center justify-center flex-shrink-0"
                      >
                        {reminder.completed && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />}
                      </button>
                      <span className="text-lg sm:text-2xl">{getCategoryIcon(reminder.category)}</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                        <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{reminder.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{reminder.description}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 gap-2 sm:gap-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{reminder.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{new Date(reminder.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {reminder.recurring && (
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        Recurring
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button className="p-1.5 sm:p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
              Completed ({completedReminders.length})
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {completedReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 opacity-75"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-base sm:text-lg flex-shrink-0">{getCategoryIcon(reminder.category)}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 line-through text-sm sm:text-base truncate">{reminder.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {reminder.time} • {new Date(reminder.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
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
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No reminders found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">Try adjusting your search or filter criteria</p>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 mx-auto text-sm sm:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Create your first reminder</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersPage;