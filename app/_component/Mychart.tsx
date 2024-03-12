"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import useSWR from "swr";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import {
  getMonthList,
  getChartOpt,
  getUrlList,
  getDatasets,multiFetcher
} from "../_libs/func";


const range = "2023-02-01:2024-02-01";

const monthList = getMonthList(range);


export default function App() {
  const pkgList = ["react", "vue"];
  const urlList = getUrlList(pkgList)
  const { data, isLoading } = useSWR(urlList, multiFetcher);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const datasets = pkgList.map((pkg, index) =>
    getDatasets(monthList, data[index], pkg)
  );
  const chartData = {
    labels: monthList,
    datasets: datasets.flat(),
  };

  return (<div className=" w-[800px]"><Line options={getChartOpt("title")} data={chartData} /></div>)
}
