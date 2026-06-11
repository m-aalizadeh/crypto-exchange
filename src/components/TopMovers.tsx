import { formatPercentage } from "../lib/formatters";
import { useTranslation } from "react-i18next";
interface TopMoversProps {
  data: any[];
}

const TopMovers: React.FC<TopMoversProps> = ({ data }) => {
  const { t } = useTranslation("translation");
  if (!data.length) return null;

  const gainers = [...data]
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
    )
    .slice(0, 5);

  const losers = [...data]
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h,
    )
    .slice(0, 5);

  const mostTraded = [...data]
    .sort((a, b) => b.total_volume - a.total_volume)
    .slice(0, 5);

  return (
    <div className="flex gap-4">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-200">
          {t("topGainers")} (24h)
        </h3>
        <div className="space-y-3">
          {gainers.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                    {coin.symbol.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    {coin.name}
                  </span>
                </div>
              </div>
              <span className="text-green-500 dark:text-green-400 font-medium transition-colors duration-200">
                ↑ {formatPercentage(coin.price_change_percentage_24h)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-200">
          {t("topLosers")} (24h)
        </h3>
        <div className="space-y-3">
          {losers.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                    {coin.symbol.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    {coin.name}
                  </span>
                </div>
              </div>
              <span className="text-red-500 dark:text-red-400 font-medium transition-colors duration-200">
                ↓ {formatPercentage(Math.abs(coin.price_change_percentage_24h))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white transition-colors duration-200">
          {t("mostTraded")}
        </h3>
        <div className="space-y-3">
          {mostTraded.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                    {coin.symbol.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    {coin.name}
                  </span>
                </div>
              </div>
              <span className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-200">
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
