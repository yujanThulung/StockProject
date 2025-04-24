import React, { useEffect } from "react";
import Chart from "../../components/dashboard/price_prediction/Chart.jsx";
import SummaryCard from "../../components/dashboard/price_prediction/SummeryCard.jsx";
import TickerSearch from "../../components/dashboard/price_prediction/TickerSearch.jsx";
import usePricePredictionStore from "../../../store/usePricePrediction.store.js";
import HistoricalDataCard from "../../components/dashboard/price_prediction/HistoricalDataCard.jsx";

const PricePredictionPage = ({ initialTicker = "META" }) => {
    const { ticker, modelData, historicalData, loading, error, setTicker, fetchAllData } =
        usePricePredictionStore();

    useEffect(() => {
        fetchAllData(initialTicker);
    }, []);

    const handleTickerSearch = (newTicker) => {
        setTicker(newTicker);
        fetchAllData(newTicker);
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
                <div className="flex flex-col gap-4 flex-1 ">
                    {modelData && <Chart data={modelData} ticker={ticker} />}
                    {historicalData && <HistoricalDataCard data={historicalData} ticker={ticker} />}
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <div className="w-full">
                        <TickerSearch onSearch={handleTickerSearch} currentTicker={ticker} />
                    </div>
                    {modelData && <SummaryCard data={modelData} ticker={ticker} />}
                </div>
            </div>
        </div>
    );
};

export default PricePredictionPage;
