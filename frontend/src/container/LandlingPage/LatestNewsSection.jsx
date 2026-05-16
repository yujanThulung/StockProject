import React, { useEffect } from "react";
import useSentimentStore from "../../../store/sentimentStore";
import NewsCard from "../../components/common/NewsCard";
import { Loader2, Globe } from "lucide-react";
import { motion } from "framer-motion";

const LatestNewsSection = () => {
  const { latestNews, loading, fetchLatestNews } = useSentimentStore();

  useEffect(() => {
    fetchLatestNews();
  }, [fetchLatestNews]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-800">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Globe className="text-blue-500 w-8 h-8" />
            MARKET PULSE
          </h2>
          <p className="text-slate-400 mt-2 italic">Global headlines driving today's market movements.</p>
        </div>
        <button 
          onClick={() => fetchLatestNews()}
          className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-2 transition-colors"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          REFRESH FEED
        </button>
      </div>

      {loading && latestNews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500">Scanning global news outlets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.slice(0, 6).map((article, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <NewsCard article={article} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestNewsSection;
