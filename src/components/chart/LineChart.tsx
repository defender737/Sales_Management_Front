import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  interface LineChartProps {
    labels: string[];
    dataSets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor?: string;
    }[];
  }
  
  const LineChart = ({ labels, dataSets }: LineChartProps) => {
    const data = {
      labels,
      datasets: dataSets.map(set => ({
        ...set,
        fill: false,
        tension: 0.3,
      }))
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
        y: {
          beginAtZero: true,
        },
      },
    };
  
    return <Line data={data} options={options} />;
  };
  
  export default LineChart;
  