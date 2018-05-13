self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open('s-offline-0509')
      .then(cache => {
        return cache.addAll(['/', '/css/style.css', '/js/script.js']);
      })
      .then(() => self.skipWaiting()) // 跳过等待
  );
});
