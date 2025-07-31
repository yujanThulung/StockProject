import React, { useEffect } from "react";
import useStockStore from "../../../../store/usePricePrediction.store";

const formatMarketCap = (cap) => {
  const n = Number(cap);
  if (isNaN(n)) return "N/A";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toFixed(2)}`;
};

export default function StockSummary() {
  const {
    ticker,
    historicalData,
    stockData,
    error,
  } = useStockStore();



  const openStock =
    historicalData.length > 0 ? `$${historicalData[0].Open}` : "N/A";
  const volume =
    historicalData.length > 0 ? historicalData[0].Volume.toLocaleString() : "N/A";
  const marketCap = stockData?.MarketCapitalization
    ? formatMarketCap(stockData.MarketCapitalization)
    : "N/A";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
      <div className="bg-white p-4 rounded-md shadow text-center">
        <p className="text-sm text-muted-foreground">Open Stock</p>
        <h3 className="text-xl font-bold">{openStock}</h3>
      </div>
      <div className="bg-white p-4 rounded-md shadow text-center">
        <p className="text-sm text-muted-foreground">Market Cap</p>
        <h3 className="text-xl font-bold">{marketCap}</h3>
      </div>
      <div className="bg-white p-4 rounded-md shadow text-center">
        <p className="text-sm text-muted-foreground">Volume</p>
        <h3 className="text-xl font-bold">{volume}</h3>
      </div>
    </div>
  );
}
