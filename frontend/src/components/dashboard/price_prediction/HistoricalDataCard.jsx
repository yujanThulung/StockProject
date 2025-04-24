import React from "react";

const HistoricalDataCard = ({ data, ticker }) => {
  if (!data || !data.historical_data) return null;

  const historicalData = [...data.historical_data].sort((a, b) => new Date(b.date) - new Date(a.date));


  // Calculate percentage change from first to last day
  const firstClose = historicalData[0]?.close;
  const lastClose = historicalData[historicalData.length - 1]?.close;
  const percentageChange = firstClose ? ((lastClose - firstClose) / firstClose) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {ticker} Historical Data
        </h3>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
          percentageChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(2)}%
        </span>
      </div>

      <div className="relative">
        <div className="overflow-x-auto">
          {/* Table header */}
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 z-10">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Close
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SMA 50
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RSI
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MACD
                </th>
              </tr>
            </thead>
          </table>

          {/* Scrollable body */}
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {historicalData.map((item, index) => (
                  <tr key={index}>
                    <td className="sticky left-0 px-4 py-3 whitespace-nowrap text-sm text-gray-900 bg-white z-10">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      ${item.close}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.volume.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.sma_50}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                      item.rsi > 70 ? 'text-red-600' :
                      item.rsi < 30 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {item.rsi}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.macd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataCard;
