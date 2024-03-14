'use client';
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
  getChartOpt,
  monthList,getDatasets
} from "../_libs/func";

export default function App({ data }) {

  const chartdata = {
    labels: monthList,
    datasets: getDatasets(data),
  };
  return <Line options={getChartOpt(`Major Release`)} data={chartdata} />;
}
