import { create } from 'zustand';

const useStockChartStore = create((set) => ({
  chartType: 'Area',
  chartTypes: [
    { label: 'Area', icon: 'Area' },
    { label: 'Candlestick', icon: 'Candlestick' }
  ],
  timeRanges: [
    // { label: '1D', months: 0.033 },
    { label: '1W', months: 0.25 },
    { label: '1M', months: 1 },
    { label: '3M', months: 3 },
    { label: '1Y', months: 12 },
    { label: '5Y', months: 60 }
  ],
  selectedRange: { label: '1M', months: 3 },
  chartData: [],
  loading: false,
  error: null,

  setChartType: (type) => set({ chartType: type }),
  setSelectedRange: (range) => set({ selectedRange: range }),
  setChartData: (data) => set({ chartData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  getPreciseDateRange: (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - months);
    return { start, end };
  }
}));

export default useStockChartStore;