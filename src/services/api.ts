import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject({
        message: "Network Error. Please check your internet connection.",
      });
    }

    const { data } = error.response;
    const originalRequest = error.config;

    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error("Bad Request:", data);
          return Promise.reject({
            ...data,
            message: data.message || "Invalid request data",
          });
        case 401:
          console.error("Token exipred!:");
          window.location.href = "/login";
          return Promise.reject({
            message: "Session expired. Please login again.",
          });
        case 403:
          console.error("Forbidden:", data);
          return Promise.reject({
            ...data,
            message:
              data.message ||
              "You don't have permission to access this resource.",
          });
        case 404:
          console.error("Not Found:", originalRequest.url);
          return Promise.reject({
            ...data,
            message: data.message || "The requested resource was not found.",
          });
        case 500:
          console.error("Server Error:", data);
          return Promise.reject({
            ...data,
            message: data.message || "An unexpected server error occurred.",
          });
        default:
      }
    }
    return Promise.reject(error);
  }
);

export default api;
