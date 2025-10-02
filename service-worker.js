self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('webvibes-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        './index.html',
        './style.css',
        './script.js',
        './image/webvibesid.png',
        './image/web developer.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
