import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { formatCurrency } from "../lib/formatters";

ChartJS.register(ArcElement, Tooltip, Legend);
interface MarketCapChartProps {
  data: any[];
}
const MarketCapChart: React.FC<MarketCapChartProps> = ({ data }) => {
  if (!data.length) return null;

  const top10 = data.slice(0, 10);
  const othersMarketCap = data
    .slice(10)
    .reduce((sum, coin) => sum + coin.market_cap, 0);

  const chartData = {
    labels: [...top10.map((coin) => coin.symbol.toUpperCase()), "Others"],
    datasets: [
      {
        data: [...top10.map((coin) => coin.market_cap), othersMarketCap],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8AC249",
          "#EA5F89",
          "#00BFFF",
          "#FFD700",
          "#C9CBCF",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-white">
        Market Cap Distribution
      </h3>
      <div className="h-80">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MarketCapChart;
