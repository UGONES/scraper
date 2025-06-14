import express from 'express';
import User from '../models/User.js';
import { auth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin dashboard - only accessible by admin
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const userCount = await User.countDocuments();

    res.json({
      message: 'Welcome to the Admin Dashboard',
      admin: req.user.email,
      userCount,
      users,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
