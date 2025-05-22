import axios from 'axios';
import dotenv from 'dotenv';

import Overview from '../models/Overview.model.js';

dotenv.config();

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

console.log("API_KEY", API_KEY);
console.log("API_URL", process.env.API_URL);

const THREE_MONTHS = 1000 * 60 * 60 * 24 * 90;

export const fetchOverview = async (req, res) => {
  const symbol = req.params.symbol.trim().toUpperCase();

    console.log("➡️ Raw symbol:", JSON.stringify(symbol));


  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  try {
    const cachedData = await Overview.findOne({
      symbol: symbol.toUpperCase(),
    });

    const isFresh =
      cachedData &&
      Date.now() - new Date(cachedData.lastUpdated).getTime() < THREE_MONTHS;

    if (isFresh) {
      return res.status(200).json(cachedData.data); // ✅ return just the data
    }

    const response = await axios.get(API_URL, {
      params: {
        function: 'OVERVIEW',
        symbol: symbol,
        apikey: API_KEY,
      },
    });

    const apiData = response.data;

    if (!apiData.Symbol) {
      return res.status(404).json({ error: "No overview found for this symbol" });
    }

    const updatedDoc = await Overview.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      { data: apiData, lastUpdated: new Date() },
      { new: true, upsert: true }
    );

    res.json(updatedDoc.data);
  } catch (error) {
    console.error('Error fetching company overview:', error.message);
    res.status(500).json({ error: 'Failed to fetch company overview' });
  }
};
