import { useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  name: string;
  email: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    // In a real app, you would call your API here
    // For demo purposes, we'll just set a mock user
    setUser({ name: "Demo User", email });
    return Promise.resolve();
  };

  const register = async (name: string, email: string, password: string) => {
    // In a real app, you would call your API here
    setUser({ name, email });
    return Promise.resolve();
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return { user, login, register, logout };
};
