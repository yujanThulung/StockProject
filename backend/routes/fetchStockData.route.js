import express from 'express';
import authenticate from '../middleware/authenticate.middleware.js';
import { fetchLosers, fetchGainers } from '../controllers/fetchTopGainerLosers.controller.js';

const router = express.Router();

router.get('/top-losers', authenticate, fetchLosers);
router.get('/top-gainers', authenticate, fetchGainers);

export default router;
