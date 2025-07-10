import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { setupCryptoSocket } from "../lib/sockets";

type Price = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  circulating_supply: number;
  max_supply?: number;
};

type Prices = Price[];

interface SocketContextType {
  prices: Prices;
  isLoading: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [prices, setPrices] = useState<Prices>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const cryptoSocket = setupCryptoSocket();
    cryptoSocket.on("initialPrices", (initialPrices) => {
      setPrices(initialPrices);
    });

    cryptoSocket.on("updatePrices", (updatedPrices) => {
      setIsLoading(false);
      setPrices(updatedPrices);
    });

    return () => {
      cryptoSocket.disconnect();
    };
  }, []);

  const value: SocketContextType = {
    prices,
    isLoading,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
