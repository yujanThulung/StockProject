import axios from "axios";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:5000";

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
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({ message: "Sentiment service is currently unavailable" });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
