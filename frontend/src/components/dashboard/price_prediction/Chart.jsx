import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    zoomPlugin
);

const Chart = ({ data, ticker }) => {
    const chartRef = useRef(null);

    // Shift predicted prices one day forward
    const shiftedPredictedPrices = [null, ...data.predicted_prices.slice(0, -1)];
    const shiftedPredictedDates = data.predicted_dates;

    // Prepare data for chart
    const allLabels = [...data.train_dates, ...data.test_dates, shiftedPredictedDates[shiftedPredictedDates.length - 1]];
    
    const allTrainPrices = [
        ...data.train_prices,
        ...Array(data.test_prices.length + 1).fill(null),
    ];
    
    const allTestPrices = [
        ...Array(data.train_prices.length).fill(null),
        ...data.test_prices,
        null // For the last predicted day
    ];
    
    const allPredictedPrices = [
        ...Array(data.train_prices.length).fill(null),
        ...shiftedPredictedPrices
    ];

    // Show last 30 days by default
    const sliceStart = Math.max(0, allLabels.length - 30);
    const chartData = {
        labels: allLabels.slice(sliceStart),
        datasets: [
            {
                label: "Train Close Price",
                data: allTrainPrices.slice(sliceStart),
                borderColor: "#10B981",
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 0,
            },
            {
                label: "Test Actual Close Price",
                data: allTestPrices.slice(sliceStart),
                borderColor: "#3B82F6",
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 0,
            },
            {
                label: "Predicted Close Price",
                data: allPredictedPrices.slice(sliceStart),
                borderColor: "#EF4444",
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.1,
                pointRadius: 0,
            },
        ],
    };

    const handleResetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                        {ticker} Price Prediction
                    </h3>
                    <p className="text-gray-600">Model Accuracy (R²): {data.r_squared?.toFixed(3)||'-'}</p>
                </div>
                <button
                    onClick={handleResetZoom}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                    Reset Zoom
                </button>
            </div>

            <div className="relative h-96 w-full">
                <Line
                    ref={chartRef}
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "top",
                                labels: {
                                    usePointStyle: true,
                                    padding: 20,
                                },
                            },
                            tooltip: {
                                mode: "index",
                                intersect: false,
                            },
                            zoom: {
                                zoom: {
                                    wheel: {
                                        enabled: true,
                                    },
                                    pinch: {
                                        enabled: true,
                                    },
                                    mode: "xy",
                                },
                                pan: {
                                    enabled: true,
                                    mode: "xy",
                                },
                            },
                        },
                        scales: {
                            x: {
                                ticks: {
                                    maxRotation: 45,
                                    minRotation: 45,
                                    callback: function (value) {
                                        return this.getLabelForValue(value) || null;
                                    },
                                },
                                grid: {
                                    display: false,
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: "Price ($)",
                                },
                            },
                        },
                        interaction: {
                            intersect: false,
                            mode: "nearest",
                        },
                    }}
                />
            </div>

            <div className="mt-4 text-sm text-gray-500 flex justify-center gap-4">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span>Training Data</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Test Actual</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-px bg-red-500 mx-1"></div>
                    <div className="w-3 h-px bg-red-500 mx-1"></div>
                    <span className="ml-2">Predicted</span>
                </div>
            </div>
        </div>
    );
};

export default Chart;