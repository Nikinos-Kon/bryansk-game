import { db } from '../db.js';
import crypto from 'crypto';

export function getGames(req, res) {
  try {
    const { category, search, minPrice, maxPrice, sort, isFeatured, isSpecialOffer, isNewRelease } = req.query;
    const userId = req.user ? req.user.id : null;

    let query = 'SELECT * FROM games WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR descriptionRu LIKE ? OR descriptionEn LIKE ? OR tags LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (category && category !== 'All' && category !== 'Все') {
      query += ' AND categories LIKE ?';
      params.push(`%"${category}"%`);
    }

    if (minPrice) {
      query += ' AND priceRub >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ' AND priceRub <= ?';
      params.push(Number(maxPrice));
    }

    if (isFeatured === 'true') {
      query += ' AND isFeatured = 1';
    }

    if (isSpecialOffer === 'true') {
      query += ' AND isSpecialOffer = 1';
    }

    if (isNewRelease === 'true') {
      query += ' AND isNewRelease = 1';
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY priceRub ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY priceRub DESC';
        break;
      case 'rating':
        query += ' ORDER BY rating DESC';
        break;
      case 'discount':
        query += ' ORDER BY discountPercent DESC';
        break;
      case 'newest':
        query += ' ORDER BY releaseDate DESC';
        break;
      default:
        query += ' ORDER BY ratingCount DESC, rating DESC';
        break;
    }

    const rawGames = db.prepare(query).all(...params);

    // Get user's owned games and wishlist items for easy badge display
    let ownedGameIds = new Set();
    let wishlistedGameIds = new Set();

    if (userId) {
      const owned = db.prepare('SELECT gameId FROM library_items WHERE userId = ?').all(userId);
      owned.forEach(o => ownedGameIds.add(o.gameId));

      const wish = db.prepare('SELECT gameId FROM wishlist_items WHERE userId = ?').all(userId);
      wish.forEach(w => wishlistedGameIds.add(w.gameId));
    }

    const games = rawGames.map(game => ({
      ...game,
      isFeatured: Boolean(game.isFeatured),
      isSpecialOffer: Boolean(game.isSpecialOffer),
      isNewRelease: Boolean(game.isNewRelease),
      screenshots: JSON.parse(game.screenshots || '[]'),
      categories: JSON.parse(game.categories || '[]'),
      tags: JSON.parse(game.tags || '[]'),
      systemRequirements: JSON.parse(game.systemRequirements || '{}'),
      isOwned: ownedGameIds.has(game.id),
      isWishlisted: wishlistedGameIds.has(game.id)
    }));

    return res.json({ games, count: games.length });
  } catch (error) {
    console.error('getGames error:', error);
    return res.status(500).json({ error: 'Ошибка при загрузке каталога игр' });
  }
}

export function getGameById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const game = db.prepare('SELECT * FROM games WHERE id = ? OR slug = ?').get(id, id);
    if (!game) {
      return res.status(404).json({ error: 'Игра не найдена' });
    }

    let isOwned = false;
    let isWishlisted = false;
    let playtimeMin = 0;

    if (userId) {
      const lib = db.prepare('SELECT playtimeMin FROM library_items WHERE userId = ? AND gameId = ?').get(userId, game.id);
      if (lib) {
        isOwned = true;
        playtimeMin = lib.playtimeMin;
      }
      const wish = db.prepare('SELECT id FROM wishlist_items WHERE userId = ? AND gameId = ?').get(userId, game.id);
      if (wish) {
        isWishlisted = true;
      }
    }

    // Get reviews
    const reviews = db.prepare(`
      SELECT r.id, r.rating, r.isPositive, r.content, r.createdAt, u.nickname, u.avatar, u.id as userId
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE r.gameId = ?
      ORDER BY r.createdAt DESC
    `).all(game.id);

    const parsedGame = {
      ...game,
      isFeatured: Boolean(game.isFeatured),
      isSpecialOffer: Boolean(game.isSpecialOffer),
      isNewRelease: Boolean(game.isNewRelease),
      screenshots: JSON.parse(game.screenshots || '[]'),
      categories: JSON.parse(game.categories || '[]'),
      tags: JSON.parse(game.tags || '[]'),
      systemRequirements: JSON.parse(game.systemRequirements || '{}'),
      isOwned,
      isWishlisted,
      playtimeMin,
      reviews
    };

    return res.json({ game: parsedGame });
  } catch (error) {
    console.error('getGameById error:', error);
    return res.status(500).json({ error: 'Ошибка получения деталей игры' });
  }
}

export function createGame(req, res) {
  try {
    const {
      title, descriptionRu, descriptionEn, shortDescRu, shortDescEn,
      priceRub, priceUsd, discountPercent, isFeatured, isSpecialOffer, isNewRelease,
      releaseDate, developer, publisher, coverImage, headerBanner, screenshots,
      trailerUrl, categories, tags, systemRequirements
    } = req.body;

    if (!title || !descriptionRu || priceRub === undefined) {
      return res.status(400).json({ error: 'Заполните обязательные поля игры (название, описание, цена)' });
    }

    const id = 'game-' + crypto.randomUUID();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    db.prepare(`
      INSERT INTO games (
        id, title, slug, descriptionRu, descriptionEn, shortDescRu, shortDescEn,
        priceRub, priceUsd, discountPercent, isFeatured, isSpecialOffer, isNewRelease,
        releaseDate, developer, publisher, rating, ratingCount, coverImage, headerBanner,
        screenshots, trailerUrl, categories, tags, systemRequirements
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 1, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, title, slug, descriptionRu, descriptionEn || descriptionRu, shortDescRu || '', shortDescEn || '',
      Number(priceRub), Number(priceUsd || (priceRub * 0.0125).toFixed(2)), Number(discountPercent || 0),
      isFeatured ? 1 : 0, isSpecialOffer ? 1 : 0, isNewRelease ? 1 : 0,
      releaseDate || new Date().toISOString().slice(0, 10), developer || 'Indie Dev', publisher || 'Bryansk Publishing',
      coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      headerBanner || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
      JSON.stringify(screenshots || []), trailerUrl || '', JSON.stringify(categories || ['Action']),
      JSON.stringify(tags || ['Новинка']), JSON.stringify(systemRequirements || {})
    );

    const newGame = db.prepare('SELECT * FROM games WHERE id = ?').get(id);

    return res.status(201).json({
      message: 'Игра успешно добавлена в каталог',
      game: newGame
    });
  } catch (error) {
    console.error('createGame error:', error);
    return res.status(500).json({ error: 'Ошибка при создании игры' });
  }
}

export function updateGame(req, res) {
  try {
    const { id } = req.params;
    const {
      title, descriptionRu, descriptionEn, priceRub, priceUsd, discountPercent,
      isFeatured, isSpecialOffer, isNewRelease, coverImage, headerBanner, categories, tags
    } = req.body;

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(id);
    if (!game) {
      return res.status(404).json({ error: 'Игра не найдена' });
    }

    db.prepare(`
      UPDATE games SET
        title = COALESCE(?, title),
        descriptionRu = COALESCE(?, descriptionRu),
        descriptionEn = COALESCE(?, descriptionEn),
        priceRub = COALESCE(?, priceRub),
        priceUsd = COALESCE(?, priceUsd),
        discountPercent = COALESCE(?, discountPercent),
        isFeatured = COALESCE(?, isFeatured),
        isSpecialOffer = COALESCE(?, isSpecialOffer),
        isNewRelease = COALESCE(?, isNewRelease),
        coverImage = COALESCE(?, coverImage),
        headerBanner = COALESCE(?, headerBanner),
        categories = COALESCE(?, categories),
        tags = COALESCE(?, tags),
        updatedAt = datetime('now')
      WHERE id = ?
    `).run(
      title, descriptionRu, descriptionEn, priceRub, priceUsd, discountPercent,
      isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
      isSpecialOffer !== undefined ? (isSpecialOffer ? 1 : 0) : null,
      isNewRelease !== undefined ? (isNewRelease ? 1 : 0) : null,
      coverImage, headerBanner,
      categories ? JSON.stringify(categories) : null,
      tags ? JSON.stringify(tags) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM games WHERE id = ?').get(id);
    return res.json({ message: 'Игра успешно обновлена', game: updated });
  } catch (error) {
    console.error('updateGame error:', error);
    return res.status(500).json({ error: 'Ошибка обновления данных игры' });
  }
}

export function deleteGame(req, res) {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM games WHERE id = ?').run(id);
    return res.json({ message: 'Игра успешно удалена из каталога' });
  } catch (error) {
    console.error('deleteGame error:', error);
    return res.status(500).json({ error: 'Ошибка удаления игры' });
  }
}
