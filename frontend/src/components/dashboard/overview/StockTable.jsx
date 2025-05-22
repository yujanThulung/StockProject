

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
        stockData
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
        <div className=" mx-auto p-6 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {sections.map(([sectionTitle, rows], idx) => (
                    <div
                        key={idx}
                        className="rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900"
                    >
                        <h2 className="text-base font-semibold px-4 py-2 border-b border-gray-300 dark:border-gray-700 bg-blue-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                            {sectionTitle}
                        </h2>
                        <table className="w-full text-sm">
                            <tbody>
                                {rows.map(([label, value], rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="even:bg-gray-200 dark:even:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                                            {label}
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                                            {value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockOverviewCard;
