import React from "react";

export const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    // Format the date: "Mon, Feb 26 2001"
    const formattedDate = new Date(data.time).toLocaleDateString("en-US", {
      weekday: "short", // Mon
      year: "numeric",  // 2001
      month: "short",   // Feb
      day: "2-digit"    // 26
    });

    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">{formattedDate}</p>
        <div className="flex justify-between mt-1">
          <span className="text-gray-500 dark:text-gray-400">Price:</span>
          <span className={`font-semibold ${
            data.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            ${data.value?.toFixed(2) ?? 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">High:</span>
          <span>${data.high?.toFixed(2) ?? 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Low:</span>
          <span>${data.low?.toFixed(2) ?? 'N/A'}</span>
        </div>
        
        {/* <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Volume:</span>
          <span>${data.volume?.toFixed(2) ?? 'N/A'}</span>
        </div> */}
      </div>
    );
  }
  return null;
};
