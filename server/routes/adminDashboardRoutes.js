import express from 'express';
import multer from 'multer';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import { validateRegister } from '../middleware/validateMiddleware.js';
import {
  getAllUsers,
  createUserByAdmin,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile
} from '../controllers/userController.js';
import {
  getScrapeByIdAdmin,
  updateScrapeAdmin,
  deleteScrapeAdmin,
  getAllScrapes,
} from '../controllers/dataController.js';

const router = express.Router();

// ✅ Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// ✅ Protect all routes
router.use(verifyToken, isAdmin);

// ✅ Admin dashboard (GET users)
router.get('/dashboard', getAllUsers);

// ✅ Admin profile update
router.put('/dashboard', upload.single('avatar'), updateUserProfile);

// ✅ Admin User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', validateRegister, createUserByAdmin);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// ✅ Admin Scrape Management
router.get('/scrapes/all', getAllScrapes);
router.get('/scrapes/:id', getScrapeByIdAdmin);
router.put('/scrapes/:id', updateScrapeAdmin);
router.delete('/scrapes/:id', deleteScrapeAdmin);

export default router;
