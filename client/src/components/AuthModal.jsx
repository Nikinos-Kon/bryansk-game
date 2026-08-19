import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useNotification } from '../context/NotificationContext';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  Gamepad2, 
  Layers 
} from 'lucide-react';

export function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const { t } = useLang();
  const { addToast } = useNotification();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register(email, password, nickname);
      }
      onClose();
    } catch (err) {
      addToast({
        title: 'Ошибка',
        message: err.message,
        icon: '⚠️',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoPass) => {
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      onClose();
    } catch (err) {
      addToast({
        title: 'Ошибка демо-входа',
        message: err.message,
        icon: '⚠️',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md rounded-3xl bg-theme-surface border border-theme-border shadow-2xl text-theme-text overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-theme-border flex items-center justify-between bg-theme-card/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-theme-primary to-theme-accent text-white flex items-center justify-center shadow-glow-primary">
              <Gamepad2 size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">Bryansk_game ID</h3>
              <p className="text-xs text-theme-muted">Авторизация в экосистеме магазина</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-theme-border bg-theme-card/30">
          <button
            type="button"
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              isLoginTab
                ? 'text-theme-primary border-b-2 border-theme-primary bg-theme-surface font-extrabold'
                : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            {t('login')}
          </button>
          <button
            type="button"
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              !isLoginTab
                ? 'text-theme-primary border-b-2 border-theme-primary bg-theme-surface font-extrabold'
                : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            {t('register')}
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLoginTab && (
              <div>
                <label className="text-[11px] font-bold text-theme-muted block mb-1">Никнейм в Steam/Bryansk_game</label>
                <div className="relative">
                  <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Например: Nikita_32RUS"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-xs text-theme-text focus:outline-none focus:border-theme-primary"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-theme-muted block mb-1">Email адрес</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gamer@bryansk.game"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-xs text-theme-text focus:outline-none focus:border-theme-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-theme-muted block mb-1">Пароль</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-card border border-theme-border text-xs text-theme-text focus:outline-none focus:border-theme-primary"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-xs font-extrabold shadow-glow-primary hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Секундочку...' : isLoginTab ? t('login') : t('register')}
            </button>
          </form>

          {/* 1-Click Fast Demo Accounts */}
          <div className="space-y-2 pt-2 border-t border-theme-border">
            <span className="text-[10px] font-black uppercase text-theme-muted tracking-wider block text-center">
              Быстрый вход для тестирования
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('gamer@bryansk.game', 'gamer123')}
                className="p-2 rounded-xl bg-theme-card hover:bg-theme-primary/20 border border-theme-border text-left transition-all group"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-theme-text group-hover:text-theme-primary">
                  <Gamepad2 size={13} className="text-emerald-400" />
                  <span>Геймер</span>
                </div>
                <p className="text-[9px] text-theme-muted truncate">Nikita_32RUS</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@bryansk.game', 'admin123')}
                className="p-2 rounded-xl bg-theme-card hover:bg-amber-500/20 border border-theme-border text-left transition-all group"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                  <ShieldCheck size={13} />
                  <span>Админ</span>
                </div>
                <p className="text-[9px] text-theme-muted truncate">BryanskAdmin</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('publisher@bryansk.game', 'pub123')}
                className="p-2 rounded-xl bg-theme-card hover:bg-purple-500/20 border border-theme-border text-left transition-all group"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-purple-400">
                  <Layers size={13} />
                  <span>Издатель</span>
                </div>
                <p className="text-[9px] text-theme-muted truncate">IndieDev</p>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
