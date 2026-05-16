import express from "express";
import { analyzeSentiment } from "../controllers/ml.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

const router = express.Router();

// Apply authentication middleware to all ML routes
router.use(authenticate);

router.post("/sentiment", analyzeSentiment);

export default router;
