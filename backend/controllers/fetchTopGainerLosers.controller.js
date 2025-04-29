import fetch from 'node-fetch'; 
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.FMP_API_KEY;
console.log('FMP API KEY:', API_KEY);

const fetchLosers = async (req, res) => {
  try {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${API_KEY}`);
    const data = await response.json();
    console.log("Top Losers Data:", data);  
    res.json(data);
  } catch (error) {
    console.error('Error fetching top losers:', error);
    res.status(500).json({ error: 'Failed to fetch top losers' });
  }
};

const fetchGainers = async (req, res) => {
  try {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${API_KEY}`);
    const data = await response.json();
    console.log("Top Gainers Data:", data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    res.status(500).json({ error: 'Failed to fetch top gainers' });
  }
};

export { fetchLosers, fetchGainers };
