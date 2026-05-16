import express from 'express';
import authenticate from '../middleware/authenticate.middleware.js';
import { fetchLosers, fetchGainers } from '../controllers/fetchTopGainerLosers.controller.js';

const router = express.Router();

// Public routes (for landing page)
router.get('/public/top-losers', fetchLosers);
router.get('/public/top-gainers', fetchGainers);

// Authenticated routes
router.get('/top-losers', authenticate, fetchLosers);
router.get('/top-gainers', authenticate, fetchGainers);

export default router;
