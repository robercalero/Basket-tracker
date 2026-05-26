const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { requireDB } = require('../middleware');

// POST /api/sync - Receive local changes and merge
router.post('/sync', requireDB, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const { workouts, profile, weightLog, lastSync } = req.body;

    if (profile) {
      await conn.query(
        'INSERT INTO profile (id, name, gender, dob, height, plan_idx) VALUES (1, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), gender=VALUES(gender), dob=VALUES(dob), height=VALUES(height), plan_idx=VALUES(plan_idx)',
        [profile.name || '', profile.gender || 'male', profile.dob || null, profile.height || 175, profile.plan_idx ?? 0]
      );
    }

    if (workouts && Array.isArray(workouts)) {
      for (const w of workouts) {
        if (!w.d) continue;
        const [existing] = await conn.query('SELECT id FROM workouts WHERE date = ?', [w.d]);
        let workoutId;
        if (existing.length > 0) {
          workoutId = existing[0].id;
          await conn.query('UPDATE workouts SET plan_idx = ?, duration_secs = ?, exercises_completed = ? WHERE id = ?',
            [w.planIdx ?? 0, w.dur || 0, w.done || 0, workoutId]);
          await conn.query('DELETE FROM exercise_logs WHERE workout_id = ?', [workoutId]);
        } else {
          const r = await conn.query('INSERT INTO workouts (date, plan_idx, duration_secs, exercises_completed) VALUES (?, ?, ?, ?)',
            [w.d, w.planIdx ?? 0, w.dur || 0, w.done || 0]);
          workoutId = r[0].insertId;
        }
        if (w.ex && Array.isArray(w.ex)) {
          for (const ex of w.ex) {
            const r = await conn.query('INSERT INTO exercise_logs (workout_id, exercise_name, sets_completed, max_weight) VALUES (?, ?, ?, ?)',
              [workoutId, ex.n || '', ex.s || 0, ex.maxW ?? 0]);
            const exLogId = r[0].insertId;
            if (ex.sets && Array.isArray(ex.sets)) {
              for (let i = 0; i < ex.sets.length; i++) {
                const s = ex.sets[i];
                await conn.query('INSERT INTO exercise_sets (exercise_log_id, set_index, weight, reps, rir, is_warmup, logged_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                  [exLogId, i, s.w || 0, String(s.r ?? ''), s.rir ?? 0, s.wu ? 1 : 0, s.t ?? Date.now()]);
              }
            }
          }
        }
      }
    }

    if (weightLog && Array.isArray(weightLog)) {
      for (const w of weightLog) {
        if (!w.d || w.w == null) continue;
        await conn.query('INSERT INTO weight_log (date, weight) VALUES (?, ?) ON DUPLICATE KEY UPDATE weight = VALUES(weight)',
          [w.d, w.w]);
      }
    }

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    if (conn) {
      try { await conn.rollback(); } catch (rollbackErr) {
        console.error('Rollback failed:', rollbackErr.message);
      }
    }
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  } finally {
    if (conn) conn.release();
  }
});

// GET /api/sync?since=ISO_DATE - Pull all data changed since timestamp
router.get('/sync', requireDB, async (req, res) => {
  const since = req.query.since || '2000-01-01';
  try {
    const [profileRows] = await pool.query('SELECT * FROM profile WHERE id = 1');
    const [weightRows] = await pool.query('SELECT date AS d, weight AS w FROM weight_log WHERE updated_at >= ? ORDER BY date ASC', [since]);
    const [workoutRows] = await pool.query(
      `SELECT w.date AS d, w.plan_idx AS p, w.duration_secs AS dur, w.exercises_completed AS done,
              e.id AS eid, e.exercise_name AS en, e.sets_completed AS es, e.max_weight AS ew,
              s.set_index AS si, s.weight AS sw, s.reps AS sr, s.rir AS sri, s.is_warmup AS swu, s.logged_at AS sl
       FROM workouts w
       LEFT JOIN exercise_logs e ON e.workout_id = w.id
       LEFT JOIN exercise_sets s ON s.exercise_log_id = e.id
       WHERE w.updated_at >= ? OR w.created_at >= ?
       ORDER BY w.date ASC, e.id ASC, s.set_index ASC`,
      [since, since]
    );

    // Reconstruct workout objects from flat rows
    const workoutMap = new Map();
    for (const row of workoutRows) {
      if (!row.d) continue;
      if (!workoutMap.has(row.d)) {
        workoutMap.set(row.d, { d: row.d, p: row.p, dur: row.dur, done: row.done, ex: [] });
      }
      const w = workoutMap.get(row.d);
      if (row.en) {
        let exLog = w.ex.find(e => e.n === row.en);
        if (!exLog) {
          exLog = { n: row.en, s: row.es || 0, w: row.ew || 0, sets: [] };
          w.ex.push(exLog);
        }
        if (row.si !== null) {
          exLog.sets.push({ idx: row.si, w: row.sw, r: row.sr, ri: row.sri, wu: !!row.swu, time: row.sl });
        }
      }
    }

    res.json({
      profile: profileRows[0] || null,
      weightLog: weightRows,
      workouts: Array.from(workoutMap.values()),
      syncedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Pull error:', err);
    res.status(500).json({ error: 'Pull failed' });
  }
});

module.exports = router;
