import { db } from '../db.js';

export function getProfile(req, res) {
  try {
    const { userId } = req.params;
    const currentUserId = req.user ? req.user.id : null;

    const targetId = userId === 'me' ? currentUserId : userId;
    if (!targetId) {
      return res.status(400).json({ error: 'Не указан пользователь' });
    }

    const user = db.prepare('SELECT id, email, nickname, avatar, role, bio, customStatus, profileFrame, profileBackground, level, walletBalance, currency, theme, lang, createdAt FROM users WHERE id = ? OR nickname = ?').get(targetId, targetId);
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

    // Total playtime
    let totalPlaytimeMin = 0;
    library.forEach(item => {
      totalPlaytimeMin += item.playtimeMin || 0;
    });

    const totalHours = Math.round(totalPlaytimeMin / 60);

    // Reviews count
    const reviewsCount = db.prepare('SELECT COUNT(*) as count FROM reviews WHERE userId = ?').get(user.id).count;

    // Friends count
    const friendsCount = db.prepare(`
      SELECT COUNT(*) as count FROM friendships
      WHERE (userId1 = ? OR userId2 = ?) AND status = 'ACCEPTED'
    `).get(user.id, user.id).count;

    // Recent reviews
    const reviews = db.prepare(`
      SELECT r.id, r.rating, r.isPositive, r.content, r.createdAt, g.title as gameTitle, g.coverImage as gameCover
      FROM reviews r
      JOIN games g ON r.gameId = g.id
      WHERE r.userId = ?
      ORDER BY r.createdAt DESC
      LIMIT 5
    `).all(user.id);

    // Steam-like badges with explicit unlock conditions & locked state
    const badges = [
      {
        id: 'badge-pioneer',
        name: 'Первопроходец Брянска',
        icon: '🚀',
        description: 'Присоединиться к сообществу Bryansk_game',
        condition: 'Регистрация аккаунта',
        isUnlocked: true,
        progress: '1/1'
      },
      {
        id: 'badge-collector-1',
        name: 'Начинающий коллекционер',
        icon: '🎮',
        description: 'Собрать коллекцию из 3 игр',
        condition: 'Приобрести 3 игры в магазине',
        isUnlocked: library.length >= 3,
        progress: `${library.length}/3`
      },
      {
        id: 'badge-collector-2',
        name: 'Магнат библиотеки',
        icon: '🏆',
        description: 'Иметь в библиотеке 10 или более игр',
        condition: 'Приобрести 10 игр',
        isUnlocked: library.length >= 10,
        progress: `${library.length}/10`
      },
      {
        id: 'badge-veteran',
        name: 'Ветеран гейминга',
        icon: '⚡',
        description: 'Провести в играх более 50 часов',
        condition: 'Наиграть 50 часов в любых играх',
        isUnlocked: totalHours >= 50,
        progress: `${totalHours}/50 ч.`
      },
      {
        id: 'badge-critic',
        name: 'Игровой критик',
        icon: '✍️',
        description: 'Опубликовать 3 рецензии на купленные игры',
        condition: 'Написать 3 отзыва к играм',
        isUnlocked: reviewsCount >= 3,
        progress: `${reviewsCount}/3`
      },
      {
        id: 'badge-social',
        name: 'Душа компании',
        icon: '🤝',
        description: 'Добавить 3 друзей в список контактов',
        condition: 'Иметь 3 подтвержденных друга',
        isUnlocked: friendsCount >= 3,
        progress: `${friendsCount}/3`
      },
      {
        id: 'badge-high-roller',
        name: 'Шейх Брянска',
        icon: '💎',
        description: 'Пополнить баланс кошелька суммарно на 10 000 ₽',
        condition: 'Пополнить кошелек на 10 000 ₽',
        isUnlocked: (user.walletBalance || 0) >= 10000,
        progress: `${Math.round(user.walletBalance || 0)}/10000 ₽`
      }
    ];

    return res.json({
      profile: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio,
        customStatus: user.customStatus || 'В сети и готов к игре',
        profileFrame: user.profileFrame || 'default',
        profileBackground: user.profileBackground || 'default',
        level: user.level,
        role: user.role,
        createdAt: user.createdAt,
        gamesCount: library.length,
        totalPlaytimeHours: totalHours,
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
