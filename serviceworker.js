// Service Worker script
const CACHE_NAME = 'animixplay-cache-v1';

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
  'https://animixplay.to/icon.png'
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
