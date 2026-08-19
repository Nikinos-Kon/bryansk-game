import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNotification } from '../context/NotificationContext';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Sparkles, 
  Check, 
  Layers,
  Gamepad2
} from 'lucide-react';

export function AdminPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { addToast } = useNotification();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New game form state
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

  if (user?.role !== 'ADMIN' && user?.role !== 'PUBLISHER') {
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
            <h1 className="text-2xl font-black text-theme-text uppercase tracking-tight">Панель управления магазином</h1>
            <p className="text-xs text-theme-muted">Управление играми, скидками и каталогом</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-lg hover:opacity-90 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Добавить новую игру</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      </div>

      {/* Games Management Table */}
      <div className="rounded-3xl bg-theme-surface border border-theme-border overflow-hidden shadow-xl">
        <div className="p-5 border-b border-theme-border font-extrabold text-sm text-theme-text">
          Список опубликованных игр
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
                      className="bg-theme-card border border-theme-border text-theme-text font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-theme-primary"
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

      {/* Add Game Modal */}
      {showAddModal && (
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
