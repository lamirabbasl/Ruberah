'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken, setToken } from '@/lib/utils/token';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setIsAuthenticated(true);
          setIsAdmin(data.role === 'admin');
          setUser({ name: data.name, email: data.email, phone: data.phone });
        })
        .catch(() => {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUser(null);
        });
    }
  }, []);

  const login = (token) => {
    setToken(token);
    fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(true);
        setIsAdmin(data.role === 'admin');
        setUser({ name: data.name, email: data.email, phone: data.phone });
      });
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};