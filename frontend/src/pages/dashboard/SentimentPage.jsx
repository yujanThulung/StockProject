import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Brain,
  BarChart2,
  Activity,
  AlertCircle,
  Loader2,
  Info,
  RefreshCw,
} from "lucide-react";
import useSentimentStore from "../../../store/sentimentStore";
import usePricePredictionStore from "../../../store/usePricePrediction.store";
import SentimentGauge from "../../components/dashboard/SentimentGauge";
import Loader from "../../components/common/Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

const QUICK = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMZN", "META"];

const pct = (a, b) => (b != null && a != null && a !== 0 ? ((b - a) / a) * 100 : null);
const fmtUSD = (n) => (n != null ? `$${n.toFixed(2)}` : "—");

// ─── Search bar ───────────────────────────────────────────────────────────────
const SearchBar = ({ onSearch, loading, activeTicker }) => {
  const [val, setVal] = useState(activeTicker || "");

  useEffect(() => { if (activeTicker) setVal(activeTicker); }, [activeTicker]);

  const submit = (e) => {
    e.preventDefault();
    const t = val.trim().toUpperCase();
    if (t) onSearch(t);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            AI Insights
            {activeTicker && <span className="ml-2 text-blue-600">— {activeTicker}</span>}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            LSTM price prediction · SVM sentiment analysis
          </p>
        </div>

        <form onSubmit={submit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="Ticker (e.g. AAPL)"
              className="w-full border border-gray-200 rounded-lg py-2 pl-8 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !val.trim()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            {loading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              :""}
            Run
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400 mr-1">Quick pick:</span>
        {QUICK.map((t) => (
          <button
            key={t}
            onClick={() => { setVal(t); onSearch(t); }}
            className={`px-2.5 py-0.5 text-xs font-medium rounded border transition-colors
              ${activeTicker === t
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
              }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Insight strip ────────────────────────────────────────────────────────────
const InsightStrip = ({ sentimentResult, modelData }) => {
  if (!sentimentResult || !modelData) return null;

  const sentiment    = sentimentResult.summary.sentiment;
  const todayActual  = modelData.test_prices?.at(-1);
  const tomorrowPred = modelData.predicted_prices?.at(-1);
  const priceUp      = tomorrowPred > todayActual;

  const aligned     = (sentiment === "Bullish" && priceUp) || (sentiment === "Bearish" && !priceUp);
  const conflicting = (sentiment === "Bullish" && !priceUp) || (sentiment === "Bearish" && priceUp);

  const cfg = aligned
    ? { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", Icon: TrendingUp, iconCls: "text-emerald-500",
        msg: `Both models agree — ${sentiment} sentiment aligns with the LSTM's ${priceUp ? "upward" : "downward"} forecast.` }
    : conflicting
    ? { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", Icon: AlertCircle, iconCls: "text-amber-500",
        msg: `Mixed signals — ${sentiment} sentiment conflicts with the LSTM's ${priceUp ? "upward" : "downward"} forecast. Proceed with caution.` }
    : { bg: "bg-gray-50 border-gray-200", text: "text-gray-600", Icon: Activity, iconCls: "text-gray-400",
        msg: `Neutral sentiment. LSTM projects a ${priceUp ? "slight gain" : "slight decline"}. Monitor for stronger signals.` };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${cfg.bg}`}
    >
      <cfg.Icon className={`w-4 h-4 flex-shrink-0 ${cfg.iconCls}`} />
      <span className={`font-medium ${cfg.text}`}>
        <span className="font-semibold">{sentimentResult.ticker} · </span>
        {cfg.msg}
      </span>
    </motion.div>
  );
};

// ─── LSTM Chart ───────────────────────────────────────────────────────────────
const PriceChart = ({ data, ticker }) => {
  const chartRef = useRef(null);

  const shifted   = [null, ...data.predicted_prices.slice(0, -1)];
  const allLabels = [...data.train_dates, ...data.test_dates, data.predicted_dates.at(-1)];
  const allTrain  = [...data.train_prices, ...Array(data.test_prices.length + 1).fill(null)];
  const allTest   = [...Array(data.train_prices.length).fill(null), ...data.test_prices, null];
  const allPred   = [...Array(data.train_prices.length).fill(null), ...shifted];
  const start     = Math.max(0, allLabels.length - 30);

  const chartData = {
    labels: allLabels.slice(start),
    datasets: [
      { label: "Actual (train)", data: allTrain.slice(start), borderColor: "#10B981", borderWidth: 1.5, tension: 0.1, pointRadius: 0 },
      { label: "Actual (test)",  data: allTest.slice(start),  borderColor: "#3B82F6", borderWidth: 2,   tension: 0.1, pointRadius: 0 },
      { label: "Predicted",      data: allPred.slice(start),  borderColor: "#EF4444", borderWidth: 2,   borderDash: [4, 4], tension: 0.1, pointRadius: 0 },
    ],
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">{ticker} — LSTM Price Prediction</p>
          <p className="text-xs text-gray-400">Last 30 trading days · scroll to zoom</p>
        </div>
        <button
          onClick={() => chartRef.current?.resetZoom()}
          className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset zoom
        </button>
      </div>
      <div className="relative h-72">
        <Line
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top", labels: { usePointStyle: true, pointStyleWidth: 8, padding: 16, font: { size: 11 } } },
              tooltip: { mode: "index", intersect: false },
              zoom: {
                zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" },
                pan:  { enabled: true, mode: "x" },
              },
            },
            scales: {
              x: { ticks: { maxRotation: 0, font: { size: 10 }, maxTicksLimit: 8 }, grid: { display: false } },
              y: { ticks: { font: { size: 10 } }, grid: { color: "#f3f4f6" } },
            },
            interaction: { intersect: false, mode: "nearest" },
          }}
        />
      </div>
    </div>
  );
};

// ─── Sentiment column ─────────────────────────────────────────────────────────
const SentimentColumn = ({ result, loading, error }) => {
  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <Loader text="Analyzing sentiment..." />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <AlertCircle className="w-6 h-6 text-red-400" />
      <p className="text-xs text-red-500">{error}</p>
    </div>
  );

  if (!result) return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
        <Brain className="w-5 h-5 text-blue-500" />
      </div>
      <p className="text-xs font-medium text-gray-600">SVM Sentiment Model</p>
      <p className="text-xs text-gray-400 max-w-[180px]">
        Classifies news headlines as Bullish, Neutral, or Bearish.
      </p>
    </div>
  );

  const { summary } = result;
  const total   = summary.total_analyzed || 1;
  const bullPct = Math.round((summary.distribution.bullish / total) * 100);
  const neuPct  = Math.round((summary.distribution.neutral  / total) * 100);
  const bearPct = Math.round((summary.distribution.bearish  / total) * 100);
  const confPct = summary.confidence * 100;

  const badge =
    summary.sentiment === "Bullish" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
    summary.sentiment === "Bearish" ? "text-red-700 bg-red-50 border-red-200" :
                                      "text-amber-700 bg-amber-50 border-amber-200";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-800">SVM Sentiment</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${badge}`}>
          {summary.sentiment}
        </span>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-[220px]">
          <SentimentGauge score={summary.index} label={summary.sentiment} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Distribution</p>
        <DistRow label="Bullish" p={bullPct} bar="bg-emerald-500" txt="text-emerald-600" />
        <DistRow label="Neutral" p={neuPct}  bar="bg-amber-400"  txt="text-amber-600"  />
        <DistRow label="Bearish" p={bearPct} bar="bg-red-500"    txt="text-red-600"    />
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Confidence</span>
          <span className="font-medium text-gray-600">{confPct.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confPct}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1 border-t border-gray-100">
        <Info className="w-3 h-3" />
        {summary.total_analyzed} articles analyzed
      </div>
    </div>
  );
};

// ─── Stats strip ──────────────────────────────────────────────────────────────
const StatCell = ({ label, value, sub, valueColor, subColor }) => (
  <div>
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className={`text-sm font-bold text-gray-900 ${valueColor || ""}`}>{value}</p>
    {sub && <p className={`text-xs mt-0.5 ${subColor || "text-gray-400"}`}>{sub}</p>}
  </div>
);

const StatsStrip = ({ modelData }) => {
  if (!modelData) return null;

  const testPrices = modelData.test_prices      || [];
  const predPrices = modelData.predicted_prices || [];
  const testDates  = modelData.test_dates       || [];
  const predDates  = modelData.predicted_dates  || [];
  const metrics    = modelData.metrics          || {};

  const todayActual    = testPrices.at(-1);
  const todayPredicted = predPrices.at(-2);
  const tomorrowPred   = predPrices.at(-1);
  const todayDate      = testDates.at(-1);
  const tomorrowDate   = predDates.at(-1);

  const predErr     = pct(todayActual, todayPredicted);
  const tomorrowChg = pct(todayActual, tomorrowPred);
  const trendUp     = tomorrowChg !== null && tomorrowChg >= 0;

  const r2   = metrics.r2   ?? null;
  const mae  = metrics.mae  ?? null;
  const rmse = metrics.rmse ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {/* Price forecast */}
      <div className="sm:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Price Forecast
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
          <StatCell
            label="Today Actual"
            value={fmtUSD(todayActual)}
            sub={todayDate}
          />
          <StatCell
            label="Today Predicted"
            value={fmtUSD(todayPredicted)}
            sub={predErr !== null ? `${predErr > 0 ? "+" : ""}${predErr.toFixed(2)}% error` : undefined}
            subColor={
              predErr !== null
                ? Math.abs(predErr) < 2 ? "text-emerald-600"
                : Math.abs(predErr) < 5 ? "text-amber-600"
                : "text-red-600"
                : ""
            }
          />
          <StatCell
            label="Tomorrow Forecast"
            value={fmtUSD(tomorrowPred)}
            sub={tomorrowDate}
            valueColor={tomorrowChg !== null ? (trendUp ? "text-emerald-600" : "text-red-600") : ""}
          />
          <StatCell
            label="Expected Change"
            value={tomorrowChg !== null ? `${tomorrowChg > 0 ? "+" : ""}${tomorrowChg.toFixed(2)}%` : "—"}
            sub={tomorrowChg !== null ? (trendUp ? "↑ Upward" : "↓ Downward") : undefined}
            valueColor={tomorrowChg !== null ? (trendUp ? "text-emerald-600" : "text-red-600") : ""}
            subColor={tomorrowChg !== null ? (trendUp ? "text-emerald-500" : "text-red-500") : ""}
          />
        </div>
      </div>

      {/* Model metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Model Metrics
        </p>
        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          <StatCell
            label="R² Score"
            value={r2 != null ? r2.toFixed(4) : "—"}
            sub={r2 != null ? (r2 > 0.8 ? "Good fit" : r2 > 0.5 ? "Moderate" : "Weak") : undefined}
            subColor={r2 != null ? (r2 > 0.8 ? "text-emerald-600" : "text-amber-600") : ""}
          />
          <StatCell
            label="MAE"
            value={mae != null ? `$${mae.toFixed(2)}` : "—"}
            sub="Mean abs. error"
          />
          <StatCell
            label="RMSE"
            value={rmse != null ? `$${rmse.toFixed(2)}` : "—"}
            sub="Root mean sq."
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Micro helpers ────────────────────────────────────────────────────────────
const DistRow = ({ label, p, bar, txt }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-400 w-12 flex-shrink-0">{label}</span>
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${p}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full ${bar} rounded-full`}
      />
    </div>
    <span className={`text-xs font-medium w-8 text-right ${txt}`}>{p}%</span>
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center gap-4 text-center">
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
        <Brain className="w-4 h-4 text-blue-500" />
      </div>
      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
        <BarChart2 className="w-4 h-4 text-indigo-500" />
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-700">Two models, one view</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs">
        Enter a ticker above to run the LSTM price predictor and SVM sentiment classifier simultaneously.
      </p>
    </div>
    <p className="text-xs text-gray-400 flex items-center gap-1">
      <Info className="w-3 h-3" /> Try AAPL, TSLA, or NVDA
    </p>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const {
    sentimentResult,
    loading: sLoading,
    error: sError,
    analyzeSentiment,
    clearTickerData,
  } = useSentimentStore();

  const {
    ticker: storeTicker,
    modelData,
    loading: pLoading,
    error: pError,
    setTicker,
    fetchModelData,
  } = usePricePredictionStore();

  const [activeTicker, setActiveTicker] = useState(storeTicker || "");

  const handleSearch = (t) => {
    setActiveTicker(t);
    analyzeSentiment(t);
    setTicker(t);
    fetchModelData(t);
  };

  // Auto-run on mount using the persisted ticker from the store (same as Financial page)
  useEffect(() => {
    if (storeTicker && !sentimentResult && !modelData && !sLoading && !pLoading) {
      setActiveTicker(storeTicker);
      analyzeSentiment(storeTicker);
      fetchModelData(storeTicker);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTickerData(), [clearTickerData]);

  const anyLoading = sLoading || pLoading;
  const hasData    = sentimentResult || modelData;

  return (
    <div className="w-full space-y-4 p-4">
      <SearchBar onSearch={handleSearch} loading={anyLoading} activeTicker={activeTicker} />

      <AnimatePresence>
        {sentimentResult && modelData && (
          <InsightStrip sentimentResult={sentimentResult} modelData={modelData} />
        )}
      </AnimatePresence>

      {!hasData && !anyLoading ? (
        <EmptyState />
      ) : (
        <>
          {/* Chart + Sentiment */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              {pLoading ? (
                <div className="flex items-center justify-center h-72">
                  <Loader text="Running LSTM model..." />
                </div>
              ) : pError ? (
                <div className="flex flex-col items-center justify-center gap-2 h-72 text-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <p className="text-sm font-medium text-gray-700">Price prediction unavailable</p>
                  <p className="text-xs text-red-500 max-w-xs">{pError}</p>
                </div>
              ) : modelData ? (
                <PriceChart data={modelData} ticker={activeTicker || storeTicker} />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 h-72 text-center">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-indigo-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">LSTM chart will appear here</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <SentimentColumn result={sentimentResult} loading={sLoading} error={sError} />
            </div>
          </div>

          {/* Stats */}
          <StatsStrip modelData={modelData} />
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
