// Service Worker script
const CACHE_NAME = 'animeflv-cache-v1';

const urlsToCache = [
  '/',
  'templates/home.html',
  'templates/anime.html',
  'templates/episode.html',
  'templates/vid.html',
  'templates/search.html',
  'static/css/bookmark.html',
  'static/css/watchlist.html',
  'static/css/Season3.html',
  'static/css/Season3vid.html',
  'static/css/anime.css',
  'static/css/search.css',
  'static/css/episode.css',
  'static/css/home.css',
  'static/css/video.css',
  'static/css/styles.css',
  'https://is1-ssl.mzstatic.com/image/thumb/Purple122/v4/20/15/e8/2015e880-f772-dd23-9a12-1cf2259ae8bd/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // If the resource is in cache, return it
        if (response) {
          return response;
        }
        // If the resource is not in cache, fetch it from the network and add it to cache
        return fetch(event.request)
          .then(function(response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(function() {
            // If the fetch fails, show an offline page
            return caches.match('/offline.html');
          });
      })
  );
});
