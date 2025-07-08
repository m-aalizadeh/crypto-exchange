import { useState, useEffect } from "react";
import { FiStar, FiX, FiPlus } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

type Price = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
};

const Watchlist = () => {
  const {
    state: { user },
  } = useAuth();
  const [allCryptos, setAllCryptos] = useState<Price[]>([]);
  const [watchlist, setWatchlist] = useState<Price[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCryptos = async () => {
      const response = await api.get("/allCryptos");
      if (Array.isArray(response.data) && response.data.length > 0) {
        setAllCryptos(response.data);
      }
    };
    const fetchWatchlist = async () => {
      const response = await api.get(`/watchlist/${user?._id}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setWatchlist(response.data);
      }
    };
    fetchWatchlist();
    fetchCryptos();
  }, []);

  const availableCryptos = allCryptos.filter(
    (crypto) =>
      !watchlist.some((item) => item.id === crypto.id) &&
      (crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddToWatchlist = async (cryptoId: string) => {
    const coinData = allCryptos.find((crypto) => crypto.id === cryptoId);
    if (!coinData) {
      return;
    }
    setWatchlist([...watchlist, coinData]);
    await api.post("/watchlist/addWatchlist", {
      userId: user?._id,
      coinData,
    });
    setIsAdding(false);
    setSearchQuery("");
  };

  const handleRemoveFromWatchlist = async (coinId: string) => {
    setWatchlist(watchlist.filter((item) => item.id !== coinId));
    // await api.delete("/watchlist/removeFromWatchlist", {
    //   coinId,
    //   userId: user?._id,
    // });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white transition-colors duration-200">
          My Watchlist
        </h2>
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors duration-200"
          >
            <FiPlus size={14} /> Add
          </button>
        ) : (
          <button
            onClick={() => {
              setIsAdding(false);
              setSearchQuery("");
            }}
            className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 px-3 py-1 rounded transition-colors duration-200"
          >
            Cancel
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded 
              bg-white dark:bg-gray-700 
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              transition-colors duration-200"
          />
          <div className="mt-2 max-h-60 overflow-y-auto">
            {availableCryptos.length > 0 ? (
              availableCryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                  onClick={() => handleAddToWatchlist(crypto.id)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-6 h-6"
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {crypto.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {crypto.symbol.toUpperCase()}
                    </span>
                  </div>
                  <FiStar className="text-yellow-400 dark:text-yellow-300" />
                </div>
              ))
            ) : (
              <p className="p-2 text-gray-500 dark:text-gray-400">
                No cryptocurrencies found
              </p>
            )}
          </div>
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="text-center py-8">
          <FiStar className="mx-auto text-gray-400 dark:text-gray-500 text-4xl mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            Your watchlist is empty
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Add some cryptocurrencies
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Coin
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  24h
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {watchlist.map((crypto) => (
                <tr
                  key={crypto.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-6 h-6 mr-2"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {crypto.name}
                      </span>
                      <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
                        {crypto.symbol.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-900 dark:text-white">
                    ${crypto.current_price.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-right ${
                      crypto.price_change_percentage_24h >= 0
                        ? "text-green-500 dark:text-green-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-900 dark:text-white">
                    ${crypto.market_cap.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleRemoveFromWatchlist(crypto.id)}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                      title="Remove from watchlist"
                    >
                      <FiX size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
