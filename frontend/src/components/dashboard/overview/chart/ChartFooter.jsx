import React from "react";
import { Info } from "lucide-react";

export const ChartFooter = () => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>Stock</span>
        </div>
        <span>•</span>
        <span>As of {new Date().toLocaleString()}</span>
      </div>
      {/* <div className="flex items-center gap-1">
        <Info className="w-4 h-4" />
        <span>Interactive chart. Click and drag to zoom.</span>
      </div> */}
    </div>
  );
};


export default ChartFooter;