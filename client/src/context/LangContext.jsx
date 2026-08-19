import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  ru: {
    // Navigation
    store: 'Магазин',
    library: 'Библиотека',
    wishlist: 'Желаемое',
    friends: 'Друзья',
    wallet: 'Кошелёк',
    settings: 'Настройки',
    admin: 'Админ-панель',
    searchPlaceholder: 'Поиск по играм, жанрам, тегам...',
    allCategories: 'Все игры',
    cart: 'Корзина',
    login: 'Войти',
    register: 'Регистрация',
    logout: 'Выйти',
    profile: 'Мой профиль',
    notifications: 'Уведомления',
    
    // Store & Hero
    heroBadge: 'ХИТ ПРОДАЖ',
    specialOffer: 'Специальное предложение',
    specialOffers: 'Специальные предложения',
    newReleases: 'Новинки',
    popularNow: 'Популярно прямо сейчас',
    viewAll: 'Смотреть все',
    buyNow: 'Купить сейчас',
    addToCart: 'В корзину',
    inCart: 'В корзине',
    inLibrary: 'В библиотеке',
    discount: 'Скидка',
    free: 'Бесплатно',
    trailer: 'Смотреть трейлер',
    reviewsCount: 'отзывов',
    rating: 'Оценка',
    
    // Filters & Sorting
    categories: 'Категории',
    filterByPrice: 'Цена',
    sortBy: 'Сортировка',
    sortPopular: 'По популярности',
    sortPriceAsc: 'Сначала дешевле',
    sortPriceDesc: 'Сначала дороже',
    sortRating: 'По рейтингу',
    sortNewest: 'Сначала новые',
    sortDiscount: 'По размеру скидки',
    clearFilters: 'Сбросить фильтры',
    
    // Game Modal / Details
    releaseDate: 'Дата выхода',
    developer: 'Разработчик',
    publisher: 'Издатель',
    systemRequirements: 'Системные требования',
    minimum: 'Минимальные',
    recommended: 'Рекомендуемые',
    os: 'ОС',
    processor: 'Процессор',
    memory: 'Память',
    graphics: 'Видеокарта',
    storage: 'Место на диске',
    userReviews: 'Отзывы игроков',
    writeReview: 'Написать отзыв',
    sendReview: 'Опубликовать отзыв',
    positive: 'Рекомендую',
    negative: 'Не рекомендую',
    reviewPlaceholder: 'Поделитесь впечатлениями об игре...',
    
    // Cart & Checkout
    cartTitle: 'Ваша корзина',
    emptyCart: 'Корзина пуста',
    cartTotal: 'Итого к оплате',
    originalPrice: 'Сумма без скидки',
    totalDiscount: 'Скидка',
    proceedCheckout: 'Перейти к оплате',
    checkoutTitle: 'Оформление заказа',
    selectPaymentMethod: 'Выберите способ оплаты',
    sbpDesc: 'Оплата через Систему быстрых платежей РФ по QR-коду',
    visaMastercard: 'Банковская карта Visa / Mastercard / МИР',
    usdtDesc: 'Криптовалюта Tether USDT (TRC-20 / ERC-20)',
    walletPayment: 'Оплата с баланса кошелька',
    scanQrToPay: 'Отсканируйте QR-код в приложении вашего банка',
    cryptoAddress: 'Адрес для перевода USDT (TRC-20)',
    copyAddress: 'Скопировать адрес',
    copied: 'Скопировано!',
    completePayment: 'Подтвердить оплату',
    paymentSuccess: 'Оплата прошла успешно!',
    
    // Library
    libraryTitle: 'Моя библиотека игр',
    ownedGames: 'Куплено игр',
    totalPlaytime: 'Всего наиграно',
    hours: 'ч.',
    minutes: 'мин.',
    playGame: 'Играть',
    installGame: 'Установить',
    installed: 'Установлено',
    readyToPlay: 'Готово к запуску',
    gameRunning: 'Игра запущена...',
    achievements: 'Достижения',
    unlocked: 'Разблокировано',
    
    // Profile
    steamLevel: 'Уровень Steam',
    badges: 'Значки профиля',
    recentActivity: 'Недавняя активность',
    showcase: 'Витрина игр',
    editProfile: 'Редактировать профиль',
    bio: 'О себе',
    saveChanges: 'Сохранить',
    
    // Wallet
    walletTitle: 'Кошелёк Bryansk_game',
    currentBalance: 'Текущий баланс',
    topUp: 'Пополнить баланс',
    switchCurrency: 'Валюта отображения',
    history: 'История транзакций',
    noTransactions: 'Транзакций пока нет',
    selectAmount: 'Выберите сумму пополнения',
    customAmount: 'Другая сумма',
    
    // Settings
    settingsTitle: 'Настройки платформы',
    themeSelection: 'Тема оформления',
    themeDark: 'Тёмная (Dark Obsidian)',
    themeLight: 'Светлая (Clean White)',
    themeRed: 'Красная (Crimson Gaming)',
    themePurple: 'Фиолетовая (Cyberpunk Neon)',
    languageSelection: 'Язык интерфейса',
    saveSettings: 'Применить настройки',
    
    // Friends
    friendsTitle: 'Список друзей',
    online: 'В сети',
    inGame: 'В игре',
    offline: 'Не в сети',
    addFriend: 'Добавить друга',
    enterNickname: 'Введите никнейм пользователя',
    chat: 'Написать сообщение',
    sendMessage: 'Отправить'
  },
  en: {
    // Navigation
    store: 'Store',
    library: 'Library',
    wishlist: 'Wishlist',
    friends: 'Friends',
    wallet: 'Wallet',
    settings: 'Settings',
    admin: 'Admin Panel',
    searchPlaceholder: 'Search games, genres, tags...',
    allCategories: 'All Games',
    cart: 'Cart',
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Sign Out',
    profile: 'My Profile',
    notifications: 'Notifications',
    
    // Store & Hero
    heroBadge: 'TOP SELLER',
    specialOffer: 'Special Offer',
    specialOffers: 'Special Offers',
    newReleases: 'New Releases',
    popularNow: 'Popular Right Now',
    viewAll: 'View All',
    buyNow: 'Buy Now',
    addToCart: 'Add to Cart',
    inCart: 'In Cart',
    inLibrary: 'In Library',
    discount: 'Discount',
    free: 'Free',
    trailer: 'Watch Trailer',
    reviewsCount: 'reviews',
    rating: 'Rating',
    
    // Filters & Sorting
    categories: 'Categories',
    filterByPrice: 'Price',
    sortBy: 'Sort By',
    sortPopular: 'Most Popular',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortRating: 'Top Rated',
    sortNewest: 'Newest Releases',
    sortDiscount: 'Highest Discount',
    clearFilters: 'Reset Filters',
    
    // Game Modal / Details
    releaseDate: 'Release Date',
    developer: 'Developer',
    publisher: 'Publisher',
    systemRequirements: 'System Requirements',
    minimum: 'Minimum',
    recommended: 'Recommended',
    os: 'OS',
    processor: 'Processor',
    memory: 'Memory',
    graphics: 'Graphics',
    storage: 'Storage',
    userReviews: 'Player Reviews',
    writeReview: 'Write a Review',
    sendReview: 'Submit Review',
    positive: 'Recommended',
    negative: 'Not Recommended',
    reviewPlaceholder: 'Share your thoughts about this game...',
    
    // Cart & Checkout
    cartTitle: 'Your Shopping Cart',
    emptyCart: 'Your cart is empty',
    cartTotal: 'Total Price',
    originalPrice: 'Base Price',
    totalDiscount: 'Discount',
    proceedCheckout: 'Proceed to Checkout',
    checkoutTitle: 'Checkout & Payment',
    selectPaymentMethod: 'Select Payment Method',
    sbpDesc: 'Pay via Fast Payment System (SBP) with QR Code',
    visaMastercard: 'Debit/Credit Card Visa / Mastercard / MIR',
    usdtDesc: 'Crypto Tether USDT (TRC-20 / ERC-20)',
    walletPayment: 'Pay with Store Wallet Balance',
    scanQrToPay: 'Scan QR code in your mobile banking app',
    cryptoAddress: 'USDT Deposit Address (TRC-20)',
    copyAddress: 'Copy Address',
    copied: 'Copied!',
    completePayment: 'Complete Payment',
    paymentSuccess: 'Payment Successful!',
    
    // Library
    libraryTitle: 'My Game Library',
    ownedGames: 'Games Owned',
    totalPlaytime: 'Total Playtime',
    hours: 'hrs',
    minutes: 'mins',
    playGame: 'Play',
    installGame: 'Install',
    installed: 'Installed',
    readyToPlay: 'Ready to Play',
    gameRunning: 'Game is running...',
    achievements: 'Achievements',
    unlocked: 'Unlocked',
    
    // Profile
    steamLevel: 'Steam Level',
    badges: 'Profile Badges',
    recentActivity: 'Recent Activity',
    showcase: 'Game Showcase',
    editProfile: 'Edit Profile',
    bio: 'About Me',
    saveChanges: 'Save Changes',
    
    // Wallet
    walletTitle: 'Bryansk_game Wallet',
    currentBalance: 'Current Balance',
    topUp: 'Add Funds',
    switchCurrency: 'Display Currency',
    history: 'Transaction History',
    noTransactions: 'No transactions yet',
    selectAmount: 'Select Amount to Top Up',
    customAmount: 'Custom Amount',
    
    // Settings
    settingsTitle: 'Platform Settings',
    themeSelection: 'Color Theme',
    themeDark: 'Dark (Dark Obsidian)',
    themeLight: 'Light (Clean White)',
    themeRed: 'Red (Crimson Gaming)',
    themePurple: 'Purple (Cyberpunk Neon)',
    languageSelection: 'Interface Language',
    saveSettings: 'Apply Settings',
    
    // Friends
    friendsTitle: 'Friends List',
    online: 'Online',
    inGame: 'In-Game',
    offline: 'Offline',
    addFriend: 'Add Friend',
    enterNickname: 'Enter username',
    chat: 'Send Message',
    sendMessage: 'Send'
  }
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('bryansk_lang') || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('bryansk_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['ru']?.[key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
