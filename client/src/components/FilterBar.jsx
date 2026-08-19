import React from 'react';
import { useLang } from '../context/LangContext';
import { useCurrency } from '../context/CurrencyContext';
import { SlidersHorizontal, ArrowUpDown, Tag, X } from 'lucide-react';

export const CATEGORIES = [
  'All',
  'Action',
  'RPG',
  'Strategy',
  'Competitive',
  'Tactical',
  'Cyberpunk',
  'Racing',
  'Open World',
  'Souls-like'
];

export function FilterBar({ 
  selectedCategory, 
  onSelectCategory, 
  sortBy, 
  setSortBy, 
  minPrice, 
  setMinPrice, 
  maxPrice, 
  setMaxPrice,
  onResetFilters 
}) {
  const { lang, t } = useLang();
  const { currency, formatPrice } = useCurrency();

  const getCategoryLabel = (cat) => {
    const key = 'cat_' + cat.toLowerCase().replace(/[^a-z0-9]/g, '');
    const translated = t(key);
    return translated && translated !== key ? translated : cat;
  };

  const hasActiveFilters = selectedCategory !== 'All' || sortBy !== 'popular' || minPrice || maxPrice;

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Category Pills Bar (Reference 1 & 2 style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white shadow-glow-primary scale-105'
                  : 'bg-theme-card hover:bg-theme-border text-theme-muted hover:text-theme-text border border-theme-border'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          );
        })}
      </div>

      {/* Secondary Filter & Sort Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-theme-surface/70 backdrop-blur-md p-3 rounded-2xl border border-theme-border">
        
        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={15} className="text-theme-muted" />
          <span className="text-xs font-semibold text-theme-muted hidden sm:inline">{t('sortBy')}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-theme-card border border-theme-border text-xs font-bold text-theme-text rounded-xl px-3 py-1.5 focus:outline-none focus:border-theme-primary cursor-pointer"
          >
            <option value="popular">{t('sortPopular')}</option>
            <option value="rating">{t('sortRating')}</option>
            <option value="discount">{t('sortDiscount')}</option>
            <option value="newest">{t('sortNewest')}</option>
            <option value="price_asc">{t('sortPriceAsc')}</option>
            <option value="price_desc">{t('sortPriceDesc')}</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-theme-muted">{t('filterByPrice')}:</span>
          <input
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-16 px-2 py-1 text-xs rounded-lg bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary"
          />
          <span className="text-xs text-theme-muted">-</span>
          <input
            type="number"
            placeholder="5000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20 px-2 py-1 text-xs rounded-lg bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary"
          />
          <span className="text-xs font-bold text-theme-primary">{currency === 'RUB' ? '₽' : '$'}</span>
        </div>

        {/* Reset button if active */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-bold flex items-center gap-1 transition-all"
          >
            <X size={13} />
            <span>{t('clearFilters')}</span>
          </button>
        )}

      </div>

    </div>
  );
}
