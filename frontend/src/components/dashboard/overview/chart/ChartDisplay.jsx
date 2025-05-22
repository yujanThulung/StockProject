
import React, { useEffect,useCallback } from "react";
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
import { io } from "socket.io-client";
import usePricePredictionStore from "../../../../../store/usePricePrediction.store";
import useStockChartStore from "../../../../../store/stockChartStore.store";
import { CustomTooltip } from "./CustomTooltip";

const socket = io("http://localhost:5000");

const ChartDisplay = () => {
    const {
        ticker,
        historicalData,
        loading,
        error,
        fetchAllData,
        addBarToHistorical,
        fetchHistoricalData,
    } = usePricePredictionStore();
    const { selectedRange, getPreciseDateRange } = useStockChartStore();

    // Memoize fetchHistoricalData to avoid unnecessary recreations
    const fetchData = useCallback(() => {
        fetchHistoricalData(ticker);
    }, [ticker, fetchHistoricalData]);

    // 1) Initial load
    useEffect(() => {
        fetchAllData(ticker);
    }, [ticker, fetchAllData]);

    // 2) Set up interval for auto-refresh
    useEffect(() => {
        fetchData(); // Fetch immediately on mount
        const interval = setInterval(fetchData, 30000); // Then every 30 seconds

        return () => {
            clearInterval(interval); // Clean up on unmount
        };
    }, [fetchData]);

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

    if (!historicalData || historicalData.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
                No chart data available for {ticker}.
            </div>
        );
    }

    // ⏱ Filter based on selected time range
    const { start: startDate } = getPreciseDateRange(selectedRange.months);

    const chartData = historicalData
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
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="4 4"
                        stroke="#CBD5E1"
                        strokeOpacity={0.6}
                    />

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
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="url(#colorValue)"
                        activeDot={{
                            r: 6,
                            stroke: "#10B981",
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
