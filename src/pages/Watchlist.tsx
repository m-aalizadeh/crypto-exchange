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
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">My Watchlist</h2>
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            <FiPlus size={14} /> Add
          </button>
        ) : (
          <button
            onClick={() => {
              setIsAdding(false);
              setSearchQuery("");
            }}
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
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
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 max-h-60 overflow-y-auto">
            {availableCryptos.length > 0 ? (
              availableCryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAddToWatchlist(crypto.id)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-6 h-6"
                    />
                    <span className="font-medium">{crypto.name}</span>
                    <span className="text-gray-500 text-sm">
                      {crypto.symbol.toUpperCase()}
                    </span>
                  </div>
                  <FiStar className="text-yellow-400" />
                </div>
              ))
            ) : (
              <p className="p-2 text-gray-500">No cryptocurrencies found</p>
            )}
          </div>
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="text-center py-8">
          <FiStar className="mx-auto text-gray-400 text-4xl mb-2" />
          <p className="text-gray-500">Your watchlist is empty</p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 text-blue-500 hover:text-blue-600"
          >
            Add some cryptocurrencies
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coin
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  24h
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {watchlist.map((crypto) => (
                <tr key={crypto.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-6 h-6 mr-2"
                      />
                      <span className="font-medium">{crypto.name}</span>
                      <span className="ml-2 text-gray-500 text-sm">
                        {crypto.symbol.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    ${crypto.current_price.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-right ${
                      crypto.price_change_percentage_24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    ${crypto.market_cap.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleRemoveFromWatchlist(crypto.id)}
                      className="text-red-500 hover:text-red-700"
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
