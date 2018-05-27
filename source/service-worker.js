importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js'
);

workbox.setConfig({ debug: false });

workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.precacheAndRoute([
  { url: '/', revision: 'v1' },
  { url: '/index.html', revision: 'v1' },
  { url: '/offline.html', revision: 'v1' },
  { url: '/images/offline-image.png', revision: 'v1' },
  { url: '/manifest.json', revision: 'v1' }
]);

workbox.routing.registerRoute(
  /.*\.(html|js|css|json)/,
  workbox.strategies.cacheFirst({
    cacheName: 'static-resources'
  })
);

workbox.routing.registerRoute(
  /.*(?:googleapis|gstatic)\.com.*$/,
  workbox.strategies.cacheFirst({
    cacheName: 'googleapis',
    plugins: [new workbox.expiration.Plugin({ maxEntries: 30 })]
  })
);

workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);
