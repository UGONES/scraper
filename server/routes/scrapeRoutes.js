import express from 'express';
import ScrapedData from '../models/ScrapedData.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

// Create a new scrape request
router.post('/', async (req, res) => {
  try {
    const { url, title } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const newScrape = new ScrapedData({
      userId: req.user.userId,
      url,
      title: title?.trim() || 'Untitled',
      status: 'Pending',
      data: {},
    });

    await newScrape.save();
    res.status(201).json(newScrape);
  } catch (err) {
    console.error('Create scrape error:', err.message);
    res.status(500).json({ message: 'Server error creating scrape' });
  }
});

// Get all scrapes of logged-in user
router.get('/', async (req, res) => {
  try {
    const scrapes = await ScrapedData.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(scrapes);
  } catch (err) {
    console.error('Get scrapes error:', err.message);
    res.status(500).json({ message: 'Server error fetching scrapes' });
  }
});

// Get a specific scrape by ID (only owner)
router.get('/:id', async (req, res) => {
  try {
    const scrape = await ScrapedData.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!scrape) return res.status(404).json({ message: 'Scrape not found' });
    res.json(scrape);
  } catch (err) {
    console.error('Get scrape by ID error:', err.message);
    res.status(500).json({ message: 'Server error fetching scrape' });
  }
});

// Update scrape status and data (owner only)
router.put('/:id', async (req, res) => {
  try {
    const { status, data, title } = req.body;
    const scrape = await ScrapedData.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!scrape) return res.status(404).json({ message: 'Scrape not found' });

    if (status && ['Pending', 'Success', 'Failed'].includes(status)) {
      scrape.status = status;
    }
    if (data) {
      scrape.data = data;
    }
    if (title) {
      scrape.title = title.trim();
    }

    await scrape.save();
    res.json(scrape);
  } catch (err) {
    console.error('Update scrape error:', err.message);
    res.status(500).json({ message: 'Server error updating scrape' });
  }
});

// Delete a scrape (owner only)
router.delete('/:id', async (req, res) => {
  try {
    const scrape = await ScrapedData.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!scrape) return res.status(404).json({ message: 'Scrape not found or already deleted' });
    res.json({ message: 'Scrape deleted successfully' });
  } catch (err) {
    console.error('Delete scrape error:', err.message);
    res.status(500).json({ message: 'Server error deleting scrape' });
  }
});

export default router;
