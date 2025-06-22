import { body, validationResult } from 'express-validator';

// User registration validation
export const validateRegister = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 6 }).withMessage('Username must be at least 6 characters'),
  body('email')
    .isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Scrape input validation
export const validateScrapeInput = [
  body('url')
    .notEmpty().withMessage('URL is required')
    .isURL().withMessage('Must be a valid URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
