// src/services/api.ts
import axios from "axios";
import { getCookie } from "./cookieUtils";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor for CSRF token
api.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrf_token");
  if (
    csrfToken &&
    ["post", "put", "patch", "delete"].includes(
      config.method?.toLowerCase() || ""
    )
  ) {
    config.headers["X-CSRF-TOKEN"] = csrfToken;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        // Logout user if refresh fails
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
