import express from 'express';

import authRoutes from './authRoutes.js';
import dataRoutes from './dataRoutes.js';
import scrapeRoutes from './scrapeRoutes.js';
import adminDashboardRoutes from './adminDashboardRoutes.js';
import userDashboardRoutes from './userDashboardRoutes.js';
import userRoutes from './userRoutes.js';
import contactRoutes from './contactRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/data', dataRoutes);
router.use('/scrape', scrapeRoutes);
router.use('/dashboard/admin', adminDashboardRoutes);
router.use('/dashboard/user', userDashboardRoutes);
router.use('/users', userRoutes);
router.use('/contact', contactRoutes);

export default router;
// This file serves as the main API router for the server.