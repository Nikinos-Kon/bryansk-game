import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Gamepad2, 
  Play, 
  Download, 
  Check, 
  Clock, 
  Trophy, 
  Cloud, 
  HardDrive, 
  Search, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export function LibraryPage({ onSelectGame }) {
  const { lang, t } = useLang();
  const { user, refreshUser } = useAuth();
  const { addToast } = useNotification();

  const [library, setLibrary] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const data = await api.getLibrary();
      setLibrary(data.library || []);
      if (data.library && data.library.length > 0) {
        setSelectedGame(data.library[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleLaunchGame = async () => {
    if (!selectedGame) return;
    setIsPlaying(true);

    addToast({
      title: 'Запуск игры',
      message: `Запускаем «${selectedGame.title}»... Приятной игры!`,
      icon: '🎮',
      type: 'info'
    });

    try {
      // Simulate 30 mins playtime added
      const res = await api.playSession(selectedGame.id, 30);
      
      setTimeout(() => {
        setIsPlaying(false);
        // update playtime locally
        setLibrary((prev) =>
          prev.map((item) =>
            item.id === selectedGame.id ? { ...item, playtimeMin: res.playtimeMin } : item
          )
        );
        setSelectedGame((prev) => ({ ...prev, playtimeMin: res.playtimeMin }));
        refreshUser();

        addToast({
          title: 'Игровая сессия завершена',
          message: `Время в «${selectedGame.title}»: ${res.playtimeMin} мин. Уровень повышен!`,
          icon: '🏆',
          type: 'success'
        });
      }, 3500);
    } catch (err) {
      setIsPlaying(false);
      console.error(err);
    }
  };

  const handleToggleInstall = async () => {
    if (!selectedGame) return;
    try {
      const res = await api.toggleInstall(selectedGame.id);
      setLibrary((prev) =>
        prev.map((item) =>
          item.id === selectedGame.id ? { ...item, isInstalled: res.isInstalled } : item
        )
      );
      setSelectedGame((prev) => ({ ...prev, isInstalled: res.isInstalled }));
      addToast({
        title: res.isInstalled ? 'Установка завершена' : 'Игра удалена',
        message: selectedGame.title,
        icon: res.isInstalled ? '💾' : '🗑️'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredGames = library.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 rounded-full border-4 border-theme-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (library.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-theme-surface border border-theme-border text-theme-text space-y-4 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-theme-card border border-theme-border flex items-center justify-center mx-auto text-theme-primary shadow-glow-primary">
          <Gamepad2 size={32} />
        </div>
        <h2 className="text-xl font-black">Ваша библиотека пока пуста</h2>
        <p className="text-xs text-theme-muted">
          Приобретайте любимые игры в магазине, и они сразу появятся здесь с поддержкой облачных сохранений и достижений!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 rounded-3xl bg-theme-surface/70 border border-theme-border overflow-hidden min-h-[600px] shadow-2xl backdrop-blur-md">
      
      {/* Left Steam-style Games List */}
      <div className="lg:col-span-1 border-r border-theme-border bg-theme-card/30 flex flex-col justify-between p-4 gap-4">
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-theme-text uppercase tracking-tight flex items-center gap-1.5">
              <Gamepad2 size={16} className="text-theme-primary" />
              <span>{t('libraryTitle')}</span>
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-theme-card border border-theme-border text-theme-muted">
              {library.length}
            </span>
          </div>

          {/* Quick Filter */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по библиотеке..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-theme-card border border-theme-border text-xs text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-primary"
            />
          </div>

          {/* Games List */}
          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {filteredGames.map((game) => {
              const isSelected = selectedGame?.id === game.id;
              return (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-theme-primary/20 to-transparent border border-theme-primary/50 text-theme-primary font-bold shadow-sm'
                      : 'hover:bg-theme-card text-theme-muted hover:text-theme-text border border-transparent'
                  }`}
                >
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate leading-tight">{game.title}</p>
                    <p className="text-[10px] text-theme-muted mt-0.5">
                      {Math.round((game.playtimeMin || 0) / 60)} {t('hours')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Quick Stats at bottom */}
        <div className="p-3 rounded-2xl bg-theme-card border border-theme-border text-xs space-y-1">
          <div className="flex justify-between text-theme-muted">
            <span>{t('ownedGames')}:</span>
            <span className="font-bold text-theme-text">{library.length}</span>
          </div>
          <div className="flex justify-between text-theme-muted">
            <span>{t('totalPlaytime')}:</span>
            <span className="font-bold text-theme-primary">
              {Math.round(library.reduce((acc, curr) => acc + (curr.playtimeMin || 0), 0) / 60)} {t('hours')}
            </span>
          </div>
        </div>

      </div>

      {/* Right Big Game Hub (Steam Detail View) */}
      {selectedGame && (
        <div className="lg:col-span-3 flex flex-col justify-between overflow-y-auto">
          
          <div>
            {/* Header Banner with Gradient */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden bg-black">
              <img
                src={selectedGame.headerBanner || selectedGame.coverImage}
                alt={selectedGame.title}
                className="w-full h-full object-cover opacity-60 transform scale-100 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theme-surface via-theme-surface/40 to-transparent" />

              {/* Title & Cloud Sync */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-black uppercase flex items-center gap-1">
                      <Cloud size={12} />
                      <span>Синхронизировано со Steam Cloud</span>
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-theme-text uppercase tracking-tight drop-shadow-lg">
                    {selectedGame.title}
                  </h1>
                </div>

                {/* Big Action Button (Play / Install) */}
                <div className="flex items-center gap-3">
                  {selectedGame.isInstalled ? (
                    <button
                      onClick={handleLaunchGame}
                      disabled={isPlaying}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-black shadow-lg hover:shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-2.5 disabled:opacity-75"
                    >
                      <Play size={18} className="fill-white" />
                      <span>{isPlaying ? t('gameRunning') : t('playGame')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleToggleInstall}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-sm font-black shadow-glow-primary hover:opacity-90 active:scale-95 transition-all flex items-center gap-2.5"
                    >
                      <Download size={18} />
                      <span>{t('installGame')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectGame(selectedGame)}
                    className="p-3.5 rounded-2xl bg-theme-card hover:bg-theme-border border border-theme-border text-theme-text transition-all"
                    title="Страница в магазине"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Play Stats Row */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-theme-border bg-theme-card/30">
              <div className="p-3 rounded-2xl bg-theme-card border border-theme-border">
                <span className="text-[10px] text-theme-muted uppercase font-bold">{t('totalPlaytime')}</span>
                <p className="text-lg font-black text-theme-text mt-0.5">
                  {Math.round((selectedGame.playtimeMin || 0) / 60)} {t('hours')} ({selectedGame.playtimeMin || 0} {t('minutes')})
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-theme-card border border-theme-border">
                <span className="text-[10px] text-theme-muted uppercase font-bold">Статус установки</span>
                <p className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <Check size={15} />
                  <span>{selectedGame.isInstalled ? t('installed') : 'Не установлено'}</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-theme-card border border-theme-border">
                <span className="text-[10px] text-theme-muted uppercase font-bold">{t('achievements')}</span>
                <p className="text-lg font-black text-amber-400 mt-0.5">
                  {selectedGame.achievements?.length || 2} / 10
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-theme-card border border-theme-border">
                <span className="text-[10px] text-theme-muted uppercase font-bold">{t('developer')}</span>
                <p className="text-xs font-bold text-theme-text mt-1 truncate">
                  {selectedGame.developer}
                </p>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-black uppercase text-theme-muted tracking-wider flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                <span>{t('achievements')} Steam / Bryansk_game</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-theme-card border border-theme-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg shadow-sm">
                    🥇
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-theme-text">Первый запуск</h4>
                    <p className="text-[10px] text-theme-muted">Запустите игру впервые на платформе</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-theme-card border border-theme-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-theme-primary/20 text-theme-primary flex items-center justify-center text-lg shadow-sm">
                    🎯
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-theme-text">Мастер тактики</h4>
                    <p className="text-[10px] text-theme-muted">Завершите 5 раундов без единого поражения</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
