import { useEffect } from "react";
import usePricePredictionStore from "../../../../store/usePricePrediction.store";
import Loader from "../../common/Loader.jsx";

const formatMarketCap = (cap) => {
  const n = Number(cap);
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `${(n / 1e6).toFixed(2)}M`;
  return `${n.toFixed(2)}`;
};

const formatPct = (val) => `${(Number(val) * 100).toFixed(1)}%`;

const sections = (d) => [
  [
    "Overview",
    [
      ["Name", d.Name],
      ["Symbol", d.Symbol],
      ["Exchange", d.Exchange],
      [
        "Website",
        d.OfficialSite ? (
          <a href={d.OfficialSite} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
            {new URL(d.OfficialSite).hostname}
          </a>
        ) : "N/A",
      ],
    ],
  ],
  [
    "Company Details",
    [
      ["Sector", d.Sector],
      ["Industry", d.Industry],
      ["Country", d.Country],
    ],
  ],
  [
    "Valuation & Fundamentals",
    [
      ["Market Cap", formatMarketCap(d.MarketCapitalization)],
      ["P/E Ratio", d.PERatio],
      ["PEG Ratio", d.PEGRatio],
      ["Price-to-Book", d.PriceToBookRatio],
      ["Price-to-Sales", d.PriceToSalesRatioTTM],
      ["Forward P/E", d.ForwardPE],
    ],
  ],
  [
    "Performance & Profitability",
    [
      ["EPS (TTM)", d.EPS],
      ["Profit Margin", formatPct(d.ProfitMargin)],
      ["Operating Margin", formatPct(d.OperatingMarginTTM)],
      ["ROA", formatPct(d.ReturnOnAssetsTTM)],
      ["ROE", formatPct(d.ReturnOnEquityTTM)],
    ],
  ],
  [
    "Growth",
    [
      ["Revenue (TTM)", formatMarketCap(d.RevenueTTM)],
      ["Earnings Growth (YoY)", formatPct(d.QuarterlyEarningsGrowthYOY)],
      ["Revenue Growth (YoY)", formatPct(d.QuarterlyRevenueGrowthYOY)],
    ],
  ],
  [
    "Stock Trend",
    [
      ["52-Week Range", `${d["52WeekLow"]} – ${d["52WeekHigh"]}`],
      ["50-Day Avg", d["50DayMovingAverage"]],
      ["200-Day Avg", d["200DayMovingAverage"]],
      ["Beta", d.Beta],
    ],
  ],
  [
    "Dividend Info",
    [
      ["Dividend/Share", d.DividendPerShare],
      ["Dividend Yield", formatPct(d.DividendYield)],
      ["Ex-Dividend Date", d.ExDividendDate],
    ],
  ],
  [
    "Analyst Insights",
    [
      ["Target Price", d.AnalystTargetPrice],
      [
        "Ratings",
        `${Number(d.AnalystRatingStrongBuy) + Number(d.AnalystRatingBuy)} Buy/Strong Buy, ${d.AnalystRatingHold} Hold, ${Number(d.AnalystRatingSell) + Number(d.AnalystRatingStrongSell)} Sell`,
      ],
    ],
  ],
];

const StockOverviewCard = () => {
  const { stockData, loading, error, ticker, fetchOverviewData } = usePricePredictionStore();

  useEffect(() => {
    if (ticker) fetchOverviewData(ticker);
  }, [ticker]);

  if (loading) return <Loader text="Loading fundamentals..." />;
  if (error)   return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (!stockData) return <div className="p-6 text-center text-gray-500">No data available.</div>;

  return (
    <div className="p-6 mx-auto max-w-6xl">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Stock Overview</h2>
      <div className="rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
        <table className="w-full text-sm divide-y divide-gray-300 dark:divide-gray-700">
          <tbody>
            {sections(stockData).flatMap(([sectionTitle, rows], idx) => [
              <tr key={`section-${idx}`} className="bg-blue-100 dark:bg-gray-800">
                <td colSpan={2} className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-100">
                  {sectionTitle}
                </td>
              </tr>,
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
