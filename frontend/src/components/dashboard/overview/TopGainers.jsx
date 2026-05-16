import { useEffect } from "react";
import { TrendingUp, Info } from "lucide-react";
import useStockStore from "../../../../store/useStockData.store.js";
import Loader from "../../common/Loader.jsx";

const TopGainers = () => {
  const { gainers, fetchGainers, loading, error } = useStockStore();

  useEffect(() => {
    fetchGainers();
  }, [fetchGainers]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-semibold text-gray-800">Top Gainers</h2>
        </div>
      </div>

      {loading ? (
        <Loader size="sm" text="Fetching gainers..." />
      ) : error ? (
        <p className="text-xs text-center text-red-500 py-4">Failed to load</p>
      ) : (
        <div className="space-y-1">
          {gainers.slice(0, 5).map((stock, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 w-14 text-center flex-shrink-0 truncate">
                  {stock.symbol}
                </span>
                <span className="text-xs text-gray-500 truncate">{stock.name}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <span className="text-xs font-semibold text-gray-800">
                  ${stock.price?.toFixed(2) ?? "—"}
                </span>
                <span className="text-xs font-bold text-emerald-600 w-14 text-right">
                  +{stock.change?.toFixed(2) ?? "0.00"}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {gainers.length > 0 && gainers[0].dateFetched && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
          <Info className="w-3 h-3 flex-shrink-0" />
          <span>
            {new Date(gainers[0].dateFetched).toLocaleTimeString(undefined, {
              month: "short", day: "numeric",
              hour: "2-digit", minute: "2-digit", hour12: true,
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default TopGainers;
