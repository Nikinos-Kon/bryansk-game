import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNotification } from '../context/NotificationContext';
import { useLang } from '../context/LangContext';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  DollarSign, 
  Sparkles, 
  Check, 
  Layers,
  Gamepad2,
  AlertTriangle,
  MessageSquareWarning,
  UserX,
  Clock,
  ShieldAlert,
  SlidersHorizontal,
  Flame,
  CheckCircle2
} from 'lucide-react';

const INITIAL_COMPLAINTS = [
  {
    id: 'rep-1',
    reportedUser: 'ToxicGamer_99',
    reportedUserId: 'user-toxic-99',
    reportedAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ToxicGamer',
    reporter: 'Nikita_32RUS',
    game: 'Counter-Strike 2',
    reason: 'Использование запрещенного ПО (Wallhack / AimBot) и накрутка статистики в рейтинговых матчах.',
    category: 'Читерство',
    date: '19.08.2026 19:42',
    severity: 'HIGH'
  },
  {
    id: 'rep-2',
    reportedUser: 'DarkShadow_Troll',
    reportedUserId: 'user-darkshadow',
    reportedAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DarkShadow',
    reporter: 'VampireHunter',
    game: 'Dota 2',
    reason: 'Систематические нецензурные оскорбления и намеренный срыв игрового процесса.',
    category: 'Токсичность',
    date: '19.08.2026 18:15',
    severity: 'MEDIUM'
  },
  {
    id: 'rep-3',
    reportedUser: 'FreeKeys_Scammer',
    reportedUserId: 'user-scammer',
    reportedAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Scammer',
    reporter: 'BryanskIndieDev',
    game: 'Cyberpunk 2077',
    reason: 'Спам фишинговыми ссылками на сторонние рулетки в разделе пользовательских рецензий к игре.',
    category: 'Мошенничество',
    date: '19.08.2026 16:30',
    severity: 'CRITICAL'
  },
  {
    id: 'rep-4',
    reportedUser: 'OffensiveNick_18',
    reportedUserId: 'user-offensivenick',
    reportedAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Offensive',
    reporter: 'CyberKnight',
    game: 'ELDEN RING',
    reason: 'Неприемлемый аватар профиля, нарушающий правила сообщества площадки Bryansk_game.',
    category: 'Неподобающий контент',
    date: '19.08.2026 14:02',
    severity: 'LOW'
  }
];

export function AdminPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const { formatPrice } = useCurrency();
  const { addToast } = useNotification();

  const isAdmin = user?.role === 'ADMIN';
  const isPublisher = user?.role === 'PUBLISHER';

  // Navigation tab state: admin defaults to 'complaints', publisher to 'games'
  const [activeTab, setActiveTab] = useState(isAdmin ? 'complaints' : 'games');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [bannedUserIds, setBannedUserIds] = useState(new Set());

  // New game form state (for publisher)
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriceRub, setNewPriceRub] = useState(1999);
  const [newDiscount, setNewDiscount] = useState(0);
  const [newDeveloper, setNewDeveloper] = useState('');
  const [newPublisher, setNewPublisher] = useState('');
  const [newCategory, setNewCategory] = useState('Action');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await api.getGames();
      setGames(data.games || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleBanAccount = (complaint) => {
    setBannedUserIds((prev) => new Set([...prev, complaint.reportedUserId]));
    addToast({
      title: 'Блокировка аккаунта',
      message: `Запрос на бан пользователя «${complaint.reportedUser}» зарегистрирован`,
      icon: '🚫',
      type: 'warning'
    });
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    try {
      await api.createGame({
        title: newTitle,
        descriptionRu: newDesc,
        descriptionEn: newDesc,
        priceRub: Number(newPriceRub),
        priceUsd: Number((newPriceRub * 0.0125).toFixed(2)),
        discountPercent: Number(newDiscount),
        developer: newDeveloper || 'Bryansk Studio',
        publisher: newPublisher || 'Bryansk Publishing',
        coverImage: newCover,
        categories: [newCategory],
        tags: ['Новинка', newCategory]
      });

      addToast({
        title: 'Игра добавлена',
        message: `«${newTitle}» опубликована в магазине!`,
        icon: '🎮',
        type: 'success'
      });

      setShowAddModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchGames();
    } catch (err) {
      addToast({
        title: 'Ошибка',
        message: err.message,
        icon: '⚠️',
        type: 'error'
      });
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!confirm('Вы уверены, что хотите удалить эту игру из каталога?')) return;
    try {
      await api.deleteGame(gameId);
      addToast({
        title: 'Игра удалена',
        message: 'Товар снят с продажи',
        icon: '🗑️'
      });
      fetchGames();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDiscount = async (game, discount) => {
    try {
      await api.updateGame(game.id, { discountPercent: Number(discount) });
      fetchGames();
      addToast({
        title: 'Скидка обновлена',
        message: `${game.title}: ${discount}%`,
        icon: '🏷️'
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin && !isPublisher) {
    return (
      <div className="p-12 text-center rounded-3xl bg-theme-surface border border-theme-border text-theme-text space-y-4 max-w-md mx-auto">
        <ShieldCheck size={36} className="mx-auto text-amber-400" />
        <h2 className="text-xl font-black">Доступ ограничен</h2>
        <p className="text-xs text-theme-muted">Эта панель доступна только администраторам и издателям платформы.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-theme-text uppercase tracking-tight">
              {isAdmin ? 'Панель администратора' : 'Панель издателя'}
            </h1>
            <p className="text-xs text-theme-muted">
              {isAdmin ? 'Модерация обращений, жалобы клиентов и контроль платформы' : 'Управление играми, скидками и каталогом'}
            </p>
          </div>
        </div>

        {/* Top Actions: Admin has Complaints button, Publisher has Add Game button */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setActiveTab('complaints')}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center gap-2 ${
                activeTab === 'complaints'
                  ? 'bg-rose-500 text-white shadow-rose-500/25 scale-105'
                  : 'bg-theme-card hover:bg-theme-border border border-theme-border text-theme-text'
              }`}
            >
              <MessageSquareWarning size={16} className="text-rose-300" />
              <span>{t('customerComplaints')}</span>
              {complaints.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-rose-600 text-[10px] font-black flex items-center justify-center ml-1">
                  {complaints.length}
                </span>
              )}
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setActiveTab('games')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'games'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-theme-card hover:bg-theme-border border border-theme-border text-theme-muted hover:text-theme-text'
              }`}
            >
              <Gamepad2 size={16} />
              <span>Каталог игр</span>
            </button>
          )}

          {isPublisher && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-black shadow-lg hover:opacity-90 flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Добавить новую игру</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isAdmin ? (
          <>
            <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-between">
              <div>
                <p className="text-xs text-theme-muted uppercase font-bold">Активных жалоб</p>
                <h3 className="text-2xl font-black text-rose-400 mt-1">{complaints.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-between">
              <div>
                <p className="text-xs text-theme-muted uppercase font-bold">Заблокировано аккаунтов</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">{bannedUserIds.size}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <UserX size={20} />
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-between">
              <div>
                <p className="text-xs text-theme-muted uppercase font-bold">Текущая роль</p>
                <h3 className="text-2xl font-black text-theme-text mt-1">{user.role}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border">
              <p className="text-xs text-theme-muted uppercase font-bold">Игр в каталоге</p>
              <h3 className="text-2xl font-black text-theme-text mt-1">{games.length}</h3>
            </div>
            <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border">
              <p className="text-xs text-theme-muted uppercase font-bold">Игр со скидкой</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">
                {games.filter(g => g.discountPercent > 0).length}
              </h3>
            </div>
            <div className="p-5 rounded-2xl bg-theme-surface border border-theme-border">
              <p className="text-xs text-theme-muted uppercase font-bold">Текущая роль</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">{user.role}</h3>
            </div>
          </>
        )}
      </div>

      {/* TAB 1: Customer Complaints / Жалобы клиентов */}
      {activeTab === 'complaints' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-theme-text flex items-center gap-2">
              <MessageSquareWarning size={18} className="text-rose-400" />
              <span>Поступившие жалобы пользователей ({complaints.length})</span>
            </h3>
            <span className="text-xs text-theme-muted">Режим рассмотрения инцидентов</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {complaints.map((item) => {
              const isBanned = bannedUserIds.has(item.reportedUserId);
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all duration-300 ${
                    isBanned
                      ? 'bg-rose-950/20 border-rose-500/40 opacity-75'
                      : 'bg-theme-surface border-theme-border hover:border-theme-border/80 shadow-lg'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Reported User & Ticket Info */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={item.reportedAvatar}
                        alt={item.reportedUser}
                        className="w-12 h-12 rounded-2xl bg-theme-card border border-theme-border object-cover flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-sm text-theme-text">{item.reportedUser}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-theme-muted flex items-center gap-1">
                            <Gamepad2 size={12} />
                            <span>{item.game}</span>
                          </span>
                        </div>
                        <p className="text-xs text-theme-text leading-relaxed">{item.reason}</p>
                        <div className="flex items-center gap-3 text-[11px] text-theme-muted pt-1">
                          <span>Отправитель: <strong className="text-theme-text font-semibold">{item.reporter}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{item.date}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ban Button Action */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleBanAccount(item)}
                        disabled={isBanned}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-md ${
                          isBanned
                            ? 'bg-theme-card border border-rose-500/50 text-rose-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/25 active:scale-95'
                        }`}
                      >
                        {isBanned ? (
                          <>
                            <CheckCircle2 size={15} className="text-rose-400" />
                            <span>{t('bannedAccountBadge')}</span>
                          </>
                        ) : (
                          <>
                            <UserX size={15} />
                            <span>{t('banAccount')}</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Games Management Table */}
      {activeTab === 'games' && (
        <div className="rounded-3xl bg-theme-surface border border-theme-border overflow-hidden shadow-xl animate-in fade-in duration-200">
          <div className="p-5 border-b border-theme-border font-extrabold text-sm text-theme-text flex items-center justify-between">
            <span>Список опубликованных игр</span>
            <span className="text-xs text-theme-muted font-normal">Всего: {games.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-theme-card/60 text-theme-muted font-bold uppercase border-b border-theme-border">
                <tr>
                  <th className="p-4">Игра</th>
                  <th className="p-4">Базовая цена</th>
                  <th className="p-4">Скидка (%)</th>
                  <th className="p-4">Разработчик</th>
                  <th className="p-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {games.map((game) => (
                  <tr key={game.id} className="hover:bg-theme-card/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={game.coverImage} alt={game.title} className="w-12 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-theme-text">{game.title}</p>
                        <span className="text-[10px] text-theme-muted">{game.categories?.[0]}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-theme-text">
                      {formatPrice(game.priceRub, game.priceUsd)}
                    </td>
                    <td className="p-4">
                      <select
                        value={game.discountPercent || 0}
                        onChange={(e) => handleUpdateDiscount(game, e.target.value)}
                        className="bg-theme-card border border-theme-border text-theme-text font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-theme-primary cursor-pointer"
                      >
                        <option value="0">Без скидки (0%)</option>
                        <option value="10">10%</option>
                        <option value="20">20%</option>
                        <option value="30">30%</option>
                        <option value="50">50%</option>
                        <option value="75">75%</option>
                      </select>
                    </td>
                    <td className="p-4 text-theme-muted">{game.developer}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteGame(game.id)}
                        className="p-2 rounded-xl text-theme-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Удалить игру"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Game Modal (Publisher only) */}
      {showAddModal && isPublisher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-theme-surface border border-theme-border p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-theme-text">Добавление новой игры</h3>
            
            <form onSubmit={handleCreateGame} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-theme-muted block mb-1">Название игры</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например: GTA VI"
                  className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-theme-muted block mb-1">Описание</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Подробное описание игрового процесса..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-theme-muted block mb-1">Цена (в рублях)</label>
                  <input
                    type="number"
                    value={newPriceRub}
                    onChange={(e) => setNewPriceRub(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-theme-muted block mb-1">Скидка (%)</label>
                  <input
                    type="number"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-theme-muted block mb-1">Категория</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary font-bold"
                  >
                    <option value="Action">Action</option>
                    <option value="RPG">RPG</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Racing">Racing</option>
                    <option value="Competitive">Competitive</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-theme-muted block mb-1">Разработчик</label>
                  <input
                    type="text"
                    value={newDeveloper}
                    onChange={(e) => setNewDeveloper(e.target.value)}
                    placeholder="Rockstar Games"
                    className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-theme-muted block mb-1">URL обложки (Image)</label>
                <input
                  type="text"
                  value={newCover}
                  onChange={(e) => setNewCover(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-theme-card border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-theme-card border border-theme-border text-theme-muted"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-white font-bold shadow-lg"
                >
                  Опубликовать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
