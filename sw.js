// ============================================================
// Family Trivia - Service Worker
// Keeps the game playable without connection once it has been
// opened at least one time. Audio files are left out on purpose:
// the audios folder is far too big to precache.
// ============================================================

// Bump this version when publishing changes so every device drops the old copy.
const CACHE = 'family-trivia-v1';

const PRECACHE = [
  './',
  'index.html',
  'ruletas.html',
  'css/styles.css',
  'js/questions.js',
  'js/script.js',
  'js/ruletas.js',
  'js/footer.js',
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

  // Pages: try the network first so updates arrive, fall back to the cache offline.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(hit => hit || caches.match('index.html')))
    );
    return;
  }

  // Everything else: serve from cache and refresh it in the background.
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
