self.addEventListener('fetch', event => {
  const { request } = event;

  event.respondWith(
    caches.open('s-dynamic-0509').then(cache => {
      return cache.match(request).then(cachedResponse => {
        const networkResponse = fetch(request).then(response => {
          cache.put(request, response.clone());
          return response;
        });
        return cachedResponse || networkResponse;
      });
    })
  );
});
