const DB = 'BasketTracker';
const STORE = 'kv';

function promisify(req) {
  return new Promise((res, rej) => {
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { r.result.createObjectStore(STORE) };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

let _db = null;
let _dbPromise = null;
async function getDB() {
  if (_db) return _db;
  if (!_dbPromise) _dbPromise = openDB();
  _db = await _dbPromise;
  return _db;
}

export const idbKeyVal = {
  async get(key) {
    const db = await getDB();
    return promisify(db.transaction(STORE, 'readonly').objectStore(STORE).get(key));
  },
  async set(key, val) {
    const db = await getDB();
    return promisify(db.transaction(STORE, 'readwrite').objectStore(STORE).put(val, key));
  },
  async del(key) {
    const db = await getDB();
    return promisify(db.transaction(STORE, 'readwrite').objectStore(STORE).delete(key));
  },
  async keys() {
    const db = await getDB();
    return promisify(db.transaction(STORE, 'readonly').objectStore(STORE).getAllKeys());
  },
};
