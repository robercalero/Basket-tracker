const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { requireDB } = require('../middleware');

router.get('/profile', async (req, res) => {
  if (!requireDB(req, res)) return;
  try {
    const [rows] = await pool.query('SELECT * FROM profile WHERE id = 1');
    res.json(rows[0] || { id: 1, name: '', gender: 'male', height: 175, plan_idx: 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', async (req, res) => {
  if (!requireDB(req, res)) return;
  const { name, gender, dob, height, plan_idx } = req.body;
  try {
    await pool.query(
      `INSERT INTO profile (id, name, gender, dob, height, plan_idx)
       VALUES (1, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), gender=VALUES(gender),
         dob=VALUES(dob), height=VALUES(height), plan_idx=VALUES(plan_idx)`,
      [name || '', gender || 'male', dob || null, height || 175, plan_idx ?? 0]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

module.exports = router;
