import express from 'express';
import { auth, isAdmin } from '../middleware/authMiddleware.js';
import { postData, getUserScrapes, getAllScrapes } from '../controllers/dataController.js';

const router = express.Router();

router.get('/my-scrapes', auth, getUserScrapes);
router.get('/admin/scrapes', auth, isAdmin, getAllScrapes);
router.post('/', auth, postData);

export default router;
