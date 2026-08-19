import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLang } from '../context/LangContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Heart, ShoppingCart, Trash2, Star, Sparkles } from 'lucide-react';

export function WishlistPage({ onSelectGame }) {
  const { lang, t } = useLang();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await api.getWishlist();
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const handleRemoveWishlist = async (gameId, e) => {
    e.stopPropagation();
    try {
      await api.toggleWishlist(gameId);
      setWishlist((prev) => prev.filter((item) => item.id !== gameId));
      addToast({
        title: 'Удалено из желаемого',
        message: 'Игра удалена из вашего списка',
        icon: '💔'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToCart = async (game, e) => {
    e.stopPropagation();
    const success = await addToCart(game);
    if (success) {
      handleRemoveWishlist(game.id, e);
    }
  };

  if (!user) {
    return (
      <div className="p-12 text-center rounded-3xl bg-theme-surface border border-theme-border text-theme-text space-y-4 max-w-md mx-auto">
        <Heart size={36} className="mx-auto text-rose-500" />
        <h2 className="text-xl font-black">Войдите в аккаунт</h2>
        <p className="text-xs text-theme-muted">Чтобы просматривать и сохранять игры в желаемое.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 rounded-full border-4 border-theme-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Heart size={22} className="fill-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-theme-text uppercase tracking-tight">{t('wishlist')}</h1>
            <p className="text-xs text-theme-muted">{wishlist.length} игр в списке ожидания</p>
          </div>
        </div>
      </div>

      {/* Wishlist Items List */}
      {wishlist.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-theme-surface border border-theme-border text-theme-muted space-y-3">
          <Heart size={36} className="mx-auto text-theme-muted/40" />
          <h3 className="font-bold text-base text-theme-text">Список желаемого пуст</h3>
          <p className="text-xs">Нажимайте на сердечко у игр в магазине, чтобы следить за скидками!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wishlist.map((game) => {
            const discount = game.discountPercent || 0;
            const finalPriceRub = discount > 0 ? Math.round(game.priceRub * (1 - discount / 100)) : game.priceRub;
            const finalPriceUsd = discount > 0 ? Number((game.priceUsd * (1 - discount / 100)).toFixed(2)) : game.priceUsd;

            return (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="group p-4 rounded-2xl bg-theme-surface border border-theme-border hover:border-theme-primary/60 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer transition-all duration-300 shadow-md"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-20 h-14 object-cover rounded-xl flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-theme-text group-hover:text-theme-primary transition-colors">
                      {game.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                        <Star size={12} className="fill-amber-400" />
                        <span>{game.rating}</span>
                      </div>
                      <span className="text-[10px] text-theme-muted">• {game.categories?.[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  {/* Price Block */}
                  <div className="text-right">
                    {discount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white font-black text-[10px]">
                          -{discount}%
                        </span>
                        <span className="text-xs line-through text-theme-muted">
                          {formatPrice(game.priceRub, game.priceUsd)}
                        </span>
                        <span className="text-base font-black text-theme-primary">
                          {formatPrice(finalPriceRub, finalPriceUsd)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base font-black text-theme-primary">
                        {formatPrice(game.priceRub, game.priceUsd)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleMoveToCart(game, e)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-xs font-bold shadow-glow-primary hover:opacity-90 active:scale-95 flex items-center gap-1.5"
                    >
                      <ShoppingCart size={14} />
                      <span>{t('addToCart')}</span>
                    </button>

                    <button
                      onClick={(e) => handleRemoveWishlist(game.id, e)}
                      className="p-2 rounded-xl bg-theme-card hover:bg-rose-500/20 text-theme-muted hover:text-rose-400 border border-theme-border transition-colors"
                      title="Удалить из списка"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
