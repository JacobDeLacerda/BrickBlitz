const CACHE_NAME = 'brick-blitz-cache-v2'; // Updated cache version
const urlsToCache = [
    'index.html',
    'manifest.json',
    'sw.js',
    'icon-192.png',
    'icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          console.log("Opened cache")
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
              if(!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic'){
                return fetchResponse
              }
               const responseToCache = fetchResponse.clone();

               caches.open(CACHE_NAME).then((cache) => {
                 cache.put(event.request, responseToCache);
               })
               return fetchResponse;
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            );
        })
    );
});