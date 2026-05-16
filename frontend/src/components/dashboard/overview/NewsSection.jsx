import { useEffect, useState } from "react";
import { Newspaper, RefreshCw } from "lucide-react";
import useSentimentStore from "../../../../store/sentimentStore";
import usePricePredictionStore from "../../../../store/usePricePrediction.store";
import NewsCard from "../../common/NewsCard";
import Loader from "../../common/Loader";

const NewsSection = () => {
  const ticker = usePricePredictionStore((s) => s.ticker);
  const { latestNews, tickerNews, loading, fetchLatestNews, fetchTickerNews } = useSentimentStore();
  const [activeTab, setActiveTab] = useState("ticker");

  useEffect(() => {
    fetchLatestNews();
  }, [fetchLatestNews]);

  useEffect(() => {
    if (ticker) fetchTickerNews(ticker);
  }, [ticker, fetchTickerNews]);

  const tabs = [
    { id: "ticker",  label: ticker ? `${ticker} News` : "Ticker News" },
    { id: "latest",  label: "Latest News" },
  ];

  const articles = activeTab === "ticker" ? tickerNews : latestNews;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Newspaper className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-800">Market News</h2>
        </div>
        <button
          onClick={() => activeTab === "ticker" ? fetchTickerNews(ticker) : fetchLatestNews()}
          disabled={loading}
          className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors
              ${activeTab === tab.id
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <Loader size="sm" text="Loading news..." />
      ) : articles.length === 0 ? (
        <div className="py-8 text-center">
          <Newspaper className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-xs text-gray-400">
            {activeTab === "ticker" && !ticker
              ? "Select a ticker to see related news"
              : "No articles found"}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
          {articles.slice(0, 10).map((article, i) => (
            <NewsCard key={i} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;
