import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import api from '../src/lib/axios.js';

// Separate axios instance for the ML model server (no auth needed)
const mlApi = axios.create({
  baseURL: 'http://localhost:8080',
});

const usePricePredictionStore = create(
  persist(
    (set, get) => ({
      ticker: '',
      modelData: null,
      historicalData: [],
      stockData: null,
      loading: false,
      error: null,
      fetchedTickers: new Set(),

      setTicker: (newTicker) => set({ ticker: newTicker }),

      fetchModelData: async (ticker) => {
        set({ loading: true, error: null });
        try {
          const response = await mlApi.post('/predict', { ticker });
          if (response.data.status !== 'success')
            throw new Error(response.data.message || 'Model fetch failed');
          set({ modelData: response.data, loading: false, error: null });
        } catch (err) {
          console.error('Error fetching model data:', err);
          set({ error: err.message, modelData: null, loading: false });
        }
      },

      fetchHistoricalData: async (ticker) => {
        const { fetchedTickers } = get();
        
        // Show loading state even for cached tickers
        set({ loading: true, error: null });
        
        // If already cached, just set loading back to false after a brief moment
        if (fetchedTickers.has(ticker)) {
          setTimeout(() => set({ loading: false }), 100);
          return;
        }

        try {
          const response = await mlApi.post('/historical', { ticker });
          if (response.data.status !== 'success')
            throw new Error(response.data.message || 'Fetch failed');

          set((state) => ({
            historicalData: response.data.historical,
            loading: false,
            error: null,
            fetchedTickers: new Set([...state.fetchedTickers, ticker]),
          }));
        } catch (err) {
          console.error('Error fetching historical data:', err);
          set({ error: err.message, historicalData: [], loading: false });
        }
      },

      fetchOverviewData: async (ticker) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/overview/${ticker}`);
          set({ stockData: response.data, loading: false, error: null });
        } catch (err) {
          console.error('Error fetching overview data:', err);
          set({ error: err.message, stockData: null, loading: false });
        }
      },

      fetchAllData: async (ticker) => {
        try {
          set({ loading: true, error: null });

          const [modelRes, historicalRes, overviewRes] = await Promise.all([
            mlApi.post('/predict', { ticker }),
            mlApi.post('/historical', { ticker }),
            api.get(`/overview/${ticker}`),
          ]);

          if (modelRes.data.status !== 'success' || historicalRes.data.status !== 'success') {
            throw new Error(
              modelRes.data.message || historicalRes.data.message || 'Failed to fetch data'
            );
          }

          set({
            modelData: modelRes.data,
            historicalData: historicalRes.data.historical,
            stockData: overviewRes.data,
            loading: false,
            error: null,
          });
        } catch (err) {
          console.error('Error in fetchAllData:', err);
          set({
            loading: false,
            error: err.message,
            modelData: null,
            historicalData: [],
            stockData: null,
          });
        }
      },

      addBarToHistorical: (bar) =>
        set((state) => {
          const last = state.historicalData.at(-1);
          const lastTime = last ? new Date(last.Date).toISOString() : null;
          const barTime = new Date(bar.Date).toISOString();

          if (lastTime !== barTime || (last && last.Close !== bar.Close)) {
            return { historicalData: [...state.historicalData, bar] };
          }
          return {};
        }),

      reset: () =>
        set({
          ticker: '',
          modelData: null,
          historicalData: [],
          stockData: null,
          loading: false,
          error: null,
        }),
    }),
    {
      name: 'price-prediction-storage',
      partialize: (state) => ({ ticker: state.ticker }),
    }
  )
);

export default usePricePredictionStore;
