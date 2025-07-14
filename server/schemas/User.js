import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Wallet Information
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  walletProvider: {
    type: String,
    enum: ['metamask', 'trustwallet', 'walletconnect'],
    required: true
  },
  network: {
    type: String,
    default: 'BSC'
  },
  
  // User Profile
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  
  // Game Statistics
  totalSpins: {
    type: Number,
    default: 0,
    min: 0
  },
  totalWinnings: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  ticketsPurchased: {
    type: Number,
    default: 0,
    min: 0
  },
  currentTickets: {
    type: Number,
    default: 0,
    min: 0
  },
  winRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Token Balances
  tokenBalances: {
    bnb: {
      type: String,
      default: '0'
    },
    usdt: {
      type: String,
      default: '0'
    },
    xxxhub: {
      type: String,
      default: '0'
    }
  },
  
  // Referral System
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  totalReferrals: {
    type: Number,
    default: 0,
    min: 0
  },
  completedReferrals: {
    type: Number,
    default: 0,
    min: 0
  },
  referralRewardsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Social Tasks
  completedTasks: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SocialTask'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    },
    rewardClaimed: {
      type: Boolean,
      default: false
    }
  }],
  
  // User Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVip: {
    type: Boolean,
    default: false
  },
  vipLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
    default: null
  },
  
  // Timestamps
  lastLoginDate: {
    type: Date,
    default: Date.now
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ walletAddress: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ referredBy: 1 });
userSchema.index({ totalSpins: -1 });
userSchema.index({ totalWinnings: -1 });
userSchema.index({ lastActivityDate: -1 });

// Virtual for profit/loss calculation
userSchema.virtual('profitLoss').get(function() {
  return this.totalWinnings - this.totalSpent;
});

// Virtual for referral link
userSchema.virtual('referralLink').get(function() {
  return this.referralCode ? `https://spinwin.app/ref/${this.referralCode}` : null;
});

// Pre-save middleware to generate referral code
userSchema.pre('save', function(next) {
  if (this.isNew && !this.referralCode) {
    this.referralCode = 'SPIN' + this.walletAddress.slice(-6).toUpperCase();
  }
  next();
});

// Methods
userSchema.methods.updateActivity = function() {
  this.lastActivityDate = new Date();
  return this.save();
};

userSchema.methods.addSpin = function(winAmount = 0) {
  this.totalSpins += 1;
  this.totalWinnings += winAmount;
  this.winRate = (this.totalWinnings / Math.max(this.totalSpent, 1)) * 100;
  this.lastActivityDate = new Date();
  return this.save();
};

userSchema.methods.purchaseTickets = function(amount, cost) {
  this.ticketsPurchased += amount;
  this.currentTickets += amount;
  this.totalSpent += cost;
  this.winRate = (this.totalWinnings / Math.max(this.totalSpent, 1)) * 100;
  this.lastActivityDate = new Date();
  return this.save();
};

userSchema.methods.useTicket = function() {
  if (this.currentTickets > 0) {
    this.currentTickets -= 1;
    return this.save();
  }
  throw new Error('No tickets available');
};

export default mongoose.model('User', userSchema);