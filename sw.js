const CACHE = "bbt-v2";
const FILES = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-192.svg",
  "./icon-512.svg"
];
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => new Response("Offline", {status: 503})))
  );
});
