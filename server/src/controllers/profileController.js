import { db } from '../db.js';

export function getProfile(req, res) {
  try {
    const { userId } = req.params;
    const currentUserId = req.user ? req.user.id : null;

    const targetId = userId === 'me' ? currentUserId : userId;
    if (!targetId) {
      return res.status(400).json({ error: 'Не указан пользователь' });
    }

    const user = db.prepare('SELECT id, email, nickname, avatar, role, bio, level, walletBalance, currency, theme, lang, createdAt FROM users WHERE id = ? OR nickname = ?').get(targetId, targetId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Games owned
    const library = db.prepare(`
      SELECT l.purchaseDate, l.playtimeMin, l.achievements, g.id, g.title, g.slug, g.coverImage, g.headerBanner
      FROM library_items l
      JOIN games g ON l.gameId = g.id
      WHERE l.userId = ?
      ORDER BY l.playtimeMin DESC
    `).all(user.id);

    // Total playtime and badges
    let totalPlaytimeMin = 0;
    library.forEach(item => {
      totalPlaytimeMin += item.playtimeMin || 0;
    });

    // Recent reviews
    const reviews = db.prepare(`
      SELECT r.id, r.rating, r.isPositive, r.content, r.createdAt, g.title as gameTitle, g.coverImage as gameCover
      FROM reviews r
      JOIN games g ON r.gameId = g.id
      WHERE r.userId = ?
      ORDER BY r.createdAt DESC
      LIMIT 5
    `).all(user.id);

    // Steam-like badges
    const badges = [
      { id: 'badge-1', name: 'Первопроходец Брянска', icon: '🚀', description: 'Один из первых пользователей Bryansk_game' },
      { id: 'badge-2', name: 'Коллекционер', icon: '🏆', description: `Собрано игр: ${library.length}` },
      { id: 'badge-3', name: 'Хардкорный геймер', icon: '⚡', description: `${Math.round(totalPlaytimeMin / 60)} часов в играх` }
    ];

    return res.json({
      profile: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio,
        level: user.level,
        role: user.role,
        createdAt: user.createdAt,
        gamesCount: library.length,
        totalPlaytimeHours: Math.round(totalPlaytimeMin / 60),
        badges,
        showcaseGames: library.slice(0, 6),
        recentReviews: reviews
      }
    });
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ error: 'Ошибка получения профиля' });
  }
}
