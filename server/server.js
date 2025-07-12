/**
 * server.js – production‑safe Express entry‑point
 * Works locally and on Render.com
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

/* ─────────────────────────────
   1.  Load environment variables
   ───────────────────────────── */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prefer a project‑root .env, fall back to /server/.env
const rootEnv = path.resolve(process.cwd(), '.env');
const serverEnv = path.resolve(__dirname, '.env');
const envFile = fs.existsSync(rootEnv) ? rootEnv : serverEnv;

dotenv.config({ path: envFile });
console.log('[DEBUG] Loaded .env from:', envFile);

// Fail fast if Mongo URI still missing
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL;
if (!MONGO_URI) {
  console.error('❌  MONGO_URI (or DATABASE_URL) is not set in', envFile);
  process.exit(1);
}

/* ─────────────────────────────
   2.  Express app setup
   ───────────────────────────── */
const LOCAL_PORT = process.env.LOCAL_PORT || 5000;
const PORT = process.env.PORT || LOCAL_PORT;

const app = express();

// Ensure /uploads exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const allowedOrigins = [
  'https://scraper-data.onrender.com', // ✅ Your frontend on Render
  'http://localhost:3000',             // ✅ For local dev
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Static uploads
app.use('/uploads', express.static(uploadsDir));

/* ─────────────────────────────
   3.  API & front‑end routes
   ───────────────────────────── */
import apiRoutes from './routes/api.js';
app.use('/api', apiRoutes);

// ✅ Serve React frontend from ../client/build
const clientBuild = path.resolve(__dirname, '../client/build');
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}
console.log('[DEBUG] JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('[DEBUG] MONGO_URI exists:', !!process.env.MONGO_URI);
// Fallback for non-API routes
// 404 for unknown API routes
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'Route not found' });
  }
  next();
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

/* ─────────────────────────────
   4.  Connect to MongoDB & start server
   ───────────────────────────── */
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀  Server listening on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err);
    process.exit(1);
  });

export default app;

// Note: This file exports the Express app instance.
// This allows us to import the app in tests without starting the server  
// or duplicating the connection logic.
// It also ensures the server is only started once, preventing issues with multiple connections in tests.
// This is the main entry point for the server application.
// It sets up the Express server, connects to MongoDB, and serves the API routes.
// It also handles static file serving for the React client build if it exists.
// The server listens on the specified port and handles errors gracefully.
