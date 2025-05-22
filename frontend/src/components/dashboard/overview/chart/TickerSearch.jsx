import React, { useState } from "react";
import { Search } from "lucide-react";
import usePricePredictionStore from "../../../../../store/usePricePrediction.store.js";

const TickerSearch = () => {
    const [inputValue, setInputValue] = useState("");
    const { ticker, setTicker, fetchAllData, loading } = usePricePredictionStore();

    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     const cleanedTicker = inputValue.trim().toUpperCase();
    //     if (cleanedTicker && cleanedTicker !== ticker) {
    //         setTicker(cleanedTicker);
    //         fetchAllData(cleanedTicker);
    //     }
    // };

    const handleSearch = (e) => {
    e.preventDefault();
    const cleanedTicker = inputValue.trim().toUpperCase();
    if (cleanedTicker && cleanedTicker !== ticker) {
        setTicker(cleanedTicker);
        fetchAllData(cleanedTicker);
    }
};

    return (
        <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                    placeholder="Search Ticker"
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
                <button 
                type="submit"
                disabled={loading}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 dark:text-gray-400"}`}>
                    <Search size={20}/>
                    </button>
            </div>
        </form>
    );
};


export default TickerSearch;