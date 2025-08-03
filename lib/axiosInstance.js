// api.js
import axios from "axios";
import { getToken, setToken, removeToken } from "./utils/token";

const api = axios.create({
  baseURL: "/api/proxy",
});

// Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    console.log("API request:", config.url, "with headers:", config.headers); // Debug log
    return config;
  },
  (error) => {
    console.error("Request error:", error.message);
    return Promise.reject(error);
  }
);

// Handle response
api.interceptors.response.use(
  (response) => {
    console.log("API response:", response.status, response.config.url); // Debug log
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Skip redirect for login-related endpoints
    if (
      originalRequest.url.includes("login") ||
      originalRequest.url.includes("users/me") ||
      originalRequest.url.includes("token")
    ) {
      console.log("Skipping 401 handling for login-related endpoint:", originalRequest.url);
      return Promise.reject(error);
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("Handling 401 error for:", originalRequest.url);

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        console.log("Attempting token refresh...");
        const response = await axios.post("/api/proxy/users/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        setToken(newAccessToken);
        localStorage.setItem("refresh_token", response.data.refresh);
        console.log("Token refreshed successfully");

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message);
        removeToken();
        localStorage.removeItem("refresh_token");

        if (typeof window !== "undefined") {
          console.log("Redirecting to /api/auth/login due to refresh failure");
          window.location.href = "/api/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Log only error message without sensitive data
    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: originalRequest.url,
    });

    return Promise.reject(error);
  }
);

export default api;