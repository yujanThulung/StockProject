import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const usePricePredictionStore = create(
  persist(
    (set, get) => ({
      ticker: "",
      modelData: null,
      historicalData: [],
      stockData: null,
      loading: false,
      error: null,
      fetchedTickers: new Set(),

      setTicker: (newTicker) => set({ ticker: newTicker }),

      fetchModelData: async (ticker) => {
        try {
          const response = await axios.post("http://localhost:8080/predict", { ticker });
          if (response.data.status !== "success")
            throw new Error(response.data.message || "Model fetch failed");
          set({ modelData: response.data, error: null });
          console.log("Fetched model data for ticker:", ticker);
        } catch (err) {
          console.error("Error fetching model data:", err);
          set({ error: err.message, modelData: null });
        }
      },

      fetchHistoricalData: async (ticker) => {
        const { fetchedTickers } = get();
        if (fetchedTickers.has(ticker)) return;

        try {
          const response = await axios.post("http://localhost:8080/historical", { ticker });
          if (response.data.status !== "success")
            throw new Error(response.data.message || "Fetch failed");

          set((state) => ({
            historicalData: response.data.historical,
            error: null,
            fetchedTickers: new Set([...state.fetchedTickers, ticker]),
          }));
          console.log("Fetched historical data for ticker from single :", ticker);
        } catch (err) {
          console.error("Error fetching historical data:", err);
          set({ error: err.message, historicalData: [] });
        }
      },

      fetchOverviewData: async (ticker) => {
        try {
          const response = await axios.get(`http://localhost:8000/api/overview/${ticker}`);
          set({ stockData: response.data, error: null });
          console.log("Fetched overview data for ticker:", ticker);
        } catch (err) {
          console.error("Error fetching overview data:", err);
          set({ error: err.message, stockData: null });
        }
      },

      fetchAllData: async (ticker) => {
        try {
          set({ loading: true, error: null });

          const [modelRes, historicalRes, overviewRes] = await Promise.all([
            axios.post("http://localhost:8080/predict", { ticker }),
            axios.post("http://localhost:8080/historical", { ticker }),
            axios.get(`http://localhost:8000/api/overview/${ticker}`),
          ]);

          if (modelRes.data.status !== "success" || historicalRes.data.status !== "success") {
            throw new Error(
              modelRes.data.message ||
                historicalRes.data.message ||
                "Failed to fetch model or historical data"
            );
          }
          console.log("Fetched all data for ticker from all data fetch:", ticker);

          set({
            modelData: modelRes.data,
            historicalData: historicalRes.data.historical,
            stockData: overviewRes.data,
            loading: false,
            error: null,
          });
        } catch (err) {
          console.error("Error in fetchAllData:", err);
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
            return {
              historicalData: [...state.historicalData, bar],
            };
          }

          return {};
        }),

      reset: () =>
        set({
          ticker: "MSFT",
          modelData: null,
          historicalData: [],
          stockData: null,
          loading: false,
          error: null,
        }),
    }),
    {
      name: "price-prediction-storage", // localStorage key
      partialize: (state) => ({ ticker: state.ticker }), // only persist ticker
    }
  )
);

export default usePricePredictionStore;
