import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'bryansk_game_super_secret_jwt_key_2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  rubToUsdRate: 0.0125 // 1 RUB = 0.0125 USD (approx 80 RUB = 1 USD)
};
