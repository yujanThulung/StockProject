import React, { useMemo } from "react";
import { motion } from "framer-motion";
import usePricePredictionStore from "../../../../../store/usePricePrediction.store";
import useStockChartStore from "../../../../../store/stockChartStore.store";
import { CustomTooltip } from "./CustomTooltip";
import AreaChart from "./AreaChart";
import CandlestickChart from "./CandleChart";
// import LineChart from "./LineChart";

const ChartDisplay = () => {
  const { ticker, historicalData, loading, error } = usePricePredictionStore();
  const { selectedRange, getPreciseDateRange, chartType } = useStockChartStore();

  const { start: startDate } = getPreciseDateRange(selectedRange.months);

  const chartData = useMemo(() => {
    return (historicalData || [])
      .filter((item) => new Date(item.Date) >= startDate)
      .map((item, idx, arr) => {
        const prev = arr[idx - 1];
        const change = prev ? item.Close - prev.Close : 0;
        const date = new Date(item.Date);

        return {
          time:
            selectedRange.label === "1W"
              ? date.toLocaleDateString("en-US", { weekday: "short" })
              : date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
          value: {
            open: item.Open,
            high: item.High,
            low: item.Low,
            close: item.Close,
          },
          numericValue: item.Close, 
          high: item.High,
          low: item.Low,
          change,
        };
      });
  }, [historicalData, selectedRange]);

  const startValue = chartData[0]?.numericValue;
  const endValue = chartData[chartData.length - 1]?.numericValue;

  let trendColor = "#6B7280";
  if (startValue && endValue) {
    const changePercent = ((endValue - startValue) / startValue) * 100;
    if (changePercent > 0.5) trendColor = "#00FF00";
    else if (changePercent < -0.5) trendColor = "#FF0000";
  }

  const renderChart = () => {
    switch (chartType) {
      case "Area":
        return <AreaChart chartData={chartData.map(d => ({ ...d, value: d.numericValue }))} trendColor={trendColor} />;
      case "Candlestick":
        return <CandlestickChart chartData={chartData} />;
      default:
        return <AreaChart chartData={chartData.map(d => ({ ...d, value: d.numericValue }))} trendColor={trendColor} />;
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center text-red-500">
        Error loading data for {ticker}: {error}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No chart data available for {ticker}.
      </div>
    );
  }

  return (
    <motion.div
      className="h-[300px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {renderChart()}
    </motion.div>
  );
};

export default ChartDisplay;