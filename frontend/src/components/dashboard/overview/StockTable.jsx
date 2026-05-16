import { useEffect } from "react";
import usePricePredictionStore from "../../../../store/usePricePrediction.store";
import Loader from "../../common/Loader.jsx";
import { ExternalLink } from "lucide-react";

const fmtCap = (cap) => {
  const n = Number(cap);
  if (!n) return "N/A";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toFixed(2)}`;
};

const fmtPct = (val) => {
  const n = Number(val);
  if (isNaN(n)) return "N/A";
  return `${(n * 100).toFixed(1)}%`;
};

const sections = (d) => [
  {
    title: "Overview",
    rows: [
      ["Name",     d.Name],
      ["Symbol",   d.Symbol],
      ["Exchange", d.Exchange],
      ["Website",  d.OfficialSite
        ? <a href={d.OfficialSite} target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-1 text-blue-600 hover:underline">
            {new URL(d.OfficialSite).hostname}
            <ExternalLink className="w-3 h-3" />
          </a>
        : "N/A"],
    ],
  },
  {
    title: "Company Details",
    rows: [
      ["Sector",   d.Sector],
      ["Industry", d.Industry],
      ["Country",  d.Country],
    ],
  },
  {
    title: "Valuation & Fundamentals",
    rows: [
      ["Market Cap",       fmtCap(d.MarketCapitalization)],
      ["P/E Ratio",        d.PERatio],
      ["PEG Ratio",        d.PEGRatio],
      ["Price-to-Book",    d.PriceToBookRatio],
      ["Price-to-Sales",   d.PriceToSalesRatioTTM],
      ["Forward P/E",      d.ForwardPE],
    ],
  },
  {
    title: "Performance & Profitability",
    rows: [
      ["EPS (TTM)",         d.EPS],
      ["Profit Margin",     fmtPct(d.ProfitMargin)],
      ["Operating Margin",  fmtPct(d.OperatingMarginTTM)],
      ["ROA",               fmtPct(d.ReturnOnAssetsTTM)],
      ["ROE",               fmtPct(d.ReturnOnEquityTTM)],
    ],
  },
  {
    title: "Growth",
    rows: [
      ["Revenue (TTM)",           fmtCap(d.RevenueTTM)],
      ["Earnings Growth (YoY)",   fmtPct(d.QuarterlyEarningsGrowthYOY)],
      ["Revenue Growth (YoY)",    fmtPct(d.QuarterlyRevenueGrowthYOY)],
    ],
  },
  {
    title: "Stock Trend",
    rows: [
      ["52-Week Range",  `${d["52WeekLow"]} – ${d["52WeekHigh"]}`],
      ["50-Day Avg",     d["50DayMovingAverage"]],
      ["200-Day Avg",    d["200DayMovingAverage"]],
      ["Beta",           d.Beta],
    ],
  },
  {
    title: "Dividend Info",
    rows: [
      ["Dividend / Share",  d.DividendPerShare],
      ["Dividend Yield",    fmtPct(d.DividendYield)],
      ["Ex-Dividend Date",  d.ExDividendDate],
    ],
  },
  {
    title: "Analyst Insights",
    rows: [
      ["Target Price", d.AnalystTargetPrice ? `$${d.AnalystTargetPrice}` : "N/A"],
      ["Ratings",
        `${Number(d.AnalystRatingStrongBuy) + Number(d.AnalystRatingBuy)} Buy / ${d.AnalystRatingHold} Hold / ${Number(d.AnalystRatingSell) + Number(d.AnalystRatingStrongSell)} Sell`
      ],
    ],
  },
];

const StockTable = () => {
  const { stockData, loading, error, ticker, fetchOverviewData } = usePricePredictionStore();

  useEffect(() => {
    if (ticker) fetchOverviewData(ticker);
  }, [ticker]);

  if (loading) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <Loader text="Loading fundamentals..." />
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <p className="text-sm text-red-500">Failed to load data: {error}</p>
    </div>
  );

  if (!stockData) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <p className="text-sm text-gray-400">Select a ticker above to view fundamentals.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {sections(stockData).flatMap(({ title, rows }, si) => [
            /* Section header */
            <tr key={`s-${si}`} className="bg-gray-50 border-t border-gray-100 first:border-t-0">
              <td
                colSpan={2}
                className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                {title}
              </td>
            </tr>,
            /* Data rows */
            ...rows.map(([label, value], ri) => (
              <tr
                key={`r-${si}-${ri}`}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-2.5 text-gray-500 w-1/2">{label}</td>
                <td className="px-5 py-2.5 text-right font-medium text-gray-800">
                  {value ?? "N/A"}
                </td>
              </tr>
            )),
          ])}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
