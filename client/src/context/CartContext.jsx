import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], count: 0, summary: { totalRub: 0, totalUsd: 0, discountRub: 0, discountUsd: 0 } });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useNotification();

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], count: 0, summary: { totalRub: 0, totalUsd: 0, discountRub: 0, discountUsd: 0 } });
      return;
    }

    try {
      setLoading(true);
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (game) => {
    if (!user) {
      addToast({
        title: 'Требуется авторизация',
        message: 'Войдите в аккаунт, чтобы добавить игру в корзину',
        icon: '🔒',
        type: 'warning'
      });
      return false;
    }

    try {
      await api.addToCart(game.id);
      addToast({
        title: 'Добавлено в корзину',
        message: `«${game.title}» теперь в корзине`,
        icon: '🛒',
        type: 'success'
      });
      fetchCart();
      return true;
    } catch (err) {
      addToast({
        title: 'Внимание',
        message: err.message,
        icon: '⚠️',
        type: 'error'
      });
      return false;
    }
  };

  const removeFromCart = async (gameId) => {
    try {
      await api.removeFromCart(gameId);
      fetchCart();
      addToast({
        title: 'Удалено из корзины',
        message: 'Товар удален из корзины',
        icon: '🗑️'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      setCart({ items: [], count: 0, summary: { totalRub: 0, totalUsd: 0, discountRub: 0, discountUsd: 0 } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
