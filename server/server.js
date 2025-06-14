import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';

// Import modular routes
import apiRoutes from './routes/api.js';

config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { dbName: 'scraperDB', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api', apiRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
