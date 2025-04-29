import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Rocket, Info } from "lucide-react";
import useStockStore from "../../../../store/useStockData.store.js";

const TopGainers = () => {
  const { gainers, fetchGainers, loading, error } = useStockStore();

  useEffect(() => {
    fetchGainers();
  }, [fetchGainers]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-900/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Top Gainers
        </h2>
        <div className="text-xs flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
          <Rocket className="w-3 h-3" />
          Momentum
        </div>
      </div>

      {loading ? (
        <p className="text-center text-emerald-600 dark:text-emerald-400">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="space-y-4">
          {gainers.slice(0,5).map((stock, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.02 }}
              className="flex justify-between items-center p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {stock.symbol}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{stock.name}</h3>
                  {/* <p className="text-xs text-gray-500 dark:text-gray-400">{stock.sector || "N/A"}</p> */}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${stock.price?.toFixed(2) || "0.00"}
                </p>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {stock.change ? `+${stock.change.toFixed(1)}%` : "0.0%"}
                  </span>
                  {/* <span className="text-xs text-gray-500 dark:text-gray-400">
                    Vol: {stock.volume || "N/A"}
                  </span> */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {gainers.length > 0 && (
        <div className="mt-4 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Info className="w-3 h-3" />
          <span>Updated at {new Date(gainers[0].dateFetched).toLocaleTimeString(undefined,{
            year: "numeric",
            month: "short",
            day:"numeric",
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit",
            hour12:true,
          })}</span>
        </div>
      )}
    </motion.div>
  );
};

export default TopGainers;
