// backend/routes/finnhub.js
import express from 'express';
import { subscribe, unsubscribe, getSubscriptions } from '../services/finnhubService.js';

const router = express.Router();

router.post('/subscribe', (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: 'Ticker symbol is required' });

  subscribe(symbol);
  res.json({ message: `Subscribed to ${symbol}`, subscriptions: getSubscriptions() });
});

router.post('/unsubscribe', (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: 'Ticker symbol is required' });

  unsubscribe(symbol);
  res.json({ message: `Unsubscribed from ${symbol}`, subscriptions: getSubscriptions() });
});

router.get('/subscriptions', (req, res) => {
  res.json({ subscriptions: getSubscriptions() });
});

export default router;
