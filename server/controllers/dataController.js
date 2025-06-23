import ScrapedData from '../models/ScrapedData.js';

export const createData = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const data = new ScrapedData({
      title,
      data: content, // Assuming content is stored inside 'data' field (matches schema)
      url: req.body.url || '', 
      userId: req.user.userId,
      status: 'Success' // Explicitly mark as Success
    });

    await data.save();

    res.status(201).json({ message: 'Data saved', data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save data' });
  }
};

export const getProtected = async (req, res) => {
  try {
    const role = req.user.role;

    const data =
      role === 'admin'
        ? await ScrapedData.find().populate('userId', 'username email')
        : await ScrapedData.find({ userId: req.user.userId });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch data' });
  }
};

export const getUserScrapes = async (req, res) => {
  try {
    const userScrapes = await ScrapedData.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(userScrapes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user-specific scrapes' });
  }
};

export const getAllScrapes = async (req, res) => {
  try {
    const scrapes = await ScrapedData.find().populate('userId', 'username email');
    res.json(scrapes);
  } catch (error) {
    console.error('Error getting all scrapes:', error.message);
    res.status(500).json({ message: 'Server error fetching all scrapes' });
  }
};

// New: Admin-only function to get a specific scrape by ID
export const getScrapeByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const scrape = await ScrapedData.findById(id).populate('userId', 'username email'); // Populate user info
    if (!scrape) {
      return res.status(404).json({ message: 'Scraped data not found' });
    }
    res.json(scrape);
  } catch (err) {
    console.error('Admin get scrape by ID error:', err.message);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid scraped data ID format' });
    }
    res.status(500).json({ message: 'Server error fetching scraped data' });
  }
};

// New: Admin-only function to update any scraped data
export const updateScrapeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Ensure only allowed fields are updated by admin, or be more flexible
    const allowedUpdates = ['url', 'title', 'data', 'status', 'userId'];
    const receivedUpdates = Object.keys(updates);
    const isValidOperation = receivedUpdates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates provided for scraped data' });
    }

    const updatedScrape = await ScrapedData.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('userId', 'username email');

    if (!updatedScrape) {
      return res.status(404).json({ message: 'Scraped data not found' });
    }

    res.json(updatedScrape);
  } catch (err) {
    console.error('Admin update scrape error:', err.message);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid scraped data ID format' });
    }
    res.status(500).json({ message: 'Server error updating scraped data' });
  }
};

// New: Admin-only function to delete any scraped data
export const deleteScrapeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedScrape = await ScrapedData.findByIdAndDelete(id);

    if (!deletedScrape) {
      return res.status(404).json({ message: 'Scraped data not found' });
    }

    res.json({ message: 'Scraped data deleted successfully' });
  } catch (err) {
    console.error('Admin delete scrape error:', err.message);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid scraped data ID format' });
    }
    res.status(500).json({ message: 'Server error deleting scraped data' });
  }
};