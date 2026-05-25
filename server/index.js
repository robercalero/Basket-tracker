const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { pool, initDB } = require('./config/db');
const syncRoutes = require('./routes/sync');
const profileRoutes = require('./routes/profile');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3001;
let dbReady = false;

app.use(express.json({ limit: '5mb' }));

// CORS for dev mode (Vite on different port)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const allowed = ['http://localhost:5173', 'http://127.0.0.1:5173'];
    if (allowed.includes(req.headers.origin)) res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });
}

// Make dbReady available to routes
app.use((req, res, next) => {
  req.dbReady = dbReady;
  req.pool = pool;
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: dbReady ? 'ok' : 'degraded',
    db: dbReady ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', syncRoutes);
app.use('/api', profileRoutes);
app.use('/api', aiRoutes);

// In production, serve the built frontend
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

async function start() {
  try {
    await initDB();
    dbReady = true;
    console.log('Database connected');
  } catch (err) {
    console.warn('WARNING: Database not available. API will return errors.');
    console.warn('  Fix: Configure .env with MySQL/TiDB Cloud credentials or run the server later.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!dbReady) console.log('  Health: http://localhost:' + PORT + '/api/health');
  });
}

start();
