import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { OAuth2Client } from 'google-auth-library';
import User from '../../schemas/User.js';
const router = express.Router();


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Get user profile
router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;
    
    let existingUser = await User.findOne({ googleId });
    
    if (!existingUser) {
      // Generate unique username
      const username = await User.generateUsername(email, name);
      
      const newUser = new User({
        email,
        name,
        username,
        googleId,
        picture: picture || 'https://via.placeholder.com/150', // Default picture if none provided
      });
      existingUser = await newUser.save();
    }
    
    res.json({ 
      success: true, 
      user: { 
        email: existingUser.email, 
        name: existingUser.name, 
        username: existingUser.username,
        googleId: existingUser.googleId, 
        picture: existingUser.picture 
      } 
    });
  } catch (err) {
    console.error('Google login error', err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;