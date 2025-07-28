import React, { useEffect } from "react";
import useStockStore from "../../../../store/usePricePrediction.store";

const formatMarketCap = (cap) => {
  const n = Number(cap);
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toFixed(2)}`;
};

const formatPct = (val) => `${(Number(val) * 100).toFixed(1)}%`;

const StockOverviewCard = () => {
  const { stockData, loading, error, ticker, overviewData } = useStockStore();

  useEffect(() => {
    stockData;
  }, [ticker]);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (!stockData) return <div className="p-6 text-center text-gray-500">No data available.</div>;

  const sections = [
    [
      "📊 Overview",
      [
        ["Name", stockData.Name],
        ["Symbol", stockData.Symbol],
        ["Exchange", stockData.Exchange],
        [
          "Website",
          <a
            href={stockData.OfficialSite}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {new URL(stockData.OfficialSite).hostname}
          </a>,
        ],
      ],
    ],
    [
      "🏢 Company Details",
      [
        ["Sector", stockData.Sector],
        ["Industry", stockData.Industry],
        ["Country", stockData.Country],
      ],
    ],
    [
      "💵 Valuation & Fundamentals",
      [
        ["Market Cap", formatMarketCap(stockData.MarketCapitalization)],
        ["P/E Ratio", stockData.PERatio],
        ["PEG Ratio", stockData.PEGRatio],
        ["Price-to-Book", stockData.PriceToBookRatio],
        ["Price-to-Sales", stockData.PriceToSalesRatioTTM],
        ["Forward P/E", stockData.ForwardPE],
      ],
    ],
    [
      "📈 Performance & Profitability",
      [
        ["EPS (TTM)", `$${stockData.EPS}`],
        ["Profit Margin", formatPct(stockData.ProfitMargin)],
        ["Operating Margin", formatPct(stockData.OperatingMarginTTM)],
        ["ROA", formatPct(stockData.ReturnOnAssetsTTM)],
        ["ROE", formatPct(stockData.ReturnOnEquityTTM)],
      ],
    ],
    [
      "📈 Growth",
      [
        ["Revenue (TTM)", formatMarketCap(stockData.RevenueTTM)],
        ["Earnings Growth (YoY)", formatPct(stockData.QuarterlyEarningsGrowthYOY)],
        ["Revenue Growth (YoY)", formatPct(stockData.QuarterlyRevenueGrowthYOY)],
      ],
    ],
    [
      "📉 Stock Trend",
      [
        ["52-Week Range", `$${stockData["52WeekLow"]} – $${stockData["52WeekHigh"]}`],
        ["50-Day Avg", `$${stockData["50DayMovingAverage"]}`],
        ["200-Day Avg", `$${stockData["200DayMovingAverage"]}`],
        ["Beta", stockData.Beta],
      ],
    ],
    [
      "💰 Dividend Info",
      [
        ["Dividend/Share", `$${stockData.DividendPerShare}`],
        ["Dividend Yield", formatPct(stockData.DividendYield)],
        ["Ex-Dividend Date", stockData.ExDividendDate],
      ],
    ],
    [
      "📋 Analyst Insights",
      [
        ["Target Price", `$${stockData.AnalystTargetPrice}`],
        [
          "Ratings",
          `${Number(stockData.AnalystRatingStrongBuy) + Number(stockData.AnalystRatingBuy)} Buy/Strong Buy, ${stockData.AnalystRatingHold} Hold, ${Number(stockData.AnalystRatingSell) + Number(stockData.AnalystRatingStrongSell)} Sell`,
        ],
      ],
    ],
  ];

  return (
    <div className="p-6 mx-auto max-w-6xl">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">📘 Stock Overview</h2>
      <div className="rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
        <table className="w-full text-sm divide-y divide-gray-300 dark:divide-gray-700">
          <tbody>
            {sections.flatMap(([sectionTitle, rows], idx) => [
              // Section header row
              <tr key={`section-${idx}`} className="bg-blue-100 dark:bg-gray-800">
                <td
                  colSpan={2}
                  className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-100"
                >
                  {sectionTitle}
                </td>
              </tr>,
              // Section data rows
              ...rows.map(([label, value], rowIdx) => (
                <tr
                  key={`row-${idx}-${rowIdx}`}
                  className="even:bg-gray-100 dark:even:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{label}</td>
                  <td className="px-4 py-2 text-right text-gray-900 dark:text-white">{value}</td>
                </tr>
              )),
            ])}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOverviewCard;
