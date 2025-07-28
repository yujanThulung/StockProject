// import React from "react";

// import StockHeader from "../../components/dashboard/overview/StockHeader.jsx";
// import StockSummary from "../../components/dashboard/overview/StockSummary.jsx";

// import StockChart from "../../components/dashboard/overview/chart/index.jsx";
// import StockComparison from "../../components/dashboard/overview/StockComparison.jsx";
// import StockDetail from "../../components/dashboard/overview/StockDetail.jsx";
// import TopGainers from "../../components/dashboard/overview/TopGainers.jsx";
// import TopLosers from "../../components/dashboard/overview/TopLosers.jsx";
// import TickerSearch from "../../components/dashboard/overview/chart/TickerSearch.jsx";
// import History from "../../components/HistoryCard";



// const Overview = () => {
//     return (
//         <div className="w-full space-y-4 p-4">
//             <div className="flex flex-col lg:flex-row gap-4 items-start">
//                 <div className="flex-1">
//                     <StockHeader />
//                 </div>
//                 <div className="w-full lg:w-1/3">
//                     <TickerSearch />
//                 </div>
//             </div>
            

//             {/* Chart + Detail section */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                 <div className="lg:col-span-2 space-y-4">
//                     <StockChart />
//                     {/* <History /> */}
//                 </div>
//                 <div className="space-y-4">
//                     {/* <StockDetail /> */}
//                     <TopGainers />
//                     <TopLosers />
//                 </div>
//             </div>

//             {/* Top Gainers and Losers */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
//         </div>
//     );
// };

// export default Overview;













import React, { useEffect } from "react";
import usePricePredictionStore from "../../../store/usePricePrediction.store";
import StockHeader from "../../components/dashboard/overview/StockHeader.jsx";
import StockChart from "../../components/dashboard/overview/chart/index.jsx";
import TopGainers from "../../components/dashboard/overview/TopGainers.jsx";
import TopLosers from "../../components/dashboard/overview/TopLosers.jsx";
import TickerSearch from "../../components/dashboard/overview/chart/TickerSearch.jsx";
import History from "../../components/HistoryCard";

const Overview = () => {
  const { ticker, fetchAllData, fetchHistoricalData } = usePricePredictionStore();

  // Run full fetch once on mount
  useEffect(() => {
    if (ticker) fetchAllData(ticker);
  }, [ticker, fetchAllData]);

  // Refresh only historical data every 30 seconds
  useEffect(() => {
    if (!ticker) return;

    const interval = setInterval(() => {
      fetchHistoricalData(ticker); // ✅ ONLY this
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
