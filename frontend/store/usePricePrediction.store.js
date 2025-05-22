
// import { create } from 'zustand';
// import axios from 'axios';

// const usePricePredictionStore = create((set) => ({
//   ticker: 'GOOG',
//   modelData: null,
//   historicalData: [],     
//   loading: false,
//   error: null,

//   // set the ticker
//   setTicker: (newTicker) => set({ ticker: newTicker }),

//   // fetch both model + historical
//   fetchAllData: async (ticker) => {
//     try {
//       set({ loading: true, error: null });

//       const [modelRes, historicalRes] = await Promise.all([
//         axios.post("http://localhost:5000/predict", { ticker }),
//         axios.post("http://localhost:5000/historical", { ticker }),
//         fetch
//       ]);

//       if (modelRes.data.status !== "success" || historicalRes.data.status !== "success") {
//         throw new Error(modelRes.data.message || historicalRes.data.message || "Failed to fetch data");
//       }

//       set({
//         modelData:       modelRes.data,
//         historicalData:  historicalRes.data.historical,  // just the array
//         loading:         false,
//         error:           null
//       });
//     } catch (err) {
//       set({
//         error:           err.message,
//         loading:         false,
//         modelData:       null,
//         historicalData:  []
//       });
//       console.error("Error fetching data:", err);
//     }
//   },

  
  
//   // ✅ NEW: fetch only historical data
//   fetchHistoricalData: async (ticker) => {
//     try {
//       const response = await axios.post("http://localhost:5000/historical", { ticker });

//       if (response.data.status !== "success") {
//         throw new Error(response.data.message || "Failed to fetch historical data");
//       }

//       set({
//         historicalData: response.data.historical,
//         error: null,
//       });
//     } catch (err) {
//       set({
//         error: err.message,
//         historicalData: [],
//       });
//       console.error("Error fetching historical data:", err);
//     }
//   },
  

//   // append a single new bar if its timestamp is different
//   addBarToHistorical: (bar) =>
//   set((state) => {
//     const last = state.historicalData.at(-1);
//     const lastTime = last ? new Date(last.Date).toISOString() : null;
//     const barTime = new Date(bar.Date).toISOString();

//     if (lastTime !== barTime || (last && last.Close !== bar.Close)) {
//       return {
//         historicalData: [...state.historicalData, bar],
//       };
//     }

//     return {}; // No update
//   }),




//   reset: () => set({
//     ticker:          'AAPL',
//     modelData:       null,
//     historicalData:  [],
//     loading:         false,
//     error:           null
//   })
// }));

// export default usePricePredictionStore;




import { create } from 'zustand';
import axios from 'axios';

const usePricePredictionStore = create((set) => ({
  ticker: 'meta',
  modelData: null,
  historicalData: [],
  stockData: null, 
  loading: false,
  error: null,

  // set the ticker
  setTicker: (newTicker) => set({ ticker: newTicker }),

  // fetch model, historical, and overview data
  fetchAllData: async (ticker) => {
    try {
      set({ loading: true, error: null });

      const [modelRes, historicalRes, overviewRes] = await Promise.all([
        axios.post("http://localhost:5000/predict", { ticker }),
        axios.post("http://localhost:5000/historical", { ticker }),
        axios.get(`http://localhost:8000/api/overview/${ticker}`), 
      ]);

      if (
        modelRes.data.status !== "success" ||
        historicalRes.data.status !== "success"
      ) {
        throw new Error(
          modelRes.data.message ||
          historicalRes.data.message ||
          "Failed to fetch model/historical data"
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
      console.error("Error fetching data:", err);
      set({
        error: err.message,
        loading: false,
        modelData: null,
        historicalData: [],
        stockData: null, 
      });
    }
  },

  
  fetchHistoricalData: async (ticker) => {
    try {
      const response = await axios.post("http://localhost:5000/historical", { ticker });

      if (response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to fetch historical data");
      }

      set({
        historicalData: response.data.historical,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching historical data:", err);
      set({
        error: err.message,
        historicalData: [],
      });
    }
  },

  // append a single new bar if its timestamp is different
  addBarToHistorical: (bar) =>
    set((state) => {
      const last = state.historicalData.at(-1);
      const lastTime = last ? new Date(last.Date).toISOString() : null;
      const barTime = new Date(bar.Date).toISOString();

      if (lastTime !== barTime || (last && last.Close !== bar.Close)) {
        return {
          historicalData: [...state.historicalData, bar],
        };
      }

      return {};
    }),

  
  reset: () => set({
    ticker: 'AAPL',
    modelData: null,
    historicalData: [],
    overviewData: null, 
    loading: false,
    error: null,
  }),
}));

export default usePricePredictionStore;
