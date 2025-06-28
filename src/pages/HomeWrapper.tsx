import { SocketProvider } from "../contexts/SocketContext";
import Home from "./Home";

export const HomeWrapper = () => {
  return (
    <SocketProvider>
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Home />
      </main>
    </SocketProvider>
  );
};
