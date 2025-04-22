// components/charts/BarChart.tsx
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string;
  }

  interface BarChartProps {
    labels: string[];
    datasets: Dataset[];
    stacked? : boolean
  }
  
  const BarChart = ({ labels, datasets, stacked = false }: BarChartProps) => {
    const data = {
      labels,
      datasets,
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right' as const,
        },
      },
      scales: {
        x: { stacked: stacked },
        y: { stacked: stacked },
      },
    };
  
    return <Bar data={data} options={options} />;
  };
  
  export default BarChart;