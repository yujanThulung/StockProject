import React, { useState, useEffect } from 'react';

const trendingTickers = [
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'PEP', name: 'PepsiCo, Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'BABA', name: 'Alibaba Group Holding Ltd' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'DIS', name: 'The Walt Disney Company' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
];

const TickerSearch = ({ onSearch, currentTicker }) => {
  const [searchTerm, setSearchTerm] = useState(currentTicker || '');
  const [showTrending, setShowTrending] = useState(true);

  // Set default search term when currentTicker changes
  useEffect(() => {
    setSearchTerm(currentTicker || '');
  }, [currentTicker]);

  const handleSearch = (e) => {
    e.preventDefault();
    const termToSearch = searchTerm.trim().toUpperCase();
    if (termToSearch) {
      onSearch(termToSearch);
      setShowTrending(false);
    }
  };

  const handleTickerClick = (symbol) => {
    onSearch(symbol);
    setSearchTerm(symbol);
    setShowTrending(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Company</h3>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value === '') {
                setShowTrending(true);
              }
            }}
            placeholder="Enter ticker symbol (e.g. META)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {showTrending && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700">Trending Stocks</h4>
            <button 
              onClick={() => setShowTrending(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Hide
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {trendingTickers.map((ticker) => (
              <button
                key={ticker.symbol}
                onClick={() => handleTickerClick(ticker.symbol)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  currentTicker === ticker.symbol
                    ? 'bg-blue-100 border border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{ticker.symbol}</div>
                <div className="text-sm text-gray-500 truncate">{ticker.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!showTrending && (
        <button 
          onClick={() => setShowTrending(true)}
          className="text-sm text-blue-500 hover:text-blue-700 mt-2"
        >
          Show trending stocks
        </button>
      )}
    </div>
  );
};

export default TickerSearch;