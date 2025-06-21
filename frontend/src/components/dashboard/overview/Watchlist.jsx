// import { useEffect, useState, useRef } from "react";
// import useWatchlistStore from "../../../../store/watchlistStore";
// import {
//     FiTrendingUp,
//     FiTrendingDown,
//     FiMinus,
//     FiCircle,
//     FiTrash2,
//     FiClock,
//     FiDatabase,
//     FiAlertTriangle,
//     FiPlus,
//     FiSearch,
//     FiActivity,
//     FiLoader,
//     FiBarChart2,
//     FiDollarSign,
// } from "react-icons/fi";

// export default function Watchlist() {
//     const {
//         watchlist,
//         liveQuotes,
//         addTicker,
//         removeTicker,
//         initSocket,
//         fetchBatchHistory,
//         historicalData,
//         loading: historyLoading,
//         error: historyError,
//         socketInitialized,
//         cleanup,
//     } = useWatchlistStore();

//     const [input, setInput] = useState("");
//     const [lastUpdateTimes, setLastUpdateTimes] = useState({});
//     const inputRef = useRef(null);

//     useEffect(() => {
//         initSocket();
//         return () => cleanup();
//     }, []);

//     useEffect(() => {
//         if (watchlist.length > 0) {
//             fetchBatchHistory(watchlist);
//         }
//     }, [watchlist.join(",")]);

//     useEffect(() => {
//         const newUpdateTimes = {};
//         Object.keys(liveQuotes).forEach((symbol) => {
//             if (liveQuotes[symbol]) {
//                 newUpdateTimes[symbol] = Date.now();
//             }
//         });
//         setLastUpdateTimes(newUpdateTimes);
//     }, [liveQuotes]);

//     const handleAdd = () => {
//         const symbol = input.trim().toUpperCase();
//         const token = localStorage.getItem("token");

//         if (symbol && !watchlist.includes(symbol)) {
//             const token = localStorage.getItem("token");
//             addTicker(symbol, token);
//             addTicker(symbol,token);
//             setInput("");
//             inputRef.current?.focus();
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") handleAdd();
//     };

//     const formatPrice = (price) => {
//         if (price === undefined || price === null) return "N/A";
//         return parseFloat(price).toFixed(2);
//     };

//     const getTimeSinceUpdate = (symbol) => {
//         const lastUpdate = lastUpdateTimes[symbol];
//         if (!lastUpdate) return "Never updated";

//         const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
//         if (seconds < 5) return "Just now";
//         if (seconds < 60) return `${seconds}s ago`;
//         const minutes = Math.floor(seconds / 60);
//         return `${minutes}m ago`;
//     };

//     return (
//         <div className="p-4 max-w-xl mx-auto bg-gray-50 rounded-lg shadow-sm">
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                     <FiBarChart2 className="text-blue-500" />
//                     Live Watchlist
//                 </h2>
//                 <div className="flex items-center gap-2">
//                     <span
//                         className={`text-sm ${socketInitialized ? "text-green-600" : "text-red-600"}`}
//                     >
//                         {socketInitialized ? "Live" : "Offline"}
//                     </span>
//                     <FiCircle
//                         className={`text-xs ${socketInitialized ? "text-green-500 animate-pulse" : "text-red-600"}`}
//                     />
//                 </div>
//             </div>

//             <div className="flex gap-2 mb-6">
//                 <div className="relative flex-1">
//                     <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                         ref={inputRef}
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter ticker (e.g. AAPL)"
//                         className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <button
//                     onClick={handleAdd}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//                 >
//                     <FiPlus />
//                     Add
//                 </button>
//             </div>

//             {watchlist.length === 0 && (
//                 <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
//                     <FiBarChart2 className="text-gray-400 text-4xl mb-2 mx-auto" />
//                     <p className="text-gray-500">Your watchlist is empty</p>
//                     <p className="text-sm text-gray-400 mt-1">
//                         Add stocks to track their performance
//                     </p>
//                 </div>
//             )}

//             {historyLoading && (
//                 <div className="flex items-center justify-center gap-2 py-4 text-blue-500">
//                     <FiLoader className="animate-spin" />
//                     Loading historical data...
//                 </div>
//             )}

//             {historyError && (
//                 <div className="flex items-center justify-center gap-2 py-4 text-red-500">
//                     <FiAlertTriangle />
//                     {historyError}
//                 </div>
//             )}

//             <div className="text-xs text-gray-500 mb-4 p-3 bg-white rounded-lg border border-gray-200 flex flex-wrap gap-x-4 gap-y-1">
//                 <span className="flex items-center gap-1">
//                     <FiActivity />
//                     Status: {socketInitialized ? "Connected" : "Disconnected"}
//                 </span>
//                 <span>
//                     Tracking: {Object.keys(liveQuotes).length}/{watchlist.length} symbols
//                 </span>
//                 <span className="flex items-center gap-1">
//                     <FiClock />
//                     {Math.max(...Object.values(lastUpdateTimes))
//                         ? new Date(Math.max(...Object.values(lastUpdateTimes))).toLocaleTimeString()
//                         : "Never"}
//                 </span>
//             </div>

//             <ul className="space-y-4">
//                 {watchlist.map((sym) => {
//                     const quote = liveQuotes[sym];
//                     const hist = historicalData[sym];
//                     const isUp = quote?.Close > quote?.Open;
//                     const isDown = quote?.Close < quote?.Open;

//                     const cardClasses = `p-4 rounded-lg border transition-all ${
//                         isUp
//                             ? "bg-green-200 border-green-300"
//                             : isDown
//                               ? "bg-red-200 border-red-300"
//                               : "bg-white border-gray-200"
//                     }`;

//                     const priceClasses = `text-xl font-bold ${
//                         isUp ? "text-green-600" : isDown ? "text-red-600" : "text-gray-700"
//                     }`;

//                     const ArrowIcon = isUp ? FiTrendingUp : isDown ? FiTrendingDown : FiMinus;
//                     const arrowColor = isUp
//                         ? "text-green-500"
//                         : isDown
//                           ? "text-red-500"
//                           : "text-gray-500";

//                     return (
//                         <li key={sym} className={cardClasses}>
//                             <div className="flex justify-between items-center mb-3">
//                                 <div className="font-bold text-xl text-gray-800">{sym}</div>
//                                 <div className="flex items-center gap-3">
//                                     <span className="text-xs text-gray-500 flex items-center gap-1">
//                                         <FiClock size={12} />
//                                         {getTimeSinceUpdate(sym)}
//                                     </span>
//                                     <button
//                                         onClick={() => {
//                                             const token = localStorage.getItem("token");
//                                             removeTicker(sym, token);
//                                         }}
//                                         className="text-gray-400 hover:text-red-500 transition-colors"
//                                         title="Remove from watchlist"
//                                     >
//                                         <FiTrash2 size={16} />
//                                     </button>
//                                 </div>
//                             </div>

//                             {quote ? (
//                                 <div className="space-y-3">
//                                     <div className="flex items-center justify-between">
//                                         <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
//                                             <FiDollarSign size={14} />
//                                             Current Price
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <span className={priceClasses}>
//                                                 ${formatPrice(quote.Close)}
//                                             </span>
//                                             <ArrowIcon
//                                                 className={`${arrowColor} ${isUp || isDown ? "animate-bounce" : ""}`}
//                                                 size={20}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-3 text-sm">
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-gray-500">High:</span>
//                                             <span className="font-medium">
//                                                 ${formatPrice(quote.High)}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-gray-500">Low:</span>
//                                             <span className="font-medium">
//                                                 ${formatPrice(quote.Low)}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-gray-500">Open:</span>
//                                             <span className="font-medium">
//                                                 ${formatPrice(quote.Open)}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center gap-2 text-amber-600">
//                                     <FiLoader className="animate-spin" />
//                                     Connecting to live feed for {sym}...
//                                 </div>
//                             )}

//                             {hist && Array.isArray(hist) && (
//                                 <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
//                                     <FiDatabase size={12} />
//                                     {hist.length} historical records loaded
//                                 </div>
//                             )}

//                             {hist?.error && (
//                                 <div className="text-xs text-red-600 mt-2 flex items-center gap-1">
//                                     <FiAlertTriangle size={12} />
//                                     Historical data error: {hist.error}
//                                 </div>
//                             )}
//                         </li>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// }




// import { useEffect, useState } from 'react';
// import useWatchlistStore from '../../../../store/watchlistStore';
// import {
//   FiTrendingUp,
//   FiTrendingDown,
//   FiMinus,
//   FiTrash2,
//   FiPlus,
//   FiLoader,
// } from 'react-icons/fi';

// const WatchlistUI = () => {
//   const {
//     watchlist,
//     liveQuotes,
//     addTicker,
//     removeTicker,
//     addMultipleTickers,
//     removeMultipleTickers,
//     initSocket,
//     cleanup,
//     socketConnected,
//     loading,
//     getTickerData,
//   } = useWatchlistStore();

//   const [input, setInput] = useState('');
//   const [selectedTickers, setSelectedTickers] = useState([]);

//   useEffect(() => {
//     initSocket();
//     return () => cleanup();
//   }, []);

//   const handleAdd = async () => {
//     if (!input.trim()) return;
//     await addTicker(input.trim());
//     setInput('');
//   };

//   const handleAddSample = async () => {
//     await addMultipleTickers();
//   };

//   const handleRemoveSelected = async () => {
//     if (selectedTickers.length === 0) return;
//     await removeMultipleTickers(selectedTickers);
//     setSelectedTickers([]);
//   };

//   const toggleSelectTicker = (symbol) => {
//     setSelectedTickers(prev => 
//       prev.includes(symbol)
//         ? prev.filter(s => s !== symbol)
//         : [...prev, symbol]
//     );
//   };

//   const formatPrice = (price) => {
//     return price ? price.toFixed(2) : 'N/A';
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* Connection Status */}
//       <div className={`inline-block px-3 py-1 mb-4 rounded-md ${
//         socketConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//       }`}>
//         Status: {socketConnected ? 'Connected' : 'Disconnected'}
//       </div>

//       {/* Controls */}
//       <div className="flex flex-wrap gap-2 mb-6">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
//           placeholder="Enter ticker symbol"
//           className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
        
//         <button
//           onClick={handleAdd}
//           disabled={loading}
//           className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           {loading ? (
//             <FiLoader className="animate-spin" />
//           ) : (
//             <FiPlus />
//           )}
//           Add
//         </button>
        
//         <button
//           onClick={handleAddSample}
//           disabled={loading}
//           className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           Add Sample
//         </button>
        
//         {selectedTickers.length > 0 && (
//           <button
//             onClick={handleRemoveSelected}
//             disabled={loading}
//             className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             <FiTrash2 />
//             Remove ({selectedTickers.length})
//           </button>
//         )}
//       </div>

//       {/* Ticker List */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {watchlist.length === 0 ? (
//           <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
//             <p className="text-gray-500">Your watchlist is empty</p>
//             <p className="text-sm text-gray-400">Add some tickers to begin tracking</p>
//           </div>
//         ) : (
//           watchlist.map(symbol => {
//             const data = getTickerData(symbol);
//             const isSelected = selectedTickers.includes(symbol);
//             const ArrowIcon = data?.up ? FiTrendingUp : data?.down ? FiTrendingDown : FiMinus;
//             const priceColor = data?.up ? 'text-green-600' : data?.down ? 'text-red-600' : 'text-gray-700';

//             return (
//               <div
//                 key={symbol}
//                 onClick={() => toggleSelectTicker(symbol)}
//                 className={`p-4 border rounded-lg cursor-pointer transition-all ${
//                   isSelected
//                     ? 'border-blue-500 bg-blue-50'
//                     : 'border-gray-200 hover:border-gray-300 bg-white'
//                 }`}
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="font-bold text-lg">{symbol}</span>
//                   <span className={`flex items-center gap-1 text-xl font-semibold ${priceColor}`}>
//                     ${formatPrice(data?.Close)}
//                     <ArrowIcon className={data?.up || data?.down ? 'animate-bounce' : ''} />
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>O: ${formatPrice(data?.Open)}</span>
//                   <span>H: ${formatPrice(data?.High)}</span>
//                   <span>L: ${formatPrice(data?.Low)}</span>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default WatchlistUI;





// import { useEffect, useState, useRef } from "react";
// import useWatchlistStore from "../../../../store/watchlistStore";
// import {
//   FiTrendingUp,
//   FiTrendingDown,
//   FiMinus,
//   FiCircle,
//   FiTrash2,
//   FiClock,
//   FiDatabase,
//   FiAlertTriangle,
//   FiPlus,
//   FiSearch,
//   FiActivity,
//   FiLoader,
//   FiBarChart2,
//   FiDollarSign,
// } from "react-icons/fi";

// export default function Watchlist() {
//   const {
//     watchlist,
//     liveQuotes,
//     addTicker,
//     removeTicker,
//     initSocket,
//     socketInitialized,
//     cleanup,
//     loading,
//     error,
//   } = useWatchlistStore();

//   const [input, setInput] = useState("");
//   const [lastUpdateTimes, setLastUpdateTimes] = useState({});
//   const inputRef = useRef(null);

//   useEffect(() => {
//     initSocket();
//     return () => cleanup();
//   }, []);

//   useEffect(() => {
//     const newUpdateTimes = {};
//     Object.keys(liveQuotes).forEach((symbol) => {
//       if (liveQuotes[symbol]?.lastUpdate) {
//         newUpdateTimes[symbol] = liveQuotes[symbol].lastUpdate;
//       }
//     });
//     setLastUpdateTimes(newUpdateTimes);
//   }, [liveQuotes]);

//   const handleAdd = () => {
//     const symbol = input.trim().toUpperCase();
//     if (symbol && !watchlist.includes(symbol)) {
//       addTicker(symbol);
//       setInput("");
//       inputRef.current?.focus();
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleAdd();
//   };

//   const formatPrice = (price) => {
//     if (price === undefined || price === null) return "N/A";
//     return parseFloat(price).toFixed(2);
//   };

//   const getTimeSinceUpdate = (symbol) => {
//     const lastUpdate = lastUpdateTimes[symbol];
//     if (!lastUpdate) return "Never updated";

//     const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
//     if (seconds < 5) return "Just now";
//     if (seconds < 60) return `${seconds}s ago`;
//     const minutes = Math.floor(seconds / 60);
//     return `${minutes}m ago`;
//   };

//   return (
//     <div className="p-4 max-w-xl mx-auto bg-gray-50 rounded-lg shadow-sm">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//           <FiBarChart2 className="text-blue-500" />
//           Live Watchlist
//         </h2>
//         <div className="flex items-center gap-2">
//           <span className={`text-sm ${socketInitialized ? "text-green-600" : "text-red-600"}`}>
//             {socketInitialized ? "Live" : "Offline"}
//           </span>
//           <FiCircle className={`text-xs ${socketInitialized ? "text-green-500 animate-pulse" : "text-red-600"}`} />
//         </div>
//       </div>

//       <div className="flex gap-2 mb-6">
//         <div className="relative flex-1">
//           <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             ref={inputRef}
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Enter ticker (e.g. AAPL)"
//             className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//         <button
//           onClick={handleAdd}
//           disabled={loading}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
//         >
//           {loading ? <FiLoader className="animate-spin" /> : <FiPlus />}
//           Add
//         </button>
//       </div>

//       {error && (
//         <div className="flex items-center justify-center gap-2 py-4 text-red-500">
//           <FiAlertTriangle />
//           {error}
//         </div>
//       )}

//       {watchlist.length === 0 && (
//         <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
//           <FiBarChart2 className="text-gray-400 text-4xl mb-2 mx-auto" />
//           <p className="text-gray-500">Your watchlist is empty</p>
//           <p className="text-sm text-gray-400 mt-1">
//             Add stocks to track their performance
//           </p>
//         </div>
//       )}

//       <div className="text-xs text-gray-500 mb-4 p-3 bg-white rounded-lg border border-gray-200 flex flex-wrap gap-x-4 gap-y-1">
//         <span className="flex items-center gap-1">
//           <FiActivity />
//           Status: {socketInitialized ? "Connected" : "Disconnected"}
//         </span>
//         <span>
//           Tracking: {Object.keys(liveQuotes).length}/{watchlist.length} symbols
//         </span>
//         <span className="flex items-center gap-1">
//           <FiClock />
//           {Math.max(...Object.values(lastUpdateTimes))
//             ? new Date(Math.max(...Object.values(lastUpdateTimes))).toLocaleTimeString()
//             : "Never"}
//         </span>
//       </div>

//       <ul className="space-y-4">
//         {watchlist.map((symbol) => {
//           const quote = liveQuotes[symbol];
//           const isUp = quote?.up;
//           const isDown = quote?.down;
//           const ArrowIcon = isUp ? FiTrendingUp : isDown ? FiTrendingDown : FiMinus;
//           const arrowColor = isUp ? "text-green-500" : isDown ? "text-red-500" : "text-gray-500";

//           return (
//             <li 
//               key={symbol} 
//               className={`p-4 rounded-lg border transition-all ${
//                 isUp ? "bg-green-100 border-green-200" :
//                 isDown ? "bg-red-100 border-red-200" :
//                 "bg-white border-gray-200"
//               }`}
//             >
//               <div className="flex justify-between items-center mb-3">
//                 <div className="font-bold text-xl text-gray-800">{symbol}</div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-xs text-gray-500 flex items-center gap-1">
//                     <FiClock size={12} />
//                     {getTimeSinceUpdate(symbol)}
//                   </span>
//                   <button
//                     onClick={() => removeTicker(symbol)}
//                     className="text-gray-400 hover:text-red-500 transition-colors"
//                     title="Remove from watchlist"
//                   >
//                     <FiTrash2 size={16} />
//                   </button>
//                 </div>
//               </div>

//               {quote ? (
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
//                       <FiDollarSign size={14} />
//                       Current Price
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className={`text-xl font-bold ${
//                         isUp ? "text-green-600" : 
//                         isDown ? "text-red-600" : 
//                         "text-gray-700"
//                       }`}>
//                         ${formatPrice(quote.Close)}
//                       </span>
//                       <ArrowIcon
//                         className={`${arrowColor} ${(isUp || isDown) ? "animate-bounce" : ""}`}
//                         size={20}
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3 text-sm">
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-500">High:</span>
//                       <span className="font-medium">
//                         ${formatPrice(quote.High)}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-500">Low:</span>
//                       <span className="font-medium">
//                         ${formatPrice(quote.Low)}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-500">Open:</span>
//                       <span className="font-medium">
//                         ${formatPrice(quote.Open)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 text-amber-600">
//                   <FiLoader className="animate-spin" />
//                   Connecting to live feed for {symbol}...
//                 </div>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }




import { useEffect, useState, useRef } from "react";
import useWatchlistStore from "../../../../store/watchlistStore";
import {
    FiTrendingUp,
    FiTrendingDown,
    FiMinus,
    FiCircle,
    FiTrash2,
    FiClock,
    FiDatabase,
    FiAlertTriangle,
    FiPlus,
    FiSearch,
    FiActivity,
    FiLoader,
    FiBarChart2,
    FiDollarSign,
} from "react-icons/fi";

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
    } = useWatchlistStore();

    const [input, setInput] = useState("");
    const [lastUpdateTimes, setLastUpdateTimes] = useState({});
    const inputRef = useRef(null);

    useEffect(() => {
        initSocket();
        return () => cleanup();
    }, []);

    useEffect(() => {
        if (watchlist.length > 0) {
            fetchBatchHistory(watchlist);
        }
    }, [watchlist.join(",")]);

    useEffect(() => {
        const newUpdateTimes = {};
        Object.keys(liveQuotes).forEach((symbol) => {
            if (liveQuotes[symbol]) {
                newUpdateTimes[symbol] = Date.now();
            }
        });
        setLastUpdateTimes(newUpdateTimes);
    }, [liveQuotes]);

    const handleAdd = () => {
        const symbol = input.trim().toUpperCase();
        const token = localStorage.getItem("token");

        if (symbol && !watchlist.includes(symbol)) {
            addTicker(symbol);
            setInput("");
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleAdd();
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "N/A";
        return parseFloat(price).toFixed(2);
    };

    const getTimeSinceUpdate = (symbol) => {
        const lastUpdate = lastUpdateTimes[symbol];
        if (!lastUpdate) return "Never updated";

        const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
        if (seconds < 5) return "Just now";
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ago`;
    };

    return (
        <div className="p-4 max-w-xl mx-auto bg-gray-50 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiBarChart2 className="text-blue-500" />
                    Live Watchlist
                </h2>
                <div className="flex items-center gap-2">
                    <span
                        className={`text-sm ${
                            socketInitialized ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {socketInitialized ? "Live" : "Offline"}
                    </span>
                    <FiCircle
                        className={`text-xs ${
                            socketInitialized ? "text-green-500 animate-pulse" : "text-red-600"
                        }`}
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
                        placeholder="Enter ticker (e.g. AAPL)"
                        className="border border-gray-300 pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <FiPlus />
                    Add
                </button>
            </div>

            {watchlist.length === 0 && (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                    <FiBarChart2 className="text-gray-400 text-4xl mb-2 mx-auto" />
                    <p className="text-gray-500">Your watchlist is empty</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Add stocks to track their performance
                    </p>
                </div>
            )}

            {historyLoading && (
                <div className="flex items-center justify-center gap-2 py-4 text-blue-500">
                    <FiLoader className="animate-spin" />
                    Loading historical data...
                </div>
            )}

            {historyError && (
                <div className="flex items-center justify-center gap-2 py-4 text-red-500">
                    <FiAlertTriangle />
                    {historyError}
                </div>
            )}

            <div className="text-xs text-gray-500 mb-4 p-3 bg-white rounded-lg border border-gray-200 flex flex-wrap gap-x-4 gap-y-1">
                <span className="flex items-center gap-1">
                    <FiActivity />
                    Status: {socketInitialized ? "Connected" : "Disconnected"}
                </span>
                <span>
                    Tracking: {Object.keys(liveQuotes).length}/{watchlist.length} symbols
                </span>
                <span className="flex items-center gap-1">
                    <FiClock />
                    {Math.max(...Object.values(lastUpdateTimes))
                        ? new Date(Math.max(...Object.values(lastUpdateTimes))).toLocaleTimeString()
                        : "Never"}
                </span>
            </div>

            <ul className="space-y-4">
                {watchlist.map((sym) => {
                    const quote = liveQuotes[sym];
                    const hist = historicalData[sym];
                    const isUp = quote?.Close > quote?.Open;
                    const isDown = quote?.Close < quote?.Open;

                    const cardClasses = `p-4 rounded-lg border transition-all ${
                        isUp
                            ? "bg-green-200 border-green-300"
                            : isDown
                              ? "bg-red-200 border-red-300"
                              : "bg-white border-gray-200"
                    }`;

                    const priceClasses = `text-xl font-bold ${
                        isUp ? "text-green-600" : isDown ? "text-red-600" : "text-gray-700"
                    }`;

                    const ArrowIcon = isUp ? FiTrendingUp : isDown ? FiTrendingDown : FiMinus;
                    const arrowColor = isUp
                        ? "text-green-500"
                        : isDown
                          ? "text-red-500"
                          : "text-gray-500";

                    return (
                        <li key={sym} className={cardClasses}>
                            <div className="flex justify-between items-center mb-3">
                                <div className="font-bold text-xl text-gray-800">{sym}</div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <FiClock size={12} />
                                        {getTimeSinceUpdate(sym)}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const token = localStorage.getItem("token");
                                            removeTicker(sym, token);
                                        }}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="Remove from watchlist"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {quote ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <FiDollarSign size={14} />
                                            Current Price
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={priceClasses}>
                                                ${formatPrice(quote.Close)}
                                            </span>
                                            <ArrowIcon
                                                className={`${arrowColor} ${
                                                    isUp || isDown ? "animate-bounce" : ""
                                                }`}
                                                size={20}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">High:</span>
                                            <span className="font-medium">
                                                ${formatPrice(quote.High)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Low:</span>
                                            <span className="font-medium">
                                                ${formatPrice(quote.Low)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">Open:</span>
                                            <span className="font-medium">
                                                ${formatPrice(quote.Open)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-amber-600">
                                    <FiLoader className="animate-spin" />
                                    Connecting to live feed for {sym}...
                                </div>
                            )}

                            {hist && Array.isArray(hist) && (
                                <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                                    <FiDatabase size={12} />
                                    {hist.length} historical records loaded
                                </div>
                            )}

                            {hist?.error && (
                                <div className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                    <FiAlertTriangle size={12} />
                                    Historical data error: {hist.error}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
