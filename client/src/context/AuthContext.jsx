import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotification();

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('bryansk_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (err) {
      console.error('Failed to get current user:', err);
      localStorage.removeItem('bryansk_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('bryansk_token', data.token);
    setUser(data.user);
    addToast({
      title: 'С возвращением!',
      message: `Вы вошли как ${data.user.nickname}`,
      icon: '🎮',
      type: 'success'
    });
    return data;
  };

  const register = async (email, password, nickname) => {
    const data = await api.register({ email, password, nickname });
    localStorage.setItem('bryansk_token', data.token);
    setUser(data.user);
    addToast({
      title: 'Добро пожаловать!',
      message: `Аккаунт ${data.user.nickname} успешно создан`,
      icon: '✨',
      type: 'success'
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('bryansk_token');
    setUser(null);
    addToast({
      title: 'Выход из аккаунта',
      message: 'До скорых встреч!',
      icon: '👋'
    });
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile, refreshUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
