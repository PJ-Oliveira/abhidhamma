const CACHE_NAME = 'abhidhamma-cache-v11';

// App shell files to cache on install
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

    const BATCH_SIZE = 3;
    for (let i = 0; i < urlsToCache.length; i += BATCH_SIZE) {
      const batch = urlsToCache.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(url =>
        cache.match(url).then(existing => {
          if (existing) return;
          return fetch(url).then(r => {
            if (r.ok) cache.put(url, r.clone());
          });
        }).catch(() => {})
      ));
    }
  } catch (err) {
    console.error('[SW] Precache error:', err);
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch(() => {});
    })
  );
  // Run background precache without blocking install completion
  void precacheAllData();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    let deletedOld = false;
    for (const name of cacheNames) {
      if (name !== CACHE_NAME) {
        deletedOld = true;
        await caches.delete(name);
      }
    }
    await self.clients.claim();
    if (deletedOld) {
      const windowClients = await self.clients.matchAll({ type: 'window' });
      for (const client of windowClients) {
        try {
          await client.navigate(client.url);
        } catch {
          // ignore if navigation not allowed
        }
      }
    }
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  // Network-first on localhost or for app code/HTML so updates appear immediately
  if (isLocalhost || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html', { ignoreSearch: true });
        }
      });
    })
  );
});

