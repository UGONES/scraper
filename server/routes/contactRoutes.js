import express from 'express';
import { handleContact } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact
router.post('/', handleContact);

export default router;
