import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api', apiRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Sample POST route
app.post('/api/data', (req, res) => {
  console.log(req.body); // Data sent from frontend
  res.json({ message: 'Data received', yourData: req.body });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: clean up and shutdown gracefully
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));