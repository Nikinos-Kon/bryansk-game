import { db } from '../db.js';
import crypto from 'crypto';

export function addReview(req, res) {
  try {
    const userId = req.user.id;
    const { gameId, rating, isPositive, content } = req.body;

    if (!gameId || !content) {
      return res.status(400).json({ error: 'Пожалуйста, напишите текст отзыва' });
    }

    const ownsGame = db.prepare('SELECT id FROM library_items WHERE userId = ? AND gameId = ?').get(userId, gameId);
    if (!ownsGame) {
      return res.status(403).json({ error: 'Вы можете оставить отзыв только на купленную игру' });
    }

    const id = 'rev-' + crypto.randomUUID();
    db.prepare(`
      INSERT INTO reviews (id, userId, gameId, rating, isPositive, content, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(id, userId, gameId, rating || 5, isPositive ? 1 : 0, content);

    // Update game average rating and count
    const stats = db.prepare('SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE gameId = ?').get(gameId);
    if (stats && stats.count > 0) {
      db.prepare('UPDATE games SET rating = ?, ratingCount = ratingCount + 1 WHERE id = ?').run(
        Number(stats.avgRating.toFixed(1)),
        gameId
      );
    }

    const review = db.prepare(`
      SELECT r.id, r.rating, r.isPositive, r.content, r.createdAt, u.nickname, u.avatar, u.id as userId
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE r.id = ?
    `).get(id);

    return res.status(201).json({
      message: 'Ваш отзыв успешно опубликован!',
      review
    });
  } catch (error) {
    console.error('addReview error:', error);
    return res.status(500).json({ error: 'Ошибка сохранения отзыва' });
  }
}

export function toggleWishlist(req, res) {
  try {
    const userId = req.user.id;
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: 'Не указан ID игры' });
    }

    const existing = db.prepare('SELECT id FROM wishlist_items WHERE userId = ? AND gameId = ?').get(userId, gameId);
    let isWishlisted = false;

    if (existing) {
      db.prepare('DELETE FROM wishlist_items WHERE id = ?').run(existing.id);
      isWishlisted = false;
    } else {
      const id = 'wish-' + crypto.randomUUID();
      db.prepare('INSERT INTO wishlist_items (id, userId, gameId) VALUES (?, ?, ?)').run(id, userId, gameId);
      isWishlisted = true;
    }

    const count = db.prepare('SELECT COUNT(*) as count FROM wishlist_items WHERE userId = ?').get(userId).count;

    return res.json({
      isWishlisted,
      wishlistCount: count,
      message: isWishlisted ? 'Игра добавлена в список желаемого' : 'Игра удалена из списка желаемого'
    });
  } catch (error) {
    console.error('toggleWishlist error:', error);
    return res.status(500).json({ error: 'Ошибка обновления списка желаемого' });
  }
}

export function getWishlist(req, res) {
  try {
    const userId = req.user.id;

    const items = db.prepare(`
      SELECT w.id as wishlistId, w.createdAt as addedAt, g.*
      FROM wishlist_items w
      JOIN games g ON w.gameId = g.id
      WHERE w.userId = ?
      ORDER BY w.createdAt DESC
    `).all(userId);

    const formatted = items.map(game => ({
      wishlistId: game.wishlistId,
      id: game.id,
      title: game.title,
      coverImage: game.coverImage,
      priceRub: game.priceRub,
      priceUsd: game.priceUsd,
      discountPercent: game.discountPercent,
      rating: game.rating,
      categories: JSON.parse(game.categories || '[]')
    }));

    return res.json({ wishlist: formatted, count: formatted.length });
  } catch (error) {
    console.error('getWishlist error:', error);
    return res.status(500).json({ error: 'Ошибка получения списка желаемого' });
  }
}
