var cacheName = 'Animeflv';
var filesToCache = [
  '/',
  '/static/css/styles.css',
  '/static/js/app.js',
  '/static/images/logo.png',
  'https://od.lk/s/OTBfMzU4MDc3MjNf/ApplogoDark.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
