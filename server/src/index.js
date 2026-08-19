import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { initDatabase } from './db.js';
import apiRouter from './routes/api.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize SQLite database and seed data
try {
  initDatabase();
  console.log('📦 SQLite database initialized successfully.');
} catch (err) {
  console.error('Failed to initialize database:', err);
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Bryansk_game API', timestamp: new Date().toISOString() });
});

// Mount main API
app.use('/api', apiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера', details: err.message });
});

app.listen(config.port, () => {
  console.log(`🎮 Bryansk_game Server running on http://localhost:${config.port}`);
});
