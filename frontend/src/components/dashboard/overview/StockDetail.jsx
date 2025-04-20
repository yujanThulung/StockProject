import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Info, Star, TrendingUp, TrendingDown } from "lucide-react";

const StockDetail = ({ symbol = "AAPL" }) => {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);

    // API placeholder structure
    const mockData = {
        symbol: "AAPL",
        currentPrice: 192.45,
        change: 1.32,
        changePercent: 0.69,
        previousClose: 191.13,
        open: 191.78,
        dayRange: "190.50 - 193.20",
        yearRange: "124.17 - 198.23",
        volume: "28.4M",
        avgVolume: "25.1M",
        marketCap: "2.99T",
        peRatio: 29.85,
        eps: 6.42,
        dividendYield: 0.52,
        beta: 1.28,
        sector: "Technology",
        lastUpdated: new Date().toISOString(),
    };

    useEffect(() => {
        // 🔄 Replace with actual API call
        setLoading(true);
        const fetchData = async () => {
            try {
                // const response = await fetch(`https://api.example.com/stocks/${symbol}`);
                // const data = await response.json();
                // setStockData(data);

                // Using mock data for now
                setTimeout(() => {
                    setStockData(mockData);
                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error("Error fetching stock data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-16">
                <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {stockData?.symbol}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {stockData?.sector}
                        </span>
                    </h4>
                    <div className="flex items-end gap-2 mt-4">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${stockData?.currentPrice?.toFixed(2)}
                        </span>
                        <span
                            className={`flex items-center text-sm font-medium ${
                                stockData?.change >= 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-red-600 dark:text-red-400"
                            }`}
                        >
                            {stockData?.change >= 0 ? (
                                <ArrowUp className="w-4 h-4" />
                            ) : (
                                <ArrowDown className="w-4 h-4" />
                            )}
                            {Math.abs(stockData?.change)} ({stockData?.changePercent?.toFixed(2)}%)
                        </span>
                    </div>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    <DetailItem
                        label="Previous Close"
                        value={`$${stockData?.previousClose?.toFixed(2)}`}
                    />
                    <DetailItem label="Open" value={`$${stockData?.open?.toFixed(2)}`} />
                    <DetailItem
                        label="Day Range"
                        value={stockData?.dayRange}
                        icon={<TrendingUp className="w-4 h-4 text-gray-400" />}
                    />
                    <DetailItem
                        label="52 Week Range"
                        value={stockData?.yearRange}
                        icon={<TrendingDown className="w-4 h-4 text-gray-400" />}
                    />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <DetailItem label="Volume" value={stockData?.volume} />
                    <DetailItem label="Avg. Volume" value={stockData?.avgVolume} />
                    <DetailItem label="P/E Ratio" value={stockData?.peRatio} />
                    <DetailItem label="EPS" value={stockData?.eps} />
                    <DetailItem label="Dividend Yield" value={`${stockData?.dividendYield}%`} />
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>Market data</span>
                </div>
                <span>Updated: {new Date(stockData?.lastUpdated).toLocaleTimeString()}</span>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, icon }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {icon && icon}
            {label}
        </span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
);

export default StockDetail;
