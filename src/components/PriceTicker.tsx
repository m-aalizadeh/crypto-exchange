import { useSocket } from "../contexts/SocketContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SparklineChart from "./SparklineChart";

type PriceData = {
  symbol: string;
  price: string;
  name: string;
  change: string;
  sparkline: string[];
};

const ITEMS_PER_PAGE = 10;

const PriceTicker = () => {
  const { prices } = useSocket();
  const [displayedPrices, setDisplayedPrices] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (prices.length > 0) {
      setIsLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());

      const mappedPrices = prices.map(
        ({ symbol, price, name, change, sparkline }) => {
          const currentPrice = parseFloat(price);
          return {
            symbol,
            price: currentPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            name,
            change,
            sparkline,
          };
        }
      );
      setDisplayedPrices(mappedPrices);
    }
  }, [prices]);

  const filteredPrices = displayedPrices.filter((price) =>
    price.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPrices.length / ITEMS_PER_PAGE);
  const paginatedPrices = filteredPrices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getChangeColor = (change: string | undefined) => {
    if (!change) return "text-gray-500";
    return parseFloat(change) >= 0 ? "text-green-500" : "text-red-500";
  };

  const priceItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold text-white">Live Crypto Prices</h2>

          <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search coins..."
                className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {isLoading ? (
                <FiRefreshCw className="animate-spin text-gray-400" />
              ) : (
                <span className="text-sm text-gray-400">
                  Updated: {lastUpdated}
                </span>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              <AnimatePresence>
                {paginatedPrices.length > 0 ? (
                  paginatedPrices.map(
                    ({ symbol, name, price, change, sparkline }) => (
                      <motion.div
                        key={symbol}
                        variants={priceItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center min-w-0">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                            style={{ backgroundColor: "#6b7280" }}
                          >
                            <span className="text-sm font-medium text-white">
                              {symbol.slice(0, 3)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-white truncate">
                              {name}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center ml-4">
                          <div className="text-right mr-4">
                            <p className="font-semibold text-white">{price}</p>
                          </div>
                          <div className="w-24 h-12">
                            <SparklineChart
                              data={sparkline}
                              currentPrice={price}
                              change={change}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )
                  )
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No matching cryptocurrencies found
                  </div>
                )}
              </AnimatePresence>
            </div>

            {filteredPrices.length > ITEMS_PER_PAGE && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  <FiChevronLeft className="mr-1" />
                  Previous
                </button>

                <div className="text-gray-300">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  Next
                  <FiChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-gray-800 px-6 py-3 text-center">
        <p className="text-xs text-gray-400">
          Showing {paginatedPrices.length} of {filteredPrices.length} coins •
          Data provided by CoinCap API
        </p>
      </div>
    </div>
  );
};

export default PriceTicker;
