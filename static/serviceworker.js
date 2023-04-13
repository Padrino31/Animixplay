// Define a cache name for the app
const CACHE_NAME = "animeflv-cache-v1";

// List of files to cache
const urlsToCache = [
  "/",
  "/index.html",
  "/static/ApplogoDark.png",
  "/static/notification-icon.png",
  "/static/notification-badge.png",
  "/scripts/main.js",
  "/styles/main.css",
];

// Install event handler
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event handler
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request since it's a stream and can only be consumed once
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response since it's a stream and can only be consumed once
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Activate event handler
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification event handler
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error("Could not parse push event data");
    return;
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      vibrate: data.vibrate || [200, 100, 200],
      data: data.data,
      actions: data.actions || [],
    })
  );
});

// Notification click event handler
self.addEventListener("notificationclick", (event) => {
  const data = event.notification.data;

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === data.url && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(data.url);
      }
    })
  );
});
