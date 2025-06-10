import { SocketProvider } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import PriceTicker from "../components/PriceTicker";

export const Home = () => {
  const {
    state: { user },
  } = useAuth();

  return (
    <SocketProvider>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Crypto Exchange Platform
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Trade cryptocurrencies with ease and security.
          </p>
          <div className="mt-8 flex justify-center space-x-3">
            <PriceTicker />
          </div>
        </div>
      </main>
    </SocketProvider>
  );
};
