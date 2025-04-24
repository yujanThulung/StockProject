// src/stores/pricePredictionStore.js
import { create } from 'zustand';
import axios from 'axios';

const usePricePredictionStore = create((set) => ({
  ticker: 'META',
  modelData: null,
  historicalData: null,
  loading: false,
  error: null,

  // Actions
  setTicker: (newTicker) => set({ ticker: newTicker }),

  fetchAllData: async (ticker) => {
    try {
      set({ loading: true, error: null });

      const [modelRes, historicalRes] = await Promise.all([
        axios.post("http://localhost:5000/model_results", { ticker }),
        axios.post("http://localhost:5000/historical", { ticker })
      ]);

      if (modelRes.data.status !== "success" || historicalRes.data.status !== "success") {
        throw new Error(modelRes.data.message || historicalRes.data.message || "Failed to fetch data");
      }

      set({ 
        modelData: modelRes.data,
        historicalData: historicalRes.data,
        loading: false,
        error: null
      });
    } catch (err) {
      set({ 
        error: err.message,
        loading: false,
        modelData: null,
        historicalData: null
      });
      console.error("Error fetching data:", err);
    }
  },

  reset: () => set({ 
    ticker: 'META',
    modelData: null,
    historicalData: null,
    loading: false,
    error: null
  })
}));

export default usePricePredictionStore;