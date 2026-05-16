import React from "react";

const NewsCard = ({ article }) => {
  const {
    headline,
    summary,
    source,
    url,
    image,
    datetime,
    sentiment,
    confidence
  } = article;

  const formattedDate = datetime 
    ? new Date(datetime * 1000).toLocaleDateString() 
    : "Recently";

  const sentimentColor = sentiment === "positive" 
    ? "text-green-400 bg-green-500/10" 
    : sentiment === "negative" 
    ? "text-red-400 bg-red-500/10" 
    : "text-blue-400 bg-blue-500/10";

  return (
    <div className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col h-full shadow-lg hover:shadow-blue-500/10">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={headline} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-500 italic">
            No Image Available
          </div>
        )}
        {sentiment && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 ${sentimentColor}`}>
            {sentiment.toUpperCase()} {confidence && `(${(confidence * 100).toFixed(0)}%)`}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">{source}</span>
          <span className="text-xs text-slate-500">{formattedDate}</span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
          {headline}
        </h3>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
          {summary || "No summary provided for this article."}
        </p>

        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors justify-center"
        >
          Read Full Article
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
