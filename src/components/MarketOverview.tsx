import { formatCurrency, formatPercentage } from "../lib/formatters";
interface MarketOverviewProps {
  data: any[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ data }) => {
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md dark:shadow-gray-900/10">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Total Market Cap
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2 transition-colors duration-200">
          {formatCurrency(totalMarketCap)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md dark:shadow-gray-900/10">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
          24h Volume
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2 transition-colors duration-200">
          {formatCurrency(totalVolume)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md dark:shadow-gray-900/10">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
          BTC Dominance
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2 transition-colors duration-200">
          {formatPercentage(btcDominance)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md dark:shadow-gray-900/10">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Market Sentiment
        </h3>
        <div className="flex items-center mt-2">
          <span
            className={`text-2xl font-bold transition-colors duration-200 ${
              parseInt(marketSentiment) > 50
                ? "text-green-500 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {marketSentiment}% Positive
          </span>
          <span
            className={`ml-2 text-2xl transition-colors duration-200 ${
              parseInt(marketSentiment) > 50
                ? "text-green-500 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {parseInt(marketSentiment) > 50 ? "↑" : "↓"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
