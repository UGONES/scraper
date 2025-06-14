import ScrapedData from '../models/ScrapedData.js';

export const postData = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const data = new ScrapedData({
      title,
      data: content, // Assuming content is stored inside 'data' field (matches schema)
      userId: req.user.userId,
      status: 'Success' // Explicitly mark as Success
    });

    await data.save();

    res.status(201).json({ message: 'Data saved', data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save data', error: err.message });
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
    res.status(500).json({ message: 'Failed to fetch data', error: err.message });
  }
};

export const getUserScrapes = async (req, res) => {
  try {
    const userScrapes = await ScrapedData.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(userScrapes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user scrapes', error: err.message });
  }
};

export const getAllScrapes = async (req, res) => {
  try {
    const scrapes = await ScrapedData.find().populate('userId', 'username email').sort({ createdAt: -1 });
    res.json(scrapes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch scrapes', error: err.message });
  }
};
