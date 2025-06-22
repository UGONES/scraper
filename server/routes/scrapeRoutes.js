// routes/scrapeRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { verifyToken } from '../middleware/authMiddleware.js';
import {validateScrapeInput} from '../middleware/validateMiddleware.js';
import {
  scrapeAndSave,
  getAllScrapes,
  getScrapeById,
  updateScrape,
  deleteScrape
} from '../controllers/scrapeController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// POST /api/scrapes - Create a new scrape request
router.post(
  '/',
  [
    body('url')
      .exists().withMessage('URL is required')
      .isURL().withMessage('Invalid URL format'),
    body('title').optional().isString().trim(),
  ],
  validateScrapeInput,
  scrapeAndSave
);

// GET /api/scrapes - Get all scrapes for the logged-in user
router.get('/', getAllScrapes);

// GET /api/scrapes/:id - Get a single scrape
router.get('/:id', getScrapeById);

// PUT /api/scrapes/:id - Update scrape
router.put('/:id', updateScrape);

// DELETE /api/scrapes/:id - Delete scrape
router.delete('/:id', deleteScrape);

export default router;
