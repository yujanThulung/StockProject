import { useEffect } from "react";
import { ExternalLink, RefreshCw, Newspaper } from "lucide-react";
import useSentimentStore from "../../../store/sentimentStore";
import Loader from "../../components/common/Loader";

const sentimentStyles = {
  positive: "text-emerald-600 bg-emerald-50 border-emerald-200",
  negative: "text-red-600 bg-red-50 border-red-200",
  neutral: "text-blue-600 bg-blue-50 border-blue-200",
};

const NewsRow = ({ article, index }) => {
  const { headline, summary, source, url, image, datetime, sentiment } = article;

  const date = datetime
    ? new Date(datetime * 1000).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    })
    : "Recently";

  const badgeClass = sentimentStyles[sentiment] ?? sentimentStyles.neutral;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 py-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/40 px-4 rounded-xl transition-colors"
    >
      {/* Index number */}
      <span className="text-2xl font-black text-slate-700 w-8 flex-shrink-0 leading-none mt-1">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Thumbnail */}
      {image ? (
        <img
          src={image}
          alt=""
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-slate-800"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-slate-800 flex-shrink-0 flex items-center justify-center">
          <Newspaper className="w-5 h-5 text-slate-600" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{source}</span>
          <span className="text-slate-700 text-xs">·</span>
          <span className="text-xs text-slate-500">{date}</span>
          {sentiment && (
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${badgeClass}`}>
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
          {headline}
        </p>
        {summary && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{summary}</p>
        )}
      </div>

      <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-1 transition-colors" />
    </a>
  );
};

const LatestNewsSection = () => {
  const { latestNews, newsLoading: loading, fetchLatestNews } = useSentimentStore();

  useEffect(() => {
    fetchLatestNews();
  }, [fetchLatestNews]);

  return (
    <section className="bg-slate-900 py-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Newspaper className="w-4 h-4" />
            Latest Headlines
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Market News</h2>
          <p className="text-slate-500 text-sm mt-2">Global headlines driving today's market movements</p>
        </div>

        {/* News list */}
        <div className="bg-slate-800/30 rounded-2xl border border-slate-800 overflow-hidden">
          {/* List header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {latestNews.length > 0 ? `${Math.min(latestNews.length, 8)} articles` : "News feed"}
            </span>
            <button
              onClick={fetchLatestNews}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {loading && latestNews.length === 0 ? (
            <div className="py-16">
              <Loader text="Loading news..." />
            </div>
          ) : latestNews.length === 0 ? (
            <div className="py-16 text-center">
              <Newspaper className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No articles available</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/0">
              {latestNews.slice(0, 8).map((article, i) => (
                <NewsRow key={i} article={article} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestNewsSection;
