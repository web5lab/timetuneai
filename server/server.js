import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

import authRoutes from './src/routes/auth.js';
import friendsRoutes from './src/routes/friends.js';

dotenv.config();
const app = express();

// Fix CORS error (Allow all origins)
app.use(cors({
  origin: '*'
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// Routes
app.use('/auth', authRoutes);
app.use('/friends', friendsRoutes);

// Connect DB and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is live at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ DB connection failed:', err);
});
