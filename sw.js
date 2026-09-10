// ============================================================
// Family Trivia - Service Worker
// Keeps the game playable without connection once it has been
// opened at least one time. Audio files are left out on purpose:
// the audios folder is far too big to precache.
// ============================================================

// Bump this version when publishing changes so every device drops the old copy.
// The ?v= of css/js must match the one used in index.html and ruletas.html:
// that query string is what forces browsers to download the new file.
const CACHE = 'family-trivia-v3';

const PRECACHE = [
  './',
  'index.html',
  'ruletas.html',
  'css/styles.css?v=20260910d',
  'js/questions.js?v=20260910d',
  'js/script.js?v=20260910d',
  'js/ruletas.js?v=20260910d',
  'js/footer.js?v=20260910d',
  'vendor/bootstrap/bootstrap.min.css',
  'vendor/bootstrap/bootstrap.bundle.min.js',
  'vendor/bootstrap-icons/bootstrap-icons.min.css',
  'vendor/bootstrap-icons/fonts/bootstrap-icons.woff2',
  'vendor/chart/chart.umd.min.js',
  'vendor/fonts/fonts.css',
  'img/FamilyTrivia.png',
  'img/FamilyTriviaName.png',
  'img/Triviaicon.png',
  'img/ruletaTitle.png',
  'img/pistaOn.png',
  'img/pistaOff.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // A single missing file must not break the whole install.
      .then(cache => Promise.allSettled(PRECACHE.map(url => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/audios/')) return;   // streamed straight from the network

  const isPage = request.mode === 'navigate' || request.destination === 'document';
  // The game's own code changes with every deploy. Serving it from the cache
  // while the page comes from the network mixes versions (new HTML with old CSS),
  // so ask the network first and keep the cache only as an offline fallback.
  const isOwnCode = /\/(css|js)\//.test(url.pathname);

  if (isPage || isOwnCode) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then(hit => hit || (isPage ? caches.match('index.html') : undefined)))
    );
    return;
  }

  // Libraries, fonts and images barely change: cache first, refreshed in the background.
  event.respondWith(
    caches.match(request).then(hit => {
      const network = fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});
