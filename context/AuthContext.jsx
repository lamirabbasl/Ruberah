"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getToken, removeToken, setToken } from "@/lib/utils/token";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <== NEW


  const verifyUser = async (token) => {
    try {
      const response = await fetch("/api/proxy/users/me/", {
        headers: {
          Authorization: token,
        },
      });
  
      if (!response.ok) throw new Error("Failed to verify user");
  
      const data = await response.json();
  
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
      throw error;
    } finally {
      setLoading(false); // <== Always stop loading
    }
  };
  

  useEffect(() => {
    const token = getToken();
    if (token) {
      verifyUser(token).catch(() => {}); // Already handled
    } else {
      setLoading(false); // No token, done loading
    }
  }, []);
  

  const login = async (token) => {
    setToken(token);
    const userData = await verifyUser(`Bearer ${token}`);
    return userData;
  };

  const logout = () => {
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
