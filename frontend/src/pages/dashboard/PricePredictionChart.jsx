import React, { useEffect } from "react";
import Chart from "../../components/dashboard/price_prediction/Chart.jsx";
import SummaryCard from "../../components/dashboard/price_prediction/SummeryCard.jsx";
import TickerSearch from "../../components/dashboard/price_prediction/TickerSearch.jsx";
import usePricePredictionStore from "../../../store/usePricePrediction.store.js";

const PricePredictionPage = ({ initialTicker = "MSFT" }) => {
    const { ticker, modelData, historicalData, loading, error, setTicker, fetchModelData } =
        usePricePredictionStore();

    console.log("Response data:", modelData);

    useEffect(() => {
        fetchModelData(initialTicker);
    }, []);

    const handleTickerSearch = (newTicker) => {
        setTicker(newTicker);
        fetchModelData(newTicker);
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
                <div className="w-full">
                    <TickerSearch onSearch={handleTickerSearch} currentTicker={ticker} />
                </div>
                {/* Left section (70%) */}
                <div className="flex flex-col gap-4 w-full lg:w-[70%]">
                    {modelData && <Chart data={modelData} ticker={ticker} />}
                </div>

                {/* Right section (30%) */}
                <div className="flex flex-col gap-4 w-full lg:w-[28%]">
                    {modelData && <SummaryCard data={modelData} ticker={ticker} />}
                </div>
            </div>
        </div>
    );
};

export default PricePredictionPage;
