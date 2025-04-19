import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

export const fetchPrediction = async (ticker, days) => {
    const response = await axios.post(`${API_BASE}/stock-prediction`, { ticker, days });

    return response.data;
};
