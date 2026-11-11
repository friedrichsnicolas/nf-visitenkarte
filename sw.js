/* Offline-Cache der digitalen Visitenkarte. Bei Änderungen VERSION erhöhen. */
const VERSION = "nf-v3";
const FILES = [
  "./", "index.html", "app.css", "app.js", "manifest.webmanifest",
  "assets/fonts/Inter-Regular.ttf", "assets/fonts/Inter-Medium.ttf",
  "assets/fonts/Playfair-Regular.ttf", "assets/fonts/Playfair-Medium.ttf",
  "assets/img/NF_Monogramm_champagner.svg", "assets/img/qr-app.svg", "assets/img/qr-vcard.svg",
  "assets/icons/icon.svg", "assets/icons/icon-192.png", "assets/icons/favicon-32.png", "assets/icons/apple-touch-icon.png",
  "downloads/Nicolas_Friedrichs.vcf"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* Erst Cache, im Hintergrund aktualisieren (stale-while-revalidate). */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(res => {
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    }).catch(() => hit || cache.match("index.html"));
    return hit || net;
  }));
});
