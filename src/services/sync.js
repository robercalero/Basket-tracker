import { dbGet, dbSet } from './storage.js';
import { apiHealth, pullData, pushData } from './api.js';

let syncTimer = null;
let online = navigator.onLine;
let lastSyncKey = 'lastSync';
let _statusListeners = [];
let _syncing = false;

export function getOnlineStatus() { return online }
export function onSyncStatus(fn) { _statusListeners.push(fn); return () => { _statusListeners = _statusListeners.filter(f => f !== fn) } }

function notify(status) {
  _statusListeners.forEach(fn => fn(status));
}

export function initSync() {
  window.addEventListener('online', () => { online = true; notify('online'); doSync() });
  window.addEventListener('offline', () => { online = false; notify('offline') });
  // Sync every 5 minutes if online
  syncTimer = setInterval(() => { if (online) doSync() }, 300000);
  // Initial sync after 2 seconds
  setTimeout(() => { if (online) doSync() }, 2000);
  // Show initial status
  notify(online ? 'online' : 'offline');
}

export function destroySync() {
  if (syncTimer) { clearInterval(syncTimer); syncTimer = null }
}

export async function doSync() {
  if (_syncing) return false;
  _syncing = true;
  notify('syncing');
  try {
    const healthy = await apiHealth();
    if (!healthy) { notify('offline'); return false }

    const lastSync = await dbGet(lastSyncKey, '2000-01-01T00:00:00.000Z');
    const profile = await dbGet('profile', null);
    const log = await dbGet('log', []);
    const weightLog = await dbGet('weightLog', []);
    const planIdx = await dbGet('planIdx', 0);

    // Push local data
    const pushPayload = {
      workouts: log.map(w => ({ ...w, _synced: true })),
      weightLog,
      profile: profile ? { ...profile, plan_idx: planIdx } : null,
      lastSync,
    };
    await pushData(pushPayload);

    // Mark local entries as synced
    if (log.length > 0) {
      const syncedLog = log.map(w => ({ ...w, _synced: true }));
      await dbSet('log', syncedLog);
    }

    // Pull remote data
    const remote = await pullData(lastSync);
    if (remote.workouts && remote.workouts.length > 0) {
      await mergeWorkouts(remote.workouts);
    }
    if (remote.profile && !profile) {
      await dbSet('profile', {
        name: remote.profile.name || '',
        gender: remote.profile.gender || 'male',
        dob: remote.profile.dob || '',
        height: remote.profile.height || 175,
      });
      if (remote.profile.plan_idx !== undefined) {
        await dbSet('planIdx', remote.profile.plan_idx);
      }
    }
    if (remote.weightLog && remote.weightLog.length > 0) {
      await mergeWeightLog(remote.weightLog);
    }

    await dbSet(lastSyncKey, remote.syncedAt || new Date().toISOString());
    notify('online');
    _syncing = false;
    return true;
  } catch {
    notify('offline');
    _syncing = false;
    return false;
  }
}

async function mergeWorkouts(remoteWorkouts) {
  const local = await dbGet('log', []);
  for (const rw of remoteWorkouts) {
    const idx = local.findIndex(l => l.d === rw.d);
    if (idx === -1) {
      local.push({ ...rw, _synced: true });
    } else {
      // Merge exercises: combine unique exercises from both sides
      const localExNames = (local[idx].ex || []).map(e => e.n);
      const remoteExs = (rw.ex || []).filter(e => !localExNames.includes(e.n));
      if (remoteExs.length > 0) {
        local[idx].ex = [...(local[idx].ex || []), ...remoteExs];
        local[idx]._synced = true;
      }
    }
  }
  await dbSet('log', local);
}

async function mergeWeightLog(remoteWeights) {
  const local = await dbGet('weightLog', []);
  for (const rw of remoteWeights) {
    const match = local.find(l => l.d === rw.d);
    if (!match) {
      local.push({ d: rw.d, w: rw.w });
    } else if (!match._synced) {
      // Keep the higher weight (likely more recent intent)
      match.w = Math.max(match.w, rw.w);
    }
  }
  local.sort((a, b) => a.d.localeCompare(b.d));
  await dbSet('weightLog', local);
}
