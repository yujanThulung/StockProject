import React from "react";

const SummaryCard = ({ data, ticker }) => {
  if (!data) return null;

  // Extract relevant data points
  const testDates = data.test_dates || [];
  const testPrices = data.test_prices || [];
  const predictedPrices = data.predicted_prices || [];
  const predictedDates = data.predicted_dates || [];

  // Get last two actual prices
  const lastTwoActual = testPrices.slice(-2).map((price, i) => ({
    date: testDates[testDates.length - 2 + i],
    price: price,
  }));

  // Today's data (last actual price)
  const today = {
    date: testDates[testDates.length - 1],
    actualPrice: testPrices[testPrices.length - 1],
    predictedPrice: predictedPrices[predictedPrices.length - 2],
  };

  // Tomorrow's prediction
  const tomorrow = {
    date: predictedDates[predictedDates.length - 1],
    predictedPrice: predictedPrices[predictedPrices.length - 1],
  };

  // Calculate percentage changes
  const todayPredictionError = today.actualPrice
    ? ((today.predictedPrice - today.actualPrice) / today.actualPrice) * 100
    : 0;

  const tomorrowPotentialChange = today.actualPrice
    ? ((tomorrow.predictedPrice - today.actualPrice) / today.actualPrice) * 100
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {ticker} Summary
        </h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          Live Data
        </span>
      </div>

      <div className="space-y-5">
        {/* Previous Days */}
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            Previous Days
          </h4>
          <div className="space-y-3">
            {lastTwoActual.map((day, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {day.date}
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ${day.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today */}
        <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Today • {today.date}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-600">Actual Price</div>
              <div className="text-lg font-bold text-gray-900">
                ${today.actualPrice?.toFixed(2) || 'N/A'}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-600">Predicted Price</div>
              <div className="text-lg font-bold text-gray-900">
                ${today.predictedPrice?.toFixed(2) || 'N/A'}
              </div>
            </div>
            {today.actualPrice && (
              <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                <div className="text-sm font-medium text-gray-600">Prediction Accuracy</div>
                <div className={`text-md font-semibold ${
                  Math.abs(todayPredictionError) < 1 ? 'text-green-600' : 
                  Math.abs(todayPredictionError) < 3 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.abs(todayPredictionError).toFixed(2)}% {todayPredictionError >= 0 ? '↑' : '↓'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tomorrow */}
        <div className="bg-green-50 rounded-lg p-5 border border-green-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Tomorrow • {tomorrow.date}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-600">Predicted Price</div>
              <div className="text-lg font-bold text-gray-900">
                ${tomorrow.predictedPrice?.toFixed(2) || 'N/A'}
              </div>
            </div>
            {today.actualPrice && (
              <div className="flex justify-between items-center pt-2 border-t border-green-100">
                <div className="text-sm font-medium text-gray-600">Potential Change</div>
                <div className={`text-md font-semibold ${
                  tomorrowPotentialChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tomorrowPotentialChange.toFixed(2)}% {tomorrowPotentialChange >= 0 ? '↑' : '↓'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;