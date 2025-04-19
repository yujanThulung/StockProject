// src/components/StockPrediction.jsx
import React, { useState } from 'react';
import axios from 'axios';

const StockPrediction = () => {
  const [ticker, setTicker] = useState('AAPL');
  const [days, setDays] = useState(3);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/predict', {
        ticker,
        days,
      });
      setPredictions(response.data.predictions || []);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">📈 Stock Price Prediction</h2>
      <div className="flex gap-4">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Enter stock ticker (e.g. AAPL)"
        />
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="border p-2 w-24 rounded"
          placeholder="Days"
        />
        <button
          onClick={fetchPrediction}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Predict
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading predictions...</p>
      ) : (
        <div className="space-y-2">
          {predictions.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded border ${
                item.type === 'actual' ? 'bg-green-100' : 'bg-yellow-100'
              }`}
            >
              <p className="font-medium">
                📅 {item.date} — 💲{item.price}
              </p>
              <p className="text-sm text-gray-600">{item.type.toUpperCase()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockPrediction;
