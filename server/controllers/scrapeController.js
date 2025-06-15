import axios from 'axios';
import * as cheerio from 'cheerio';
import ScrapedData from '../models/ScrapedData.js';

async function startScrape(req, res) {
  try {
    const url = req.query.url || req.body.url;

    if (!url || !/^https?:\/\/.+/.test(url)) {
      return res.status(400).json({ message: 'A valid URL is required' });
    }

    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    const scrapedTitle = $('title').text().trim() || 'Untitled';

    const saved = await ScrapedData.create({
      url,
      title: scrapedTitle,
      userId: req.user.userId,
      status: 'Success',
      data: {}, // optionally store empty or scraped data
    });

    res.status(200).json({
      message: 'Scraping successful',
      data: {
        title: scrapedTitle,
        id: saved._id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Scraping failed', error: err.message });
  }
};
export {startScrape};