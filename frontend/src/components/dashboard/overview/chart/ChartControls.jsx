// import React from "react";
// import { CandlestickChart, LineChart, AreaChart as AreaIcon } from "lucide-react";
// import useStockChartStore from "../../../../../store/stockChartStore.store";

// const iconComponents = {
//   Area: AreaIcon,
//   Line: LineChart,
//   Candlestick: CandlestickChart
// };

// export const ChartControls = ({ symbol }) => {
//   const {
//     chartType,
//     setChartType,
//     selectedRange,
//     setSelectedRange,
//     timeRanges,
//     chartTypes
//   } = useStockChartStore();

//   return (
//     <>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <div>
//           <h3 className="text-lg font-bold text-gray-900 dark:text-white">{symbol} Price Chart</h3>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             {selectedRange.label} view • {chartType} chart
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-1">
//             {chartTypes.map((type) => {
//               const IconComponent = iconComponents[type.icon];
//               return (
//                 <button
//                   key={type.label}
//                   onClick={() => setChartType(type.label)}
//                   className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
//                     chartType === type.label
//                       ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
//                       : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
//                   }`}
//                 >
//                   <IconComponent size={16} />
//                   <span>{type.label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-2 mb-6">
//         {timeRanges.map((range) => (
//           <button
//             key={range.label}
//             onClick={() => setSelectedRange(range)}
//             className={`px-3 py-1 text-sm rounded-full border ${
//               selectedRange.label === range.label
//                 ? "bg-black dark:bg-gray-700 text-white dark:text-white border-black dark:border-gray-600"
//                 : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
//             }`}
//           >
//             {range.label}
//           </button>
//         ))}
//       </div>
//     </>
//   );
// };

// export default ChartControls;






import React, { useEffect } from "react";
import { CandlestickChart, LineChart, AreaChart as AreaIcon } from "lucide-react";
import useStockChartStore from "../../../../../store/stockChartStore.store";
import usePricePredictionStore from "../../../../../store/usePricePrediction.store";

const iconComponents = {
  Area: AreaIcon,
  Line: LineChart,
  Candlestick: CandlestickChart,
};

export const ChartControls = ({ symbol }) => {
  const {
    chartType,
    setChartType,
    selectedRange,
    setSelectedRange,
    timeRanges,
    chartTypes,
  } = useStockChartStore();

  const { fetchAllData } = usePricePredictionStore();

  // Trigger data reload on range change
  useEffect(() => {
    if (symbol && selectedRange) {
      fetchAllData(symbol);
    }
  }, [selectedRange, chartType, symbol, fetchAllData]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{symbol} Price Chart</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedRange?.label || "No Range"} view • {chartType} chart
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            {chartTypes.map((type) => {
              const IconComponent = iconComponents[type.icon];
              return (
                <button
                  key={type.label}
                  onClick={() => setChartType(type.label)}
                  className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                    chartType === type.label
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
    </>
  );
};

export default ChartControls;
