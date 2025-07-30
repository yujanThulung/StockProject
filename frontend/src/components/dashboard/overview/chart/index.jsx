import React, { useEffect, useMemo } from "react";
import usePricePredictionStore from "../../../../../store/usePricePrediction.store.js";
import useStockChartStore from "../../../../../store/stockChartStore.store";

import ChartControls from "./ChartControls.jsx";
import ChartDisplay from "./ChartDisplay.jsx";
import ChartFooter from "./ChartFooter.jsx";

const StockChart = () => {
    const ticker = usePricePredictionStore((state) => state.ticker);
    const historicalData = usePricePredictionStore((state) => state.historicalData);

    const setChartData = useStockChartStore((state) => state.setChartData);
    const selectedRange = useStockChartStore((state) => state.selectedRange);
    const fetchHistoricalData = usePricePredictionStore((state) => state.fetchHistoricalData);

    // useEffect(() => {
    //     if (ticker && (!historicalData || historicalData.length === 0)) {
    //         fetchHistoricalData(ticker);
    //     }
    // }, [ticker, fetchHistoricalData, historicalData]);


//     useEffect(() => {
//   if (ticker) {
//     fetchHistoricalData(ticker);
//   }
// }, [ticker, fetchHistoricalData]);


    // Transform historical data for chart display
    const transformedData = useMemo(() => {
        if (!historicalData?.historical_data) return [];

        return historicalData.historical_data.map((item, index) => {
            const date = new Date(item.date);
            const prevClose =
                index > 0 ? historicalData.historical_data[index - 1].close : item.close;
            const change = prevClose !== 0 ? ((item.close - prevClose) / prevClose) * 100 : 0;

            let timeFormat;
            if (selectedRange.months <= 0.25) {
                timeFormat = { weekday: "short", day: "numeric" };
            } else if (selectedRange.months <= 3) {
                timeFormat = { month: "short", day: "numeric" };
            } else if (selectedRange.months <= 12) {
                timeFormat = { month: "short" };
            } else {
                timeFormat = { year: "numeric", month: "short" };
            }

            return {
                time: date.toLocaleDateString("en-US", timeFormat),
                value: item.close,
                high: item.high,
                low: item.low,
                change,
                changePercent: item.open !== 0 ? ((item.close - item.open) / item.open) * 100 : 0,
            };
        });
    }, [historicalData, selectedRange]);

    // Set chart data when transformed
    React.useEffect(() => {
        if (transformedData.length > 0) {
            setChartData(transformedData);
        }
    }, [transformedData, setChartData]);

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <ChartControls symbol={ticker} />
            <ChartDisplay />
            <ChartFooter />
        </div>
    );
};

export default StockChart;
