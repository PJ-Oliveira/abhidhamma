const CACHE_NAME = 'abhidhamma-cache-v7';

// App shell files to cache immediately on install
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './fonts/GentiumBookPlus-Regular.ttf',
  './fonts/GentiumBookPlus-Italic.ttf',
  './img/logo.png',
  './data/manifest.json',
  './data/dictionary/pali_core.json',
  './data/dictionary/common_pali.json',
  './js/app.js',
  './js/dictionary.js',
  './js/export.js',
  './js/graph.js',
  './js/i18n.js',
  './js/logger.js',
  './js/reader.js',
  './js/search.js',
  './js/selection.js',
  './js/srs.js',
  './js/state.js',
  './js/tree.js',
  './js/types.js'
];

async function precacheAllData() {
  try {
    // Delay 10 seconds before aggressively fetching 140MB of data
    // to ensure the user can start reading smoothly without network starvation.
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const cache = await caches.open(CACHE_NAME);
    const res = await fetch('./data/manifest.json');
    if (!res.ok) return;
    const manifest = await res.json();
    
    const urlsToCache = [];
    if (manifest.groups) {
      for (const group of Object.values(manifest.groups)) {
        for (const work of group) {
          if (work.parts) {
            for (const part of Object.values(work.parts)) {
              if (part.files) {
                for (const file of part.files) {
                  urlsToCache.push(`./data/works/${work.id}/${file}`);
                }
              }
            }
          }
        }
      }
    }
    
    console.log(`[SW] Pre-caching ${urlsToCache.length} data files for offline reading...`);
    const BATCH_SIZE = 3; // Lower batch size to prevent CPU/Network choking
    let cached = 0;
    for (let i = 0; i < urlsToCache.length; i += BATCH_SIZE) {
      const batch = urlsToCache.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(url => 
        cache.match(url).then(existing => {
          if (existing) return; // already cached
          return fetch(url).then(r => {
            if (r.ok) cache.put(url, r.clone());
          });
        }).catch(() => {})
      ));
      cached += batch.length;
      if (cached % 30 === 0) {
        console.log(`[SW] Cached ${cached}/${urlsToCache.length} files...`);
      }
    }
    console.log('[SW] Finished precaching all books for offline use.');
  } catch (err) {
    console.error('[SW] Precache error:', err);
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  // Start background precache of all text data (don't block install)
  event.waitUntil(precacheAllData());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  // Skip chrome-extension and other non-http(s)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      // Return cached version immediately if available
      if (cachedResponse) {
        // Also revalidate in background (stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Not in cache — fetch from network and cache it
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline and not cached — return a fallback for HTML requests
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html', { ignoreSearch: true });
        }
      });
    })
  );
});
