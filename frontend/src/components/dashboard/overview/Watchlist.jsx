import { useEffect, useState, useRef } from "react";
import useWatchlistStore from "../../../../store/watchlistStore";
import Clock from "../../clock";
import {
  TrendingUp, TrendingDown, Minus, Trash2,
  Plus, Search, Wifi, WifiOff, Activity, Loader2,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../../common/Loader";
import EmptyState from "../../common/EmptyState";
import { FiDatabase } from "react-icons/fi";

const formatPrice = (price) =>
  price === undefined || price === null ? "—" : parseFloat(price).toFixed(2);

const timeSince = (quote) => {
  const lastUpdate = quote?.lastWebSocketUpdate || quote?.lastOHLCUpdate;
  if (!lastUpdate) return null;
  const s = Math.floor((Date.now() - lastUpdate) / 1000);
  if (s < 5)  return "Just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
};

// ─── Single ticker card ───────────────────────────────────────────────────────
const TickerCard = ({ sym, quote, onRemove }) => {
  if (!quote) {
    return (
      <li className="p-4 rounded-lg border bg-gray-100 border-gray-300">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xl text-gray-700">{sym}</div>
          <button onClick={() => onRemove(sym)} className="text-gray-500 hover:text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-gray-500 mt-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading data for {sym}...
        </div>
      </li>
    );
  }

  const livePrice    = quote.livePrice;
  const open         = quote.o;
  const close        = quote.c;
  const high         = quote.h;
  const low          = quote.l;
  const displayPrice = livePrice !== undefined ? livePrice : close ?? open;
  const hasLive      = livePrice !== undefined;
  const isUp         = open !== undefined && displayPrice > open;
  const isDown       = open !== undefined && displayPrice < open;
  const updated      = timeSince(quote);

  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const bgColor   = isUp
    ? "bg-green-600 border-green-600"
    : isDown
    ? "bg-red-600 border-red-600"
    : "bg-blue-600 border-blue-600";

  return (
    <li className={`p-4 rounded-lg border text-white ${bgColor} transition-all`}>
      <div className="flex justify-between items-center mb-3">
        <div className="font-bold text-xl flex items-center gap-2">
          {sym}
          {hasLive && (
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full flex items-center gap-1">
              <Activity className="w-2.5 h-2.5" />
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {updated && (
            <span className="text-xs opacity-80">{updated}</span>
          )}
          <button onClick={() => onRemove(sym)} className="hover:text-red-300 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium opacity-90">
          {hasLive ? "Live Price" : "Latest Price"}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">${formatPrice(displayPrice)}</span>
          <TrendIcon className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 text-sm">
        {[["Open", open], ["High", high], ["Low", low], ["Close", close]].map(([label, val]) => (
          <div key={label} className="flex flex-col">
            <span className="opacity-75">{label}</span>
            <span className="font-medium">${formatPrice(val)}</span>
          </div>
        ))}
      </div>
    </li>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function Watchlist() {
  const {
    watchlist,
    liveQuotes,
    addTicker,
    removeTicker,
    initSocket,
    fetchBatchHistory,
    socketInitialized,
    cleanup,
    loadWatchlistFromDB,
    watchlistLoading,
    fetchQuotesForWatchlist,
  } = useWatchlistStore();

  const [input, setInput]           = useState("");
  const [addingTicker, setAdding]   = useState(false);
  const inputRef                    = useRef(null);

  useEffect(() => {
    const init = async () => {
      await loadWatchlistFromDB();
      initSocket();
      await fetchQuotesForWatchlist();
    };
    init();
    return () => cleanup();
  }, []);

  useEffect(() => {
    if (watchlist.length > 0) fetchBatchHistory(watchlist);
  }, [watchlist.join(",")]);

  const handleAdd = async () => {
    const symbol = input.trim().toUpperCase();
    if (!symbol) return;
    if (watchlist.includes(symbol)) { toast.error("Already in watchlist"); return; }
    setAdding(true);
    try {
      await addTicker(symbol);
      toast.success(`${symbol} added`);
      setInput("");
      inputRef.current?.focus();
    } catch { toast.error("Failed to add ticker."); }
    finally { setAdding(false); }
  };

  const handleRemove = async (symbol) => {
    try {
      await removeTicker(symbol);
      toast.success(`${symbol} removed`);
    } catch { toast.error("Failed to remove ticker."); }
  };

  const liveCount = Object.values(liveQuotes).filter((q) => q?.livePrice !== undefined).length;

  return (
    <div className="w-full p-4 space-y-4">
      <Toaster position="top-right" />

      {/* Header card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-bold text-gray-900">Watchlist</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {watchlist.length} symbol{watchlist.length !== 1 ? "s" : ""} · {liveCount} live
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {socketInitialized
              ? <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              : <WifiOff className="w-3.5 h-3.5 text-red-400" />}
            <span className={`text-xs font-medium ${socketInitialized ? "text-emerald-600" : "text-red-500"}`}>
              {socketInitialized ? "Live" : "Offline"}
            </span>
            <span className="text-xs text-gray-400 ml-2">
              <Clock />
            </span>
          </div>
        </div>

        {/* Add input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Add ticker (e.g. AAPL)"
              disabled={addingTicker}
              className="w-full border border-gray-200 rounded-lg py-2 pl-8 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={addingTicker || !input.trim()}
            className="flex items-center gap-1.5 bg-blue-950 hover:bg-blue-900 disabled:opacity-40 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {addingTicker
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Plus className="w-3.5 h-3.5" />}
            Add
          </button>
        </div>
      </div>

      {/* Ticker list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Tracked Symbols
        </p>

        {watchlistLoading ? (
          <Loader text="Loading watchlist..." />
        ) : watchlist.length === 0 ? (
          <EmptyState
            icon={FiDatabase}
            title="No symbols yet"
            description="Add a ticker above to start tracking prices."
          />
        ) : (
          <ul className="space-y-3">
            {watchlist.map((sym) => (
              <TickerCard
                key={sym}
                sym={sym}
                quote={liveQuotes[sym]}
                onRemove={handleRemove}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
