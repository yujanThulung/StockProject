// src/components/dashboard/pages/Overview.jsx
import React from "react";

import StockHeader from "../../components/dashboard/overview/StockHeader.jsx";
import StockSummary from "../../components/dashboard/overview/StockSummary.jsx";
import StockChart from "../../components/dashboard/overview/StockChart.jsx";
import StockComparison from "../../components/dashboard/overview/StockComparison.jsx";
import StockDetail from "../../components/dashboard/overview/StockDetail.jsx";
import TopGainers from "../../components/dashboard/overview/TopGainers.jsx";
import TopLosers from "../../components/dashboard/overview/TopLosers.jsx";

const Overview = () => {
  return (
    <div className="w-full space-y-4 p-4">
      <StockHeader />
      <StockSummary />

      {/* Chart + Detail section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <StockChart />
        </div>
        <StockDetail />
      </div>

      {/* Top Gainers and Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopGainers />
        <TopLosers />
      </div>
    </div>
  );
};

export default Overview;
