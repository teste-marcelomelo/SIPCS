const CACHE_NAME = 'sipcs-cache-v2';

const FILES_TO_CACHE = [
  '/SIPCS/',
  '/SIPCS/index.html',
  '/SIPCS/manifest.json'
];

self.addEventListener('install', event => {
  // ✅ FORÇA ATIVAÇÃO IMEDIATA
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  // ✅ LIMPA CACHES ANTIGOS
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  // ✅ ASSUME CONTROLE IMEDIATO DAS PÁGINAS
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
