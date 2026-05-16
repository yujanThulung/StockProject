import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

const StockRow = ({ stock, type }) => {
  const isGainer = type === "gainer";
  const change   = stock.changesPercentage ?? stock.change ?? 0;
  const price    = stock.price ?? 0;

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0
          ${isGainer ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
          {stock.symbol}
        </span>
        <span className="text-xs text-slate-400 truncate">{stock.name}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <span className="text-xs font-semibold text-slate-300">
          ${Number(price).toFixed(2)}
        </span>
        <span className={`text-xs font-bold w-16 text-right
          ${isGainer ? "text-emerald-400" : "text-red-400"}`}>
          {change > 0 ? "+" : ""}{Number(change).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

const ColumnSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-5 w-12 bg-slate-700 rounded" />
          <div className="h-3 w-28 bg-slate-800 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-3 w-14 bg-slate-800 rounded" />
          <div className="h-3 w-12 bg-slate-800 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const StockTicker = () => {
  const [gainers, setGainers] = useState([]);
  const [losers,  setLosers]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [gRes, lRes] = await Promise.all([
          axios.get(`${API_BASE}/public/top-gainers`),
          axios.get(`${API_BASE}/public/top-losers`),
        ]);
        setGainers(gRes.data.slice(0, 5));
        setLosers(lRes.data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch market movers:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <section className="bg-slate-900 py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Market Movers
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Today's Top Gainers &amp; Losers
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Snapshot of the biggest movers in today's session
          </p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gainers */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Top Gainers</h3>
            </div>
            {loading ? <ColumnSkeleton /> : gainers.map((s, i) => (
              <StockRow key={i} stock={s} type="gainer" />
            ))}
          </div>

          {/* Losers */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-white">Top Losers</h3>
            </div>
            {loading ? <ColumnSkeleton /> : losers.map((s, i) => (
              <StockRow key={i} stock={s} type="loser" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StockTicker;
