import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/services';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then(({ data }) => setUser(data.data))
      .catch(() => { localStorage.clear(); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password });
    const { user: u, accessToken, refreshToken } = data.data;
    localStorage.setItem('accessToken',  accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user',         JSON.stringify(u));
    setUser(u);
    toast.success(`Welcome back, ${u.full_name.split(' ')[0]}!`);
    return u;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    const { user: u, accessToken, refreshToken } = data.data;
    localStorage.setItem('accessToken',  accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user',         JSON.stringify(u));
    setUser(u);
    toast.success('Account created!');
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out');
  }, []);

  const isAdmin   = user?.role === 'admin';
  const isManager = user?.role === 'admin' || user?.role === 'manager';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isManager }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};