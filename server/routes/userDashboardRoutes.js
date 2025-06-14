import express from 'express';
import ScrapedData from '../models/ScrapedData.js';
import { auth } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Matches: GET /api/user/dashboard
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const scrapes = await ScrapedData.find({ userId: req.user.userId }).sort({ createdAt: -1 });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      scrapes,
    });
  } catch (error) {
    console.error('User dashboard error:', error.message);
    res.status(500).json({ message: 'Failed to load user dashboard data.' });
  }
});

export default router;
