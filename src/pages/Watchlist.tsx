import { useState } from "react";
import { FiStar, FiX, FiPlus } from "react-icons/fi";

const Watchlist = () => {
  const allCryptos = [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 51234.78,
      price_change_percentage_24h: 2.34,
      market_cap: 1000000000000,
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 2987.65,
      price_change_percentage_24h: -1.23,
      market_cap: 358000000000,
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      current_price: 1.45,
      price_change_percentage_24h: 5.67,
      market_cap: 49000000000,
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      current_price: 145.89,
      price_change_percentage_24h: 8.91,
      market_cap: 48000000000,
    },
    {
      id: "ripple",
      symbol: "xrp",
      name: "XRP",
      image:
        "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      current_price: 0.54,
      price_change_percentage_24h: -0.45,
      market_cap: 26000000000,
    },
  ];

  const [watchlist, setWatchlist] = useState([allCryptos[0], allCryptos[1]]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const availableCryptos = allCryptos.filter(
    (crypto) =>
      !watchlist.some((item) => item.id === crypto.id) &&
      (crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddToWatchlist = (cryptoId: string) => {
    const crypto = allCryptos.find((crypto) => crypto.id === cryptoId);
    if (!crypto) {
      return;
    }
    setWatchlist([...watchlist, crypto]);
    setIsAdding(false);
    setSearchQuery("");
  };

  const handleRemoveFromWatchlist = (cryptoId: string) => {
    setWatchlist(watchlist.filter((item) => item.id !== cryptoId));
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
