import React from "react";
import { Info } from "lucide-react";
import LiveClock from "../../../clock";

export const ChartFooter = () => {
    return (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span>Stock</span>
                </div>
                <span>•</span>
                <LiveClock />
            </div>
        </div>
    );
};

export default ChartFooter;
