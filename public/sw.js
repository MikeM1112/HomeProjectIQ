const CACHE_NAME = 'homeprojectiq-v4';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [
  '/',
  '/landing-page.html',
  '/offline.html',
  '/manifest.json',
  '/fonts/dm-sans-latin-var.woff2',
  '/fonts/sora-latin-var.woff2',
  '/fonts/jetbrains-mono-700-latin.woff2',
  '/img/icon.png',
  '/img/icon.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()).then(() => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage({ type: 'swUpdateAvailable' }));
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Don't intercept cross-origin requests (CDN scripts, fonts, etc.)
  if (url.origin !== self.location.origin) return;

  // Don't intercept standalone demo/prototype static pages — not part of the app shell
  if (url.pathname === '/demo.html' || url.pathname === '/prototype.html') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        // Revalidate in background to keep cache fresh
        const networkUpdate = fetch(event.request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          }
          return response;
        }).catch(() => cached || caches.match(OFFLINE_URL));
        // Stale-while-revalidate: return cached immediately, else wait for network
        return cached || networkUpdate;
      })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
