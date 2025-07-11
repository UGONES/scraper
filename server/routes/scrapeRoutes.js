import express from 'express';
import { body } from 'express-validator';
import {
  createScrape,
  getOwnScrapes,
  getAllScrapes
} from '../controllers/scrapeController.js';
import { verifyToken, isAdmin, isUser,allowUserOrAdmin } from '../middleware/authMiddleware.js';
import { validateScrapeInput } from '../middleware/validateMiddleware.js';

const router = express.Router();

// ✅ All routes require authentication
router.use(verifyToken);

// ✅ USER: Create a scrape
router.post(
  '/user',
  allowUserOrAdmin,
  [
    body('input')
      .exists().withMessage('Input is required')
      .isString().withMessage('Input must be a string'),
  ],
  validateScrapeInput,
  createScrape
);

// ✅ USER: Get own scrapes
router.get('/user', allowUserOrAdmin, getOwnScrapes);

// ✅ ADMIN: Get all scrapes (for admin only)
router.get('/admin', isAdmin, getAllScrapes);

export default router;
