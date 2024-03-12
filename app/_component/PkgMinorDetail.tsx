"use client"
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
  getMinorDatasets,
} from "../_libs/func";
import { useData } from "../_libs/client";
const range = "2023-02-01:2024-02-01";

const monthList = getMonthList(range);

export default function App({name}) {
  const { data, isLoading } = useData(name);

  if (isLoading) {
    return <div>Loading...</div>; // 或者返回 null，或以其他方式处理
  }

  const chartdata = {
    labels: monthList,
    datasets: getMinorDatasets(monthList, data, name),
  };

  return <Line options={getChartOpt(`Most popular Minor Release of ${name.toUpperCase()} in the past year.`)} data={chartdata} />;
}
