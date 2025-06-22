// controllers/scrapeController.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import ScrapedData from '../models/ScrapedData.js';

// Create and save a scrape entry (with real scraping logic)
export const scrapeAndSave = async (req, res) => {
  try {
    const url = req.body.url || req.query.url;
    const titleFromClient = req.body.title;

    if (!url || !/^https?:\/\/.+/.test(url)) {
      return res.status(400).json({ message: 'A valid URL is required' });
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const scrapedTitle = $('title').text().trim() || 'Untitled';

    const newScrape = new ScrapedData({
      userId: req.user.userId,
      url,
      title: titleFromClient || scrapedTitle,
      status: 'Success',
      data: {
        html: data,
      },
    });

    await newScrape.save();

    res.status(201).json({
      message: 'Scraping successful',
      data: {
        id: newScrape._id,
        title: newScrape.title,
      },
    });
  } catch (err) {
    console.error('Scraping error:', err.message);
    res.status(500).json({ message: 'Scraping failed', error: err.message });
  }
};

// Get all scrapes for the logged-in user
export const getAllScrapes = async (req, res) => {
  try {
    const scrapes = await ScrapedData.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(scrapes);
  } catch (err) {
    console.error('Error fetching scrapes:', err.message);
    res.status(500).json({ message: 'Failed to fetch scrapes' });
  }
};

// Get a specific scrape
export const getScrapeById = async (req, res) => {
  try {
    const scrape = await ScrapedData.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!scrape) {
      return res.status(404).json({ message: 'Scrape not found' });
    }

    res.json(scrape);
  } catch (err) {
    console.error('Error fetching scrape:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a scrape (title, status, or data)
export const updateScrape = async (req, res) => {
  try {
    const { title, status, data } = req.body;

    const scrape = await ScrapedData.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!scrape) {
      return res.status(404).json({ message: 'Scrape not found' });
    }

    if (title) scrape.title = title.trim();
    if (status && ['Pending', 'Success', 'Failed'].includes(status)) scrape.status = status;
    if (data) scrape.data = data;

    await scrape.save();
    res.json(scrape);
  } catch (err) {
    console.error('Error updating scrape:', err.message);
    res.status(500).json({ message: 'Failed to update scrape' });
  }
};

// Delete a scrape (by owner)
export const deleteScrape = async (req, res) => {
  try {
    const deleted = await ScrapedData.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Scrape not found or already deleted' });
    }

    res.json({ message: 'Scrape deleted successfully' });
  } catch (err) {
    console.error('Error deleting scrape:', err.message);
    res.status(500).json({ message: 'Failed to delete scrape' });
  }
};
