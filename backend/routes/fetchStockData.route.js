// backend/routes/stocks.js
import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.FMP_API_KEY; // Use a secure name (not REACT_APP_...)
console.log('API KEY:', API_KEY);

router.get('/gainers', async (req, res) => {
  try {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    res.status(500).json({ error: 'Failed to fetch top gainers' });
  }
});

router.get('/losers', async (req, res) => {
  try {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching top losers:', error);
    res.status(500).json({ error: 'Failed to fetch top losers' });
  }
});

export default router;
