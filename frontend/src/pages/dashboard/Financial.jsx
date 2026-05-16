import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import usePricePredictionStore from "../../../store/usePricePrediction.store";
import StockTable from "../../components/dashboard/overview/StockTable.jsx";

const Financial = () => {
  const { ticker, setTicker, fetchOverviewData } = usePricePredictionStore();
  const [val, setVal] = useState(ticker || "");

  useEffect(() => { if (ticker) setVal(ticker); }, [ticker]);

  const submit = (e) => {
    e.preventDefault();
    const sym = val.trim().toUpperCase();
    if (!sym) return;
    setTicker(sym);
    fetchOverviewData(sym);
  };

  return (
    <div className="w-full p-4 space-y-4">
      {/* Search bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
        <form onSubmit={submit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Search ticker (e.g. AAPL)"
              className="w-full border border-gray-200 rounded-lg py-2 pl-8 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!val.trim()}
            className="bg-blue-950 hover:bg-blue-900 disabled:opacity-40 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </div>

      <StockTable />
    </div>
  );
};

export default Financial;
