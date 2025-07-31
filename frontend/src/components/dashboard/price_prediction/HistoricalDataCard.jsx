import React, { useEffect, useState, useMemo } from "react";
import usePricePredictionStore from "../../../../store/usePricePrediction.store";

const PAGE_SIZE = 100;

const HistoricalDataCard = () => {
  const {
    historicalData,
    ticker,
    fetchHistoricalData,
    loading,
    error,
  } = usePricePredictionStore();


  const sortedData = useMemo(() => {
    return [...historicalData].sort((a, b) => new Date(b.Date) - new Date(a.Date));
  }, [historicalData]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedData.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedData]);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  if (loading) return <div className="p-6 text-center">Loading historical data...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!historicalData || historicalData.length === 0)
    return <div className="p-6 text-center">No historical data available.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{ticker.toUpperCase()} Historical Data</h3>

      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Open</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">High</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Low</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Close</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pageData.map((item, idx) => {
              const open = item.Open ?? 0;
              const close = item.Close ?? 0;
              const bgColor =
                close > open
                  ? "bg-green-600 hover:bg-green-700 font-semibold"
                  : close < open
                  ? "bg-red-600 hover:bg-red-700 font-semibold"
                  : "bg-blue-600 hover:bg-blue-700 font-semibold";

              return (
                <tr key={idx} className={bgColor}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-white">
                    {new Date(item.Date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-white">${open.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-white">${item.High?.toFixed(2) ?? "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-white">${item.Low?.toFixed(2) ?? "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-white">${close.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-white">
                    {item.Volume?.toLocaleString() ?? "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goPrev}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-300 disabled:bg-gray-100 text-gray-700 hover:bg-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={goNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-300 disabled:bg-gray-100 text-gray-700 hover:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HistoricalDataCard;
