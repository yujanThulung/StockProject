import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Make Better Investment Decisions With Alternative Data
          </h1>
          <p className="text-xl text-gray-300">
            Get the inside scoop on companies like never before.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-700 my-8"></div>

        {/* Stock Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {/* Apple Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">APPLE</h2>
            <div className="space-y-2">
              <p className="text-gray-300">Apple</p>
              <p className="text-2xl font-semibold">$149.62</p>
              <div className="flex justify-between text-gray-400">
                <span>$0.00</span>
                <span>$0.00</span>
              </div>
            </div>
          </div>

          {/* Spotify Card with Chart */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">SPOT (Spotify)</h2>
            
            {/* Time Filters */}
            <div className="flex space-x-2 mb-4">
              {['12H', '1D', '1W', '1M', '1Y'].map((item) => (
                <button 
                  key={item}
                  className="px-3 py-1 bg-gray-700 rounded-md text-sm hover:bg-gray-600 transition"
                >
                  {item}
                </button>
              ))}
            </div>
            
            {/* Candlestick Chart Placeholder */}
            <div className="relative h-40 mb-4">
              {/* Chart background */}
              <div className="absolute inset-0 bg-gray-700 rounded-md"></div>
              
              {/* Y-axis values */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
                {[280, 260, 240, 220, 200].map((price) => (
                  <span key={price}>${price}</span>
                ))}
              </div>
              
              {/* Candlestick bars - simplified representation */}
              <div className="absolute left-8 right-4 top-0 h-full flex items-end space-x-2">
                {[244.21, 240, 248, 242, 246].map((price, idx) => {
                  const height = ((price - 200) / (280 - 200)) * 100;
                  return (
                    <div 
                      key={idx}
                      className="w-4 bg-green-500 rounded-sm"
                      style={{ height: `${height}%` }}
                    ></div>
                  );
                })}
              </div>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-400">
                {['Mo', 'Tu', 'We', 'Th'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Facebook Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">FB</h2>
            <div className="space-y-2">
              <p className="text-gray-300">Facebook, Inc</p>
              <p className="text-2xl font-semibold">$365.51</p>
              <div className="flex justify-between text-green-400">
                <span>+$2.16</span>
                <span>+$2.52</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;