import { Navigate, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiCall } from "../services/api";
import type { ApiResponse } from "../types/api";

export const ProtectedRoute = () => {
  const {
    state: { user, loading },
    getCurrentUser,
  } = useAuth();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await apiCall<ApiResponse>("GET", "/user/verifyToken");
      if (response.status === "error") {
        navigate("/login");
        return;
      }
      if (window.location.pathname.startsWith("/dashboard") && user === null) {
        await getCurrentUser();
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  if (loading || isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
