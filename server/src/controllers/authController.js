import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { config } from '../config.js';
import crypto from 'crypto';

export function register(req, res) {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json({ error: 'Заполните все обязательные поля (Email, Пароль, Никнейм)' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const id = 'user-' + crypto.randomUUID();
    const passwordHash = bcrypt.hashSync(password, 10);
    const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nickname)}`;

    db.prepare(`
      INSERT INTO users (id, email, passwordHash, nickname, avatar, role, bio, level, walletBalance, currency, theme, lang)
      VALUES (?, ?, ?, ?, ?, 'USER', 'Новый игрок на Bryansk_game', 1, 3000.0, 'RUB', 'dark', 'ru')
    `).run(id, email, passwordHash, nickname, defaultAvatar);

    const user = db.prepare('SELECT id, email, nickname, avatar, role, bio, level, walletBalance, currency, theme, lang FROM users WHERE id = ?').get(id);

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Регистрация успешно завершена',
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Ошибка сервера при регистрации' });
  }
}

export function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Введите email и пароль' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });

    const safeUser = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role,
      bio: user.bio,
      level: user.level,
      walletBalance: user.walletBalance,
      currency: user.currency,
      theme: user.theme,
      lang: user.lang
    };

    return res.json({
      message: 'Успешный вход в аккаунт',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Ошибка сервера при входе' });
  }
}

export function getMe(req, res) {
  try {
    const user = db.prepare('SELECT id, email, nickname, avatar, role, bio, level, walletBalance, currency, theme, lang FROM users WHERE id = ?').get(req.user.id);
    
    // Count user's library games and wishlist
    const gamesCount = db.prepare('SELECT COUNT(*) as count FROM library_items WHERE userId = ?').get(req.user.id).count;
    const wishlistCount = db.prepare('SELECT COUNT(*) as count FROM wishlist_items WHERE userId = ?').get(req.user.id).count;
    const cartCount = db.prepare('SELECT COUNT(*) as count FROM cart_items WHERE userId = ?').get(req.user.id).count;

    return res.json({
      user: {
        ...user,
        gamesCount,
        wishlistCount,
        cartCount
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ error: 'Ошибка получения профиля' });
  }
}

export function updatePreferences(req, res) {
  try {
    const { theme, lang, currency, bio, nickname, avatar } = req.body;
    const current = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    const newTheme = theme || current.theme;
    const newLang = lang || current.lang;
    const newCurrency = currency || current.currency;
    const newBio = bio !== undefined ? bio : current.bio;
    const newNickname = nickname || current.nickname;
    const newAvatar = avatar || current.avatar;

    db.prepare(`
      UPDATE users 
      SET theme = ?, lang = ?, currency = ?, bio = ?, nickname = ?, avatar = ?, updatedAt = datetime('now')
      WHERE id = ?
    `).run(newTheme, newLang, newCurrency, newBio, newNickname, newAvatar, req.user.id);

    const updatedUser = db.prepare('SELECT id, email, nickname, avatar, role, bio, level, walletBalance, currency, theme, lang FROM users WHERE id = ?').get(req.user.id);

    return res.json({
      message: 'Настройки успешно сохранены',
      user: updatedUser
    });
  } catch (error) {
    console.error('updatePreferences error:', error);
    return res.status(500).json({ error: 'Ошибка обновления настроек' });
  }
}
