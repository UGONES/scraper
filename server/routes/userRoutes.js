import express from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { auth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-only routes
router.use(auth, isAdmin);

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
