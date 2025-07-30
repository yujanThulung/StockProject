import React, { useEffect } from "react";
import usePricePredictionStore from "../../../store/usePricePrediction.store";
import StockHeader from "../../components/dashboard/overview/StockHeader.jsx";
import StockChart from "../../components/dashboard/overview/chart/index.jsx";
import TopGainers from "../../components/dashboard/overview/TopGainers.jsx";
import TopLosers from "../../components/dashboard/overview/TopLosers.jsx";
import TickerSearch from "../../components/dashboard/overview/chart/TickerSearch.jsx";
import History from "../../components/HistoryCard";

const Overview = () => {
  const { ticker, fetchHistoricalData } = usePricePredictionStore();

  // Run full fetch once on mount
  useEffect(() => {
    if (ticker) fetchHistoricalData(ticker);
  }, [ticker, fetchHistoricalData]);

  // Refresh only historical data every 30 seconds
  useEffect(() => {
    if (!ticker) return;

    const interval = setInterval(() => {
      fetchHistoricalData(ticker); 
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // cleanup
  }, [ticker, fetchHistoricalData]);

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="flex-1">
          <StockHeader />
        </div>
        <div className="w-full lg:w-1/3">
          <TickerSearch />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <StockChart />
          <History />
        </div>
        <div className="space-y-4">
          <TopGainers />
          <TopLosers />
        </div>
      </div>
    </div>
  );
};

export default Overview;
