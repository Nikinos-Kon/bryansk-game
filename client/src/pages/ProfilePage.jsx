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
  Lock, 
  Unlock, 
  Image as ImageIcon,
  Palette,
  MessageSquare,
  Flame,
  Star,
  CheckCircle2
} from 'lucide-react';

export const PROFILE_FRAMES = {
  default: { id: 'default', name: 'Обычная рамка', borderClass: 'border-2 border-theme-primary' },
  cyberpunk: { id: 'cyberpunk', name: 'Киберпанк Неон', borderClass: 'border-4 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse' },
  gold: { id: 'gold', name: 'Золотой Ветеран', borderClass: 'border-4 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.8)]' },
  crimson: { id: 'crimson', name: 'Рубиновый Дракон', borderClass: 'border-4 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.8)]' },
  purple: { id: 'purple', name: 'Пламя Брянска', borderClass: 'border-4 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.8)]' }
};

export const PROFILE_BACKGROUNDS = {
  default: { id: 'default', name: 'По умолчанию', bgStyle: 'bg-gradient-to-br from-theme-surface via-theme-card to-theme-surface' },
  nightcity: { id: 'nightcity', name: 'Найт-Сити Киберпанк', bgUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg' },
  space: { id: 'space', name: 'Глубокий Космос', bgUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80' },
  redcitadel: { id: 'redcitadel', name: 'Рубиновая Цитадель', bgUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2519060/header.jpg' },
  witcher: { id: 'witcher', name: 'Просторы Ведьмака', bgUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg' }
};

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
];

export function ProfilePage({ onSelectGame }) {
  const { user, refreshUser } = useAuth();
  const { lang, t } = useLang();
  const { addToast } = useNotification();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Customization inputs
  const [nicknameInput, setNicknameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [customStatusInput, setCustomStatusInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('default');
  const [selectedBg, setSelectedBg] = useState('default');
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getProfile('me');
      setProfileData(data.profile);
      setNicknameInput(data.profile.nickname || '');
      setBioInput(data.profile.bio || '');
      setCustomStatusInput(data.profile.customStatus || 'В сети и готов к игре');
      setAvatarInput(data.profile.avatar || '');
      setSelectedFrame(data.profile.profileFrame || 'default');
      setSelectedBg(data.profile.profileBackground || 'default');
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
        nickname: nicknameInput,
        bio: bioInput,
        customStatus: customStatusInput,
        avatar: avatarInput,
        profileFrame: selectedFrame,
        profileBackground: selectedBg
      });

      addToast({
        title: 'Профиль обновлен',
        message: 'Кастомизация профиля успешно сохранена',
        icon: '🎨',
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
        <p className="text-xs text-theme-muted">Чтобы настроить свой профиль Steam / Bryansk.</p>
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

  const currentFrame = PROFILE_FRAMES[profileData.profileFrame] || PROFILE_FRAMES.default;
  const currentBg = PROFILE_BACKGROUNDS[profileData.profileBackground] || PROFILE_BACKGROUNDS.default;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Steam-Style Custom Profile Banner */}
      <div 
        className="relative rounded-3xl overflow-hidden border border-theme-border shadow-2xl p-6 sm:p-8 transition-all duration-500 bg-cover bg-center"
        style={{
          backgroundImage: currentBg.bgUrl ? `url(${currentBg.bgUrl})` : undefined,
          backgroundColor: !currentBg.bgUrl ? 'var(--bg-surface)' : undefined
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-theme-surface/95 via-theme-surface/85 to-theme-surface/75 backdrop-blur-[4px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Avatar & Info */}
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <img
                src={profileData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profileData.nickname}`}
                alt={profileData.nickname}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover transition-all ${currentFrame.borderClass}`}
              />
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider border-2 border-theme-surface shadow-md">
                В сети
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-theme-text">{profileData.nickname}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-theme-primary/20 text-theme-primary text-xs font-black uppercase tracking-wider border border-theme-primary/30">
                  {profileData.role}
                </span>
              </div>

              {/* Custom Status Under Nickname */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{profileData.customStatus || 'В сети и готов к игре'}</span>
              </div>

              {/* Bio */}
              <p className="text-xs text-theme-muted max-w-md italic leading-relaxed pt-0.5">
                "{profileData.bio || 'Геймер из Брянска'}"
              </p>
            </div>
          </div>

          {/* Level & Edit Button */}
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
              <span>{isEditing ? 'Закрыть редактор' : 'Кастомизация профиля'}</span>
            </button>

          </div>

        </div>

        {/* Customization / Profile Editor Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="relative z-10 mt-6 pt-6 border-t border-theme-border/70 space-y-5 animate-in slide-in-from-top-3">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Nickname */}
              <div>
                <label className="font-bold text-theme-muted block mb-1">Никнейм</label>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary font-bold"
                  required
                />
              </div>

              {/* Custom Status */}
              <div>
                <label className="font-bold text-emerald-400 block mb-1 flex items-center gap-1">
                  <MessageSquare size={13} />
                  <span>Пользовательский статус под ником</span>
                </label>
                <input
                  type="text"
                  value={customStatusInput}
                  onChange={(e) => setCustomStatusInput(e.target.value)}
                  placeholder="Например: Играю в CS2, ищу тиммейтов"
                  className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Avatar URL or Preset Selector */}
              <div className="md:col-span-2 space-y-2">
                <label className="font-bold text-theme-muted block flex items-center gap-1.5">
                  <ImageIcon size={14} />
                  <span>Фото / Аватар профиля (вставьте URL или выберите готовый)</span>
                </label>
                <input
                  type="text"
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  placeholder="https://... ссылка на изображение"
                  className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary font-mono text-[11px]"
                />
                
                {/* Preset Avatars */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-theme-muted font-bold">Пресеты:</span>
                  {AVATAR_PRESETS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarInput(url)}
                      className="w-8 h-8 rounded-lg overflow-hidden border border-theme-border hover:border-theme-primary transition-all hover:scale-110"
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="font-bold text-theme-muted block mb-1">О себе (Bio)</label>
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary"
                />
              </div>

              {/* Profile Frames */}
              <div>
                <label className="font-bold text-theme-muted block mb-2 flex items-center gap-1.5">
                  <Palette size={14} className="text-theme-primary" />
                  <span>Рамка аватара (Steam Frame)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(PROFILE_FRAMES).map((frame) => (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => setSelectedFrame(frame.id)}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        selectedFrame === frame.id
                          ? 'border-theme-primary bg-theme-primary/10 text-theme-primary font-bold shadow-sm'
                          : 'border-theme-border bg-theme-card text-theme-muted hover:text-theme-text'
                      }`}
                    >
                      <span>{frame.name}</span>
                      {selectedFrame === frame.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Backgrounds */}
              <div>
                <label className="font-bold text-theme-muted block mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Фон профиля (Profile Background)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(PROFILE_BACKGROUNDS).map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setSelectedBg(bg.id)}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                        selectedBg === bg.id
                          ? 'border-theme-primary bg-theme-primary/10 text-theme-primary font-bold shadow-sm'
                          : 'border-theme-border bg-theme-card text-theme-muted hover:text-theme-text'
                      }`}
                    >
                      <span className="truncate">{bg.name}</span>
                      {selectedBg === bg.id && <Check size={14} className="flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-theme-border/60">
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
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-theme-primary to-theme-primary-hover text-white text-xs font-black shadow-glow-primary hover:opacity-90 transition-all"
              >
                {saving ? 'Сохранение...' : t('saveChanges')}
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-theme-surface border border-theme-border flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-theme-primary/20 text-theme-primary flex items-center justify-center">
            <Gamepad2 size={24} />
          </div>
          <div>
            <p className="text-xs text-theme-muted uppercase font-bold">{t('ownedGames')}</p>
            <h3 className="text-2xl font-black text-theme-text">{profileData.gamesCount}</h3>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-theme-surface border border-theme-border flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-theme-muted uppercase font-bold">{t('totalPlaytime')}</p>
            <h3 className="text-2xl font-black text-theme-text">{profileData.totalPlaytimeHours} {t('hours')}</h3>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-theme-surface border border-theme-border flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs text-theme-muted uppercase font-bold">{t('badges')}</p>
            <h3 className="text-2xl font-black text-theme-text">
              {profileData.badges?.filter(b => b.isUnlocked).length} / {profileData.badges?.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Badges Section with Conditions and Unlock State */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-theme-text uppercase tracking-tight flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <span>Значки профиля Steam / Bryansk</span>
          </h3>
          <span className="text-xs text-theme-muted font-semibold">
            Открыто: <strong className="text-amber-400">{profileData.badges?.filter(b => b.isUnlocked).length}</strong> из {profileData.badges?.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profileData.badges?.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all duration-300 ${
                badge.isUnlocked
                  ? 'bg-theme-surface border-theme-border shadow-md hover:border-amber-400/60'
                  : 'bg-theme-surface/40 border-theme-border/50 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                    badge.isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-theme-card text-gray-500 grayscale'
                  }`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className={`font-bold text-xs ${badge.isUnlocked ? 'text-theme-text' : 'text-theme-muted'}`}>
                      {badge.name}
                    </h4>
                    <p className="text-[10px] text-theme-muted mt-0.5">{badge.description}</p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {badge.isUnlocked ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      <Unlock size={11} />
                      <span>Открыт</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-500/20 text-gray-400 text-[10px] font-bold border border-gray-500/30">
                      <Lock size={11} />
                      <span>Закрыт</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Condition & Progress footer */}
              <div className="pt-2 border-t border-theme-border/60 flex items-center justify-between text-[10px]">
                <span className="text-theme-muted font-medium">
                  <strong>Условие:</strong> {badge.condition}
                </span>
                <span className="font-mono font-bold text-theme-primary">
                  {badge.progress}
                </span>
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
              <div key={rev.id} className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-start gap-4 shadow-sm">
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
