import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Failed to fetch user data:', err);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// Update user profile (partial update)
router.put('/me', async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update here

    // Optional: Validate updates keys to only allow certain fields
    const allowedUpdates = ['username', 'email', 'avatar', 'bio'];
    const invalidFields = Object.keys(updates).filter(key => !allowedUpdates.includes(key));
    if (invalidFields.length > 0) {
      return res.status(400).json({ message: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    console.error('Failed to update user data:', err);
    res.status(500).json({ message: 'Failed to update user data' });
  }
});

export default router;
