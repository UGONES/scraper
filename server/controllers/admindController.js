import User from "../models/User.js";
import Scrape from "../models/ScrapedData.js"

export const getAdminSummary = async (_req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalScrapes = await Scrape.countDocuments({});
    res.json({ totalUsers, totalScrapes });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find({}, "username email role");
    res.json(users);
  } catch (err) {
    next(err);
  }
};
