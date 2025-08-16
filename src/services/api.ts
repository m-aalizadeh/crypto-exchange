import axios from "axios";
import type { ApiResponse } from "../types/api";
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ApiError {
  status?: "error";
  message: string;
  validationErrors?: Array<{ [key: string]: string }>;
  [key: string]: any;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    const data: ApiResponse = response.data;

    if (data.status === "error") {
      return Promise.reject({
        ...data,
        message: data.message || "Request failed",
      });
    }

    return {
      ...response,
      data,
    };
  },
  (error) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject({
        status: "error",
        message: "Network Error. Please check your internet connection.",
      } as ApiError);
    }

    const { data, status } = error.response;

    if (
      data &&
      typeof data === "object" &&
      "status" in data &&
      "message" in data
    ) {
      return Promise.reject({
        ...data,
        status: "error",
      } as ApiError);
    }

    switch (status) {
      case 400:
        console.error("Bad Request:", data);
        return Promise.reject({
          status: "error",
          message: data?.message || "Invalid request data",
          validationErrors: data?.validationErrors,
        } as ApiError);
      case 401:
        console.error("Unauthorized:", data);
        window.location.href = "/login";
        return Promise.reject({
          status: "error",
          message: "Session expired. Please login again.",
        } as ApiError);
      case 403:
        console.error("Forbidden:", data);
        return Promise.reject({
          status: "error",
          message:
            data?.message ||
            "You don't have permission to access this resource.",
        } as ApiError);
      case 404:
        console.error("Not Found:", error.config.url);
        return Promise.reject({
          status: "error",
          message: data?.message || "The requested resource was not found.",
        } as ApiError);
      case 500:
        console.error("Server Error:", data);
        return Promise.reject({
          status: "error",
          message: data?.message || "An unexpected server error occurred.",
        } as ApiError);
      default:
        return Promise.reject({
          status: "error",
          message: "An unexpected error occurred",
        } as ApiError);
    }
  }
);

export default api;
