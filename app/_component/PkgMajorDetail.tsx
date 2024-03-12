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
  getMajorDatasets,range,getPackageDetail
} from "../_libs/func";



export default function App({pkg_name,data}) {


  return <Line options={getChartOpt(`${pkg_name.toUpperCase()} Major Release`)} data={data} />;
}
