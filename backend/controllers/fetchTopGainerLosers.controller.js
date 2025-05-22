

console.log("I am in fetchTopGainerLosers.controller.js");

import TopGainer from "../models/TopGainer.model.js";
import TopLoser from "../models/TopLoser.model.js";


const fetchLosers = async (req, res) => {
  console.log("Fetching top losers from DB...");
  try {
    const data = await TopLoser.find({}).sort({ changesPercentage: 1 });
    console.log("📉 Top Losers Fetched:", data.length);
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching top losers from DB:', error.message);
    res.status(500).json({ error: 'Failed to fetch top losers' });
  }
};

const fetchGainers = async (req, res) => {
  console.log("API: Fetching top gainers from DB...");
  try {
    const data = await TopGainer.find({}).sort({ changesPercentage: -1 });
    console.log("API:📈 Top Gainers Fetched:", data.length);
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching top gainers from DB:', error.message);
    res.status(500).json({ error: 'Failed to fetch top gainers' });
  }
};

export { fetchLosers, fetchGainers };
