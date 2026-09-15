import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/login', { username, password });
      const authData = res.data;
      const userData = {
        userId: authData.userId,
        customerId: authData.customerId,
        username: authData.username,
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role,
      };

      setToken(authData.token);
      setUser(userData);
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/register', formData);
      const authData = res.data;
      const userData = {
        userId: authData.userId,
        customerId: authData.customerId,
        username: authData.username,
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role,
      };

      setToken(authData.token);
      setUser(userData);
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasRole = (...roles) => {
    if (!user || !user.role) return false;
    if (user.role === 'SYSTEM_ADMIN') return true; // Admin has access to all
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, hasRole, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
