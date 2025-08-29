"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyUser = async () => {
    try {
      console.log("Verifying user");
      const response = await fetch("/api/proxy/users/me/", {
        method: "GET",
        credentials: "include",
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
      throw error;
    } finally {
      setLoading(false);
      console.log("User verification finished, loading set to false");
    }
  };

  useEffect(() => {
    verifyUser().catch(() => {
      console.log("Initial verification failed, staying on current page");
    });
  }, []);

  const login = async (credentials) => {
    console.log("AuthContext login called with credentials");
    try {
      const response = await fetch("/api/proxy/users/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await verifyUser();
      return userData; // Ensure userData is returned
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    console.log("Logging out user");
    await fetch("/api/logout", { method: "POST", credentials: "include" });
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