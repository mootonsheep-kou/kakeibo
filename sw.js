// 通信が無くても開けるようにするための仕組み。ファイルを直したら VERSION を1つ上げる
const VERSION = "kakeibo-v4";
const HERO = [];
for (const n of [2, 3, 4, 5, 6, 7]) for (const p of ["sq", "good", "pinch", "down"]) HERO.push("hero/hero" + n + "_" + p + ".png");
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"].concat(HERO);
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
