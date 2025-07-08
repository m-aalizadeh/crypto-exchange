import MarketOverview from "../components/MarketOverview";
import MarketCapChart from "../components/MarketCapChart";
import CryptocurrencyTable from "../components/CryptocurrencyTable";
import TopMovers from "../components/TopMovers";
import { useSocket } from "../contexts/SocketContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { prices = [], isLoading } = useSocket();
  const { t } = useTranslation("translation");

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        {t(`cryptocurrencyMarketOverview`)}
      </h1>
      <MarketOverview data={prices} />
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <MarketCapChart data={prices} />
        </div>
        <div className="lg:w-1/3">
          <TopMovers data={prices} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Top 100 Cryptocurrencies by Market Cap
          </h2>
          <CryptocurrencyTable pageSize={10} data={prices} />
        </div>
      </div>
    </div>
  );
};

export default Home;
