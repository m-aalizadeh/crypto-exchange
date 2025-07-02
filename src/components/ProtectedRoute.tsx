import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = () => {
  const {
    state: { user, loading },
    getCurrentUser,
  } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
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
