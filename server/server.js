import express, { json } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(json());
app.use(morgan('dev'));

// Routes
import apiRoutes from './routes/api.js';

app.use('/api', apiRoutes);

// MongoDB Connection
connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// 404 Fallback Handler
app.use('/*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Unhandled Promise Rejection Handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
