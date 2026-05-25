const BASE = '/api';

export async function apiHealth() {
  try {
    const r = await fetch(`${BASE}/health`);
    return r.ok;
  } catch { return false }
}

export async function pullData(since) {
  const r = await fetch(`${BASE}/sync?since=${encodeURIComponent(since)}`);
  if (!r.ok) throw new Error('Pull failed');
  return r.json();
}

export async function pushData(data) {
  const r = await fetch(`${BASE}/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error('Push failed');
  return r.json();
}

export async function saveProfile(profile) {
  const r = await fetch(`${BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  return r.ok;
}
