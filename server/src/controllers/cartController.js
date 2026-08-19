import { db } from '../db.js';
import crypto from 'crypto';

export function getCart(req, res) {
  try {
    const userId = req.user.id;

    const items = db.prepare(`
      SELECT c.id as cartItemId, c.createdAt as addedAt, g.*
      FROM cart_items c
      JOIN games g ON c.gameId = g.id
      WHERE c.userId = ?
      ORDER BY c.createdAt DESC
    `).all(userId);

    let totalRub = 0;
    let totalUsd = 0;
    let totalDiscountRub = 0;
    let totalDiscountUsd = 0;

    const formattedItems = items.map(game => {
      const discount = game.discountPercent || 0;
      const finalPriceRub = discount > 0 ? Math.round(game.priceRub * (1 - discount / 100)) : game.priceRub;
      const finalPriceUsd = discount > 0 ? Number((game.priceUsd * (1 - discount / 100)).toFixed(2)) : game.priceUsd;

      totalRub += finalPriceRub;
      totalUsd += finalPriceUsd;
      totalDiscountRub += (game.priceRub - finalPriceRub);
      totalDiscountUsd += (game.priceUsd - finalPriceUsd);

      return {
        cartItemId: game.cartItemId,
        gameId: game.id,
        title: game.title,
        coverImage: game.coverImage,
        originalPriceRub: game.priceRub,
        originalPriceUsd: game.priceUsd,
        discountPercent: game.discountPercent,
        finalPriceRub,
        finalPriceUsd
      };
    });

    return res.json({
      items: formattedItems,
      count: formattedItems.length,
      summary: {
        totalRub: Math.round(totalRub),
        totalUsd: Number(totalUsd.toFixed(2)),
        discountRub: Math.round(totalDiscountRub),
        discountUsd: Number(totalDiscountUsd.toFixed(2))
      }
    });
  } catch (error) {
    console.error('getCart error:', error);
    return res.status(500).json({ error: 'Ошибка получения корзины' });
  }
}

export function addToCart(req, res) {
  try {
    const userId = req.user.id;
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: 'Не указан ID игры' });
    }

    // Check if user already owns this game
    const alreadyOwned = db.prepare('SELECT id FROM library_items WHERE userId = ? AND gameId = ?').get(userId, gameId);
    if (alreadyOwned) {
      return res.status(400).json({ error: 'Эта игра уже есть в вашей библиотеке' });
    }

    const existing = db.prepare('SELECT id FROM cart_items WHERE userId = ? AND gameId = ?').get(userId, gameId);
    if (existing) {
      return res.status(400).json({ error: 'Игра уже находится в корзине' });
    }

    const id = 'cart-' + crypto.randomUUID();
    db.prepare('INSERT INTO cart_items (id, userId, gameId) VALUES (?, ?, ?)').run(id, userId, gameId);

    const count = db.prepare('SELECT COUNT(*) as count FROM cart_items WHERE userId = ?').get(userId).count;

    return res.status(201).json({
      message: 'Игра добавлена в корзину',
      cartCount: count
    });
  } catch (error) {
    console.error('addToCart error:', error);
    return res.status(500).json({ error: 'Ошибка добавления в корзину' });
  }
}

export function removeFromCart(req, res) {
  try {
    const userId = req.user.id;
    const { gameId } = req.params;

    db.prepare('DELETE FROM cart_items WHERE userId = ? AND (gameId = ? OR id = ?)').run(userId, gameId, gameId);
    const count = db.prepare('SELECT COUNT(*) as count FROM cart_items WHERE userId = ?').get(userId).count;

    return res.json({
      message: 'Игра удалена из корзины',
      cartCount: count
    });
  } catch (error) {
    console.error('removeFromCart error:', error);
    return res.status(500).json({ error: 'Ошибка удаления из корзины' });
  }
}

export function clearCart(req, res) {
  try {
    const userId = req.user.id;
    db.prepare('DELETE FROM cart_items WHERE userId = ?').run(userId);

    return res.json({
      message: 'Корзина очищена',
      cartCount: 0
    });
  } catch (error) {
    console.error('clearCart error:', error);
    return res.status(500).json({ error: 'Ошибка очистки корзины' });
  }
}
