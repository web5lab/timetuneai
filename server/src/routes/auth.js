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
    const existingUser = await User.findOne({ googleId })
    if (!existingUser) {
      const newUser = new User({
        email,
        name,
        googleId,
        picture: picture || 'https://via.placeholder.com/150', // Default picture if none provided
      });
      await newUser.save();
    }
    res.json({ success: true, user: { email, name, googleId, picture } });
  } catch (err) {
    console.error('Google login error', err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;