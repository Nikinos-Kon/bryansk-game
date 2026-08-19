import { db } from '../db.js';

export function getLibrary(req, res) {
  try {
    const userId = req.user.id;

    const items = db.prepare(`
      SELECT l.id as libraryItemId, l.purchaseDate, l.playtimeMin, l.isInstalled, l.achievements,
             g.*
      FROM library_items l
      JOIN games g ON l.gameId = g.id
      WHERE l.userId = ?
      ORDER BY l.purchaseDate DESC
    `).all(userId);

    const formatted = items.map(game => ({
      libraryItemId: game.libraryItemId,
      id: game.id,
      title: game.title,
      slug: game.slug,
      coverImage: game.coverImage,
      headerBanner: game.headerBanner,
      screenshots: JSON.parse(game.screenshots || '[]'),
      categories: JSON.parse(game.categories || '[]'),
      tags: JSON.parse(game.tags || '[]'),
      systemRequirements: JSON.parse(game.systemRequirements || '{}'),
      purchaseDate: game.purchaseDate,
      playtimeMin: game.playtimeMin,
      isInstalled: Boolean(game.isInstalled),
      achievements: JSON.parse(game.achievements || '[]')
    }));

    return res.json({ library: formatted, count: formatted.length });
  } catch (error) {
    console.error('getLibrary error:', error);
    return res.status(500).json({ error: 'Ошибка получения библиотеки' });
  }
}

export function toggleInstall(req, res) {
  try {
    const userId = req.user.id;
    const { gameId } = req.params;

    const item = db.prepare('SELECT * FROM library_items WHERE userId = ? AND gameId = ?').get(userId, gameId);
    if (!item) {
      return res.status(404).json({ error: 'Игра не найдена в библиотеке' });
    }

    const newStatus = item.isInstalled ? 0 : 1;
    db.prepare('UPDATE library_items SET isInstalled = ? WHERE id = ?').run(newStatus, item.id);

    return res.json({
      message: newStatus ? 'Игра успешно установлена' : 'Игра удалена с диска',
      isInstalled: Boolean(newStatus)
    });
  } catch (error) {
    console.error('toggleInstall error:', error);
    return res.status(500).json({ error: 'Ошибка изменения статуса установки' });
  }
}

export function playSession(req, res) {
  try {
    const userId = req.user.id;
    const { gameId } = req.params;
    const { addedMinutes = 30 } = req.body;

    const item = db.prepare('SELECT * FROM library_items WHERE userId = ? AND gameId = ?').get(userId, gameId);
    if (!item) {
      return res.status(404).json({ error: 'Игра не найдена в библиотеке' });
    }

    const newPlaytime = item.playtimeMin + addedMinutes;
    db.prepare('UPDATE library_items SET playtimeMin = ?, isInstalled = 1 WHERE id = ?').run(newPlaytime, item.id);

    // Increase user level slightly with playtime
    const user = db.prepare('SELECT level FROM users WHERE id = ?').get(userId);
    const newLevel = Math.max(1, Math.floor(newPlaytime / 120) + 1);
    if (newLevel > user.level) {
      db.prepare('UPDATE users SET level = ? WHERE id = ?').run(newLevel, userId);
    }

    return res.json({
      message: `Игровая сессия завершена. Время в игре: ${newPlaytime} мин.`,
      playtimeMin: newPlaytime,
      level: newLevel
    });
  } catch (error) {
    console.error('playSession error:', error);
    return res.status(500).json({ error: 'Ошибка обновления игровой сессии' });
  }
}
