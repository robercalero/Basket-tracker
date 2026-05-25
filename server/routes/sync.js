const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { requireDB } = require('../middleware');

// POST /api/sync - Receive local changes and merge
router.post('/sync', async (req, res) => {
  if (!requireDB(req, res)) return;
  const { workouts, profile, weightLog, lastSync } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Upsert profile
    if (profile) {
      await conn.query(
        `INSERT INTO profile (id, name, gender, dob, height, plan_idx)
         VALUES (1, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), gender=VALUES(gender),
           dob=VALUES(dob), height=VALUES(height), plan_idx=VALUES(plan_idx)`,
        [profile.name || '', profile.gender || 'male', profile.dob || null, profile.height || 175, profile.plan_idx ?? 0]
      );
    }

    // Upsert weight log entries
    if (weightLog && weightLog.length > 0) {
      for (const w of weightLog) {
        await conn.query(
          `INSERT INTO weight_log (date, weight) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE weight=VALUES(weight)`,
          [w.d, w.w]
        );
      }
    }

    // Upsert workouts + exercise logs + sets
    if (workouts && workouts.length > 0) {
      for (const w of workouts) {
        await conn.query(
          `INSERT INTO workouts (date, plan_idx, duration_secs, exercises_completed)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE plan_idx=VALUES(plan_idx),
             duration_secs=VALUES(duration_secs),
             exercises_completed=VALUES(exercises_completed)`,
          [w.d, w.p ?? 0, w.dur ?? 0, w.done ?? 0]
        );
        const [[{ id: workoutId }]] = await conn.query('SELECT id FROM workouts WHERE date = ?', [w.d]);

        if (w.ex && w.ex.length > 0) {
          await conn.query('DELETE FROM exercise_logs WHERE workout_id = ?', [workoutId]);
          for (const ex of w.ex) {
            const [exResult] = await conn.query(
              `INSERT INTO exercise_logs (workout_id, exercise_name, sets_completed, max_weight)
               VALUES (?, ?, ?, ?)`,
              [workoutId, ex.n, ex.s || 0, ex.w || 0]
            );
            const exLogId = exResult.insertId;

            if (ex.sets && ex.sets.length > 0) {
              const setValues = ex.sets.map(s => [
                exLogId, s.idx ?? 0, s.w || 0, s.r || '', s.ri || 0, s.wu ? 1 : 0, s.time || 0
              ]);
              await conn.query(
                `INSERT INTO exercise_sets (exercise_log_id, set_index, weight, reps, rir, is_warmup, logged_at)
                 VALUES ?`,
                [setValues]
              );
            }
          }
        }
      }
    }

    await conn.commit();
    res.json({ success: true, syncedAt: new Date().toISOString() });
  } catch (err) {
    await conn.rollback();
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  } finally {
    conn.release();
  }
});

// GET /api/sync?since=ISO_DATE - Pull all data changed since timestamp
router.get('/sync', async (req, res) => {
  if (!requireDB(req, res)) return;
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
