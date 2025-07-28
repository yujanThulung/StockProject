


import { create } from "zustand";
import axios from "axios";
import { io } from "socket.io-client";

const API_BASE_URL = "http://localhost:8000";

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

  // 🔁 Load watchlist from DB and resubscribe
  loadWatchlistFromDB: async () => {
    try {
      set({ watchlistLoading: true });

      const res = await axios.get(`${API_BASE_URL}/api/watchlist/list`, {
        withCredentials: true,
      });

      const symbols = res.data.map((item) => item.symbol.toUpperCase());
      set({ watchlist: symbols });

      console.log("📋 Loaded watchlist from DB:", symbols);
    } catch (err) {
      console.error("Error loading watchlist:", err);
      set({ error: "Failed to load watchlist from DB" });
    } finally {
      set({ watchlistLoading: false });
    }
  },

  // ➕ Add ticker
  addTicker: async (symbol) => {
    try {
      symbol = symbol.toUpperCase();

      await axios.post(
        `${API_BASE_URL}/api/watchlist/add`,
        { symbol },
        { withCredentials: true }
      );

      set((state) => ({
        watchlist: [...new Set([...state.watchlist, symbol])],
      }));

      // Subscribe to live data immediately
      if (socket && socket.connected) {
        socket.emit("join-room", symbol);
        socket.emit("subscribe", symbol);
        console.log(`✅ Joined room and subscribed to ${symbol}`);
      }

      await get().fetchQuotesForWatchlist();
    } catch (err) {
      console.error("Error adding ticker:", err);
      throw err;
    }
  },

  // ❌ Remove ticker
  removeTicker: async (symbol) => {
    try {
      symbol = symbol.toUpperCase();

      const res = await axios.get(`${API_BASE_URL}/api/watchlist/list`, {
        withCredentials: true,
      });

      const item = res.data.find((i) => i.symbol === symbol);
      if (!item) return;

      await axios.delete(`${API_BASE_URL}/api/watchlist/delete/${item._id}`, {
        withCredentials: true,
      });

      set((state) => {
        const newLiveQuotes = { ...state.liveQuotes };
        delete newLiveQuotes[symbol];
        
        return {
          watchlist: state.watchlist.filter((s) => s !== symbol),
          liveQuotes: newLiveQuotes,
        };
      });

      if (socket && socket.connected) {
        socket.emit("unsubscribe", symbol);
        console.log(`❌ Unsubscribed from ${symbol}`);
      }
    } catch (err) {
      console.error("Error removing ticker:", err);
      throw err;
    }
  },

  // 📡 Socket connection
  initSocket: () => {
    if (socket && socket.connected) {
      console.log("🔌 Socket already connected");
      return;
    }

    console.log("🔌 Initializing socket connection...");
    
    socket = io(API_BASE_URL, {
      withCredentials: true,
      transports: ["websocket"],
      forceNew: true,
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      set({ socketInitialized: true });

      // Subscribe to all symbols in watchlist
      const { watchlist } = get();
      console.log("🔄 Subscribing to watchlist symbols:", watchlist);
      
      watchlist.forEach(symbol => {
        socket.emit("join-room", symbol);
        socket.emit("subscribe", symbol);
        console.log(`🔄 Resubscribed to ${symbol} on connect`);
      });
    });

    socket.on("finnhub_data", (payload) => {
      console.log("📩 Received finnhub_data:", payload);

      if (!payload || !payload.symbol) {
        console.warn("⚠️ Invalid payload received:", payload);
        return;
      }

      set((state) => {
        const updatedQuotes = {
          ...state.liveQuotes,
          [payload.symbol]: {
            ...state.liveQuotes[payload.symbol],
            // Store the live WebSocket data
            livePrice: payload.price,
            liveVolume: payload.volume,
            liveTime: payload.time,
            lastWebSocketUpdate: Date.now(),
          },
        };

        console.log(`📊 Updated live quote for ${payload.symbol}:`, updatedQuotes[payload.symbol]);
        
        return {
          liveQuotes: updatedQuotes,
        };
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      set({ socketInitialized: false });
    });

    socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error);
      set({ socketInitialized: false });
    });

    socket.on("error", (error) => {
      console.error("🔴 Socket error:", error);
    });
  },

  // 🧹 Disconnect
  cleanup: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    set({ socketInitialized: false, liveQuotes: {} });
  },

  // 📈 Dummy batch history fetch
  fetchBatchHistory: async (symbols) => {
    set({ loading: true });
    try {
      const result = {};
      for (const symbol of symbols) {
        result[symbol] = [];
      }
      set({ historicalData: result });
    } catch (err) {
      set({ error: "Failed to fetch history" });
    } finally {
      set({ loading: false });
    }
  },

  // 📊 Fetch OHLC for all symbols
  fetchQuotesForWatchlist: async () => {
    const { watchlist } = get();
    if (watchlist.length === 0) return;

    console.log("📊 Fetching OHLC data for:", watchlist);
    
    try {
      const quotePromises = watchlist.map(async (symbol) => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/watchlist/quote/${symbol}`, {
            withCredentials: true,
          });
          return { symbol, data: res.data };
        } catch (err) {
          console.error(`Failed to fetch quote for ${symbol}:`, err);
          return { symbol, data: null };
        }
      });

      const results = await Promise.all(quotePromises);
      
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

        console.log("📊 Updated OHLC data:", updatedQuotes);
        
        return {
          liveQuotes: updatedQuotes,
        };
      });
    } catch (err) {
      console.error("Failed to fetch OHLC quotes", err);
      set({ error: "Failed to fetch OHLC data" });
    }
  },
}));

export default useWatchlistStore;