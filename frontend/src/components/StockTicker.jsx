import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ChevronLeft, ChevronRight } from "lucide-react"; // icon package

const StockTicker = () => {
    const [gainers, setGainers] = useState([]);
    const [losers, setLosers] = useState([]);
    const scrollRef = useRef();

    const staticGainers = [
        { symbol: "AAPL", name: "Apple Inc.", change: 3.45, price: 186.54, changesPercentage: 1.89 },
        { symbol: "TSLA", name: "Tesla Inc.", change: 4.23, price: 722.21, changesPercentage: 2.15 },
        { symbol: "AMZN", name: "Amazon.com Inc.", change: 2.76, price: 3254.56, changesPercentage: 0.85 },
        { symbol: "MSFT", name: "Microsoft Corp.", change: 1.34, price: 299.31, changesPercentage: 0.45 },
        { symbol: "NVDA", name: "NVIDIA Corporation", change: 5.82, price: 534.12, changesPercentage: 3.15 },
    ];

    const staticLosers = [
        { symbol: "NFLX", name: "Netflix Inc.", change: -6.12, price: 482.65, changesPercentage: -2.35 },
        { symbol: "META", name: "Meta Platforms Inc.", change: -3.41, price: 312.44, changesPercentage: -1.08 },
        { symbol: "PYPL", name: "PayPal Holdings Inc.", change: -2.11, price: 187.54, changesPercentage: -1.11 },
        { symbol: "INTC", name: "Intel Corporation", change: -1.76, price: 58.32, changesPercentage: -0.97 },
        { symbol: "ZM", name: "Zoom Video Communications", change: -4.85, price: 92.33, changesPercentage: -3.12 },
    ];

    const combinedData = [...staticGainers, ...staticLosers].sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {

      
 // const fetchData = async () => {
        //   try {
        //     const gainerRes = await fetch('http://localhost:8000/api/gainers');
        //     const loserRes = await fetch('http://localhost:8000/api/losers');
        //     const gainerData = await gainerRes.json();
        //     const loserData = await loserRes.json();

        //     setGainers(gainerData.slice(0, 5));
        //     setLosers(loserData.slice(0, 5));
        //   } catch (error) {
        //     console.error('Error fetching stock data:', error);
        //   }
        // };

        // fetchData();
        // const interval = setInterval(fetchData, 10000);
        // return () => clearInterval(interval); 

        setGainers(staticGainers);
        setLosers(staticLosers);
    }, []);

    const generateChartData = (change) => ({
        labels: Array(6).fill(""),
        datasets: [
            {
                data: Array.from({ length: 6 }, (_, i) => i + (Math.random() * change) / 0.2),
                backgroundColor: change > 0 ? "#00FFA3" : "#FF4D4D",
                borderColor: change > 0 ? "#00FFA3" : "#FF4D4D",
                borderWidth: 1,
                pointRadius: 0,
                fill: false,
                tension: 0,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false },
            y: { display: false },
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            current.scrollBy({
                left: direction === "left" ? -220 : 220,
                behavior: "smooth",
            });
        }
    };

    const renderCard = (stock, idx) => {
        const isPositive = stock.change > 0;
        return (
            <div
                key={idx}
                className={`flex items-center justify-between bg-[#1b2028] rounded-xl p-4 w-56 flex-shrink-0 border ${
                    isPositive ? "border-[#00FFA3]/20" : "border-[#FF4D4D]/20"
                }`}
            >
                <div>
                    <div className="text-sm font-medium text-white mb-1">{stock.symbol}</div>
                    <div className="text-gray-300 text-sm mb-1">${stock.price}</div>
                    <div
                        className={`text-xs font-medium ${
                            isPositive ? "text-[#00FFA3]" : "text-[#FF4D4D]"
                        }`}
                    >
                        {isPositive ? "+" : ""}
                        {stock.change.toFixed(2)} ({stock.changesPercentage.toFixed(2)}%)
                    </div>
                </div>
                <div className="w-24 h-10 ml-2 relative">
                    <Line data={generateChartData(stock.change)} options={chartOptions} />
                </div>
            </div>
        );
    };

    return (
        <div className="bg-slate-900 p-6 my-24 text-white">
            <div className="flex items-center justify-between mb-4 px-16">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <span role="img" aria-label="fire">🔥</span>
                    Top Stocks in the Market
                    <span className="text-gray-500 text-xs font-normal">(Close Soon 1H 15M)</span>
                </div>
                <a href="/market-activity" className="text-xs text-[#00FFA3] hover:underline">
                    View Market Activity ↗
                </a>
            </div>

            <div className="relative">
                
                    <ChevronLeft size={40} 
                    onClick={() => scroll("left")}
                    className="absolute left-0 z-10 h-full px-2 ml-9 text-white  rounded-l-lg transition-transform duration-300 hover:scale-125"/>
                

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar px-8"
                    style={{ scrollBehavior: "smooth" }}
                >
                    {combinedData.map(renderCard)}
                </div>

                
                    <ChevronRight size={40} onClick={() => scroll("right")}
                    className="absolute right-0 top-0 z-10 h-full px-2 ml-9 text-white   rounded-r-lg transition-transform duration-300 hover:scale-150"
                    />
            </div>
        </div>
    );
};

export default StockTicker;








