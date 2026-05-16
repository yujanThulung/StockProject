import React, { useEffect } from "react";
import usePricePredictionStore from "../../../store/usePricePrediction.store";

import StockHeader from "../../components/dashboard/overview/StockHeader.jsx";
import StockChart from "../../components/dashboard/overview/chart/index.jsx";
import TopGainers from "../../components/dashboard/overview/TopGainers.jsx";
import TopLosers from "../../components/dashboard/overview/TopLosers.jsx";
import TickerSearch from "../../components/dashboard/overview/chart/TickerSearch.jsx";
import History from "../../components/HistoryCard";
import NewsSection from "../../components/dashboard/overview/NewsSection.jsx";

const Overview = () => {
  const { ticker, fetchHistoricalData } = usePricePredictionStore();

  useEffect(() => {
    if (ticker) fetchHistoricalData(ticker);
  }, [ticker, fetchHistoricalData]);

  useEffect(() => {
    if (!ticker) return;

    const interval = setInterval(() => {
      fetchHistoricalData(ticker);
    }, 30000);

    return () => clearInterval(interval);
  }, [ticker, fetchHistoricalData]);

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="flex-1">
          <StockHeader />
        </div>

        <div className="w-full lg:w-1/3">
          <TickerSearch />
        </div>
      </div>

      {/* Full Width Chart */}
      <div className="w-full">
        <StockChart />
      </div>

      {/* History + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Historical Data */}
        <div className="lg:col-span-2">
          <History />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-2">
          <TopGainers />
          <TopLosers />
        </div>
      </div>

      {/* News Section Below */}
      <div className="w-full">
        <NewsSection />
      </div>
    </div>
  );
};

export default Overview;