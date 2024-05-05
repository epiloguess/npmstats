"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import { Doughnut } from "react-chartjs-2";

import { getRandomARGB, getChartOpt, version_downloads_array } from "@utils/server"



export default function App({ data }: { data: version_downloads_array }) {
  let sorted_data = data.toSorted((a,b)=>(b.downloads - a.downloads))
  const labels = sorted_data.map((entry) => `${entry.version}`);
  const countdata = sorted_data.map((entry) => entry.downloads);
  const mydata = {
    labels,
    datasets: [
      {
        label: "",
        data: countdata,
        backgroundColor: data.map(() => getRandomARGB()),
      },
    ],
  };

  return <Doughnut options={getChartOpt()} data={mydata} />;
}
