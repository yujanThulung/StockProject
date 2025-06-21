// import { create } from "zustand";
// import { io } from "socket.io-client";
// import axios from "axios";


// // Create socket connection
// const socket = io("http://localhost:5000", {
//     transports: ["websocket"],
//     withCredentials: true,
//     extraHeaders: {
//         "my-custom-header": "abcd",
//     },
// });

// const useWatchlistStore = create((set, get) => ({
//     watchlist: [],
//     liveQuotes: {},
//     historicalData: {},
//     loading: false,
//     error: null,
//     socketInitialized: false,

//     // addTicker: async (symbol, token) => {
//     //     try {
//     //         const s = symbol.toUpperCase();
//     //         const currentWatchlist = get().watchlist;

//     //         console.log(`Adding ticker: ${s} to watchlist`);

//     //         if (!currentWatchlist.includes(s)) {
//     //             console.log(`Adding ticker: ${s}`);

//     //             //add to the database
//     //             await axios.post(
//     //                 "http://localhost:8000/watchlist/add",
//     //                 { symbol: s },
//     //                 { headers: { Authorization: `Bearer ${token}` } }
//     //             );

//     //             socket.emit("subscribe", { symbol: s });

//     //             set((state) => ({
//     //                 watchlist: [...state.watchlist, s],
//     //             }));
//     //         }
//     //     } catch (error) {
//     //         console.error("Error adding ticker:", error);
//     //         set({ error: error.response?.data?.error || error.message });
//     //     }
//     // },




//     addTicker: async (symbol, token) => {
//     try {
//         const s = symbol.toUpperCase();
//         const currentWatchlist = get().watchlist;

//         if (currentWatchlist.includes(s)) {
//             console.log(`Ticker ${s} already in watchlist`);
//             return;
//         }

//         // First add to database
//         await axios.post(
//             "http://localhost:8000/watchlist/add",
//             { symbol: s },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // Then subscribe via socket
//         await new Promise((resolve) => {
//             socket.emit("subscribe", { symbol: s }, (response) => {
//                 if (response?.success) {
//                     set((state) => ({
//                         watchlist: [...state.watchlist, s],
//                     }));
//                     resolve();
//                 } else {
//                     throw new Error(response?.error || "Subscription failed");
//                 }
//             });
//         });
//     } catch (error) {
//         console.error("Error adding ticker:", error);
//         set({ error: error.response?.data?.error || error.message });
//     }
// },



//     // removeTicker: async (symbol, token) => {
//     //     try {
//     //         const s = symbol.toUpperCase();
//     //         console.log(`Removing ticker: ${s}`);

//     //         //getting the database id
//     //         const response = await axios.get("http://localhost:8000/api/watchlist/list", {
//     //             headers: { Authorization: `Bearer ${token}` },
//     //         });

//     //         const itemToRemove = response.data.find((item) => item.symbol === s);

//     //         if (!itemToRemove) {
//     //             throw new Error(`Ticker ${s} not found in watchlist`);
//     //         }

//     //         // remove from db
//     //         await axios.delete(`http://localhost:8000/api/watchlist/delete/${itemToRemove._id}`, {
//     //             headers: { Authorization: `Bearer ${token}` },
//     //         });

//     //         // Unsubscribe from the socket
//     //         socket.emit("unsubscribe", { symbol: s });

//     //         // Update local state
//     //         set((state) => {
//     //             const newLiveQuotes = { ...state.liveQuotes };
//     //             const newHistoricalData = { ...state.historicalData };

//     //             delete newLiveQuotes[s];
//     //             delete newHistoricalData[s];

//     //             return {
//     //                 watchlist: state.watchlist.filter((t) => t !== s),
//     //                 liveQuotes: newLiveQuotes,
//     //                 historicalData: newHistoricalData,
//     //             };
//     //         });
//     //     } catch (error) {
//     //         console.error("Error removing ticker:", error);
//     //         set({ error: error.response?.data?.error || error.message });
//     //     }
//     // },

//     //Initialize user's watchlist database
    
    
    
//     removeTicker: async (symbol, token) => {
//     try {
//         const s = symbol.toUpperCase();
        
//         // First remove from database
//         const response = await axios.get("http://localhost:8000/api/watchlist/list", {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         const itemToRemove = response.data.find((item) => item.symbol === s);
//         if (!itemToRemove) throw new Error(`Ticker ${s} not found in watchlist`);

//         await axios.delete(`http://localhost:8000/api/watchlist/delete/${itemToRemove._id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         // Then unsubscribe via socket
//         await new Promise((resolve) => {
//             socket.emit("unsubscribe", { symbol: s }, (response) => {
//                 if (response?.success) {
//                     set((state) => {
//                         const newLiveQuotes = { ...state.liveQuotes };
//                         const newHistoricalData = { ...state.historicalData };
//                         delete newLiveQuotes[s];
//                         delete newHistoricalData[s];

//                         return {
//                             watchlist: state.watchlist.filter((t) => t !== s),
//                             liveQuotes: newLiveQuotes,
//                             historicalData: newHistoricalData,
//                         };
//                     });
//                     resolve();
//                 } else {
//                     throw new Error(response?.error || "Unsubscription failed");
//                 }
//             });
//         });
//     } catch (error) {
//         console.error("Error removing ticker:", error);
//         set({ error: error.response?.data?.error || error.message });
//     }
// },

// initializeWatchlist: async (token) => {
//         try {
//             set({ loading: true });

//             const response = await axios.get("http://localhost:8000/api/watchlist/list", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             const symbols = response.data.map((item) => item.symbol.toUpperCase());

//             //subscribe to all symbols
//             if (symbols.length > 0) {
//                 socket.emit("subscribe_watchlist", { symbols });
//             }

//             set({
//                 watchlist: symbols,
//                 loading: false,
//             });
//             return symbols;
//         } catch (error) {
//             console.error("Error initializing watchlist:", error);
//             set({
//                 error: error.response?.data?.error || error.message,
//                 loading: false,
//             });
//             return [];
//         }
//     },

//     initSocket: () => {
//         const state = get();

//         // Prevent multiple initializations
//         if (state.socketInitialized) {
//             console.log("Socket already initialized");
//             return;
//         }

//         console.log("Initializing socket listeners...");

//         // Remove any existing listeners to prevent duplicates
//         socket.off("live_update");
//         socket.off("connect");
//         socket.off("disconnect");

//         // Set up live update listener with proper state management
//         socket.on("live_update", (data) => {
//             console.log("🔴 Received live update:", data);

//             const { symbol, bar, price, volume } = data;

//             if (!symbol) {
//                 console.warn("❌ Invalid live update - no symbol:", data);
//                 return;
//             }

//             // Use the current state to get previous values
//             const currentState = get();
//             const currentQuote = currentState.liveQuotes[symbol];

//             // Create the new quote data
//             let newQuote;
//             if (bar) {
//                 // Full bar data from server
//                 newQuote = { ...bar };
//             } else if (price !== undefined) {
//                 // Just price update
//                 newQuote = {
//                     ...currentQuote,
//                     Close: price,
//                     Volume: volume || currentQuote?.Volume || 0,
//                     Date: new Date().toISOString(),
//                 };
//             } else {
//                 console.warn("❌ No price or bar data in update:", data);
//                 return;
//             }

//             // Determine price direction
//             let up = false;
//             let down = false;

//             if (currentQuote && currentQuote.Close !== undefined && newQuote.Close !== undefined) {
//                 const currentPrice = parseFloat(newQuote.Close);
//                 const lastPrice = parseFloat(currentQuote.Close);

//                 if (currentPrice > lastPrice) {
//                     up = true;
//                     console.log(`📈 ${symbol} UP: ${lastPrice} → ${currentPrice}`);
//                 } else if (currentPrice < lastPrice) {
//                     down = true;
//                     console.log(`📉 ${symbol} DOWN: ${lastPrice} → ${currentPrice}`);
//                 } else {
//                     console.log(`➡️ ${symbol} SAME: ${currentPrice}`);
//                 }
//             } else {
//                 console.log(`🆕 ${symbol} FIRST UPDATE: ${newQuote.Close}`);
//             }

//             // Update state with new quote
//             set((state) => {
//                 const updatedQuotes = {
//                     ...state.liveQuotes,
//                     [symbol]: {
//                         ...newQuote,
//                         up,
//                         down,
//                         lastUpdate: Date.now(),
//                     },
//                 };

//                 console.log(`✅ Updated state for ${symbol}:`, updatedQuotes[symbol]);

//                 return {
//                     liveQuotes: updatedQuotes,
//                 };
//             });
//         });

//         socket.on("connect", () => {
//             console.log("Connected to backend");

//             socket.emit("subscribe", { symbol: "AAPL" }); // subscribe to a symbol
//         });

//         socket.io.on("reconnect", () => {
//             console.log("Socket reconnected");
//             get().refreshLiveQuotes();
//         });


//         socket.on("disconnect", () => {
//             console.log("Socket disconnected");
//         });

//         // Handle other socket events
//         socket.on("watchlist_subscribed", (data) => {
//             console.log("Watchlist subscribed:", data);
//         });

//         socket.on("watchlist_error", (error) => {
//             console.error("Watchlist error:", error);
//             set({ error: error.error || "Unknown socket error" });
//         });

//         // Mark socket as initialized
//         set({ socketInitialized: true });
//     },

//     // Method to force refresh live quotes
//     refreshLiveQuotes: () => {
//         const { watchlist } = get();
//         console.log("Refreshing live quotes for:", watchlist);

//         watchlist.forEach((symbol) => {
//             socket.emit("subscribe", { symbol });
//         });
//     },

//     fetchBatchHistory: async (tickers) => {
//         if (!tickers || tickers.length === 0) return;

//         set({ loading: true, error: null });

//         try {
//             console.log("Fetching batch history for:", tickers);
//             const response = await axios.post("http://localhost:5000/batch-historical", {
//                 tickers,
//             });

//             if (response.data.status === "success") {
//                 set({
//                     historicalData: response.data.historical,
//                     loading: false,
//                 });
//             } else {
//                 set({
//                     error: response.data.message || "Unexpected error",
//                     loading: false,
//                 });
//             }
//         } catch (err) {
//             console.error("Error fetching batch history:", err);
//             set({
//                 error: err.message || "Failed to fetch historical data",
//                 loading: false,
//             });
//         }
//     },

//     // Cleanup method
//     cleanup: () => {
//         socket.off("live_update");
//         socket.off("connect");
//         socket.off("disconnect");
//         socket.off("watchlist_subscribed");
//         socket.off("watchlist_error");
//         set({ socketInitialized: false });
//     },
// }));


// export default useWatchlistStore;




// import { create } from 'zustand';
// import { io } from 'socket.io-client';

// // Socket connection (replace with your backend URL)
// const socket = io('http://localhost:5000', {
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// const useWatchlistStore = create((set, get) => ({
//   // State
//   watchlist: [],
//   liveQuotes: {},
//   socketConnected: false,
//   error: null,
//   loading: false,

//   // Initialize socket connection
//   initSocket: () => {
//     if (get().socketConnected) return;

//     console.log('Initializing socket connection...');
    
//     socket.on('connect', () => {
//       console.log('Socket connected');
//       set({ socketConnected: true });
      
//       // Resubscribe to all symbols on reconnect
//       if (get().watchlist.length > 0) {
//         socket.emit('subscribe_watchlist', { symbols: get().watchlist });
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//       set({ socketConnected: false });
//     });

//     socket.on('live_update', (data) => {
//       const { symbol, bar, price } = data;
//       if (!symbol) return;

//       set((state) => {
//         const currentQuote = state.liveQuotes[symbol] || {};
//         const newPrice = bar?.Close || price;
        
//         // Determine price direction
//         let up = false;
//         let down = false;
        
//         if (currentQuote.Close && newPrice) {
//           up = parseFloat(newPrice) > parseFloat(currentQuote.Close);
//           down = parseFloat(newPrice) < parseFloat(currentQuote.Close);
//         }

//         return {
//           liveQuotes: {
//             ...state.liveQuotes,
//             [symbol]: {
//               ...(bar || currentQuote),
//               Close: newPrice || currentQuote.Close,
//               up,
//               down,
//               lastUpdate: Date.now(),
//             }
//           }
//         };
//       });
//     });

//     socket.on('watchlist_subscribed', (data) => {
//       console.log('Batch subscription result:', data);
//     });

//     socket.on('error', (err) => {
//       console.error('Socket error:', err);
//       set({ error: err.message });
//     });
//   },

//   // Add single ticker
//   addTicker: async (symbol) => {
//     const s = symbol.toUpperCase();
//     if (get().hasTicker(s)) return true;

//     set({ loading: true });
    
//     return new Promise((resolve) => {
//       socket.emit('subscribe', { symbol: s }, (response) => {
//         set({ loading: false });
        
//         if (response?.success) {
//           set((state) => ({
//             watchlist: [...state.watchlist, s],
//           }));
//           resolve(true);
//         } else {
//           set({ error: response?.error || 'Subscription failed' });
//           resolve(false);
//         }
//       });
//     });
//   },

//   // Add multiple tickers
//   addMultipleTickers: async (symbols) => {
//     const newSymbols = symbols
//       .map(s => s.toUpperCase())
//       .filter(s => !get().hasTicker(s));
    
//     if (newSymbols.length === 0) return { successful: [], failed: [] };

//     set({ loading: true });
    
//     return new Promise((resolve) => {
//       socket.emit('subscribe_watchlist', { symbols: newSymbols }, (response) => {
//         set({ loading: false });
        
//         if (response?.successful?.length > 0) {
//           set((state) => ({
//             watchlist: [...new Set([...state.watchlist, ...response.successful])],
//           }));
//         }
//         resolve(response);
//       });
//     });
//   },

//   // Remove single ticker
//   removeTicker: async (symbol) => {
//     const s = symbol.toUpperCase();
//     if (!get().hasTicker(s)) return true;

//     set({ loading: true });
    
//     return new Promise((resolve) => {
//       socket.emit('unsubscribe', { symbol: s }, (response) => {
//         set({ loading: false });
        
//         if (response?.success) {
//           set((state) => {
//             const newLiveQuotes = { ...state.liveQuotes };
//             delete newLiveQuotes[s];
            
//             return {
//               watchlist: state.watchlist.filter(t => t !== s),
//               liveQuotes: newLiveQuotes,
//             };
//           });
//           resolve(true);
//         } else {
//           set({ error: response?.error || 'Unsubscription failed' });
//           resolve(false);
//         }
//       });
//     });
//   },

//   // Remove multiple tickers
//   removeMultipleTickers: async (symbols) => {
//     const symbolsToRemove = symbols.map(s => s.toUpperCase());
    
//     set({ loading: true });
    
//     return new Promise((resolve) => {
//       socket.emit('unsubscribe_watchlist', { symbols: symbolsToRemove }, (response) => {
//         set({ loading: false });
        
//         if (response) {
//           set((state) => {
//             const newLiveQuotes = { ...state.liveQuotes };
//             symbolsToRemove.forEach(s => delete newLiveQuotes[s]);
            
//             return {
//               watchlist: state.watchlist.filter(t => !symbolsToRemove.includes(t)),
//               liveQuotes: newLiveQuotes,
//             };
//           });
//         }
//         resolve(response);
//       });
//     });
//   },

//   // Helper methods
//   getTickerPrice: (symbol) => {
//     return get().liveQuotes[symbol.toUpperCase()]?.Close || null;
//   },

//   hasTicker: (symbol) => {
//     return get().watchlist.includes(symbol.toUpperCase());
//   },

//   getTickerData: (symbol) => {
//     return get().liveQuotes[symbol.toUpperCase()] || null;
//   },

//   // Cleanup
//   cleanup: () => {
//     console.log('Cleaning up socket...');
//     socket.off('connect');
//     socket.off('disconnect');
//     socket.off('live_update');
//     socket.off('watchlist_subscribed');
//     socket.off('error');
//     set({ socketConnected: false });
//   },
// }));

// export default useWatchlistStore;



// import { create } from 'zustand';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:5000', {
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// const useWatchlistStore = create((set, get) => ({
//   watchlist: [],
//   liveQuotes: {},
//   socketInitialized: false,
//   loading: false,
//   error: null,

//   initSocket: () => {
//     if (get().socketInitialized) return;

//     socket.on('connect', () => {
//       set({ socketInitialized: true });
//       // Resubscribe to existing symbols on reconnect
//       if (get().watchlist.length > 0) {
//         socket.emit('subscribe_watchlist', { symbols: get().watchlist });
//       }
//     });

//     socket.on('disconnect', () => {
//       set({ socketInitialized: false });
//     });

//     socket.on('live_update', (data) => {
//       const { symbol, bar, price } = data;
//       if (!symbol) return;

//       set((state) => {
//         const currentQuote = state.liveQuotes[symbol] || {};
//         const newPrice = bar?.Close || price;
        
//         let up = false;
//         let down = false;
        
//         if (currentQuote.Close && newPrice) {
//           up = parseFloat(newPrice) > parseFloat(currentQuote.Close);
//           down = parseFloat(newPrice) < parseFloat(currentQuote.Close);
//         }

//         return {
//           liveQuotes: {
//             ...state.liveQuotes,
//             [symbol]: {
//               ...(bar || currentQuote),
//               Close: newPrice || currentQuote.Close,
//               up,
//               down,
//               lastUpdate: Date.now(),
//             }
//           }
//         };
//       });
//     });

//     socket.on('subscribed_symbols', (data) => {
//       set({ watchlist: data.symbols });
//     });

//     set({ socketInitialized: true });
//   },

//   addTicker: async (symbol) => {
//     const s = symbol.toUpperCase();
//     if (get().watchlist.includes(s)) return true;

//     set({ loading: true });
//     return new Promise((resolve) => {
//       socket.emit('subscribe', { symbol: s }, (response) => {
//         set({ loading: false });
//         if (response?.success) {
//           set((state) => ({
//             watchlist: [...state.watchlist, s],
//           }));
//           resolve(true);
//         } else {
//           set({ error: response?.error || 'Subscription failed' });
//           resolve(false);
//         }
//       });
//     });
//   },

//   removeTicker: async (symbol) => {
//     const s = symbol.toUpperCase();
//     if (!get().watchlist.includes(s)) return true;

//     set({ loading: true });
//     return new Promise((resolve) => {
//       socket.emit('unsubscribe', { symbol: s }, (response) => {
//         set({ loading: false });
//         if (response?.success) {
//           set((state) => ({
//             watchlist: state.watchlist.filter(t => t !== s),
//             liveQuotes: Object.fromEntries(
//               Object.entries(state.liveQuotes).filter(([key]) => key !== s)
//           }));
//           resolve(true);
//         } else {
//           set({ error: response?.error || 'Unsubscription failed' });
//           resolve(false);
//         }
//       });
//     });
//   },

//   cleanup: () => {
//     socket.off('connect');
//     socket.off('disconnect');
//     socket.off('live_update');
//     socket.off('subscribed_symbols');
//     set({ socketInitialized: false });
//   },
// }));

// export default useWatchlistStore;



import { create } from 'zustand';
import { io } from 'socket.io-client';
import axios from 'axios';

// Create socket connection
const socket = io('http://localhost:5000', {
  transports: ['websocket'], 
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

const useWatchlistStore = create((set, get) => ({
  watchlist: [],
  liveQuotes: {},
  historicalData: {},
  loading: false,
  error: null,
  socketInitialized: false,

  addTicker: (symbol) => {
    const s = symbol.toUpperCase();
    const currentWatchlist = get().watchlist;
    
    if (!currentWatchlist.includes(s)) {
      console.log(`Adding ticker: ${s}`);
      socket.emit('subscribe', { symbol: s });
      
      set((state) => ({
        watchlist: [...state.watchlist, s]
      }));
    }
  },

  removeTicker: (symbol) => {
    const s = symbol.toUpperCase();
    console.log(`Removing ticker: ${s}`);
    
    socket.emit('unsubscribe', { symbol: s });
    
    set((state) => {
      const newLiveQuotes = { ...state.liveQuotes };
      const newHistoricalData = { ...state.historicalData };
      
      delete newLiveQuotes[s];
      delete newHistoricalData[s];
      
      return {
        watchlist: state.watchlist.filter((t) => t !== s),
        liveQuotes: newLiveQuotes,
        historicalData: newHistoricalData,
      };
    });
  },

  initSocket: () => {
    const state = get();
    
    // Prevent multiple initializations
    if (state.socketInitialized) {
      console.log('Socket already initialized');
      return;
    }

    console.log('Initializing socket listeners...');

    // Remove any existing listeners to prevent duplicates
    socket.off('live_update');
    socket.off('connect');
    socket.off('disconnect');

    // Set up live update listener with proper state management
    socket.on('live_update', (data) => {
      console.log('🔴 Received live update:', data);
      
      const { symbol, bar, price, volume } = data;
      
      if (!symbol) {
        console.warn('❌ Invalid live update - no symbol:', data);
        return;
      }

      // Use the current state to get previous values
      const currentState = get();
      const currentQuote = currentState.liveQuotes[symbol];
      
      // Create the new quote data
      let newQuote;
      if (bar) {
        // Full bar data from server
        newQuote = { ...bar };
      } else if (price !== undefined) {
        // Just price update
        newQuote = {
          ...currentQuote,
          Close: price,
          Volume: volume || currentQuote?.Volume || 0,
          Date: new Date().toLocaleString()
        };
      } else {
        console.warn('❌ No price or bar data in update:', data);
        return;
      }

      // Determine price direction
      let up = false;
      let down = false;
      
      if (currentQuote && currentQuote.Close !== undefined && newQuote.Close !== undefined) {
        const currentPrice = parseFloat(newQuote.Close);
        const lastPrice = parseFloat(currentQuote.Close);
        
        if (currentPrice > lastPrice) {
          up = true;
          console.log(`📈 ${symbol} UP: ${lastPrice} → ${currentPrice}`);
        } else if (currentPrice < lastPrice) {
          down = true;
          console.log(`📉 ${symbol} DOWN: ${lastPrice} → ${currentPrice}`);
        } else {
          console.log(`➡️ ${symbol} SAME: ${currentPrice}`);
        }
      } else {
        console.log(`🆕 ${symbol} FIRST UPDATE: ${newQuote.Close}`);
      }

      // Update state with new quote
      set((state) => {
        const updatedQuotes = {
          ...state.liveQuotes,
          [symbol]: {
            ...newQuote,
            up,
            down,
            lastUpdate: Date.now()
          }
        };
        
        console.log(`✅ Updated state for ${symbol}:`, updatedQuotes[symbol]);
        
        return {
          liveQuotes: updatedQuotes
        };
      });
    });


    
socket.on('connect', () => {
  console.log('Connected to backend');

  socket.emit('subscribe', { symbol: 'AAPL' }); // subscribe to a symbol

  socket.on('live_update', (data) => {
    console.log('Live update:', data);
  });
});


    // Connection status listeners
    socket.on('connect', () => {
      console.log('Socket connected');
    });


    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Handle other socket events
    socket.on('watchlist_subscribed', (data) => {
      console.log('Watchlist subscribed:', data);
    });

    socket.on('watchlist_error', (error) => {
      console.error('Watchlist error:', error);
      set({ error: error.error || 'Unknown socket error' });
    });

    // Mark socket as initialized
    set({ socketInitialized: true });
  },

  // Method to force refresh live quotes
  refreshLiveQuotes: () => {
    const { watchlist } = get();
    console.log('Refreshing live quotes for:', watchlist);
    
    watchlist.forEach(symbol => {
      socket.emit('subscribe', { symbol });
    });
  },

  fetchBatchHistory: async (tickers) => {
    if (!tickers || tickers.length === 0) return;
    
    set({ loading: true, error: null });
    
    try {
      console.log('Fetching batch history for:', tickers);
      const response = await axios.post('http://localhost:5000/batch-historical', { tickers });

      if (response.data.status === 'success') {
        set({
          historicalData: response.data.historical,
          loading: false,
        });
      } else {
        set({
          error: response.data.message || 'Unexpected error',
          loading: false,
        });
      }
    } catch (err) {
      console.error('Error fetching batch history:', err);
      set({
        error: err.message || 'Failed to fetch historical data',
        loading: false,
      });
    }
  },

  // Cleanup method
  cleanup: () => {
    socket.off('live_update');
    socket.off('connect');
    socket.off('disconnect');
    socket.off('watchlist_subscribed');
    socket.off('watchlist_error');
    set({ socketInitialized: false });
  }
}));



export default useWatchlistStore;