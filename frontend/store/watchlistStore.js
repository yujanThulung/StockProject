import { create } from 'zustand';
import { io } from 'socket.io-client';
import api from '../src/lib/axios.js';

const SOCKET_URL = 'http://localhost:8000';

let socket = null;

const useWatchlistStore = create((set, get) => ({
  watchlist: [],
  liveQuotes: {},
  historicalData: {},
  loading: false,
  error: null,
  socketInitialized: false,
  watchlistLoading: false,

  clearError: () => set({ error: null }),

  // Load watchlist from DB
  loadWatchlistFromDB: async () => {
    try {
      set({ watchlistLoading: true });
      const res = await api.get('/watchlist/list');
      const symbols = res.data.map((item) => item.symbol.toUpperCase());
      set({ watchlist: symbols });
    } catch (err) {
      console.error('Error loading watchlist:', err);
      set({ error: 'Failed to load watchlist from DB' });
    } finally {
      set({ watchlistLoading: false });
    }
  },

  // Add ticker
  addTicker: async (symbol) => {
    try {
      symbol = symbol.toUpperCase();
      await api.post('/watchlist/add', { symbol });

      set((state) => ({
        watchlist: [...new Set([...state.watchlist, symbol])],
      }));

      if (socket && socket.connected) {
        socket.emit('join-room', symbol);
        socket.emit('subscribe', symbol);
      }

      await get().fetchQuotesForWatchlist();
    } catch (err) {
      console.error('Error adding ticker:', err);
      throw err;
    }
  },

  // Remove ticker
  removeTicker: async (symbol) => {
    try {
      symbol = symbol.toUpperCase();

      const res = await api.get('/watchlist/list');
      const item = res.data.find((i) => i.symbol === symbol);
      if (!item) return;

      await api.delete(`/watchlist/delete/${item._id}`);

      set((state) => {
        const newLiveQuotes = { ...state.liveQuotes };
        delete newLiveQuotes[symbol];
        return {
          watchlist: state.watchlist.filter((s) => s !== symbol),
          liveQuotes: newLiveQuotes,
        };
      });

      if (socket && socket.connected) {
        socket.emit('unsubscribe', symbol);
      }
    } catch (err) {
      console.error('Error removing ticker:', err);
      throw err;
    }
  },

  // Socket connection
  initSocket: () => {
    if (socket && socket.connected) return;

    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
      forceNew: true,
    });

    socket.on('connect', () => {
      set({ socketInitialized: true });
      const { watchlist } = get();
      watchlist.forEach((symbol) => {
        socket.emit('join-room', symbol);
        socket.emit('subscribe', symbol);
      });
    });

    socket.on('finnhub_data', (payload) => {
      if (!payload || !payload.symbol) return;

      set((state) => ({
        liveQuotes: {
          ...state.liveQuotes,
          [payload.symbol]: {
            ...state.liveQuotes[payload.symbol],
            livePrice: payload.price,
            liveVolume: payload.volume,
            liveTime: payload.time,
            lastWebSocketUpdate: Date.now(),
          },
        },
      }));
    });

    socket.on('disconnect', () => set({ socketInitialized: false }));
    socket.on('connect_error', () => set({ socketInitialized: false }));
  },

  // Disconnect
  cleanup: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    set({ socketInitialized: false, liveQuotes: {} });
  },

  // Fetch OHLC quotes for all watchlist symbols
  fetchQuotesForWatchlist: async () => {
    const { watchlist } = get();
    if (watchlist.length === 0) return;

    try {
      const results = await Promise.all(
        watchlist.map(async (symbol) => {
          try {
            const res = await api.get(`/watchlist/quote/${symbol}`);
            return { symbol, data: res.data };
          } catch (err) {
            console.error(`Failed to fetch quote for ${symbol}:`, err);
            return { symbol, data: null };
          }
        })
      );

      set((state) => {
        const updatedQuotes = { ...state.liveQuotes };
        results.forEach(({ symbol, data }) => {
          if (data) {
            updatedQuotes[symbol] = {
              ...updatedQuotes[symbol],
              ...data,
              lastOHLCUpdate: Date.now(),
            };
          }
        });
        return { liveQuotes: updatedQuotes };
      });
    } catch (err) {
      console.error('Failed to fetch OHLC quotes', err);
      set({ error: 'Failed to fetch OHLC data' });
    }
  },

  fetchBatchHistory: async (symbols) => {
    set({ loading: true });
    try {
      const result = {};
      symbols.forEach((symbol) => { result[symbol] = []; });
      set({ historicalData: result });
    } catch (err) {
      set({ error: 'Failed to fetch history' });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useWatchlistStore;
