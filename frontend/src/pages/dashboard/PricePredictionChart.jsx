import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from '../../components/dashboard/price_prediction/Chart.jsx';
import SummaryCard from '../../components/dashboard/price_prediction/SummeryCard.jsx';
import TickerSearch from '../../components/dashboard/price_prediction/TickerSearch.jsx';

const PricePredictionPage = ({ initialTicker = "META" }) => {
    const [ticker, setTicker] = useState(initialTicker);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.post("http://localhost:5000/model_results", {
                    ticker: ticker,
                });

                if (response.data.status !== "success") {
                    throw new Error(response.data.message || "Failed to fetch model results");
                }

                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error("Error:", err);
            }
        };

        fetchData();
    }, [ticker]);

    const handleTickerSearch = (newTicker) => {
        setTicker(newTicker);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-row flex-wrap lg:flex-row gap-4 p-4 min-h-[80vh]">
            <div className="w-full flex flex-row flex-wrap gap-4">
                <div className="flex-2">
                    <Chart data={data} ticker={ticker} />
                </div>
                <div className="flex-1 flex flex-col gap-4">
                <div className="w-full">
                <TickerSearch onSearch={handleTickerSearch} currentTicker={ticker} />
            </div>
                    <SummaryCard data={data} ticker={ticker} />
                </div>
            </div>
        </div>
    );
};

export default PricePredictionPage;