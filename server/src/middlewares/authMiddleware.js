import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { db } from '../db.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = db.prepare('SELECT id, email, nickname, avatar, role, bio, level, walletBalance, currency, theme, lang FROM users WHERE id = ?').get(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Недействительный токен сессии' });
  }
}

export function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = db.prepare('SELECT id, email, nickname, avatar, role, bio, level, walletBalance, currency, theme, lang FROM users WHERE id = ?').get(decoded.userId);
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Недостаточно прав для выполнения действия' });
    }
    next();
  };
}
