import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useNotification } from '../context/NotificationContext';
import { 
  User as UserIcon, 
  Trophy, 
  Gamepad2, 
  Clock, 
  Sparkles, 
  Edit3, 
  Check, 
  ShieldCheck, 
  Share2, 
  Heart,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

export function ProfilePage({ onSelectGame }) {
  const { user, refreshUser } = useAuth();
  const { lang, t } = useLang();
  const { addToast } = useNotification();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getProfile('me');
      setProfileData(data.profile);
      setBioInput(data.profile.bio || '');
      setNicknameInput(data.profile.nickname || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updatePreferences({
        bio: bioInput,
        nickname: nicknameInput
      });

      addToast({
        title: 'Профиль обновлен',
        message: 'Изменения успешно сохранены',
        icon: '✨',
        type: 'success'
      });

      setIsEditing(false);
      await refreshUser();
      await fetchProfile();
    } catch (err) {
      addToast({
        title: 'Ошибка',
        message: err.message,
        icon: '⚠️',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="p-12 text-center rounded-3xl bg-theme-surface border border-theme-border text-theme-text space-y-4 max-w-md mx-auto">
        <UserIcon size={36} className="mx-auto text-theme-primary" />
        <h2 className="text-xl font-black">Авторизуйтесь в профиле</h2>
        <p className="text-xs text-theme-muted">Чтобы увидеть ваш Steam-профиль, значки и библиотеку.</p>
      </div>
    );
  }

  if (loading || !profileData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 rounded-full border-4 border-theme-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Steam-Style Profile Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-theme-surface via-theme-card to-theme-surface border border-theme-border shadow-2xl p-6 sm:p-8">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-theme-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Avatar & Info */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.nickname}`}
                alt={user.nickname}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-theme-primary shadow-glow-primary"
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider border-2 border-theme-surface shadow-md">
                В сети
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-theme-text">{profileData.nickname}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-theme-primary/20 text-theme-primary text-xs font-black uppercase tracking-wider border border-theme-primary/30">
                  {profileData.role}
                </span>
              </div>
              <p className="text-xs text-theme-muted max-w-md italic leading-relaxed">
                "{profileData.bio || 'Геймер из Брянска'}"
              </p>
              <p className="text-[11px] text-theme-muted font-medium">
                В сообществе Bryansk_game с {profileData.createdAt?.slice(0, 10) || '2024'}
              </p>
            </div>
          </div>

          {/* Level & Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 w-full md:w-auto">
            
            {/* Steam Level Circle Badge */}
            <div className="flex items-center gap-3 p-2.5 pr-4 rounded-2xl bg-theme-card border border-theme-border shadow-inner">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center font-black text-lg shadow-md">
                {profileData.level}
              </div>
              <div>
                <p className="text-[10px] text-theme-muted uppercase font-black">{t('steamLevel')}</p>
                <p className="text-xs font-bold text-amber-400">Ветеран Брянска</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-theme-card hover:bg-theme-border border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Edit3 size={14} />
              <span>{isEditing ? 'Закрыть' : t('editProfile')}</span>
            </button>

          </div>

        </div>

        {/* Edit Profile Panel */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-theme-border space-y-4 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-theme-muted block mb-1">Никнейм</label>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-xs text-theme-text focus:outline-none focus:border-theme-primary"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-theme-muted block mb-1">О себе (Bio)</label>
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-xs text-theme-text focus:outline-none focus:border-theme-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-theme-card border border-theme-border text-xs font-bold text-theme-muted hover:text-theme-text"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-glow-primary hover:opacity-90"
              >
                {saving ? 'Сохранение...' : t('saveChanges')}
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Stats and Badges Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Games Stats */}
        <div className="p-5 rounded-3xl bg-theme-surface border border-theme-border flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-theme-primary/20 text-theme-primary flex items-center justify-center">
            <Gamepad2 size={24} />
          </div>
          <div>
            <p className="text-xs text-theme-muted uppercase font-bold">{t('ownedGames')}</p>
            <h3 className="text-2xl font-black text-theme-text">{profileData.gamesCount}</h3>
          </div>
        </div>

        {/* Playtime Stats */}
        <div className="p-5 rounded-3xl bg-theme-surface border border-theme-border flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-theme-muted uppercase font-bold">{t('totalPlaytime')}</p>
            <h3 className="text-2xl font-black text-theme-text">{profileData.totalPlaytimeHours} {t('hours')}</h3>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="p-5 rounded-3xl bg-theme-surface border border-theme-border flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs text-theme-muted uppercase font-bold">{t('badges')}</p>
            <h3 className="text-2xl font-black text-theme-text">{profileData.badges?.length || 3} значка</h3>
          </div>
        </div>

      </div>

      {/* Badges Showcase */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-theme-text uppercase tracking-tight flex items-center gap-2">
          <Trophy size={18} className="text-amber-400" />
          <span>{t('badges')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {profileData.badges?.map((badge) => (
            <div key={badge.id} className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-center gap-3.5 shadow-md">
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <h4 className="font-bold text-xs text-theme-text">{badge.name}</h4>
                <p className="text-[10px] text-theme-muted mt-0.5">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Showcase Games Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-theme-text uppercase tracking-tight flex items-center gap-2">
          <Gamepad2 size={18} className="text-theme-primary" />
          <span>{t('showcase')}</span>
        </h3>

        {profileData.showcaseGames?.length === 0 ? (
          <p className="text-xs text-theme-muted italic">В витрине пока нет игр.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {profileData.showcaseGames?.map((game) => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="group relative rounded-2xl overflow-hidden bg-theme-card border border-theme-border cursor-pointer hover:border-theme-primary hover:shadow-glow-primary transition-all duration-300"
              >
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-2 text-center bg-theme-surface/90 backdrop-blur-md">
                  <p className="font-bold text-[11px] text-theme-text truncate">{game.title}</p>
                  <p className="text-[9px] text-theme-muted">{Math.round((game.playtimeMin || 0) / 60)} ч.</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      {profileData.recentReviews?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-theme-text uppercase tracking-tight flex items-center gap-2">
            <MessageSquare size={18} className="text-theme-primary" />
            <span>{t('recentActivity')} (Отзывы)</span>
          </h3>

          <div className="space-y-3">
            {profileData.recentReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-start gap-4">
                <img src={rev.gameCover} alt={rev.gameTitle} className="w-12 h-8 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-theme-text">{rev.gameTitle}</h4>
                    <span className="text-[10px] text-theme-muted">{rev.createdAt}</span>
                  </div>
                  <p className="text-xs text-theme-muted mt-1 italic">"{rev.content}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
