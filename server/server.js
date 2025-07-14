import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

import authRoutes from './src/routes/auth.js';
import gameRoutes from './src/routes/game.js';
import referralRoutes from './src/routes/referral.js';
import socialRoutes from './src/routes/social.js';
import adminRoutes from './src/routes/admin.js';

dotenv.config();
const app = express();

// Fix CORS error (Allow all origins)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// Routes
app.use('/api/auth', authRoutes);

// Connect DB and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is live at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ DB connection failed:', err);
});
