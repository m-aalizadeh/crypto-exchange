import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header";

export const HomeLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
