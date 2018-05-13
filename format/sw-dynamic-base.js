self.addEventListener('fetch', event => {
  const { request } = event;

  event.respondWith(
    fetch(request).then(response => {
      caches.open('s-dynamic-0509').then(cache => {
        cache.put(request, response.clone());
      });

      return response;
    })
  );
});
