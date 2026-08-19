import { db } from '../db.js';

/**
 * Resets player libraries, playtime, and profile customizations back to default seed layout.
 * Used for testing and rapid product demonstration reset.
 */
export function resetLayout(req, res) {
  try {
    db.exec('BEGIN TRANSACTION');

    // 1. Reset library_items: clear all purchased games during testing
    db.exec('DELETE FROM library_items');

    // 2. Restore default starter library for demo gamer account
    const insertLib = db.prepare(`
      INSERT INTO library_items (id, userId, gameId, playtimeMin, isInstalled, achievements)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertLib.run('lib-1', 'user-gamer', 'game-cyberpunk-2077', 1280, 1, JSON.stringify([
      { id: 'ach-1', title: 'Легенда Посмертия', description: 'Завершите все заказы фиксеров в Найт-Сити', unlockedAt: '2024-04-10' },
      { id: 'ach-2', title: 'Киберпсихоз', description: 'Обезвредьте всех киберпсихопатов', unlockedAt: '2024-04-15' }
    ]));
    insertLib.run('lib-2', 'user-gamer', 'game-cs2', 3450, 1, JSON.stringify([
      { id: 'ach-3', title: 'Первая кровь', description: 'Совершите первое убийство в раунде', unlockedAt: '2024-03-01' },
      { id: 'ach-4', title: 'Хедшотер', description: 'Поразите 500 врагов в голову', unlockedAt: '2024-03-05' }
    ]));
    insertLib.run('lib-3', 'user-gamer', 'game-rdr2', 2100, 1, JSON.stringify([
      { id: 'ach-5', title: 'Золотая лихорадка', description: 'Получите 70 золотых медалей в сюжетных заданиях', unlockedAt: '2024-05-20' }
    ]));

    // 3. Clear cart items and test wishlists
    db.exec('DELETE FROM cart_items');
    db.exec('DELETE FROM wishlist_items');

    // 4. Reset transactions to default starter records
    db.exec('DELETE FROM transactions');
    const insertTx = db.prepare(`
      INSERT INTO transactions (id, userId, amountRub, amountUsd, type, paymentMethod, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertTx.run('tx-1', 'user-gamer', 2500, 31.25, 'TOPUP', 'VISA_MC', 'COMPLETED', '2026-08-19 17:30:19');
    insertTx.run('tx-2', 'user-gamer', 1339, 16.74, 'PURCHASE', 'WALLET', 'COMPLETED', '2026-08-19 18:25:10');
    insertTx.run('tx-3', 'user-admin', 500, 6.25, 'TOPUP', 'SBP', 'COMPLETED', '2026-08-19 17:06:19');

    // 5. Reset profile customizations, playtime, and default balances for standard demo accounts
    db.prepare(`
      UPDATE users SET
        profileFrame = 'default',
        profileBackground = 'default',
        customStatus = 'В сети и готов к игре',
        bio = 'Главный администратор и архитектор площадки Bryansk_game.',
        avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        walletBalance = 25000.0,
        level = 42
      WHERE id = 'user-admin'
    `).run();

    db.prepare(`
      UPDATE users SET
        profileFrame = 'default',
        profileBackground = 'default',
        customStatus = 'В сети и готов к игре',
        bio = 'Люблю качественные игры, кооперативы и стильные интерфейсы!',
        avatar = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80',
        walletBalance = 7500.0,
        level = 15
      WHERE id = 'user-gamer'
    `).run();

    db.prepare(`
      UPDATE users SET
        profileFrame = 'default',
        profileBackground = 'default',
        customStatus = 'В сети и готов к игре',
        bio = 'Официальный издатель инди-игр на Bryansk_game.',
        avatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
        walletBalance = 12000.0,
        level = 28
      WHERE id = 'user-publisher'
    `).run();

    // 5. Reset any dynamically registered users to default clean state
    db.prepare(`
      UPDATE users SET
        profileFrame = 'default',
        profileBackground = 'default',
        customStatus = 'В сети и готов к игре',
        bio = 'Новый игрок на Bryansk_game',
        avatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=' || nickname,
        walletBalance = 3000.0,
        level = 1
      WHERE id NOT IN ('user-admin', 'user-gamer', 'user-publisher')
    `).run();

    db.exec('COMMIT');

    return res.json({
      success: true,
      message: 'Макет успешно сброшен: библиотеки игроков и кастомизация профилей возвращены к исходным значениям.'
    });
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('resetLayout error:', error);
    return res.status(500).json({ error: 'Ошибка сброса макета' });
  }
}
