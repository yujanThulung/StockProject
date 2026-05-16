import { ExternalLink } from "lucide-react";

const sentimentStyles = {
  positive: "text-emerald-700 bg-emerald-50 border-emerald-200",
  negative: "text-red-700 bg-red-50 border-red-200",
  neutral:  "text-blue-700 bg-blue-50 border-blue-200",
};

const NewsCard = ({ article }) => {
  const { headline, summary, source, url, image, datetime, sentiment, confidence } = article;

  const date = datetime
    ? new Date(datetime * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recently";

  const badgeClass = sentimentStyles[sentiment] ?? sentimentStyles.neutral;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
    >
      {/* Thumbnail */}
      {image ? (
        <img
          src={image}
          alt=""
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0" />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide truncate">
            {source}
          </span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400 flex-shrink-0">{date}</span>
          {sentiment && (
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border flex-shrink-0 ${badgeClass}`}>
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
              {confidence ? ` ${(confidence * 100).toFixed(0)}%` : ""}
            </span>
          )}
        </div>

        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
          {headline}
        </p>

        {summary && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{summary}</p>
        )}
      </div>

      {/* Link icon */}
      <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-colors" />
    </a>
  );
};

export default NewsCard;
