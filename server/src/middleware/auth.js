import jwt from 'jsonwebtoken';
import User from '../../schemas/User.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // For now, we'll use a simple approach since we're using Google Auth
    // In a real app, you'd verify the JWT token properly
    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    const user = await User.findOne({ googleId: decoded.sub });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = { id: user._id.toString(), ...user.toObject() };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};