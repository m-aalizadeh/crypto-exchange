// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};
