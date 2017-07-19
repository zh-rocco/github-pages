'use strict';
// 缓存版本
const CACHE_VERSION = 's-data-v4';
// 需要缓存的离线页面
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/fancybox/jquery.fancybox.css',
  '/css/style.css',
  '/css/images/banner.jpg',
  '/css/fonts/fontawesome-webfont.woff',
  'https://cdn.bootcss.com/jquery/2.0.3/jquery.min.js',
  '/fancybox/jquery.fancybox.pack.js',
  '/js/script.js'
];

/**
 * Install 安装
 */

self.addEventListener('install', function (event) {
  console.log('[SW]:', '开始安装 Service Worker');

  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => console.log('[SW]:', '离线资源缓存完毕，当前版本:', CACHE_VERSION))
      .then(() => self.skipWaiting())
  );
});

/**
 * Fetch
 */

self.addEventListener('fetch', function (event) {
  const request = event.request;

  event.respondWith(
    caches.match(request)
      .then(response => {
        // 如果匹配到缓存，就直接返回，减少一次 http 请求
        if (response) {
          console.log('[SW]:', '读取缓存', request.method, request.url);
          return response;
        }

        // 如果未匹配到缓存，就直接发起网络请求
        const requestClone = request.clone(); // 拷贝原始请求
        return fetch(requestClone)
          .then(httpResponse => {
            const responseClone = httpResponse.clone();
            caches.open(CACHE_VERSION)
              .then(cache => {
                cache.put(request, responseClone);
                console.log('[SW]:', '写入缓存', request.method, request.url);
              });
            return httpResponse;
          })
      })
  );
});

/**
 * Activate
 */

self.addEventListener("activate", function (event) {
  console.log('[SW]:', '激活 Service Worker');

  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
          .filter(key => key !== CACHE_VERSION) // 过滤不需要删除的资源
          .map(key => {
            console.log('[SW]:', '移除过时缓存:', key);
            caches.delete(key);
          }) // 删除旧版本资源，caches.delete() 返回 Promise 对象
        )
      )
  );

  return self.clients.claim();
});
