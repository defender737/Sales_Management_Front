import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutDataItem {
  label: string;
  value: number;
  color: string;
}

interface DoughnutChartProps {
  dataItems: DoughnutDataItem[];
}

export default function DoughnutChart ({ dataItems } : DoughnutChartProps){
  const chartData = {
    labels: dataItems.map((item) => item.label),
    datasets: [
      {
        data: dataItems.map((item) => item.value),
        backgroundColor: dataItems.map((item) => item.color),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toLocaleString()}원`;
          },
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};