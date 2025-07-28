import axios from 'axios';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

export const fetchQuote = async (req, res) => {
  const { symbol } = req.params;

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const response = await axios.get(url);

    res.json({
      o: response.data.o, // open
      h: response.data.h, // high
      l: response.data.l, // low
      c: response.data.c, // current/close
    });
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    res.status(500).json({ error: 'Failed to fetch quote', details: error.message });
  }
};
