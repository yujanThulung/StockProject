// src/components/dashboard/overview/TopGainers.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Rocket, Info } from "lucide-react";

const TopGainers = () => {
  const [gainers, setGainers] = useState([
    { 
      symbol: "TECH", 
      name: "TechNova Inc.", 
      price: 156.78,
      change: +8.2,
      volume: "4.7M",
      sector: "Technology"
    },
    { 
      symbol: "BIO", 
      name: "BioHealth Labs", 
      price: 89.45,
      change: +6.9,
      volume: "3.1M",
      sector: "Healthcare"
    },
    { 
      symbol: "GLE", 
      name: "Green Energy Co.", 
      price: 34.12,
      change: +5.7,
      volume: "8.2M",
      sector: "Renewables"
    },
    { 
      symbol: "FINX", 
      name: "Fintech Express", 
      price: 112.30,
      change: +4.8,
      volume: "2.9M",
      sector: "Financial"
    },
    { 
      symbol: "LUX", 
      name: "Luxury Brands", 
      price: 245.90,
      change: +4.3,
      volume: "1.5M",
      sector: "Consumer"
    },
  ]);

  // 🔁 Uncomment and replace URL when backend is ready
  /*
  useEffect(() => {
    const fetchGainers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/top-gainers");
        const data = await res.json();
        setGainers(data);
      } catch (err) {
        console.error("Error fetching top gainers:", err);
      }
    };
    fetchGainers();
  }, []);
  */

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

      <div className="space-y-4">
        {gainers.map((stock, index) => (
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
                <p className="text-xs text-gray-500 dark:text-gray-400">{stock.sector}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
              <div className="flex items-center justify-end gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  +{stock.change.toFixed(1)}%
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

export default TopGainers;