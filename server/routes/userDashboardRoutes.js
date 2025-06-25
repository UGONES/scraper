import express from 'express';
import multer from 'multer';
import { verifyToken, isUser } from '../middleware/authMiddleware.js';
import { updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

// Set up multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// Protect all user routes
router.use(verifyToken, isUser);

// Routes
router.get('/dashboard', (req, res) => {
  res.json({ message: `Welcome to user dashboard, user ID: ${req.user.userId}` });
});

// ✅ Use multer here to handle avatar
router.put('/dashboard', upload.single('avatar'), updateUserProfile);

export default router;
