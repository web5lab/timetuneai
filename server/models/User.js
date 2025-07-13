const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  provider: {
    type: String,
    enum: ['google', 'email'],
    default: 'google'
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    defaultReminderTime: {
      type: String,
      default: '09:00'
    },
    snoozeTime: {
      type: Number,
      default: 5
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active'
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  stats: {
    totalReminders: {
      type: Number,
      default: 0
    },
    completedReminders: {
      type: Number,
      default: 0
    },
    streakDays: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for completion rate
userSchema.virtual('completionRate').get(function() {
  if (this.stats.totalReminders === 0) return 0;
  return Math.round((this.stats.completedReminders / this.stats.totalReminders) * 100);
});

// Method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save();
};

// Method to increment reminder stats
userSchema.methods.incrementReminderStats = function(completed = false) {
  this.stats.totalReminders += 1;
  if (completed) {
    this.stats.completedReminders += 1;
  }
  return this.save();
};

module.exports = mongoose.model('User', userSchema);