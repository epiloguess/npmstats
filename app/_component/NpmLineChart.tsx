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
  monthList,
  getDatasets,
  getRandomRGB,
} from "../_libs/func";

export default function App({ data }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: {
      xAxisKey: "day",
      yAxisKey: "downloads",
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "关闭较大比重的标签以放大密集区域",
      },
      tooltip: {
        mode: "nearest",
        intersect: false, // 如果为 true，则仅当鼠标位置与元素相交时才应用工具提示模式。如果为 false，则将始终应用该模式。
        displayColors: true,
        multiKeyBackground: "transparent",
        // xPadding: 10,
        // yPadding: 10,
        // titleMarginBottom: 10,
        // bodySpacing: 10,
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },
  };
  const mydata = {
    datasets: [
      {
        data:data.downloads,label:data.package,
        borderColor: getRandomRGB(),
      },
    ],
  };

  return <Line options={options} data={mydata} />;
}
