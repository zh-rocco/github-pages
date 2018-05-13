self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // 更新客户端
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== 's-offline-0509')
            .map(cacheName => {
              return caches.delete(cacheName);
            })
        );
      })
    ])
  );
});
