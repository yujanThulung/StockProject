import React from "react";
import { motion } from "framer-motion";

const SentimentGauge = ({ score = 50, label = "Neutral" }) => {
  // score is 0 to 100
  // rotation for needle: -90 (Bearish) to 90 (Bullish)
  const rotation = (score / 100) * 180 - 90;

  const getColor = (s) => {
    if (s < 40) return "#ef4444"; // Red
    if (s < 60) return "#eab308"; // Yellow
    return "#22c55e"; // Green
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[400px] mx-auto py-10">
      {/* Gauge Background (Semi-circle) */}
      <svg viewBox="0 0 200 120" className="w-full drop-shadow-[0_0_15px_rgba(34,197,94,0.2)]">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="60%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        
        {/* Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Gradient Overlay (Colored Track) */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="251.32" // Circumference of semi-circle (PI * 80)
          strokeDashoffset={251.32 * (1 - score / 100)}
          className="transition-all duration-1000 ease-out"
        />

        {/* Center Point */}
        <circle cx="100" cy="100" r="6" fill="#1e293b" />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          style={{ originX: "100px", originY: "100px" }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <polygon points="100,25 96,35 104,35" fill="#1e293b" />
        </motion.g>

        {/* Labels */}
        <text x="25" y="115" textAnchor="middle" fill="#6b7280" fontSize="8" fontWeight="bold">BEARISH</text>
        <text x="100" y="85" textAnchor="middle" fill="#6b7280" fontSize="8" fontWeight="bold">NEUTRAL</text>
        <text x="175" y="115" textAnchor="middle" fill="#6b7280" fontSize="8" fontWeight="bold">BULLISH</text>
      </svg>

      {/* Score Text */}
      <div className="absolute bottom-5 flex flex-col items-center">
        <motion.span 
          key={score}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-black tracking-tighter"
          style={{ color: getColor(score) }}
        >
          {score.toFixed(0)}
        </motion.span>
        <span className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">
          {label}
        </span>
      </div>
    </div>
  );
};

export default SentimentGauge;
