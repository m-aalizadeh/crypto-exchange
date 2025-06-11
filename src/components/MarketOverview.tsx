import { formatCurrency, formatPercentage } from "../lib/formatters";
import { useSocket } from "../contexts/SocketContext";

const MarketOverview = () => {
  const { prices: data = [] } = useSocket();
  if (!data.length) return null;

  const totalMarketCap = data.reduce((sum, coin) => sum + coin.market_cap, 0);
  const totalVolume = data.reduce((sum, coin) => sum + coin.total_volume, 0);
  const btc = data.find((c) => c.id === "bitcoin");
  const btcDominance = btc ? (btc.market_cap / totalMarketCap) * 100 : 0;

  const positiveCoins = data.filter(
    (c) => c.price_change_percentage_24h >= 0
  ).length;
  const marketSentiment = ((positiveCoins / data.length) * 100).toFixed(0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Market Cap
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalMarketCap)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          24h Volume
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalVolume)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          BTC Dominance
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatPercentage(btcDominance)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Market Sentiment
        </h3>
        <p className="text-2xl font-bold flex items-center">
          <span
            className={
              parseInt(marketSentiment) > 50 ? "text-green-500" : "text-red-500"
            }
          >
            {marketSentiment}% Positive
          </span>
          <span
            className={`ml-2 ${
              parseInt(marketSentiment) > 50 ? "text-green-500" : "text-red-500"
            }`}
          >
            {parseInt(marketSentiment) > 50 ? "↑" : "↓"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default MarketOverview;
