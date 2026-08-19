import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { SEED_GAMES, SEED_USERS } from './utils/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../dev.db');

export const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys
try {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);
} catch (e) {
  // Ignore
}

export function initDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      nickname TEXT NOT NULL,
      avatar TEXT,
      role TEXT DEFAULT 'USER',
      bio TEXT DEFAULT 'Геймер из Брянска',
      level INTEGER DEFAULT 1,
      walletBalance REAL DEFAULT 5000.0,
      currency TEXT DEFAULT 'RUB',
      theme TEXT DEFAULT 'dark',
      lang TEXT DEFAULT 'ru',
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      descriptionRu TEXT NOT NULL,
      descriptionEn TEXT NOT NULL,
      shortDescRu TEXT,
      shortDescEn TEXT,
      priceRub REAL NOT NULL,
      priceUsd REAL NOT NULL,
      discountPercent INTEGER DEFAULT 0,
      isFeatured INTEGER DEFAULT 0,
      isSpecialOffer INTEGER DEFAULT 0,
      isNewRelease INTEGER DEFAULT 1,
      releaseDate TEXT NOT NULL,
      developer TEXT NOT NULL,
      publisher TEXT NOT NULL,
      rating REAL DEFAULT 4.8,
      ratingCount INTEGER DEFAULT 100,
      coverImage TEXT NOT NULL,
      headerBanner TEXT NOT NULL,
      screenshots TEXT NOT NULL,
      trailerUrl TEXT,
      categories TEXT NOT NULL,
      tags TEXT NOT NULL,
      systemRequirements TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS library_items (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      gameId TEXT NOT NULL,
      purchaseDate TEXT DEFAULT (datetime('now')),
      playtimeMin INTEGER DEFAULT 0,
      isInstalled INTEGER DEFAULT 0,
      achievements TEXT DEFAULT '[]',
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE CASCADE,
      UNIQUE(userId, gameId)
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      gameId TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE CASCADE,
      UNIQUE(userId, gameId)
    );

    CREATE TABLE IF NOT EXISTS wishlist_items (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      gameId TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE CASCADE,
      UNIQUE(userId, gameId)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      gameId TEXT NOT NULL,
      rating INTEGER NOT NULL,
      isPositive INTEGER DEFAULT 1,
      content TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      type TEXT NOT NULL,
      paymentMethod TEXT NOT NULL,
      amountRub REAL NOT NULL,
      amountUsd REAL NOT NULL,
      status TEXT NOT NULL,
      details TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS friendships (
      id TEXT PRIMARY KEY,
      userId1 TEXT NOT NULL,
      userId2 TEXT NOT NULL,
      status TEXT DEFAULT 'ACCEPTED',
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId1) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (userId2) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(userId1, userId2)
    );
  `);

  // Always sync/upsert games catalog with full official Steam games data
  console.log(`Syncing ${SEED_GAMES.length} real games with official Steam artwork...`);
  const upsertGame = db.prepare(`
    INSERT INTO games (
      id, title, slug, descriptionRu, descriptionEn, shortDescRu, shortDescEn,
      priceRub, priceUsd, discountPercent, isFeatured, isSpecialOffer, isNewRelease,
      releaseDate, developer, publisher, rating, ratingCount, coverImage, headerBanner,
      screenshots, trailerUrl, categories, tags, systemRequirements
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      descriptionRu = excluded.descriptionRu,
      descriptionEn = excluded.descriptionEn,
      shortDescRu = excluded.shortDescRu,
      shortDescEn = excluded.shortDescEn,
      priceRub = excluded.priceRub,
      priceUsd = excluded.priceUsd,
      discountPercent = excluded.discountPercent,
      isFeatured = excluded.isFeatured,
      isSpecialOffer = excluded.isSpecialOffer,
      isNewRelease = excluded.isNewRelease,
      coverImage = excluded.coverImage,
      headerBanner = excluded.headerBanner,
      screenshots = excluded.screenshots,
      trailerUrl = excluded.trailerUrl,
      categories = excluded.categories,
      tags = excluded.tags,
      systemRequirements = excluded.systemRequirements
  `);

  for (const game of SEED_GAMES) {
    upsertGame.run(
      game.id,
      game.title,
      game.slug,
      game.descriptionRu,
      game.descriptionEn,
      game.shortDescRu || '',
      game.shortDescEn || '',
      game.priceRub,
      game.priceUsd,
      game.discountPercent || 0,
      game.isFeatured ? 1 : 0,
      game.isSpecialOffer ? 1 : 0,
      game.isNewRelease ? 1 : 0,
      game.releaseDate,
      game.developer,
      game.publisher,
      game.rating,
      game.ratingCount,
      game.coverImage,
      game.headerBanner,
      game.screenshots,
      game.trailerUrl || '',
      game.categories,
      game.tags,
      game.systemRequirements
    );
  }

  // Seed default users if empty
  const countUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (countUsers === 0) {
    console.log('Seeding default users and test accounts...');
    const insertUser = db.prepare(`
      INSERT INTO users (
        id, email, passwordHash, nickname, avatar, role, bio, level, walletBalance
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    for (const user of SEED_USERS) {
      const passwordHash = bcrypt.hashSync(user.passwordPlain, 10);
      insertUser.run(
        user.id,
        user.email,
        passwordHash,
        user.nickname,
        user.avatar,
        user.role,
        user.bio,
        user.level,
        user.walletBalance
      );
    }

    // Give gamer account purchased games in library
    const insertLib = db.prepare(`
      INSERT OR IGNORE INTO library_items (id, userId, gameId, playtimeMin, isInstalled, achievements)
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

    // Seed default reviews
    const insertReview = db.prepare(`
      INSERT INTO reviews (id, userId, gameId, rating, isPositive, content)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertReview.run('rev-1', 'user-gamer', 'game-cyberpunk-2077', 5, 1, 'Шедевр после всех патчей и Phantom Liberty! Графика и сюжет на высоте.');
    insertReview.run('rev-2', 'user-admin', 'game-baldurs-gate-3', 5, 1, '10 из 10, лучшая ролевая игра десятилетия. Прошел за 150 часов.');
    insertReview.run('rev-3', 'user-gamer', 'game-rdr2', 5, 1, 'Лучший открытый мир и невероятно трогательная история Артура Моргана.');
  }
}
