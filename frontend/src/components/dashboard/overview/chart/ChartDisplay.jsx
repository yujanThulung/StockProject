import React, { useMemo } from "react";
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
import { motion } from "framer-motion";
import usePricePredictionStore from "../../../../../store/usePricePrediction.store";
import useStockChartStore from "../../../../../store/stockChartStore.store";
import { CustomTooltip } from "./CustomTooltip";

const ChartDisplay = () => {
  const { ticker, historicalData, loading, error } = usePricePredictionStore();
  const { selectedRange, getPreciseDateRange } = useStockChartStore();

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
          value: item.Close,
          high: item.High,
          low: item.Low,
          change,
        };
      });
  }, [historicalData, selectedRange]);

  const startValue = chartData[0]?.value;
  const endValue = chartData[chartData.length - 1]?.value;

  let trendColor = "#6B7280";
  if (startValue && endValue) {
    const changePercent = ((endValue - startValue) / startValue) * 100;
    if (changePercent > 0.5) trendColor = "#00FF00";
    else if (changePercent < -0.5) trendColor = "#FF0000";
  }

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
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={trendColor} stopOpacity={1} />
              <stop offset="95%" stopColor={trendColor} stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke={trendColor} strokeOpacity={0.6} />

          <XAxis
            dataKey="time"
            tick={{
              fill: "#6B7280",
              fontSize: 12,
              angle: selectedRange.label === "1W" ? 0 : -45,
              textAnchor: selectedRange.label === "1W" ? "middle" : "end",
            }}
            interval={chartData.length <= 10 ? 0 : "preserveEnd"}
            height={selectedRange.label === "1W" ? 40 : 60}
          />

          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickFormatter={(val) => `$${val.toFixed(2)}`}
            width={60}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#D1D5DB",
              strokeDasharray: "3 3",
              strokeOpacity: 0.5,
            }}
          />

          {chartData.length > 1 && (
            <ReferenceLine
              y={chartData[0].value}
              stroke="#6B7280"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
              label={{
                position: "right",
                value: "Start",
                fill: "#6B7280",
                fontSize: 12,
              }}
            />
          )}

          <Area
            type="monotone"
            dataKey="value"
            stroke={trendColor}
            strokeWidth={2}
            fill="url(#colorValue)"
            activeDot={{
              r: 6,
              stroke: trendColor,
              strokeWidth: 2,
              fill: "#FFFFFF",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ChartDisplay;
