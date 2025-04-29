import { fetchLosers, fetchGainers } from '../controllers/fetchTopGainerLosers.controller.js';

// your routes here
import express from 'express';
const router = express.Router();

router.get('/losers', fetchLosers);
router.get('/gainers', fetchGainers);

export default router;
