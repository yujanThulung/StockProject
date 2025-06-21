import express from 'express';
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from '../controllers/watchlistController.js';

import authenticate from '../middleware/authenticate.middleware.js';

const router = express.Router();

router.post('/add',authenticate, addToWatchlist);
router.get('/list',authenticate, getWatchlist);
router.delete('/delete/:id', authenticate,removeFromWatchlist);

export default router;
