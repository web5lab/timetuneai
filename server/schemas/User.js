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
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
    default: 'https://via.placeholder.com/150', // Default placeholder image
  },
}, {
  timestamps: true,
});


export default mongoose.model('User', userSchema);