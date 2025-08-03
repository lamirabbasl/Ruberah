"use client"

// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getToken, removeToken, setToken } from "@/lib/utils/token";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyUser = async (token) => {
    try {
      console.log("Verifying user with token:", token); // Debug log
      const response = await fetch("/api/proxy/users/me/", {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error("Failed to verify user");

      const data = await response.json();
      console.log("User verified:", data);

      setIsAuthenticated(true);
      setIsAdmin(data.groups.includes("manager"));
      setUser({
        id: data.id,
        name: data.username,
        phone: data.phone_number,
        groups: data.groups,
      });

      return data;
    } catch (error) {
      console.error("Verification error:", error.message);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
      removeToken();
      // Do NOT redirect here to avoid interfering with login page
      throw error;
    } finally {
      setLoading(false);
      console.log("User verification finished, loading set to false");
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log("Initial token check:", token);
      verifyUser(token).catch(() => {
        console.log("Initial verification failed, staying on current page");
      });
    } else {
      setLoading(false);
      console.log("No token found, loading set to false");
    }
  }, []);

  const login = async (token) => {
    console.log("AuthContext login called with token:", token);
    setToken(token);
    const userData = await verifyUser(`Bearer ${token}`);
    return userData;
  };

  const logout = () => {
    console.log("Logging out user");
    removeToken();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        login,
        logout,
        userGroups: user?.groups || [],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};