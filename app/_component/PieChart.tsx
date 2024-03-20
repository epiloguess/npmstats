"use client"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

import { Doughnut } from 'react-chartjs-2';

import { getRandomARGB } from '@/_libs/func';




export default function App({data}){

 
  const labels = data.map(entry => entry.version);
  const countdata = data.map(entry => entry.count);
   const mydata = {
    labels,
    datasets: [
      {
        label: '',
        data: countdata,
        backgroundColor: data.map(()=>(getRandomARGB()))
        ,

      },
    ],
  };

    return <Doughnut data={mydata} />
  
}

