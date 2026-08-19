import React from 'react';
import { useLang } from '../context/LangContext';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  X, 
  Settings, 
  Palette, 
  Globe, 
  Check, 
  Sun, 
  Moon, 
  Flame, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export function SettingsModal({ onClose }) {
  const { lang, setLang, t } = useLang();
  const { theme, changeTheme } = useTheme();
  const { user, refreshUser } = useAuth();
  const { addToast } = useNotification();

  const themeOptions = [
    {
      id: THEMES.DARK,
      name: t('themeDark'),
      desc: 'Классическая тёмная тема платформы',
      icon: Moon,
      bg: '#0d1117',
      primary: '#3b82f6',
      border: '#30363d'
    },
    {
      id: THEMES.LIGHT,
      name: t('themeLight'),
      desc: 'Светлая тема в стиле референса 1',
      icon: Sun,
      bg: '#f3f4f6',
      primary: '#e11d48',
      border: '#e5e7eb'
    },
    {
      id: THEMES.RED,
      name: t('themeRed'),
      desc: 'Агрессивная геймерская рубиновая тема',
      icon: Flame,
      bg: '#140507',
      primary: '#ef4444',
      border: '#3f1118'
    },
    {
      id: THEMES.PURPLE,
      name: t('themePurple'),
      desc: 'Неоновый киберпанк в стиле референса 2',
      icon: Sparkles,
      bg: '#160d27',
      primary: '#8b5cf6',
      border: '#3d1d64'
    }
  ];

  const handleSelectTheme = async (newTheme) => {
    changeTheme(newTheme);
    if (user) {
      try {
        await api.updatePreferences({ theme: newTheme });
        refreshUser();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSelectLang = async (newLang) => {
    setLang(newLang);
    if (user) {
      try {
        await api.updatePreferences({ lang: newLang });
        refreshUser();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl rounded-3xl bg-theme-surface border border-theme-border shadow-2xl text-theme-text overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-theme-border flex items-center justify-between bg-theme-card/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-theme-primary/20 text-theme-primary flex items-center justify-center shadow-md">
              <Settings size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">{t('settingsTitle')}</h3>
              <p className="text-xs text-theme-muted">Персонализация внешнего вида и языка</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
          
          {/* Theme Selector Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-theme-muted tracking-wider flex items-center gap-2">
              <Palette size={16} className="text-theme-primary" />
              <span>{t('themeSelection')}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themeOptions.map((opt) => {
                const isSelected = theme === opt.id;
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectTheme(opt.id)}
                    className={`relative p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all duration-300 ${
                      isSelected
                        ? 'border-theme-primary bg-theme-card shadow-glow-primary scale-[1.02]'
                        : 'border-theme-border bg-theme-card/60 hover:bg-theme-card opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: opt.bg, color: opt.primary, border: `1px solid ${opt.border}` }}
                        >
                          <Icon size={16} />
                        </div>
                        <span className="font-bold text-xs text-theme-text">{opt.name}</span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-theme-primary text-white flex items-center justify-center">
                          <Check size={12} />
                        </div>
                      )}
                    </div>

                    {/* Color Swatch Preview */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: opt.bg }} />
                      <span className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: opt.primary }} />
                      <span className="text-[10px] text-theme-muted truncate ml-1">{opt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector Section */}
          <div className="space-y-3 pt-4 border-t border-theme-border">
            <h4 className="text-xs font-black uppercase text-theme-muted tracking-wider flex items-center gap-2">
              <Globe size={16} className="text-theme-primary" />
              <span>{t('languageSelection')}</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              
              {/* Russian */}
              <button
                onClick={() => handleSelectLang('ru')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  lang === 'ru'
                    ? 'border-theme-primary bg-theme-card shadow-glow-primary font-bold'
                    : 'border-theme-border bg-theme-card/60 text-theme-muted hover:text-theme-text'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🇷🇺</span>
                  <span className="text-xs">Русский (RU)</span>
                </div>
                {lang === 'ru' && <Check size={16} className="text-theme-primary" />}
              </button>

              {/* English */}
              <button
                onClick={() => handleSelectLang('en')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  lang === 'en'
                    ? 'border-theme-primary bg-theme-card shadow-glow-primary font-bold'
                    : 'border-theme-border bg-theme-card/60 text-theme-muted hover:text-theme-text'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🇬🇧</span>
                  <span className="text-xs">English (EN)</span>
                </div>
                {lang === 'en' && <Check size={16} className="text-theme-primary" />}
              </button>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
