import React, { useEffect } from "react";
import { ArrowUp, ArrowDown, Info, Star, TrendingUp } from "lucide-react";
import useStockStore from "../../../../store/usePricePrediction.store";

const dummyHistorical = {
  ticker: "AAPL",
  historical_data: [
    { date: "2025-04-30", open: 490, high: 500, low: 485, close: 495, volume: 10000000 },
    { date: "2025-04-29", open: 485, high: 495, low: 480, close: 490, volume: 9500000 },
    { date: "2025-04-28", open: 480, high: 490, low: 475, close: 485, volume: 9000000 },
    { date: "2025-04-27", open: 475, high: 485, low: 470, close: 480, volume: 8500000 },
    { date: "2025-04-26", open: 470, high: 480, low: 465, close: 475, volume: 8000000 }
  ],
  info: {
    market_cap: 1500000000000,
    trailing_pe: 22.5
  }
};


const StockDetail = () => {
    // const { ticker, historicalData, loading, error, fetchAllData } = useStockStore();

    // useEffect(() => {
    //     fetchAllData(ticker);
    // }, [ticker, fetchAllData]);

    // Here we use dummy data instead of actual fetched data
    const historicalData = dummyHistorical;
    const ticker = dummyHistorical.ticker;
    const loading = false;
    const error = null;

    console.log("Historical data in stock detail: ", historicalData);

    const calculateChange = (current, previous) => {
        if (previous === 0 || isNaN(previous) || isNaN(current)) {
            return { change: 0, changePercent: 0 };
        }
        const change = current - previous;
        const changePercent = (change / Math.abs(previous)) * 100;
        return { change, changePercent };
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return <ErrorDisplay error={error} />;
    }

    if (!historicalData?.historical_data?.length) {
        return <NoDataDisplay ticker={ticker} />;
    }

    const latestData = historicalData.historical_data[0];
    const previousData = historicalData.historical_data[1] || latestData;
    const { change, changePercent } = calculateChange(latestData.close, previousData.close);

    const stockData = {
        symbol: ticker,
        currentPrice: latestData.close,
        change,
        changePercent,
        previousClose: previousData.close,
        open: latestData.open,
        dayRange: `${latestData.low.toFixed(2)} - ${latestData.high.toFixed(2)}`,
        volume: formatVolume(latestData.volume),
        marketCap: formatMarketCap(historicalData.info?.market_cap),
        peRatio: formatRatio(historicalData.info?.trailing_pe)
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {stockData.symbol}
                    </h4>
                    <PriceDisplay 
                        price={stockData.currentPrice}
                        change={stockData.change}
                        changePercent={stockData.changePercent}
                    />
                </div>
                <StarButton />
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailColumn 
                    items={[
                        { label: "Previous Close", value: `$${stockData.previousClose.toFixed(2)}` },
                        { label: "Open", value: `$${stockData.open.toFixed(2)}` },
                        { label: "Day Range", value: stockData.dayRange, icon: <TrendingUp /> }
                    ]} 
                />
                <DetailColumn 
                    items={[
                        { label: "Volume", value: stockData.volume },
                        { label: "Market Cap", value: stockData.marketCap },
                        { label: "P/E Ratio", value: stockData.peRatio }
                    ]} 
                />
            </div>

            <DataFooter />
        </div>
    );
};

// Helper functions
const formatVolume = (volume) => 
    volume ? `${(volume / 1e6).toFixed(2)}M` : "N/A";

const formatMarketCap = (marketCap) => {
    if (!marketCap) return "N/A";
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toFixed(2)}`;
};

const formatRatio = (ratio) => 
    ratio ? ratio.toFixed(2) : "N/A";

// Sub-components
const LoadingSkeleton = () => (
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

const ErrorDisplay = ({ error }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        <div className="text-red-500 dark:text-red-400">
            Error: {error.message || error.toString()}
        </div>
    </div>
);

const NoDataDisplay = ({ ticker }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
        <div className="text-yellow-500 dark:text-yellow-400">
            No historical data available for {ticker}
        </div>
    </div>
);

const PriceDisplay = ({ price, change, changePercent }) => (
    <div className="flex items-end gap-2 mt-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${price.toFixed(2)}
        </span>
        <span className={`flex items-center text-sm font-medium ${
            change >= 0 ? "text-emerald-600" : "text-red-600"
        }`}>
            {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            {Math.abs(change).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
        </span>
    </div>
);

const StarButton = () => (
    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
    </button>
);

const DetailColumn = ({ items }) => (
    <div className="space-y-4">
        {items.map((item, index) => (
            <DetailItem key={index} {...item} />
        ))}
    </div>
);

const DetailItem = ({ label, value, icon }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {icon && icon}
            {label}
        </span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
            {value}
        </span>
    </div>
);

const DataFooter = () => (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Market data</span>
        </div>
    </div>
);

export default StockDetail;
