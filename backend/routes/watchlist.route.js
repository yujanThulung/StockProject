import express from 'express';
import authenticate from '../middleware/authenticate.middleware.js';
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from '../controllers/watchlistController.js';
import { fetchQuote } from '../controllers/quote.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/add', addToWatchlist);
router.get('/list', getWatchlist);
router.delete('/delete/:id', removeFromWatchlist);
router.get('/quote/:symbol', fetchQuote);

export default router;
