import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import usePricePredictionStore from "../../../../../store/usePricePrediction.store";
import useStockChartStore from "../../../../../store/stockChartStore.store";
import { getPreciseDateRange } from "../../../../utils/getPreciseDateRange";

// Format large numbers for volume
const formatNumber = (value) => {
  if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(2) + "K";
  return Number(value).toFixed(2);
};

const ApexCandlestickChart = () => {
  const { historicalData } = usePricePredictionStore();
  const { selectedRange } = useStockChartStore();

  const [chartData, setChartData] = useState({
    series: [],
    options: {},
    seriesBar: [],
    optionsBar: {},
  });

  useEffect(() => {
    if (!historicalData?.length) return;

    const { start: startDate } = getPreciseDateRange(selectedRange.months);

    const filtered = historicalData
      .filter((d) => new Date(d.Date) >= startDate)
      .map((item) => ({
        x: new Date(item.Date).getTime(),
        y: [
          parseFloat(Number(item.Open).toFixed(2)),
          parseFloat(Number(item.High).toFixed(2)),
          parseFloat(Number(item.Low).toFixed(2)),
          parseFloat(Number(item.Close).toFixed(2)),
        ],
        volume: Number(item.Volume || 0),
      }));

    const candleSeries = filtered.map(({ x, y }) => ({ x, y }));
    const volumeSeries = filtered.map(({ x, volume }) => ({ x, y: volume }));

    setChartData({
      series: [{ name: "Price", data: candleSeries }],
      options: {
        chart: {
          id: "candlestick-chart",
          type: "candlestick",
          height: 300,
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
          },
          zoom: {
            enabled: true,
            type: "x",
            autoScaleYaxis: true,
          },
        },
        xaxis: {
          type: "datetime",
          labels: { show: true },
        },
        yaxis: {
          tooltip: { enabled: true },
          labels: {
            formatter: (val) => Number(val).toFixed(2),
          },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#00C176",
              downward: "#FF4560",
            },
          },
        },
        tooltip: {
          enabled: true,
          shared: false,
          x: { show: true },
          y: {
            formatter: (value) => Number(value).toFixed(2),
          },
        },
      },
      seriesBar: [{ name: "Volume", data: volumeSeries }],
      optionsBar: {
        chart: {
          id: "volume-bar",
          type: "bar",
          height: 120,
          brush: {
            enabled: true,
            target: "candlestick-chart",
          },
          selection: {
            enabled: true,
            xaxis: {
              min: filtered[0]?.x,
              max: filtered[filtered.length - 1]?.x,
            },
          },
        },
        xaxis: {
          type: "datetime",
          labels: { show: false },
        },
        yaxis: {
          labels: {
            formatter: formatNumber,
            show: false,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "70%",
            borderRadius: 2,
          },
        },
        fill: {
          colors: ["#90caf9"],
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: formatNumber,
            title: {
              formatter: () => "Volume",
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 0,
        },
      },
    });
  }, [historicalData, selectedRange]);

  return (
    <div className="flex flex-col gap-4">
      {/* Candlestick Chart */}
      <div id="chart-candlestick">
        {chartData.options?.chart && chartData.series?.[0]?.data?.length > 0 && (
          <ReactApexChart
            key="candlestick"
            options={chartData.options}
            series={chartData.series}
            type="candlestick"
            height={300}
          />
        )}
      </div>

      {/* //Volume Chart
      <div id="chart-bar" className="-mt-38 z-10">
        {chartData.optionsBar?.chart &&
          chartData.seriesBar?.[0]?.data?.length > 0 && (
            <ReactApexChart
              key="bar"
              options={chartData.optionsBar}
              series={chartData.seriesBar}
              type="bar"
              height={120}
            />
          )}
      </div> */}
    </div>
  );
};

export default ApexCandlestickChart;
