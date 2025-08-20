import React, { createContext, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../services/cookieUtils";
import useToast from "../hooks/useToast";
import { apiCall } from "../services/api";
import type { ApiResponse } from "../types/api";
import { useTranslation } from "react-i18next";

type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  online: boolean;
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
  const toast = useToast();
  const { t } = useTranslation("translation");

  const login = async (username: string, password: string) => {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      const result = await apiCall<ApiResponse>("POST", "/user/signin", {
        username,
        password,
      });
      if (result.status === "success" && result.user && result.token) {
        localStorage.setItem("token", result.token);
        toast.showSuccess(result.message || t("Login successful"));
        dispatch({ type: "AUTH_SUCCESS", payload: result.user });
        navigate("/dashboard");
      } else {
        const errorMsg = result.message || t("Login failed");
        toast.showError(errorMsg);
        dispatch({ type: "AUTH_FAILURE", payload: errorMsg });
      }
    } catch (error: unknown) {
      let errorMessage = t("Login failed");
      if (typeof error === "object" && error !== null) {
        const apiError = error as {
          message?: string;
          validationErrors?: Array<{ message: string }>;
        };

        errorMessage = apiError.message || errorMessage;

        if (apiError.validationErrors?.length) {
          apiError.validationErrors.forEach((err) => {
            toast.showError(err.message);
          });
        } else {
          toast.showError(errorMessage);
        }
      } else {
        toast.showError(errorMessage);
      }

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
      const result = await apiCall<ApiResponse>("POST", "/user/signup", {
        username,
        email,
        password,
      });
      if (result.status === "success" && result.user && result.token) {
        localStorage.setItem("token", result.token);
        toast.showSuccess("Registration successful");
        dispatch({ type: "AUTH_SUCCESS", payload: result.user });
        navigate("/dashboard");
      } else {
        const errorMsg = result.message || t("Registration failed");
        toast.showError(errorMsg);
        dispatch({ type: "AUTH_FAILURE", payload: errorMsg });
      }
    } catch (error: unknown) {
      let errorMessage = t("Registration failed");

      if (typeof error === "object" && error !== null) {
        const apiError = error as {
          message?: string;
          validationErrors?: Array<{ message: string }>;
        };

        errorMessage = apiError.message || errorMessage;

        if (apiError.validationErrors?.length) {
          apiError.validationErrors.forEach((err) => {
            toast.showError(err.message);
          });
        } else {
          toast.showError(errorMessage);
        }
      } else {
        toast.showError(errorMessage);
      }

      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
    }
  };

  const getCurrentUser = async () => {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      const response = await apiCall<ApiResponse>("GET", "/user/currentUser");
      if (response.status === "success" && response.user) {
        dispatch({ type: "AUTH_SUCCESS", payload: response.user });
      }
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE", payload: "Token got expired" });
    }
  };

  const logout = async () => {
    try {
      await apiCall("GET", "/user/logout");
      localStorage.clear();
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
