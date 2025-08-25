import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
 email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z0-9_]+$/,
  },
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
    default: 'https://via.placeholder.com/150', // Default placeholder image
  },
  bio: {
    type: String,
    maxlength: 150,
    default: '',
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Generate unique username from email
userSchema.statics.generateUsername = async function(email, name) {
  const baseUsername = (name || email.split('@')[0])
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 15);
  
  let username = baseUsername;
  let counter = 1;
  
  while (await this.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  
  return username;
};

export default mongoose.model('User', userSchema);