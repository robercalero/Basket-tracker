import { idbKeyVal } from '../utils/idb-keyval.js';

const useLS = !('indexedDB' in window) || location.protocol === 'http:';

function ls() {
  try { return localStorage.getItem('bbt') || '{}' } catch { return '{}' }
}
function lss(s) {
  try { localStorage.setItem('bbt', s) } catch { }
}

function lsParse() {
  try { return JSON.parse(ls()) } catch { return {} }
}

export async function dbGet(key, def) {
  if (useLS) { const d = lsParse(); return key in d ? d[key] : def }
  const v = await idbKeyVal.get(key);
  return v !== undefined ? v : def;
}

export async function dbSet(key, val) {
  if (useLS) { const d = lsParse(); d[key] = val; lss(JSON.stringify(d)); return }
  await idbKeyVal.set(key, val);
}

export async function dbDel(key) {
  if (useLS) { const d = lsParse(); delete d[key]; lss(JSON.stringify(d)); return }
  await idbKeyVal.del(key);
}

export async function dbKeys() {
  if (useLS) return Object.keys(lsParse());
  return idbKeyVal.keys();
}
