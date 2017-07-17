self.addEventListener('install', function onInstall(event) {
  console.log('[SW]:', '开始安装 Service Worker');

  event.waitUntil(
    caches.open('test-cache-v1')
      .then(cache => cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/css/images/banner.jpg',
        '/js/script.js',
        '/offline.html',
        '/images/offline-image.png'
      ]))
      .then(() => console.log('[SW]:', '离线资源缓存完毕，当前版本:', 'test-cache-v1'))
      .then(() => self.skipWaiting())
  );
});
