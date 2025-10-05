import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AIRBNB_API_URL || "https://airbnbnew.cybersoft.edu.vn",
  headers: {
    "Content-Type": "application/json",
    TokenCybersoft: process.env.NEXT_PUBLIC_TOKEN_CYBERSOFT ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjIyLzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2OTA0MDAwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY5MTkxMjAwfQ.kBKKhbMMH6Pqm5TdwA9DOp9z6srHiyc9KnYL_084PPo",
  },
  timeout: 10000,
});

// Request interceptor để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          throw new Error(data?.message || "Bad request. Please check your input.");
        case 401:
          throw new Error(data?.message || "Unauthorized. Please login again.");
        case 403:
          throw new Error(data?.message || "Forbidden. You do not have permission.");
        case 404:
          throw new Error(data?.message || "Resource not found.");
        case 500:
          throw new Error(data?.message || "Server error. Please try again later.");
        default:
          throw new Error(data?.message || "An unexpected error occurred.");
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
);

export default api;
