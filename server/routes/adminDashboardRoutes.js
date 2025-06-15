import express from 'express';
import User from '../models/User.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get('/', (req, res) => {
  res.json({ message: `Welcome to admin dashboard, admin ID: ${req.user.userId}` });
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

export default router;
