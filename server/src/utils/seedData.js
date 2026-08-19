// Seed data for initial store population
export const SEED_GAMES = [
  {
    id: "game-call-of-duty-mw3",
    title: "Call of Duty: Modern Warfare III",
    slug: "call-of-duty-modern-warfare-3",
    descriptionRu: "В прямом продолжении рекордной Call of Duty: Modern Warfare II капитан Прайс и ОТГ-141 противостоят величайшей угрозе. Ультранационалистический военный преступник Владимир Макаров распространяет свою власть по всему миру, заставляя ОТГ-141 сражаться как никогда раньше.",
    descriptionEn: "In the direct sequel to the record-breaking Call of Duty: Modern Warfare II, Captain Price and Task Force 141 face off against the ultimate threat. The ultranationalist war criminal Vladimir Makarov is extending his grasp across the world causing Task Force 141 to fight like never before.",
    shortDescRu: "Легендарный шутер от первого лица с масштабной кампанией и сетевым режимом.",
    shortDescEn: "The legendary first-person shooter with intense campaign and dynamic multiplayer.",
    priceRub: 4999.0,
    priceUsd: 59.99,
    discountPercent: 20,
    isFeatured: true,
    isSpecialOffer: true,
    isNewRelease: true,
    releaseDate: "2023-11-10",
    developer: "Sledgehammer Games, Infinity Ward",
    publisher: "Activision",
    rating: 4.8,
    ratingCount: 1450,
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    headerBanner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
    screenshots: JSON.stringify([
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
    ]),
    trailerUrl: "https://www.youtube.com/embed/mHDEDDrGYvo",
    categories: JSON.stringify(["Action", "Shooter", "Competitive"]),
    tags: JSON.stringify(["Экшен", "Мультиплеер", "Шутер", "Военные"]),
    systemRequirements: JSON.stringify({
      min: { os: "Windows 10 64-bit", cpu: "Intel Core i5-6600 / AMD Ryzen 5 1400", ram: "8 GB RAM", gpu: "NVIDIA GeForce GTX 960 / GTX 1650", storage: "125 GB SSD" },
      rec: { os: "Windows 11 64-bit", cpu: "Intel Core i7-6700K / AMD Ryzen 5 1600X", ram: "16 GB RAM", gpu: "NVIDIA GeForce RTX 3060 / AMD Radeon RX 6600XT", storage: "125 GB NVMe SSD" }
    })
  },
  {
    id: "game-valorant-tactics",
    title: "Valorant: Protocol Strike",
    slug: "valorant-protocol-strike",
    descriptionRu: "Тактический шутер с видом от первого лица 5 на 5 с уникальными персонажами-агентами. Проявите мастерство меткой стрельбы и стратегическое мышление с помощью спецспособностей.",
    descriptionEn: "A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities. Blend your style and experience on a global, competitive stage.",
    shortDescRu: "Тактический соревновательный шутер с уникальными агентами.",
    shortDescEn: "Tactical competitive shooter with hero abilities and strategic gameplay.",
    priceRub: 1890.0,
    priceUsd: 24.99,
    discountPercent: 30,
    isFeatured: true,
    isSpecialOffer: false,
    isNewRelease: true,
    releaseDate: "2024-02-15",
    developer: "Riot Games",
    publisher: "Riot Games",
    rating: 4.9,
    ratingCount: 3200,
    coverImage: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    headerBanner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80",
    screenshots: JSON.stringify([
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
    ]),
    trailerUrl: "https://www.youtube.com/embed/e_E9W2VSZYU",
    categories: JSON.stringify(["Action", "Competitive", "Tactical"]),
    tags: JSON.stringify(["Тактика", "Соревновательная", "Шутер", "Киберспорт"]),
    systemRequirements: JSON.stringify({
      min: { os: "Windows 10 64-bit", cpu: "Intel Core 2 Duo E8400", ram: "4 GB RAM", gpu: "Intel HD 4000", storage: "20 GB" },
      rec: { os: "Windows 11 64-bit", cpu: "Intel i5-9400F 2.90GHz", ram: "16 GB RAM", gpu: "GTX 1050 Ti", storage: "30 GB SSD" }
    })
  },
  {
    id: "game-cyberpunk-2077",
    title: "Cyberpunk 2077: Phantom Liberty",
    slug: "cyberpunk-2077",
    descriptionRu: "Приключенческая ролевая игра с открытым миром в футуристичном мегаполисе Найт-Сити, где власть, роскошь и модификации тела ценятся превыше всего. Сыграйте за наёмника V в борьбе за выживание.",
    descriptionEn: "Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival.",
    shortDescRu: "Грандиозная RPG в мире темного киберпанк-будущего.",
    shortDescEn: "Epic open-world action RPG set in the futuristic Night City.",
    priceRub: 3500.0,
    priceUsd: 44.99,
    discountPercent: 35,
    isFeatured: true,
    isSpecialOffer: true,
    isNewRelease: false,
    releaseDate: "2023-09-26",
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    rating: 4.9,
    ratingCount: 5400,
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    headerBanner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80",
    screenshots: JSON.stringify([
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80"
    ]),
    trailerUrl: "https://www.youtube.com/embed/UnA7tepsc7s",
    categories: JSON.stringify(["RPG", "Action", "Cyberpunk"]),
    tags: JSON.stringify(["Открытый мир", "Ролевая игра", "Киберпанк", "Сюжет"]),
    systemRequirements: JSON.stringify({
      min: { os: "Windows 10 64-bit", cpu: "Core i7-6700 or Ryzen 5 1600", ram: "12 GB RAM", gpu: "GeForce GTX 1060 6GB", storage: "70 GB SSD" },
      rec: { os: "Windows 10/11 64-bit", cpu: "Core i7-12700 or Ryzen 7 7800X3D", ram: "16 GB RAM", gpu: "GeForce RTX 3070", storage: "70 GB NVMe" }
    })
  },
  {
    id: "game-baldurs-gate-3",
    title: "Baldur's Gate 3",
    slug: "baldurs-gate-3",
    descriptionRu: "Соберите отряд и вернитесь в Забытые Королевства. Вас ждет история о дружбе и предательстве, выживании и самопожертвовании, а также о сладком зове абсолютной власти.",
    descriptionEn: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
    shortDescRu: "Игра года — масштабная партийная RPG по правилам D&D.",
    shortDescEn: "Game of the Year — next-generation RPG set in the world of Dungeons & Dragons.",
    priceRub: 2999.0,
    priceUsd: 39.99,
    discountPercent: 15,
    isFeatured: true,
    isSpecialOffer: false,
    isNewRelease: false,
    releaseDate: "2023-08-03",
    developer: "Larian Studios",
    publisher: "Larian Studios",
    rating: 5.0,
    ratingCount: 8900,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    headerBanner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    screenshots: JSON.stringify([
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ]),
    trailerUrl: "https://www.youtube.com/embed/1T22wN1BIzU",
    categories: JSON.stringify(["RPG", "Strategy", "Adventure"]),
    tags: JSON.stringify(["Партийная RPG", "D&D", "Глубокий сюжет", "Магия"]),
    systemRequirements: JSON.stringify({
      min: { os: "Windows 10 64-bit", cpu: "Intel i5-4690 / AMD FX 8350", ram: "8 GB RAM", gpu: "Nvidia GTX 970 / RX 480 (4GB)", storage: "150 GB SSD" },
      rec: { os: "Windows 10/11 64-bit", cpu: "Intel i7 8700K / AMD r5 3600", ram: "16 GB RAM", gpu: "Nvidia 2060 Super / RX 5700 XT", storage: "150 GB SSD" }
    })
  },
  {
    id: "game-wasteland-3",
    title: "Wasteland 3: Colorado Apocalypse",
    slug: "wasteland-3",
    descriptionRu: "Вам предстоит взять под командование отряд Пустынных рейнджеров — законников в мире после ядерного апокалипсиса, которые пытаются восстановить общество из пепла.",
    descriptionEn: "A squad-based tactical RPG featuring challenging turn-based combat and a deep, reactive story full of twists, turns, and brutal ethical decisions.",
    shortDescRu: "Постапокалиптическая партийная тактическая ролевая игра.",
    shortDescEn: "Squad-based post-apocalyptic tactical RPG in frozen Colorado.",
    priceRub: 1499.0,
    priceUsd: 19.99,
    discountPercent: 50,
    isFeatured: false,
    isSpecialOffer: true,
    isNewRelease: false,
    releaseDate: "2020-08-28",
    developer: "inXile Entertainment",
    publisher: "Xbox Game Studios",
    rating: 4.7,
    ratingCount: 1800,
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    headerBanner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80",
    screenshots: JSON.stringify([
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80"
    ]),
    trailerUrl: "https://www.youtube.com/embed/s3yv5WvT32Q",
    categories: JSON.stringify(["RPG", "Strategy", "Tactical"]),
    tags: JSON.stringify(["Постапокалипсис", "Пошаговая тактика", "Кооператив"]),
    systemRequirements: JSON.stringify({
      min: { os: "Windows 10 64-bit", cpu: "Intel Core i5-3.3 GHz", ram: "8 GB RAM", gpu: "Nvidia GTX 760", storage: "52 GB" },
      rec: { os: "Windows 10 64-bit", cpu: "Intel Core i7-3770K", ram: "16 GB RAM", gpu: "Nvidia GTX 1060 (6GB)", storage: "52 GB SSD" }
    })
  },
  {
    id: "game-witcher-3",
    title: "The Witcher 3: Wild Hunt Next-Gen",
    slug: "the-witcher-3-wild-hunt",
    descriptionRu: "Вы — Геральт из Ривии, наемный охотник на чудовищ. Ваш мир раздирает война, и в этом хаосе вам предстоит найти Дитя Предназначения — живое оружие невероятной мощи.",
    descriptionEn: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will.",
    shortDescRu: "Шедевр ролевых игр о ведьмаке Геральте в обновленном издании.",
    shortDescEn: "Critically acclaimed open-world RPG with upgraded next-gen visuals.",
    priceRub: 1999.0,
    priceUsd: 29.99,
    discountPercent: 40,
    isFeatured: true,
    isSpecialOffer: false,
    isNewRelease: false,
    releaseDate: "2022-12-14",
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    rating: 5.0,
    ratingCount: 12400,
    coverImage: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
    headerBanner: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80",
    screenshots: JSON.stringify([
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80"
    ]),
    trailerUrl: "https://www.youtube.com/embed/53MyR_I3wpw",
    categories: JSON.stringify(["RPG", "Adventure", "Open World"]),
    tags: JSON.stringify(["Открытый мир", "Фэнтези", "Сюжет", "Магия"]),
    systemRequirements: JSON.stringify({
      min: { os: "Windows 10 64-bit", cpu: "Intel CPU Core i5-2500K 3.3GHz", ram: "8 GB RAM", gpu: "Nvidia GPU GeForce GTX 660", storage: "50 GB" },
      rec: { os: "Windows 11 64-bit", cpu: "Intel CPU Core i7 3770 3.4 GHz", ram: "16 GB RAM", gpu: "Nvidia GPU GeForce RTX 3060", storage: "50 GB SSD" }
    })
  },
  {
    id: "game-elden-ring",
    title: "ELDEN RING: Shadow of the Erdtree",
    slug: "elden-ring",
    descriptionRu: "Восстань, погасшая душа! Междуземье ждет своего владыки. Исследуйте гигантский таинственный мир, побеждайте грозных боссов и создайте свое неповторимое наследие.",
    descriptionEn: "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    shortDescRu: "Монументальный экшен-RPG от создателей Dark Souls и Джорджа Мартина.",
    shortDescEn: "Challenging open-world dark fantasy action RPG masterpiece.",
    priceRub: 3999.0,
    priceUsd: 49.99,
    discountPercent: 10,
    isFeatured: true,
    isSpecialOffer: false,
    isNewRelease: true,
    releaseDate: "2024-06-21",
    developer: "FromSoftware Inc.",
    publisher: "Bandai Namco Entertainment",
    rating: 4.9,
    ratingCount: 7600,
    coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    headerBanner: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80",
    screenshots: JSON.stringify([
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80"
    ]),
    trailerUrl: "https://www.youtube.com/embed/qLZenOn7WUo",
    categories: JSON.stringify(["Action", "RPG", "Souls-like"]),
    tags: JSON.stringify(["Сложная", "Souls-like", "Темное фэнтези", "Боссы"]),
    systemRequirements: JSON.stringify({
      min: { os: "Windows 10", cpu: "INTEL CORE I5-8400 or AMD RYZEN 3 3300X", ram: "12 GB RAM", gpu: "NVIDIA GEFORCE GTX 1060 3 GB", storage: "60 GB" },
      rec: { os: "Windows 11/10", cpu: "INTEL CORE I7-8700K or AMD RYZEN 5 3600X", ram: "16 GB RAM", gpu: "NVIDIA GEFORCE GTX 1070 8 GB", storage: "60 GB SSD" }
    })
  },
  {
    id: "game-forza-horizon-5",
    title: "Forza Horizon 5: Premium Racing",
    slug: "forza-horizon-5",
    descriptionRu: "Вас ждёт бесконечный калейдоскоп приключений Horizon! Совершайте увлекательные поездки по невероятно красивому и самобытному миру Мексики за рулем сотен лучших автомобилей мира.",
    descriptionEn: "Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of world’s greatest cars.",
    shortDescRu: "Лучший гоночный симулятор в открытом мире солнечной Мексики.",
    shortDescEn: "The ultimate open-world automotive adventure across dynamic Mexico.",
    priceRub: 2799.0,
    priceUsd: 34.99,
    discountPercent: 25,
    isFeatured: false,
    isSpecialOffer: true,
    isNewRelease: false,
    releaseDate: "2021-11-09",
    developer: "Playground Games",
    publisher: "Xbox Game Studios",
    rating: 4.8,
    ratingCount: 3100,
    coverImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    headerBanner: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    screenshots: JSON.stringify([
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ]),
    trailerUrl: "https://www.youtube.com/embed/FYH9n3Ov126",
    categories: JSON.stringify(["Racing", "Open World", "Sports"]),
    tags: JSON.stringify(["Гонки", "Автомобили", "Открытый мир", "Мультиплеер"]),
    systemRequirements: JSON.stringify({
      min: { os: "Windows 10 version 15063.0 or higher", cpu: "Intel i5-4460 or AMD Ryzen 3 1200", ram: "8 GB RAM", gpu: "NVidia GTX 970 OR AMD RX 470", storage: "110 GB" },
      rec: { os: "Windows 10/11", cpu: "Intel i7-10700K or AMD Ryzen 7 3800XT", ram: "16 GB RAM", gpu: "NVidia RTX 2070 OR AMD RX 5700 XT", storage: "110 GB SSD" }
    })
  }
];

export const SEED_USERS = [
  {
    id: "user-admin",
    email: "admin@bryansk.game",
    nickname: "BryanskAdmin",
    passwordPlain: "admin123",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    bio: "Главный администратор и архитектор площадки Bryansk_game.",
    level: 42,
    walletBalance: 25000.0
  },
  {
    id: "user-gamer",
    email: "gamer@bryansk.game",
    nickname: "Nikita_32RUS",
    passwordPlain: "gamer123",
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80",
    bio: "Люблю качественные игры, кооперативы и стильные интерфейсы!",
    level: 15,
    walletBalance: 7500.0
  },
  {
    id: "user-publisher",
    email: "publisher@bryansk.game",
    nickname: "BryanskIndieDev",
    passwordPlain: "pub123",
    role: "PUBLISHER",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    bio: "Официальный издатель инди-игр на Bryansk_game.",
    level: 28,
    walletBalance: 12000.0
  }
];
