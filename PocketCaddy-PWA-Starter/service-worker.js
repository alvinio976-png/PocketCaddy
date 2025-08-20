// Simple cache-first SW (works on HTTPS/localhost)
const CACHE = "pcw-v1";
const ASSETS = ["/","/index.html","/assets/styles.css","/assets/app.js","/assets/icons/icon-192.png","/assets/icons/icon-512.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener("fetch", e => {
  const { request } = e;
  if (request.method !== "GET") return;
  e.respondWith(
    caches.match(request).then(r => r || fetch(request))
  );
});
