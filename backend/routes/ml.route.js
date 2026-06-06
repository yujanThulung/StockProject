import express from "express";
import {
  analyzeSentiment,
  getLatestNews,
  getTickerNews,
  analyzeTickerSentiment
} from "../controllers/ml.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

const router = express.Router();

// --- Public Routes ---
router.get("/news/latest", getLatestNews);
router.get("/news/ticker/:ticker", getTickerNews);

// --- Authenticated Routes ---
router.use(authenticate);

router.post("/sentiment", analyzeSentiment); // Original list-based
router.post("/sentiment/ticker", analyzeTickerSentiment); // Ticker-based (new)

export default router;
