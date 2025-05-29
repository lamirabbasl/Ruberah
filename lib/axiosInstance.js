import axios from "axios";
import { getToken, setToken, removeToken } from "./utils/token";

const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error.message);
    return Promise.reject(error);
  }
);

// Handle response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post("/api/proxy/users/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        setToken(newAccessToken);
        localStorage.setItem("refresh_token", response.data.refresh);

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message);
        removeToken();
        localStorage.removeItem("refresh_token");

        if (typeof window !== "undefined") {
          window.location.href = "/api/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Log only error message without sensitive data
    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

export default api;
