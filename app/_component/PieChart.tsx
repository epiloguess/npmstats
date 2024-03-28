"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import { Doughnut } from "react-chartjs-2";

import { getRandomARGB, getChartOpt } from "@/_libs/func";

type data = {
  version: string;
  count: number;
}[];

export default function App({ data }: { data: data }) {
  const labels = data.map((entry) => entry.version);
  const countdata = data.map((entry) => entry.count);
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
