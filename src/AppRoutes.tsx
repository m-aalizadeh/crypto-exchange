import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./pages/Layout/MainLayout";
import { AuthLayout } from "./pages/Layout/AuthLayout";
import { HomeLayout } from "./pages/Layout/HomeLayout";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Registration";
import { Dashboard } from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { HomeWrapper } from "./pages/HomeWrapper";
import Watchlist from "./pages/Watchlist";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { NotFound } from "./pages/NotFound";

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomeWrapper />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/watchlist" element={<Watchlist />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
