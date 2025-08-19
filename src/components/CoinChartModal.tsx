import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Line } from "react-chartjs-2";
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
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CoinChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinId: string | null;
}

const CoinChartModal: React.FC<CoinChartModalProps> = ({
  isOpen,
  onClose,
  coinId,
}) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<[number, number][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !coinId) {
      setChartData(null);
      setError(null);
      setLoading(true);
      return;
    }

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`
        );
        const data = await response.json();
        setChartData(data.prices);
      } catch (err) {
        t("Failed to fetch chart data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [isOpen, coinId]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 capitalize">
          {coinId} t("Price Chart (Last 30 Days)")
        </h2>
        {loading && (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && (
          <div className="text-red-500 dark:text-red-400 text-center py-4">
            {error}
          </div>
        )}
        {chartData && chartData.length > 0 && (
          <div>
            <div className="h-80">
              <Line
                data={{
                  labels: chartData.map((dataPoint) =>
                    new Date(dataPoint[0]).toLocaleDateString()
                  ),
                  datasets: [
                    {
                      label: "Price (USD)",
                      data: chartData.map((dataPoint) => dataPoint[1]),
                      fill: false,
                      borderColor: "rgb(75, 192, 192)",
                      tension: 0.1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top" as const,
                    },
                    title: {
                      display: true,
                      text: `${coinId?.toUpperCase()} Price Chart`,
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Date",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Price (USD)",
                      },
                    },
                  },
                }}
              />
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-4 text-center">
              t("Data from CoinGecko. Chart displays last 30 days of daily
              data.")
            </p>
          </div>
        )}
        {chartData && chartData.length === 0 && !loading && !error && (
          <div className="text-gray-500 dark:text-gray-400 text-center py-4">
            t("No chart data available for") {coinId}.
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CoinChartModal;
