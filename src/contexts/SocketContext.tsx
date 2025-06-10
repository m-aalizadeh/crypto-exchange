// context/SocketContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Define types for the context
type Message = {
  text: string;
  sender: string;
  time: string;
};

type Price = {
  symbol: string;
  price: string;
  name: string;
  change: string;
  sparkline: string[];
};

type Prices = Price[];

interface SocketContextType {
  socket: Socket | null;
  messages: Message[];
  prices: Prices;
  sendMessage: (message: Omit<Message, "time">) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Custom hook for using the socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Provider component
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [prices, setPrices] = useState<Prices>([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for price updates
    newSocket.on("updatePrices", (data: Prices) => {
      console.log(data);
      setPrices(data);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (message: Omit<Message, "time">) => {
    if (socket) {
      const completeMessage: Message = {
        ...message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("sendMessage", completeMessage);
    }
  };

  const value: SocketContextType = {
    socket,
    messages,
    prices,
    sendMessage,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
