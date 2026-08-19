import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLang } from '../context/LangContext';
import { HeroSlider } from '../components/HeroSlider';
import { GameCard } from '../components/GameCard';
import { SpecialOffersSidebar } from '../components/SpecialOffersSidebar';
import { FilterBar } from '../components/FilterBar';
import { Sparkles, Flame, Trophy, Compass, Search } from 'lucide-react';

export function StorePage({ searchQuery, onSelectGame, onBuyDirect }) {
  const { lang, t } = useLang();
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchGames = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (sortBy) params.sort = sortBy;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = await api.getGames(params);
      setGames(data.games || []);
    } catch (err) {
      console.error('Failed to load games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [searchQuery, selectedCategory, sortBy, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSortBy('popular');
    setMinPrice('');
    setMaxPrice('');
  };

  const featuredGames = games.filter(g => g.isFeatured) || games.slice(0, 3);
  const specialOffers = games.filter(g => g.isSpecialOffer || g.discountPercent > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Hero & Special Offers Section (Matches Reference 1 & 2) */}
      {!searchQuery && selectedCategory === 'All' && !minPrice && !maxPrice && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Slider (Takes 2 cols on large screens) */}
          <div className="lg:col-span-2">
            <HeroSlider featuredGames={featuredGames} onSelectGame={onSelectGame} />
          </div>

          {/* Right Side Special Offers Panel (Matches Reference 1) */}
          <div className="lg:col-span-1">
            <SpecialOffersSidebar
              specialGames={specialOffers}
              onSelectGame={onSelectGame}
              onViewAll={() => setSortBy('discount')}
            />
          </div>
        </div>
      )}

      {/* Filter and Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-theme-text uppercase tracking-tight flex items-center gap-2">
            <Compass size={20} className="text-theme-primary" />
            <span>{t('gameCatalog')}</span>
          </h2>
          <span className="text-xs text-theme-muted font-bold">
            {t('foundGames')}: {games.length}
          </span>
        </div>

        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Games Grid (3D Hover Cards) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-2xl bg-theme-card border border-theme-border h-72 animate-pulse" />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-theme-card border border-theme-border text-theme-muted space-y-3">
          <Search size={36} className="mx-auto text-theme-muted/40" />
          <h3 className="font-bold text-base text-theme-text">{t('noGamesFound')}</h3>
          <p className="text-xs">{t('noGamesFoundDesc')}</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-glow-primary"
          >
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} onSelectGame={onSelectGame} />
          ))}
        </div>
      )}

    </div>
  );
}
