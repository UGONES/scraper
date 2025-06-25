import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

import ScrapedData from '../models/ScrapedData.js';
import OpenAI from 'openai';

// ✅ Initialize OpenAI using v4+ syntax
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Check if the input is a valid URL
const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// ✅ Unified scrape handler (handles both URLs and text input)
export const scrapeHandler = async (req, res) => {
  const { input } = req.body;

  if (!input || input.length < 3) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    let result = { title: '', data: {} };

    if (isValidUrl(input)) {
      // 🌐 Scrape from a URL
      const { data } = await axios.get(input);
      const $ = cheerio.load(data);
      result.title = $('title').text().trim() || 'Untitled';
      result.data = { html: data };
    } else {
      // 🤖 Use OpenAI for text/symbol summarization
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a data summarizer that turns user input into structured insights.',
            },
            {
              role: 'user',
              content: `Extract relevant data and a title from: ${input}`,
            },
          ],
        });

        result.title = 'AI-generated Scrape';
        result.data = { summary: completion.choices[0].message.content };
      } catch (error) {
        console.error('OpenAI GPT Error:', error.message);
        return res.status(500).json({ message: 'OpenAI API call failed' });
      }
    }

    // 💾 Save to database
    const newScrape = await ScrapedData.create({
      userId: req.user.userId,
      url: isValidUrl(input) ? input : '',
      title: result.title,
      status: 'Success',
      data: result.data,
    });

    res.status(201).json({
      message: 'Scraping successful',
      data: {
        id: newScrape._id,
        title: newScrape.title,
      },
    });
  } catch (err) {
    console.error('Scrape error:', err.message);
    res.status(500).json({ message: 'Scrape failed' });
  }
};

// ✅ Get all scrapes for logged-in user
export const getAllScrapes = async (req, res) => {
  try {
    const scrapes = await ScrapedData.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(scrapes);
  } catch (err) {
    console.error('Error fetching scrapes:', err.message);
    res.status(500).json({ message: 'Failed to fetch scrapes' });
  }
};

// ✅ Get a specific scrape
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

// ✅ Update a scrape
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

// ✅ Delete a scrape
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
// ✅ Admin-only function to get all scrapes (for admin dashboard)
export const getAllScrapesAdmin = async (req, res) => {
  try {
    const scrapes = await ScrapedData.find().sort({ createdAt: -1 }).populate('userId', 'username email');
    res.json(scrapes);
  } catch (err) {
    console.error('Admin error fetching scrapes:', err.message);
    res.status(500).json({ message: 'Failed to fetch scrapes' });
  }
};