import axios from "axios";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:5001";

// Public: Get latest general news
export const getLatestNews = async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/news/latest`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in getLatestNews proxy:", error.message);
    return res.status(error.response?.status || 500).json(error.response?.data || { message: "Internal Server Error" });
  }
};

// Public: Get news for a specific ticker
export const getTickerNews = async (req, res) => {
  try {
    const { ticker } = req.params;
    const response = await axios.get(`${PYTHON_API_URL}/news/ticker/${ticker}`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in getTickerNews proxy:", error.message);
    return res.status(error.response?.status || 500).json(error.response?.data || { message: "Internal Server Error" });
  }
};

// Authenticated: Analyze sentiment for a ticker (fetches news + scores them)
export const analyzeTickerSentiment = async (req, res) => {
  try {
    const { ticker } = req.body;

    if (!ticker) {
      return res.status(400).json({ message: "Ticker is required" });
    }

    const response = await axios.post(`${PYTHON_API_URL}/sentiment/ticker`, {
      ticker,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in analyzeTickerSentiment proxy:", error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      return res.status(503).json({ message: "Sentiment service is currently unavailable" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

// Legacy: Analyze sentiment for a list of texts
export const analyzeSentiment = async (req, res) => {
  try {
    const { texts, ticker } = req.body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ message: "Texts list is empty or invalid" });
    }

    const response = await axios.post(`${PYTHON_API_URL}/sentiment`, {
      texts,
      ticker,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in analyzeSentiment proxy:", error.message);
    return res.status(error.response?.status || 500).json(error.response?.data || { message: "Internal Server Error" });
  }
};
