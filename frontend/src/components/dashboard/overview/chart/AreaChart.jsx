import React from "react";
import {
  AreaChart as RechartsArea,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

import { CustomTooltip } from "./CustomTooltip";
import useStockChartStore from "../../../../../store/stockChartStore.store";

const AreaChart = ({ chartData, trendColor }) => {
  const { selectedRange } = useStockChartStore();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsArea data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
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
      </RechartsArea>
    </ResponsiveContainer>
  );
};

export default AreaChart;