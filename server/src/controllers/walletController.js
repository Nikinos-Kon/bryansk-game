import { db } from '../db.js';
import crypto from 'crypto';

export function getWallet(req, res) {
  try {
    const userId = req.user.id;
    const user = db.prepare('SELECT walletBalance, currency FROM users WHERE id = ?').get(userId);

    const transactions = db.prepare(`
      SELECT * FROM transactions
      WHERE userId = ?
      ORDER BY createdAt DESC
      LIMIT 20
    `).all(userId);

    return res.json({
      walletBalance: user.walletBalance,
      currency: user.currency || 'RUB',
      walletBalanceUsd: Number((user.walletBalance * 0.0125).toFixed(2)),
      transactions
    });
  } catch (error) {
    console.error('getWallet error:', error);
    return res.status(500).json({ error: 'Ошибка получения информации о кошельке' });
  }
}

export function topUpWallet(req, res) {
  try {
    const userId = req.user.id;
    const { amountRub, paymentMethod } = req.body; 
    // paymentMethod: 'SBP', 'VISA_MC', 'USDT'

    const amount = Number(amountRub);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Укажите корректную сумму пополнения' });
    }

    const amountUsd = Number((amount * 0.0125).toFixed(2));
    const user = db.prepare('SELECT walletBalance, currency FROM users WHERE id = ?').get(userId);
    const newBalance = user.walletBalance + amount;

    const txId = 'tx-' + crypto.randomUUID();

    try {
      db.exec('BEGIN TRANSACTION');
      db.prepare('UPDATE users SET walletBalance = ? WHERE id = ?').run(newBalance, userId);
      db.prepare(`
        INSERT INTO transactions (id, userId, type, paymentMethod, amountRub, amountUsd, status, details, createdAt)
        VALUES (?, ?, 'TOPUP', ?, ?, ?, 'COMPLETED', ?, datetime('now'))
      `).run(txId, userId, paymentMethod || 'SBP', amount, amountUsd, JSON.stringify({ note: 'Пополнение баланса кошелька' }));
      db.exec('COMMIT');
    } catch (txErr) {
      db.exec('ROLLBACK');
      throw txErr;
    }

    return res.json({
      message: `Кошелек успешно пополнен на ${amount} ₽!`,
      walletBalance: newBalance,
      walletBalanceUsd: Number((newBalance * 0.0125).toFixed(2)),
      transactionId: txId
    });
  } catch (error) {
    console.error('topUpWallet error:', error);
    return res.status(500).json({ error: 'Ошибка пополнения кошелька' });
  }
}

export function switchCurrency(req, res) {
  try {
    const userId = req.user.id;
    const { currency } = req.body; // 'RUB' or 'USD'

    if (!currency || !['RUB', 'USD'].includes(currency)) {
      return res.status(400).json({ error: 'Поддерживаются только валюты RUB и USD' });
    }

    db.prepare('UPDATE users SET currency = ? WHERE id = ?').run(currency, userId);

    return res.json({
      message: `Основная валюта изменена на ${currency}`,
      currency
    });
  } catch (error) {
    console.error('switchCurrency error:', error);
    return res.status(500).json({ error: 'Ошибка смены валюты' });
  }
}
