import { create } from 'zustand';
import api from '../src/lib/axios';

const useSentimentStore = create((set, get) => ({
  latestNews: [],
  tickerNews: [],
  sentimentResult: null,
  loading: false,
  error: null,

  fetchLatestNews: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/ml/news/latest`);
      set({ latestNews: response.data.articles || response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTickerNews: async (ticker) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/ml/news/ticker/${ticker}`);
      set({ tickerNews: response.data.articles || response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  analyzeSentiment: async (ticker) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/ml/sentiment/ticker`, { ticker });
      set({ sentimentResult: response.data, loading: false });
      // After analysis, we might want to update ticker news too
      if (response.data.results) {
        set({ tickerNews: response.data.results });
      }
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  clearTickerData: () => {
    set({ tickerNews: [], sentimentResult: null, error: null });
  }
}));

export default useSentimentStore;
