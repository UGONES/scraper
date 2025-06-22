import express from 'express';
import {
  createData,
  getProtected,
  getUserScrapes,
  getAllScrapes,
  getScrapeByIdAdmin,
  updateScrapeAdmin,
  deleteScrapeAdmin
} from '../controllers/dataController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Authenticated user routes
router.post('/', verifyToken, createData);               // Create new scraped data
router.get('/protected', verifyToken, getProtected);     // Get data depending on user role
router.get('/user', verifyToken, getUserScrapes);        // Get scrapes for logged-in user

// Admin routes
router.get('/all', verifyToken, getAllScrapes);          // Get all scrapes (admin)
router.get('/admin/:id', verifyToken, getScrapeByIdAdmin); // Get scrape by ID (admin)
router.put('/admin/:id', verifyToken, updateScrapeAdmin);  // Update scrape (admin)
router.delete('/admin/:id', verifyToken, deleteScrapeAdmin); // Delete scrape (admin)

export default router;
