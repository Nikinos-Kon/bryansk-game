import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  Search, 
  ShoppingCart, 
  Wallet, 
  Settings, 
  Sun, 
  Moon, 
  Gamepad2, 
  SlidersHorizontal,
  Flame,
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronDown
} from 'lucide-react';

export function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  onOpenSettings, 
  onOpenWallet, 
  onOpenCart, 
  onOpenAuth, 
  onNavigate,
  onOpenFilterModal
}) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { t } = useLang();
  const { theme, changeTheme } = useTheme();
  const { currency, switchCurrency, formatPrice } = useCurrency();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleNextTheme = () => {
    if (theme === THEMES.DARK) changeTheme(THEMES.LIGHT);
    else if (theme === THEMES.LIGHT) changeTheme(THEMES.RED);
    else if (theme === THEMES.RED) changeTheme(THEMES.PURPLE);
    else changeTheme(THEMES.DARK);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case THEMES.LIGHT: return <Sun size={18} className="text-amber-500" />;
      case THEMES.RED: return <Flame size={18} className="text-red-500" />;
      case THEMES.PURPLE: return <Sparkles size={18} className="text-purple-400" />;
      default: return <Moon size={18} className="text-blue-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-theme-surface/85 border-b border-theme-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('store')} 
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-theme-primary to-theme-accent flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform duration-300">
            <Gamepad2 size={24} />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-theme-text flex items-center gap-1.5">
              <span>Bryansk</span>
              <span className="text-theme-primary bg-theme-primary/10 px-1.5 py-0.5 rounded-md text-xs font-black uppercase tracking-widest border border-theme-primary/30">GAME</span>
            </div>
            <p className="text-[10px] text-theme-muted font-medium tracking-wider uppercase">Digital Store & Steam Hub</p>
          </div>
        </div>

        {/* Center Search Bar with Filter Integration (Expanded width so placeholder fits fully) */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-theme-muted pointer-events-none">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-11 pr-28 py-2.5 rounded-full bg-theme-card border border-theme-border text-sm text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 transition-all shadow-inner"
            />
            {onOpenFilterModal && (
              <button
                onClick={onOpenFilterModal}
                className="absolute right-2 px-3 py-1 rounded-full bg-theme-surface hover:bg-theme-primary/20 hover:text-theme-primary border border-theme-border text-theme-muted text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Фильтры каталога"
              >
                <SlidersHorizontal size={13} />
                <span>Фильтры</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Quick Currency Switcher */}
          <button
            onClick={() => switchCurrency(currency === 'RUB' ? 'USD' : 'RUB')}
            className="px-2.5 py-1.5 rounded-lg bg-theme-card hover:bg-theme-primary/15 border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1 transition-all"
            title="Переключить валюту (RUB / USD)"
          >
            <span className="text-theme-primary font-black">{currency === 'RUB' ? '₽' : '$'}</span>
            <span className="text-[11px] text-theme-muted">{currency}</span>
          </button>

          {/* Quick Theme Switcher */}
          <button
            onClick={toggleNextTheme}
            className="p-2 rounded-lg bg-theme-card hover:bg-theme-border border border-theme-border text-theme-text transition-all"
            title={`Тема: ${theme} (нажмите для смены)`}
          >
            {getThemeIcon()}
          </button>

          {/* Wallet Balance Pill */}
          {user && (
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-theme-card hover:bg-theme-primary/20 border border-theme-border text-theme-text transition-all group"
              title="Открыть кошелёк"
            >
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Wallet size={14} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-theme-muted uppercase font-semibold leading-none">{t('wallet')}</p>
                <p className="text-xs font-bold text-theme-text group-hover:text-theme-primary transition-colors">
                  {formatPrice(user.walletBalance)}
                </p>
              </div>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-theme-card hover:bg-theme-primary/20 border border-theme-border text-theme-text transition-all"
            title={t('cart')}
          >
            <ShoppingCart size={19} />
            {cart.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-theme-accent text-white text-[10px] font-black flex items-center justify-center shadow-lg animate-bounce">
                {cart.count}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-theme-card hover:bg-theme-border border border-theme-border text-theme-text transition-all"
            title={t('settings')}
          >
            <Settings size={19} />
          </button>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-theme-card hover:bg-theme-border border border-theme-border transition-all"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.nickname}`}
                  alt={user.nickname}
                  className="w-8 h-8 rounded-lg object-cover border border-theme-primary"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-theme-text leading-tight flex items-center gap-1">
                    <span>{user.nickname}</span>
                    <span className="text-[10px] bg-theme-primary/20 text-theme-primary px-1 rounded font-black">
                      lvl {user.level || 1}
                    </span>
                  </div>
                </div>
                <ChevronDown size={14} className="text-theme-muted" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-theme-surface border border-theme-border shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-theme-border">
                    <p className="text-xs text-theme-muted">{user.email}</p>
                    <p className="text-sm font-bold text-theme-text capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <button
                    onClick={() => { onNavigate('profile'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-theme-text hover:bg-theme-card flex items-center gap-2"
                  >
                    <UserIcon size={16} />
                    <span>{t('profile')}</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('library'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-theme-text hover:bg-theme-card flex items-center gap-2"
                  >
                    <Gamepad2 size={16} />
                    <span>{t('library')}</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('wishlist'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-theme-text hover:bg-theme-card flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>{t('wishlist')}</span>
                  </button>
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => { onNavigate('admin'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-amber-400 hover:bg-theme-card flex items-center gap-2"
                    >
                      <SlidersHorizontal size={16} />
                      <span>{t('admin')}</span>
                    </button>
                  )}
                  <div className="border-t border-theme-border mt-1"></div>
                  <button
                    onClick={() => { logout(); setUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-xs font-bold shadow-glow-primary hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <UserIcon size={15} />
              <span>{t('login')}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
