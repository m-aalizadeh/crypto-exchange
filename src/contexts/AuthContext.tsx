import React, { createContext, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../services/cookieUtils";
import api from "../services/api";

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

type AuthAction =
  | { type: "AUTH_REQUEST" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" };

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_REQUEST":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "AUTH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "AUTH_LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

type AuthContextType = {
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      const response = await api.post("/user/signin", { username, password });
      dispatch({ type: "AUTH_SUCCESS", payload: response.data });
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      const response = await api.post("/user/signup", {
        username,
        email,
        password,
      });
      dispatch({ type: "AUTH_SUCCESS", payload: response.data });
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
    }
  };

  const getCurrentUser = async () => {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      const response = await api.get("/user/currentUser");
      dispatch({ type: "AUTH_SUCCESS", payload: response.user });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE", payload: "Token got expired" });
    }
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } finally {
      deleteCookie("token");
      dispatch({ type: "AUTH_LOGOUT" });
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, getCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
