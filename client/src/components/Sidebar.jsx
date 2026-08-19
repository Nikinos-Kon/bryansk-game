import React from 'react';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import { 
  Store, 
  Gamepad2, 
  Heart, 
  Users, 
  Globe,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export function Sidebar({ activePage, onNavigate, onOpenSupport }) {
  const { lang, setLang, t } = useLang();
  const { user } = useAuth();

  const navItems = [
    { id: 'store', icon: Store, label: t('store') },
    { id: 'library', icon: Gamepad2, label: t('library') },
    { id: 'wishlist', icon: Heart, label: t('wishlist') },
    { id: 'friends', icon: Users, label: t('friends') },
  ];

  const toggleLanguage = () => {
    setLang(lang === 'ru' ? 'en' : 'ru');
  };

  return (
    <aside className="w-18 md:w-20 fixed left-0 top-20 bottom-0 z-30 bg-theme-surface/70 backdrop-blur-xl border-r border-theme-border flex flex-col items-center justify-between py-6 transition-colors duration-300">
      
      {/* Top Navigation Icons */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-tr from-theme-primary to-theme-accent text-white shadow-glow-primary scale-105'
                  : 'text-theme-muted hover:text-theme-text hover:bg-theme-card'
              }`}
              title={item.label}
            >
              <Icon size={22} className="transition-transform group-hover:scale-110" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-theme-card border border-theme-border text-theme-text text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50">
                {item.label}
              </div>
            </button>
          );
        })}

        {user?.role === 'PUBLISHER' && (
          <button
            onClick={() => onNavigate('admin')}
            className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              activePage === 'admin'
                ? 'bg-amber-500 text-white shadow-lg scale-105'
                : 'text-amber-400 hover:bg-amber-500/10'
            }`}
            title={t('publisherPanel')}
          >
            <ShieldCheck size={22} className="transition-transform group-hover:scale-110" />
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-theme-card border border-theme-border text-amber-400 text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50">
              {t('publisherPanel')}
            </div>
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 w-full px-2">
        <button
          onClick={onOpenSupport}
          className="group relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-all duration-300 shadow-sm"
          title={t('support')}
        >
          <MessageSquare size={20} className="transition-transform group-hover:scale-110" />
          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-theme-card border border-theme-border text-indigo-400 text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50">
            {t('support')}
          </div>
        </button>
        <button
          onClick={toggleLanguage}
          className="group relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-theme-card/70 hover:bg-theme-card border border-theme-border text-theme-text hover:border-theme-primary/50 transition-all shadow-sm"
          title={`Язык: ${lang === 'ru' ? 'Русский (RU)' : 'English (EG)'} (нажмите для смены)`}
        >
          <Globe size={18} className="text-theme-primary transition-transform group-hover:rotate-45" />
          <span className="text-[10px] font-black text-theme-text mt-0.5 tracking-wider uppercase">
            {lang === 'ru' ? 'RU' : 'EG'}
          </span>

          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-theme-card border border-theme-border text-theme-text text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50">
            {lang === 'ru' ? '🇷🇺 Русский (RU)' : '🇬🇧 English (EG)'}
          </div>
        </button>
      </div>

    </aside>
  );
}
