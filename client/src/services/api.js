const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('bryansk_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Произошла ошибка при запросе');
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  updatePreferences: (body) => request('/auth/preferences', { method: 'PUT', body: JSON.stringify(body) }),

  // Games
  getGames: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/games${query ? `?${query}` : ''}`);
  },
  getGameById: (id) => request(`/games/${id}`),
  createGame: (body) => request('/games', { method: 'POST', body: JSON.stringify(body) }),
  updateGame: (id, body) => request(`/games/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteGame: (id) => request(`/games/${id}`, { method: 'DELETE' }),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (gameId) => request('/cart/add', { method: 'POST', body: JSON.stringify({ gameId }) }),
  removeFromCart: (gameId) => request(`/cart/item/${gameId}`, { method: 'DELETE' }),
  clearCart: () => request('/cart/clear', { method: 'DELETE' }),

  // Orders / Checkout
  checkout: (body) => request('/orders/checkout', { method: 'POST', body: JSON.stringify(body) }),

  // Library
  getLibrary: () => request('/library'),
  toggleInstall: (gameId) => request(`/library/${gameId}/install`, { method: 'POST' }),
  playSession: (gameId, addedMinutes) => request(`/library/${gameId}/play`, { method: 'POST', body: JSON.stringify({ addedMinutes }) }),

  // Wishlist
  getWishlist: () => request('/wishlist'),
  toggleWishlist: (gameId) => request('/wishlist/toggle', { method: 'POST', body: JSON.stringify({ gameId }) }),

  // Reviews
  addReview: (body) => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),

  // Wallet
  getWallet: () => request('/wallet'),
  topUpWallet: (body) => request('/wallet/topup', { method: 'POST', body: JSON.stringify(body) }),
  switchCurrency: (currency) => request('/wallet/currency', { method: 'POST', body: JSON.stringify({ currency }) }),

  // Profile
  getProfile: (userId) => request(`/profile/${userId}`),

  // Friends
  getFriends: () => request('/friends'),
  addFriend: (targetUserId) => request('/friends/add', { method: 'POST', body: JSON.stringify({ targetUserId }) }),
  removeFriend: (friendId) => request(`/friends/${friendId}`, { method: 'DELETE' })
};
