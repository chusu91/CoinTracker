import { useQuery } from "@tanstack/react-query";
import { redirect, useParams } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import CandleChart from "react-apexcharts";

interface IHistoricalData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

interface IChartProps {
  isDark: boolean;
}
function Chart({ isDark }: IChartProps) {
  const { coinId } = useParams<"coinId">();
  const { isLoading, data } = useQuery<IHistoricalData[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId)
  );
  const chartData = data?.map((price) => {
    return {
      x: new Date(price.time_close * 1000).toLocaleDateString(),
      y: [price.open, price.high, price.low, price.close].map((str) => {
        return Number(str);
      }),
    };
  });

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "price",
              data: data?.map((price) => parseFloat(price.close)) as number[],
            },
            //series data [] 가 받아야 하는 건 number 인데 저희는 data?.map() 으로 읽어올때랑 아닐때를 구분해서 받아야 하는데 읽어오면 number 이지만 못읽어오면 undefind 가 되서 문제.
            //저 데이터는 number 배열이다! 라고강제 하는겁니다..
          ]}
          options={{
            theme: { mode: isDark ? "dark" : "light" },
            chart: {
              height: 500,
              width: 500,
              toolbar: { show: false },
              background: "transparant",
            },
            grid: { show: false },
            stroke: { curve: "smooth", width: 3 },
            yaxis: { show: false },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: false },
              type: "datetime",
              categories: data?.map((price) =>
                new Date(price.time_close * 1000).toISOString()
              ),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["blue"], stops: [0, 100] },
            },
            colors: ["red"],
            tooltip: {
              y: {
                formatter: (value) => `$ ${value.toFixed(3)}`,
              },
            },
          }}
        />
      )}
      {isLoading ? (
        "Loading chart..."
      ) : (
        <CandleChart
          type="candlestick"
          series={[
            {
              data: chartData!,
            },
          ]}
          options={{
            theme: { mode: "dark" },
            chart: {
              height: 500,
              width: 500,
              toolbar: { show: false },
              background: "transparant",
            },

            // plotOptions: {
            //   candlestick: {
            //     colors: {
            //       upward: "red",
            //       downward: "blue",
            //     },
            //     wick: {
            //       useFillColor: true,
            //     },
            //   },
            // },
          }}
        />
      )}
    </div>
  );
}
export default Chart;
