import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('minoforge_user');
      const token = localStorage.getItem('token');
      return (savedUser && token) ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.getMe();
          const fetchedUser = res.data.user || res.data;
          setUser(fetchedUser);
          localStorage.setItem('minoforge_user', JSON.stringify(fetchedUser));
        } catch (error) {
          // If token explicitly expired (401), logout. Otherwise keep cached user session
          if (error.response?.status === 401) {
            console.error('Session expired', error);
            localStorage.removeItem('token');
            localStorage.removeItem('minoforge_user');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for unauthorized events from axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('minoforge_user');
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('minoforge_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password) => {
    const res = await api.register(username, email, password);
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('minoforge_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (credential) => {
    const res = await api.googleLogin(credential);
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('minoforge_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const verifyLoginCode = async (email, code, username) => {
    const res = await api.verifyCode(email, code, username);
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('minoforge_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('minoforge_user');
    setUser(null);
  };

  const updateUser = (newData) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...newData };
      localStorage.setItem('minoforge_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, verifyLoginCode, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
