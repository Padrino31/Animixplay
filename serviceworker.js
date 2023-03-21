const cachea = "HVHCache-v1";
list = []
var appshellfiles = [
    // pages can be added here for caching
    './templates/home.html',
    './templates/anime.html',
    './templates/video.html',
    './templates/episode.html',
    './templates/search.html',
    '/.gitattributes',
    '/.gitignore',
    '/.replit',
      '/vercel.json',
        '/app.py',
        '/main.py',
     '/index.py',
     '/config.py',
     '/wsgi.py',
     './programs/anilist.py',
     './programs/anime_loader.py',
     './programs/db.py',
     './programs/html_gen.py',
     './programs/others.py',
     './programs/techzapi.py',
        '../static/css/anime.css',
        '../static/css/episode.css',
        '../static/css/home.css',   
    '../static/css/search.css',
        '../static/css/styles.css',
        '../static/css/video.css',
        '../static/css/watchlist.html',
        '../static/css/bookmark.hmtl.css',
      '/tab.min.js',
      '/manifest.json'

]
appshellfiles = []
self.addEventListener("install", e => {


    e.waitUntil((async () => {

        const cache = await caches.open(cachea);
        await cache.addAll(appshellfiles);
    })());


});
self.addEventListener("activate", event => {
    console.log("Service worker activated");
});

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    return fetch(request);
};

self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
});
