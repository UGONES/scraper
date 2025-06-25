// routes/scrapeRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { verifyToken } from '../middleware/authMiddleware.js';
import { validateScrapeInput } from '../middleware/validateMiddleware.js';
import {
  scrapeHandler, // ✅ Unified scrape logic for URL + Text
  getAllScrapes,
  getScrapeById,
  updateScrape,
  deleteScrape
} from '../controllers/scrapeController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ✅ POST /api/scrapes - Accepts either a URL or free-form input
router.post(
  '/',
  [
    body('input')
      .exists().withMessage('Input is required')
      .isString().withMessage('Input must be a string'),
  ],
  validateScrapeInput,
  scrapeHandler
);

// ✅ GET all scrapes for the logged-in user
router.get('/', getAllScrapes);

// ✅ GET a single scrape
router.get('/:id', getScrapeById);

// ✅ PUT: update scrape (title, status, or data)
router.put('/:id', updateScrape);

// ✅ DELETE a scrape
router.delete('/:id', deleteScrape);

export default router;
