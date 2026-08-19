import { db } from '../db.js';
import crypto from 'crypto';

export function getFriends(req, res) {
  try {
    const userId = req.user.id;

    // Get list of friends (either userId1 or userId2)
    const friendships = db.prepare(`
      SELECT 
        CASE WHEN userId1 = ? THEN userId2 ELSE userId1 END as friendId,
        status, createdAt
      FROM friendships
      WHERE (userId1 = ? OR userId2 = ?) AND status = 'ACCEPTED'
    `).all(userId, userId, userId);

    const friends = friendships.map(f => {
      const friendUser = db.prepare('SELECT id, nickname, avatar, level, bio FROM users WHERE id = ?').get(f.friendId);
      
      // Check if playing any game
      const lastPlayed = db.prepare(`
        SELECT g.title FROM library_items l
        JOIN games g ON l.gameId = g.id
        WHERE l.userId = ? AND l.playtimeMin > 0
        ORDER BY l.purchaseDate DESC LIMIT 1
      `).get(f.friendId);

      // Steam-style online status
      const statuses = ['В игре', 'В сети', 'Не в сети'];
      const statusIndex = (f.friendId.charCodeAt(f.friendId.length - 1) || 0) % 3;
      const statusText = statusIndex === 0 && lastPlayed ? `В игре: ${lastPlayed.title}` : (statusIndex === 1 ? 'В сети' : 'Не в сети');
      const isOnline = statusIndex < 2;

      return {
        ...friendUser,
        statusText,
        isOnline,
        friendshipDate: f.createdAt
      };
    });

    // Also get pending suggestions
    const allUsers = db.prepare('SELECT id, nickname, avatar, level, bio FROM users WHERE id != ? LIMIT 10').all(userId);
    const friendIds = new Set(friends.map(f => f.id));
    const suggestions = allUsers.filter(u => !friendIds.has(u.id));

    return res.json({ friends, suggestions });
  } catch (error) {
    console.error('getFriends error:', error);
    return res.status(500).json({ error: 'Ошибка получения списка друзей' });
  }
}

export function addFriend(req, res) {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    if (!targetUserId || targetUserId === userId) {
      return res.status(400).json({ error: 'Неверный ID пользователя' });
    }

    const existing = db.prepare(`
      SELECT * FROM friendships 
      WHERE (userId1 = ? AND userId2 = ?) OR (userId1 = ? AND userId2 = ?)
    `).get(userId, targetUserId, targetUserId, userId);

    if (existing) {
      return res.status(400).json({ error: 'Запрос дружбы уже существует или вы уже друзья' });
    }

    const id = 'fr-' + crypto.randomUUID();
    db.prepare('INSERT INTO friendships (id, userId1, userId2, status) VALUES (?, ?, ?, ?)').run(id, userId, targetUserId, 'ACCEPTED');

    return res.status(201).json({ message: 'Пользователь добавлен в друзья!' });
  } catch (error) {
    console.error('addFriend error:', error);
    return res.status(500).json({ error: 'Ошибка добавления в друзья' });
  }
}

export function removeFriend(req, res) {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    db.prepare(`
      DELETE FROM friendships
      WHERE (userId1 = ? AND userId2 = ?) OR (userId1 = ? AND userId2 = ?)
    `).run(userId, friendId, friendId, userId);

    return res.json({ message: 'Пользователь удален из друзей' });
  } catch (error) {
    console.error('removeFriend error:', error);
    return res.status(500).json({ error: 'Ошибка удаления из друзей' });
  }
}
