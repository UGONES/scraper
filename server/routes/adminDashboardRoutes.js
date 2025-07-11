import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import {
  getAdminSummary,
  getAllUsers,
} from "../controllers/admindController.js";
import {
  getOwnScrapes,
  getAllScrapes,
} from "../controllers/scrapeController.js";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";


const router = express.Router();

router.use(verifyToken, isAdmin);

router.get("/summary", getAdminSummary);
router.get("/users", getAllUsers);
router.get("/scrapes", getOwnScrapes);        // admin’s own
router.get("/scrape/all", getAllScrapes);    // global history
router.get("/profile", getUserProfile);          // ✅ new
router.put("/profile", updateUserProfile);       // ✅ new

export default router;
