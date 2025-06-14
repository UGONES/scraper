import { Router } from 'express';
import { register, login } from '../controllers/authControllers.js';
import { body } from 'express-validator';
import validate from '../middleware/validateMiddleware.js';

const router = Router();

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

export default router;
