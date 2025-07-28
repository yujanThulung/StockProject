import { useEffect, useState, useRef } from "react";
import useWatchlistStore from "../../../../store/watchlistStore";
import Clock from "../../clock";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiCircle,
  FiTrash2,
  FiClock,
  FiPlus,
  FiSearch,
  FiActivity,
  FiLoader,
  FiBarChart2,
  FiDollarSign,
  FiWifi,
  FiWifiOff,
  FiDatabase,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

export default function Watchlist() {
  const {
    watchlist,
    liveQuotes,
    addTicker,
    removeTicker,
    initSocket,
    fetchBatchHistory,
    historicalData,
    loading: historyLoading,
    error: historyError,
    socketInitialized,
    cleanup,
    loadWatchlistFromDB,
    watchlistLoading,
    fetchQuotesForWatchlist,
  } = useWatchlistStore();

  const [input, setInput] = useState("");
  const [addingTicker, setAddingTicker] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const initializeApp = async () => {
      await loadWatchlistFromDB();
      initSocket();
      await fetchQuotesForWatchlist();
    };
    initializeApp();
    return () => cleanup();
  }, []);

  useEffect(() => {
    if (watchlist.length > 0) {
      fetchBatchHistory(watchlist);
    }
  }, [watchlist.join(",")]);

  const handleAdd = async () => {
    const symbol = input.trim().toUpperCase();
    if (!symbol) return;

    if (watchlist.includes(symbol)) {
      toast.error("Symbol already exists in watchlist");
      return;
    }

    setAddingTicker(true);
    try {
      await addTicker(symbol);
      toast.success(`${symbol} added to watchlist`);
      setInput("");
      inputRef.current?.focus();
    } catch (error) {
      toast.error("Failed to add ticker.");
    } finally {
      setAddingTicker(false);
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await removeTicker(symbol);
      toast.success(`${symbol} removed from watchlist`);
    } catch (error) {
      toast.error("Failed to remove ticker.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "N/A";
    return parseFloat(price).toFixed(2);
  };

  const getTimeSinceUpdate = (quote) => {
    const lastUpdate = quote?.lastWebSocketUpdate || quote?.lastOHLCUpdate;
    if (!lastUpdate) return "Never updated";

    const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="p-4 max-w-full mx-auto bg-gray-50 rounded-lg shadow-sm">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiBarChart2 className="text-blue-500" />
          Live Watchlist
        </h2>
        <div className="flex items-center gap-2">
          <span className={`text-sm flex items-center gap-1 ${socketInitialized ? "text-green-600" : "text-red-600"}`}>
            {socketInitialized ? <FiWifi size={14} /> : <FiWifiOff size={14} />}
            {socketInitialized ? "Live" : "Offline"}
          </span>
          <FiCircle
            className={`text-xs ${socketInitialized ? "text-green-500 animate-pulse" : "text-red-600"}`}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter ticker (e.g. AAPL, MSFT)"
            className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={addingTicker}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={addingTicker || !input.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {addingTicker ? <FiLoader className="animate-spin" /> : <FiPlus />}
          Add
        </button>
      </div>

      <div className="text-xs text-gray-500 mb-4 p-3 bg-white rounded-lg border border-gray-200 flex flex-wrap gap-x-4 gap-y-1">
        <span className="flex items-center gap-1">
          <FiActivity />
          Status: {socketInitialized ? "Connected" : "Disconnected"}
        </span>
        <span>Tracking: {watchlist.length} symbols</span>
        <span>Live: {Object.values(liveQuotes).filter((q) => q?.livePrice !== undefined).length}</span>
        <Clock />
      </div>

      {watchlistLoading && (
        <div className="flex items-center justify-center py-8">
          <FiLoader className="animate-spin mr-2" />
          Loading watchlist...
        </div>
      )}

      <ul className="space-y-4">
        {watchlist.map((sym) => {
          const quote = liveQuotes[sym];
          if (!quote) {
            return (
              <li key={sym} className="p-4 rounded-lg border bg-gray-100 border-gray-300">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-xl text-gray-700">{sym}</div>
                  <button onClick={() => handleRemove(sym)} className="text-gray-500 hover:text-red-500">
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mt-2">
                  <FiLoader className="animate-spin" />
                  Loading data for {sym}...
                </div>
              </li>
            );
          }

          const livePrice = quote.livePrice;
          const open = quote.o;
          const close = quote.c;
          const high = quote.h;
          const low = quote.l;

          const displayPrice = livePrice !== undefined ? livePrice : close ?? open;
          const hasLiveData = livePrice !== undefined;

          const isUp = open !== undefined && displayPrice > open;
          const isDown = open !== undefined && displayPrice < open;

          const bgColor = isUp
            ? "bg-green-600 border-green-600"
            : isDown
            ? "bg-red-600 border-red-600"
            : "bg-blue-600 border-blue-600";

          const ArrowIcon = isUp ? FiTrendingUp : isDown ? FiTrendingDown : FiMinus;

          return (
            <li key={sym} className={`p-4 rounded-lg border text-white ${bgColor} transition-all`}>
              <div className="flex justify-between items-center mb-3">
                <div className="font-bold text-xl flex items-center gap-2">
                  {sym}
                  {hasLiveData && (
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full flex items-center gap-1">
                      <FiActivity size={10} />
                      LIVE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs flex items-center gap-1">
                    <FiClock size={12} />
                    {getTimeSinceUpdate(quote)}
                  </span>
                  <button onClick={() => handleRemove(sym)} className="hover:text-red-300">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-medium flex items-center gap-1">
                  <FiDollarSign size={14} />
                  {hasLiveData ? "Live Price" : "Latest Price"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">${formatPrice(displayPrice)}</span>
                  <ArrowIcon size={20} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="opacity-75">Open</span>
                  <span className="font-medium">${formatPrice(open)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-75">High</span>
                  <span className="font-medium">${formatPrice(high)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-75">Low</span>
                  <span className="font-medium">${formatPrice(low)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-75">Close</span>
                  <span className="font-medium">${formatPrice(close)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {watchlist.length === 0 && !watchlistLoading && (
        <div className="text-center py-8 text-gray-500">
          <FiDatabase className="mx-auto mb-2" size={48} />
          <p>No symbols in your watchlist</p>
          <p className="text-sm">Add a ticker symbol to get started</p>
        </div>
      )}
    </div>
  );
}
