import express from 'express';
import authenticate from '../middleware/authenticate.middleware.js';
import { fetchOverview } from '../controllers/overview.controller.js';

const router = express.Router();

router.get('/overview/:symbol', authenticate, fetchOverview);

export default router;
