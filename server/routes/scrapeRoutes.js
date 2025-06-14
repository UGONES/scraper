import express from 'express';
import { query } from 'express-validator';
import { scrape } from '../controllers/scrapeController.js';
import { auth } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get(
  '/',
  auth,
  [
    query('url').exists().withMessage('URL is required').isURL().withMessage('Invalid URL format'),
  ],
  validate,
  scrape
);

export default router;
