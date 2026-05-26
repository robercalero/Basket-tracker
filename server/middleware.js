function requireDB(req, res, next) {
  if (!req.dbReady) {
    return res.status(503).json({ error: 'Database not available', status: 'degraded' });
  }
  next();
}

module.exports = { requireDB };
