import Scrape from "../models/ScrapedData.js"

export const getUserSummary = async (req, res, next) => {
  try {
    const myScrapes = await Scrape.countDocuments({ user: req.user.id });
    res.json({ myScrapes });
  } catch (err) {
    next(err);
  }
};
