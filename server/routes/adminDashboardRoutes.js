import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { validateRegister } from '../middleware/validateMiddleware.js';
import {
  getAllUsers,
  createUserByAdmin,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import {
  getScrapeByIdAdmin,
  updateScrapeAdmin,
  deleteScrapeAdmin,
  getAllScrapes,
} from '../controllers/dataController.js';

const router = express.Router();

// Middleware to protect all admin routes
router.use(verifyToken, isAdmin);

//
// ✅ Admin Dashboard Overview Route
//
router.get('/dashboard', async (req, res) => {
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

//
// ✅ Admin User Management Routes
//
router.get('/users', getAllUsers); // List all users
router.get('/users/:id', getUserById); // Get user by ID
router.post('/users', validateRegister, createUserByAdmin); // Create new user
router.put('/users/:id', updateUser); // Update user
router.delete('/users/:id', deleteUser); // Delete user

//
// ✅ Admin Scraped Data Management Routes
//
router.get('/scrapes/all', getAllScrapes); // View all scrapes
router.get('/scrapes/:id', getScrapeByIdAdmin); // Get specific scrape
router.put('/scrapes/:id', updateScrapeAdmin); // Update scrape
router.delete('/scrapes/:id', deleteScrapeAdmin); // Delete scrape

export default router;
