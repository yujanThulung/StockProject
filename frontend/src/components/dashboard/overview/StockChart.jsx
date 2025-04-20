import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { 
  ArrowUp, 
  ArrowDown, 
  Info, 
  Star, 
  CandlestickChart,
  LineChart,
  BarChart
} from "lucide-react";

// ✅ Generate realistic stock-like data with trends and volatility
const generateStockData = (days, volatility = 0.5) => {
  let data = [];
  let price = 100 + Math.random() * 20; // Starting price
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    // Simulate market trends and random fluctuations
    const trend = i < days/3 ? 0.1 : i < days*2/3 ? -0.05 : 0.07;
    const change = (Math.random() - 0.5 + trend) * volatility;
    price = price * (1 + change);
    
    // Ensure price stays positive
    price = Math.max(5, price);
    
    // Simulate intraday movement (high/low)
    const intradayChange = Math.random() * 0.03 * price;
    const high = price + intradayChange;
    const low = price - intradayChange;
    
    data.push({
      date: date,
      time: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: parseFloat(price.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      change: parseFloat(change.toFixed(4))
    });
  }
  return data;
};

const timeRanges = [
  { label: "1D", days: 1, interval: "hour" },
  { label: "1W", days: 7, interval: "day" },
  { label: "1M", days: 30, interval: "day" },
  { label: "3M", days: 90, interval: "week" },
  { label: "6M", days: 180, interval: "week" },
  { label: "1Y", days: 365, interval: "month" },
  { label: "5Y", days: 1825, interval: "month" },
  { label: "All", days: 3650, interval: "year" },
];

const chartTypes = [
  { label: "Area", icon: <AreaChart size={16} /> },
  { label: "Line", icon: <LineChart size={16} /> },
  { label: "Candlestick", icon: <CandlestickChart size={16} /> },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">{data.time}</p>
        <div className="flex justify-between mt-1">
          <span className="text-gray-500 dark:text-gray-400">Price:</span>
          <span className={`font-semibold ${
            data.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            ${data.value.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">High:</span>
          <span>${data.high?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Low:</span>
          <span>${data.low?.toFixed(2)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function StockChart({ symbol = "AAPL" }) {
  const [chartData, setChartData] = useState([]);
  const [selectedRange, setSelectedRange] = useState(timeRanges[2]); // Default to 1M
  const [chartType, setChartType] = useState("Area");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      setChartData(generateStockData(selectedRange.days));
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedRange]);

  const formatXAxis = (tickItem) => {
    if (selectedRange.days <= 1) {
      // For intraday, show hours
      return new Date(tickItem).toLocaleTimeString([], { hour: '2-digit' });
    } else if (selectedRange.days <= 7) {
      // For 1 week, show short day names
      return new Date(tickItem).toLocaleDateString([], { weekday: 'short' });
    } else if (selectedRange.days <= 90) {
      // For 3 months, show month/day
      return new Date(tickItem).toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      // For longer ranges, show month/year
      return new Date(tickItem).toLocaleDateString([], { year: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{symbol} Price Chart</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedRange.label} view • {chartType} chart
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            {chartTypes.map((type) => (
              <button
                key={type.label}
                onClick={() => setChartType(type.label)}
                className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                  chartType === type.label
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                {type.icon}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Range Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {timeRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => setSelectedRange(range)}
            className={`px-3 py-1 text-sm rounded-full border ${
              selectedRange.label === range.label
                ? "bg-black dark:bg-gray-700 text-white dark:text-white border-black dark:border-gray-600"
                : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                strokeOpacity={0.5}
              />
              
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickMargin={10}
              />
              
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                width={60}
              />
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ 
                  stroke: "#D1D5DB", 
                  strokeDasharray: "3 3",
                  strokeOpacity: 0.5
                }} 
              />
              
              {chartData.length > 10 && (
                <ReferenceLine 
                  y={chartData[0].value} 
                  stroke="#6B7280" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.5}
                  label={{
                    position: "right",
                    value: "Start",
                    fill: "#6B7280",
                    fontSize: 12
                  }}
                />
              )}
              
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorValue)"
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "#10B981",
                  strokeWidth: 2,
                  fill: "#FFFFFF"
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer with additional info */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>{symbol}</span>
          </div>
          <span>•</span>
          <span>As of {new Date().toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Info className="w-4 h-4" />
          <span>Interactive chart. Click and drag to zoom.</span>
        </div>
      </div>
    </div>
  );
}