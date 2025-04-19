// controllers/prediction.controller.js
import axios from 'axios';

export const fetchPrediction = async (req, res) => {
    try {
        const { ticker, days } = req.body;
        
        // Add debug logging
        console.log("Attempting to call Flask API with:", { ticker, days });
        
        const response = await axios.post('http://localhost:5000/predict', {
            ticker,
            days
        });

        console.log("Received response from Flask:", response.data);
        res.json(response.data);
        
    } catch (error) {
        // Enhanced error logging
        console.error("Full error details:", {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });
        
        res.status(500).json({
            status: 'error',
            message: error.response?.data?.message || 'Failed to fetch prediction',
            details: error.message
        });
    }
};