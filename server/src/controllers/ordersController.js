import { db } from '../db.js';
import crypto from 'crypto';

export function checkout(req, res) {
  try {
    const userId = req.user.id;
    const { paymentMethod = 'WALLET', items: directItems } = req.body; 

    let gamesToPurchase = [];

    if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      // Direct checkout for specific game(s)
      for (const item of directItems) {
        const gameId = typeof item === 'string' ? item : (item.gameId || item.id);
        if (gameId) {
          const game = db.prepare('SELECT * FROM games WHERE id = ?').get(String(gameId));
          if (game) gamesToPurchase.push(game);
        }
      }
    } else {
      // Checkout all items from user's cart
      const cartRows = db.prepare(`
        SELECT g.* FROM cart_items c
        JOIN games g ON c.gameId = g.id
        WHERE c.userId = ?
      `).all(userId);
      gamesToPurchase = cartRows;
    }

    if (gamesToPurchase.length === 0) {
      return res.status(400).json({ error: 'Нет товаров для оформления покупки' });
    }

    // Calculate total
    let totalRub = 0;
    let totalUsd = 0;

    for (const game of gamesToPurchase) {
      const discount = game.discountPercent || 0;
      const finalRub = discount > 0 ? Math.round(game.priceRub * (1 - discount / 100)) : game.priceRub;
      const finalUsd = discount > 0 ? Number((game.priceUsd * (1 - discount / 100)).toFixed(2)) : game.priceUsd;
      totalRub += finalRub;
      totalUsd += finalUsd;
    }

    // Check user balance for internal wallet
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if ((user.walletBalance || 0) < totalRub) {
      return res.status(400).json({
        error: `Недостаточно средств на кошельке. Требуется ${Math.round(totalRub)} ₽, у вас ${Math.round(user.walletBalance || 0)} ₽.`
      });
    }

    // Execute atomic transaction for purchasing
    const txId = 'tx-' + crypto.randomUUID();

    try {
      db.exec('BEGIN TRANSACTION');

      // 1. Deduct balance
      const newBalance = (user.walletBalance || 0) - totalRub;
      db.prepare('UPDATE users SET walletBalance = ? WHERE id = ?').run(newBalance, userId);

      // 2. Add games to library
      const insertLib = db.prepare(`
        INSERT OR IGNORE INTO library_items (id, userId, gameId, purchaseDate, playtimeMin, isInstalled, achievements)
        VALUES (?, ?, ?, datetime('now'), 0, 0, '[]')
      `);

      for (const game of gamesToPurchase) {
        const libId = 'lib-' + crypto.randomUUID();
        insertLib.run(libId, userId, game.id);

        // Remove from cart & wishlist
        db.prepare('DELETE FROM cart_items WHERE userId = ? AND gameId = ?').run(userId, game.id);
        db.prepare('DELETE FROM wishlist_items WHERE userId = ? AND gameId = ?').run(userId, game.id);
      }

      // 3. Create transaction log
      db.prepare(`
        INSERT INTO transactions (id, userId, type, paymentMethod, amountRub, amountUsd, status, details, createdAt)
        VALUES (?, ?, 'PURCHASE', 'WALLET', ?, ?, 'COMPLETED', ?, datetime('now'))
      `).run(
        txId, userId, totalRub, totalUsd,
        JSON.stringify(gamesToPurchase.map(g => ({ id: g.id, title: g.title, priceRub: g.priceRub })))
      );

      db.exec('COMMIT');
    } catch (txErr) {
      db.exec('ROLLBACK');
      throw txErr;
    }

    const updatedUser = db.prepare('SELECT id, email, nickname, avatar, role, bio, customStatus, profileFrame, profileBackground, level, walletBalance, currency, theme, lang FROM users WHERE id = ?').get(userId);

    return res.status(200).json({
      message: 'Оплата успешно завершена! Игры добавлены в вашу библиотеку.',
      transactionId: txId,
      purchasedCount: gamesToPurchase.length,
      purchasedGames: gamesToPurchase.map(g => ({ id: g.id, title: g.title, coverImage: g.coverImage })),
      user: updatedUser
    });
  } catch (error) {
    console.error('checkout error:', error);
    return res.status(500).json({ error: 'Ошибка при проведении платежа' });
  }
}
