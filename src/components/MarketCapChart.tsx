import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { formatCurrency } from "../lib/formatters";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MarketCapChartProps {
  data: any[];
}

const MarketCapChart: React.FC<MarketCapChartProps> = ({ data }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial check for dark mode
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    // Create observer for dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setIsDarkMode(isDark);
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

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
        borderColor: isDarkMode ? "#374151" : "#ffffff", // dark:gray-700 : white
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: isDarkMode ? "#D1D5DB" : "#6B7280", // dark:gray-300 : gray-500
          font: {
            size: 12,
          },
          padding: 20,
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
        backgroundColor: isDarkMode
          ? "rgba(17, 24, 39, 0.8)"
          : "rgba(255, 255, 255, 0.8)", // dark:gray-900 : white
        titleColor: isDarkMode ? "#F3F4F6" : "#111827", // dark:gray-100 : gray-900
        bodyColor: isDarkMode ? "#D1D5DB" : "#4B5563", // dark:gray-300 : gray-600
        borderColor: isDarkMode ? "#374151" : "#E5E7EB", // dark:gray-700 : gray-200
        borderWidth: 1,
        padding: 12,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg p-4 transition-colors duration-200">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-white transition-colors duration-200">
        Market Cap Distribution
      </h3>
      <div className="h-80">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MarketCapChart;
