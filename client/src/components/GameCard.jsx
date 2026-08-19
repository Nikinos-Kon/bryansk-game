import React, { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Check, 
  Eye, 
  Gamepad2
} from 'lucide-react';

export function GameCard({ game, onSelectGame }) {
  const { lang, t } = useLang();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [isWishlisted, setIsWishlisted] = useState(Boolean(game.isWishlisted));
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const discount = game.discountPercent || 0;
  const finalPriceRub = discount > 0 ? Math.round(game.priceRub * (1 - discount / 100)) : game.priceRub;
  const finalPriceUsd = discount > 0 ? Number((game.priceUsd * (1 - discount / 100)).toFixed(2)) : game.priceUsd;

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      addToast({
        title: 'Требуется авторизация',
        message: 'Войдите, чтобы добавить игру в желаемое',
        icon: '🔒',
        type: 'warning'
      });
      return;
    }

    try {
      setWishlistLoading(true);
      const res = await api.toggleWishlist(game.id);
      setIsWishlisted(res.isWishlisted);
      addToast({
        title: res.isWishlisted ? 'Добавлено в желаемое' : 'Удалено из желаемого',
        message: game.title,
        icon: res.isWishlisted ? '💖' : '💔'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(game);
  };

  return (
    <div
      onClick={() => onSelectGame(game)}
      className="game-card-hover group relative flex flex-col rounded-2xl bg-theme-card border border-theme-border overflow-hidden cursor-pointer shadow-md select-none transition-all duration-300"
    >
      
      {/* Cover Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-theme-surface">
        <img
          src={game.coverImage}
          alt={game.title}
          className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-theme-card via-transparent to-black/30 opacity-80 group-hover:opacity-95 transition-opacity" />

        {/* Rating Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-[11px] font-black">
          <Star size={11} className="fill-amber-400" />
          <span>{game.rating}</span>
        </div>

        {/* Wishlist Heart Toggle (Top Right) */}
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
            isWishlisted
              ? 'bg-rose-500 text-white border-rose-400 shadow-lg scale-105'
              : 'bg-black/50 text-white/80 border-white/10 hover:bg-rose-500 hover:text-white'
          }`}
          title={t('wishlist')}
        >
          <Heart size={14} className={isWishlisted ? 'fill-white' : ''} />
        </button>

        {/* Quick Preview Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <span className="px-3.5 py-1.5 rounded-full bg-theme-primary text-white text-xs font-bold shadow-glow-primary flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={14} />
            <span>Подробнее</span>
          </span>
        </div>

        {/* Owned Badge */}
        {game.isOwned && (
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shadow-md">
            <Check size={11} />
            <span>{t('inLibrary')}</span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        
        <div>
          {/* Categories / Genre */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            {game.categories?.slice(0, 2).map((cat) => (
              <span key={cat} className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">
                {cat}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-theme-text group-hover:text-theme-primary transition-colors line-clamp-1 mt-0.5">
            {game.title}
          </h3>
        </div>

        {/* Price & Cart Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-theme-border/60">
          
          {/* Price Block */}
          <div className="flex items-center gap-1.5">
            {discount > 0 ? (
              <>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30">
                  -{discount}%
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-theme-muted line-through font-semibold leading-none">
                    {formatPrice(game.priceRub, game.priceUsd)}
                  </span>
                  <span className="text-sm font-black text-theme-text mt-0.5">
                    {formatPrice(finalPriceRub, finalPriceUsd)}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm font-black text-theme-text">
                {formatPrice(game.priceRub, game.priceUsd)}
              </span>
            )}
          </div>

          {/* Quick Cart Button */}
          {!game.isOwned && (
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-xl bg-theme-surface hover:bg-theme-primary hover:text-white border border-theme-border text-theme-text transition-all duration-200 shadow-sm"
              title={t('addToCart')}
            >
              <ShoppingCart size={15} />
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
