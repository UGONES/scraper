import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connect } from 'mongoose';
import { fileURLToPath } from 'url';

// 🗄️ Load environment variables
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

// 📍 Resolve current file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚀 Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// 🗂️ Ensure /uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('✅ /uploads folder created');
}

// 🛡️ Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

// 📁 Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// 🔌 API routes
import apiRoutes from './routes/api.js';
app.use('/api', apiRoutes);

// 🌐 Serve React build when present
const clientBuild = path.join(__dirname, 'client', 'build');
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get('*', (_req, res) => res.sendFile(path.join(clientBuild, 'index.html')));
}

// 🛑 404 handler for API routes
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'Route not found' });
  }
  next();
});

// ❗ Global error handler
app.use((err, _req, res, _next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error' });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 🗄️ Connect to MongoDB and start server
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      setTimeout(() => {
        console.log('🕒 Server started after 5 seconds delay');
      }, 1000);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
