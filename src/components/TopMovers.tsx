import { formatPercentage } from "../lib/formatters";
interface TopMoversProps {
  data: any[];
}

const TopMovers: React.FC<TopMoversProps> = ({ data }) => {
  if (!data.length) return null;

  const gainers = [...data]
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )
    .slice(0, 5);

  const losers = [...data]
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    )
    .slice(0, 5);

  const mostTraded = [...data]
    .sort((a, b) => b.total_volume - a.total_volume)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Top Gainers (24h)
        </h3>
        <div className="space-y-3">
          {gainers.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {coin.symbol.toUpperCase()}
                </span>
              </div>
              <span className="text-green-500 font-medium">
                ↑ {formatPercentage(coin.price_change_percentage_24h)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Top Losers (24h)
        </h3>
        <div className="space-y-3">
          {losers.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {coin.symbol.toUpperCase()}
                </span>
              </div>
              <span className="text-red-500 font-medium">
                ↓ {formatPercentage(Math.abs(coin.price_change_percentage_24h))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Most Traded
        </h3>
        <div className="space-y-3">
          {mostTraded.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {coin.symbol.toUpperCase()}
                </span>
              </div>
              <span className="dark:text-gray-500 text-sm">
                Vol:{" "}
                {formatPercentage((coin.total_volume / coin.market_cap) * 100)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMovers;
