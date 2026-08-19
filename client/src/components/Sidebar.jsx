import React from 'react';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import { 
  Store, 
  Gamepad2, 
  Trophy, 
  Heart, 
  Users, 
  Wallet, 
  Settings, 
  ShieldCheck
} from 'lucide-react';

export function Sidebar({ activePage, onNavigate, onOpenWallet, onOpenSettings }) {
  const { t } = useLang();
  const { user } = useAuth();

  const navItems = [
    { id: 'store', icon: Store, label: t('store') },
    { id: 'library', icon: Gamepad2, label: t('library') },
    { id: 'wishlist', icon: Heart, label: t('wishlist') },
    { id: 'friends', icon: Users, label: t('friends') },
  ];

  return (
    <aside className="w-18 md:w-20 fixed left-0 top-20 bottom-0 z-30 bg-theme-surface/70 backdrop-blur-xl border-r border-theme-border flex flex-col items-center justify-between py-6 transition-colors duration-300">
      
      {/* Top Nav Icons */}
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

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => onNavigate('admin')}
            className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              activePage === 'admin'
                ? 'bg-amber-500 text-white shadow-lg scale-105'
                : 'text-amber-400 hover:bg-amber-500/10'
            }`}
            title={t('admin')}
          >
            <ShieldCheck size={22} className="transition-transform group-hover:scale-110" />
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-theme-card border border-theme-border text-amber-400 text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50">
              {t('admin')}
            </div>
          </button>
        )}
      </div>

      {/* Bottom Shortcuts */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        <button
          onClick={onOpenWallet}
          className="group relative flex items-center justify-center w-12 h-12 rounded-2xl text-emerald-400 hover:bg-emerald-500/15 transition-all"
          title={t('wallet')}
        >
          <Wallet size={21} className="transition-transform group-hover:scale-110" />
          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-theme-card border border-theme-border text-emerald-400 text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50">
            {t('wallet')}
          </div>
        </button>

        <button
          onClick={onOpenSettings}
          className="group relative flex items-center justify-center w-12 h-12 rounded-2xl text-theme-muted hover:text-theme-text hover:bg-theme-card transition-all"
          title={t('settings')}
        >
          <Settings size={21} className="transition-transform group-hover:rotate-45" />
          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-theme-card border border-theme-border text-theme-text text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50">
            {t('settings')}
          </div>
        </button>
      </div>

    </aside>
  );
}
