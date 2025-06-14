import express from 'express';

import authRoutes from './authRoutes.js';
import dataRoutes from './dataRoutes.js';
import scrapeRoutes from './scrapeRoutes.js';
import adminDashboardRoutes from './adminDashboardRoutes.js';
import userDashboardRoutes from './userDashboardRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/data', dataRoutes);
router.use('/scrape', scrapeRoutes);
router.use('/admin/dashboard', adminDashboardRoutes);
router.use('/user/dashboard', userDashboardRoutes);
router.use('/users', userRoutes);

export default router;
