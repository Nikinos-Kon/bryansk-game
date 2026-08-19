import React from 'react';
import { useLang } from '../context/LangContext';
import { useCurrency } from '../context/CurrencyContext';
import { Star, ChevronRight, Sparkles, Flame } from 'lucide-react';

export function SpecialOffersSidebar({ specialGames = [], onSelectGame, onViewAll }) {
  const { t } = useLang();
  const { formatPrice } = useCurrency();

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-theme-surface border border-theme-border p-5 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-base text-theme-text flex items-center gap-2 tracking-tight">
          <Flame size={18} className="text-theme-primary" />
          <span>{t('specialOffers')}</span>
        </h2>
        <span className="text-[11px] font-bold text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded-full border border-theme-primary/20">
          HOT
        </span>
      </div>

      {/* Special Offer Cards List */}
      <div className="flex flex-col gap-3.5">
        {specialGames.slice(0, 3).map((game) => {
          const discount = game.discountPercent || 0;
          const finalPriceRub = discount > 0 ? Math.round(game.priceRub * (1 - discount / 100)) : game.priceRub;
          const finalPriceUsd = discount > 0 ? Number((game.priceUsd * (1 - discount / 100)).toFixed(2)) : game.priceUsd;

          return (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-theme-card border border-theme-border cursor-pointer transition-all duration-300 hover:border-theme-primary hover:shadow-glow-primary hover:-translate-y-1"
            >
              {/* Image banner */}
              <div className="relative w-full h-28 overflow-hidden bg-theme-surface">
                <img
                  src={game.coverImage || game.headerBanner}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Rating Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-black border border-white/10">
                  <Star size={10} className="fill-amber-400" />
                  <span>{game.rating}</span>
                </div>

                {/* Discount Tag */}
                {discount > 0 && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black shadow-md">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-theme-text group-hover:text-theme-primary transition-colors line-clamp-1">
                    {game.title}
                  </h4>
                  <p className="text-[10px] text-theme-muted font-medium mt-0.5">
                    {game.categories?.[0] || 'Game'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-theme-text">
                    {formatPrice(finalPriceRub, finalPriceUsd)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* See All Button */}
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-xs font-bold shadow-glow-primary hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
        >
          <span>{t('viewAll')}</span>
          <ChevronRight size={14} />
        </button>
      )}

    </div>
  );
}
