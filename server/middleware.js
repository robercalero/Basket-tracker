function requireDB(req, res) {
  if (!req.dbReady) {
    res.status(503).json({ error: 'Database not available', status: 'degraded' });
    return false;
  }
  return true;
}

module.exports = { requireDB };
