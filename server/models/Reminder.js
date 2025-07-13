const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['personal', 'work', 'health', 'other'],
    default: 'personal'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['', 'daily', 'weekly', 'monthly'],
    default: ''
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  nextOccurrence: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better performance
reminderSchema.index({ userId: 1, date: 1 });
reminderSchema.index({ userId: 1, isCompleted: 1 });
reminderSchema.index({ userId: 1, category: 1 });
reminderSchema.index({ date: 1, time: 1 });

// Virtual for datetime
reminderSchema.virtual('datetime').get(function() {
  return new Date(`${this.date}T${this.time}`);
});

// Method to mark as completed
reminderSchema.methods.markCompleted = function() {
  this.isCompleted = true;
  this.completedAt = new Date();
  return this.save();
};

// Method to calculate next occurrence for recurring reminders
reminderSchema.methods.calculateNextOccurrence = function() {
  if (!this.isRecurring || !this.recurrencePattern) return null;
  
  const currentDate = new Date(`${this.date}T${this.time}`);
  
  switch (this.recurrencePattern) {
    case 'daily':
      currentDate.setDate(currentDate.getDate() + 1);
      break;
    case 'weekly':
      currentDate.setDate(currentDate.getDate() + 7);
      break;
    case 'monthly':
      currentDate.setMonth(currentDate.getMonth() + 1);
      break;
    default:
      return null;
  }
  
  return currentDate;
};

module.exports = mongoose.model('Reminder', reminderSchema);