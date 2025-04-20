// src/components/dashboard/overview/TopLosers.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, AlertTriangle, Info } from "lucide-react";

const TopLosers = () => {
  const [losers, setLosers] = useState([
    { 
      symbol: "XYZ", 
      name: "XYZ Industries", 
      price: 45.32,
      change: -5.1,
      volume: "2.4M",
      sector: "Industrial"
    },
    { 
      symbol: "EVE", 
      name: "Everest Energy", 
      price: 12.56,
      change: -4.6,
      volume: "1.8M",
      sector: "Energy"
    },
    { 
      symbol: "DHL", 
      name: "Downhill Ltd", 
      price: 78.90,
      change: -4.0,
      volume: "3.2M",
      sector: "Consumer"
    },
    { 
      symbol: "CLM", 
      name: "Classic Motors", 
      price: 210.45,
      change: -3.7,
      volume: "5.6M",
      sector: "Automotive"
    },
    { 
      symbol: "LFI", 
      name: "Lumbini Finance", 
      price: 34.21,
      change: -3.2,
      volume: "1.2M",
      sector: "Financial"
    },
  ]);

  // 🔁 Uncomment and replace URL when backend is ready
  /*
  useEffect(() => {
    const fetchLosers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/top-losers");
        const data = await res.json();
        setLosers(data);
      } catch (err) {
        console.error("Error fetching top losers:", err);
      }
    };
    fetchLosers();
  }, []);
  */

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-red-100 dark:border-red-900/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
          <TrendingDown className="w-5 h-5" />
          Top Losers
        </h2>
        
      </div>

      <div className="space-y-4">
        {losers.map((stock, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02 }}
            className="flex justify-between items-center p-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="font-medium text-red-600 dark:text-red-400">
                  {stock.symbol}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{stock.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stock.sector}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
              <div className="flex items-center justify-end gap-2">
                <span className="text-red-600 dark:text-red-400 font-bold">
                  {stock.change.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Vol: {stock.volume}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <Info className="w-3 h-3" />
        <span>Updated at {new Date().toLocaleTimeString()}</span>
      </div>
    </motion.div>
  );
};

export default TopLosers;