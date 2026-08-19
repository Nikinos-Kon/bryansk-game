import express from 'express';
import { authenticateToken, optionalAuthenticateToken, requireRole } from '../middlewares/authMiddleware.js';

// Controllers
import * as authController from '../controllers/authController.js';
import * as gamesController from '../controllers/gamesController.js';
import * as cartController from '../controllers/cartController.js';
import * as ordersController from '../controllers/ordersController.js';
import * as libraryController from '../controllers/libraryController.js';
import * as profileController from '../controllers/profileController.js';
import * as friendsController from '../controllers/friendsController.js';
import * as reviewsController from '../controllers/reviewsController.js';
import * as walletController from '../controllers/walletController.js';
import * as devController from '../controllers/devController.js';

const router = express.Router();

// --- AUTH & USER PREFERENCES ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getMe);
router.put('/auth/preferences', authenticateToken, authController.updatePreferences);

// --- GAMES CATALOG ---
router.get('/games', optionalAuthenticateToken, gamesController.getGames);
router.get('/games/:id', optionalAuthenticateToken, gamesController.getGameById);
router.post('/games', authenticateToken, requireRole('PUBLISHER'), gamesController.createGame);
router.put('/games/:id', authenticateToken, requireRole('PUBLISHER'), gamesController.updateGame);
router.delete('/games/:id', authenticateToken, requireRole('PUBLISHER', 'ADMIN'), gamesController.deleteGame);

// --- CART ---
router.get('/cart', authenticateToken, cartController.getCart);
router.post('/cart/add', authenticateToken, cartController.addToCart);
router.delete('/cart/item/:gameId', authenticateToken, cartController.removeFromCart);
router.delete('/cart/clear', authenticateToken, cartController.clearCart);

// --- CHECKOUT & PAYMENTS ---
router.post('/orders/checkout', authenticateToken, ordersController.checkout);

// --- LIBRARY ---
router.get('/library', authenticateToken, libraryController.getLibrary);
router.post('/library/:gameId/install', authenticateToken, libraryController.toggleInstall);
router.post('/library/:gameId/play', authenticateToken, libraryController.playSession);

// --- WISHLIST ---
router.get('/wishlist', authenticateToken, reviewsController.getWishlist);
router.post('/wishlist/toggle', authenticateToken, reviewsController.toggleWishlist);

// --- REVIEWS ---
router.post('/reviews', authenticateToken, reviewsController.addReview);

// --- WALLET & CURRENCY ---
router.get('/wallet', authenticateToken, walletController.getWallet);
router.post('/wallet/topup', authenticateToken, walletController.topUpWallet);
router.post('/wallet/currency', authenticateToken, walletController.switchCurrency);

// --- PROFILES ---
router.get('/profile/:userId', optionalAuthenticateToken, profileController.getProfile);

// --- FRIENDS ---
router.get('/friends', authenticateToken, friendsController.getFriends);
router.post('/friends/add', authenticateToken, friendsController.addFriend);
router.delete('/friends/:friendId', authenticateToken, friendsController.removeFriend);

// --- DEV & LAYOUT RESET ---
router.post('/dev/reset', devController.resetLayout);

export default router;
