import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

interface SparklineProps {
  data: (string | null)[];
  currentPrice: string;
  change: string;
  width?: number | string;
  height?: number | string;
}

const SparklineChart = ({
  data,
  currentPrice,
  change,
  width = "100%",
  height = 60,
}: SparklineProps) => {
  // Process sparkline data
  const chartData = data
    .filter((item) => item !== null)
    .map((price, index) => ({
      index,
      price: parseFloat(price || "0"),
    }));

  const isPositive = parseFloat(change) >= 0;
  const chartColor = isPositive ? "#10b981" : "#ef4444";

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 flex items-center">
        <span
          className={`text-sm font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}%
        </span>
        {isPositive ? (
          <FiArrowUp className="ml-1 text-green-500" />
        ) : (
          <FiArrowDown className="ml-1 text-red-500" />
        )}
      </div>

      <ResponsiveContainer width={width} height={height}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="price"
            stroke={chartColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              return (
                <div className="bg-gray-800 text-white p-2 rounded shadow-lg text-xs">
                  <p>Price: ${payload[0].value?.toFixed(4)}</p>
                  <p>Current: ${parseFloat(currentPrice).toFixed(4)}</p>
                </div>
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SparklineChart;
