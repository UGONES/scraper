import express from 'express';
import { verifyToken, isUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken, isUser);

router.get('/', (req, res) => {
  res.json({ message: `Welcome to user dashboard, user ID: ${req.user.userId}` });
});

export default router;
