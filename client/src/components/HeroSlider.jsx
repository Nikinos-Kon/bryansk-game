import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { 
  Play, 
  ShoppingCart, 
  Sparkles, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Flame,
  ShieldAlert
} from 'lucide-react';

export function HeroSlider({ featuredGames = [], onSelectGame }) {
  const { lang, t } = useLang();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!featuredGames.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  if (!featuredGames || featuredGames.length === 0) return null;

  const game = featuredGames[currentIndex] || featuredGames[0];
  const discount = game.discountPercent || 0;
  const finalPriceRub = discount > 0 ? Math.round(game.priceRub * (1 - discount / 100)) : game.priceRub;
  const finalPriceUsd = discount > 0 ? Number((game.priceUsd * (1 - discount / 100)).toFixed(2)) : game.priceUsd;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-theme-border bg-theme-surface min-h-[420px] md:min-h-[460px] flex flex-col justify-end transition-all duration-500 group">
      
      {/* Background Image with Dynamic Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-100 group-hover:scale-105"
        style={{ backgroundImage: `url(${game.headerBanner || game.coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-theme-surface via-theme-surface/75 to-transparent backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-surface via-theme-surface/40 to-transparent" />
      </div>

      {/* Slide Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-theme-surface/80 hover:bg-theme-primary text-theme-text hover:text-white backdrop-blur-md border border-theme-border flex items-center justify-center transition-all z-20 shadow-lg opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredGames.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-theme-surface/80 hover:bg-theme-primary text-theme-text hover:text-white backdrop-blur-md border border-theme-border flex items-center justify-center transition-all z-20 shadow-lg opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={20} />
      </button>

      {/* Content Container */}
      <div className="relative z-10 p-6 md:p-10 max-w-2xl flex flex-col items-start gap-4">
        
        {/* Category & Badge Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-theme-primary/20 text-theme-primary border border-theme-primary/30 text-xs font-black uppercase tracking-wider flex items-center gap-1">
            <Flame size={14} />
            {t('heroBadge')}
          </span>
          {game.categories?.map((cat) => (
            <span key={cat} className="px-3 py-1 rounded-full bg-theme-card/80 backdrop-blur-md border border-theme-border text-xs font-medium text-theme-text">
              {cat}
            </span>
          ))}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Star size={13} className="fill-amber-400" />
            <span>{game.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black text-theme-text tracking-tight leading-tight uppercase drop-shadow-md">
          {game.title}
        </h1>

        {/* Short Description */}
        <p className="text-sm md:text-base text-theme-muted line-clamp-2 max-w-xl font-normal leading-relaxed">
          {lang === 'en' ? (game.shortDescEn || game.descriptionEn) : (game.shortDescRu || game.descriptionRu)}
        </p>

        {/* Price & Actions Row */}
        <div className="flex flex-wrap items-center gap-4 mt-2">
          
          {/* Price Tag with Discount */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-theme-card/90 backdrop-blur-md border border-theme-border shadow-inner">
            {discount > 0 ? (
              <>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-black text-xs shadow-sm">
                  -{discount}%
                </span>
                <span className="text-xs text-theme-muted line-through font-semibold">
                  {formatPrice(game.priceRub, game.priceUsd)}
                </span>
                <span className="text-xl font-black text-theme-primary">
                  {formatPrice(finalPriceRub, finalPriceUsd)}
                </span>
              </>
            ) : (
              <span className="text-xl font-black text-theme-primary">
                {formatPrice(game.priceRub, game.priceUsd)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => onSelectGame(game)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-sm font-extrabold shadow-glow-primary hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>{t('buyNow')}</span>
          </button>

          <button
            onClick={() => addToCart(game)}
            className="px-4 py-3 rounded-2xl bg-theme-card/80 hover:bg-theme-card border border-theme-border text-theme-text text-sm font-bold backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
            title={t('addToCart')}
          >
            <ShoppingCart size={18} />
          </button>
        </div>

      </div>

      {/* Dots Indicator */}
      <div className="relative z-10 p-6 pt-0 flex items-center gap-2">
        {featuredGames.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-theme-primary' : 'w-2 bg-theme-border hover:bg-theme-muted'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
