'use strict';

const VERSION = 'v5',
  OFFLINE_CACHE = 's-offline-' + VERSION,
  DATA_CACHE = 's-data-' + VERSION,

  // 需要缓存的离线页面
  FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/images/banner.jpg',
    '/js/script.js',
    '/offline.html',
    '/images/offline-image.png'
  ],

  // 不需要缓存的地址和文件
  IGNORE_FILES = [
    /https?:\/\/hm.baidu.com\//,
    /https?:\/\/jsfiddle.net\//,
    /\/css\/images\/banner.jpg/
  ];


/**
 * Install 安装
 */

self.addEventListener('install', function (event) {
  console.log('[SW]:', '开始安装 Service Worker');

  event.waitUntil(
    caches.open(DATA_CACHE)
      .then(cache => cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/css/images/banner.jpg',
        '/js/script.js',
        '/offline.html',
        '/images/offline-image.png'
      ]))
      .then(() => console.log('[SW]:', '离线资源缓存完毕，当前版本:', DATA_CACHE))
      .then(() => self.skipWaiting())
  );
});

/**
 * Fetch
 */

self.addEventListener('fetch', function (event) {
  const request = event.request;

  // 应当永远从网络请求的资源
  // 如果请求失败，则使用离线资源替代
  if (request.method !== 'GET' || IGNORE_FILES.some(regex => request.url.match(regex))) {
    console.log('[SW]:', 'AlwaysFetch request: ', request.url);
    event.respondWith(
      fetch(request)
        .then(response => {
          console.log('[SW]:', '网络请求', request.method, request.url);
          return response;
        })
        .catch(() => {
          console.log('[SW]:', '离线模式', request.method, request.url);
          if (request.url.match(/\.(jpg|png|gif|svg|jpeg)(\?.*)?$/)) {
            return caches.match('/images/offline-image.png');
          } else {
            return caches.match('/offline.html');
          }
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(function (response) {
        // 如果匹配到缓存，就直接返回，减少一次 http 请求
        if (response) {
          console.log('[SW]:', response ? '读取缓存' : '未匹配缓存', request.method, request.url);
          return response;
        }

        // 如果未匹配到缓存，就直接发起网络请求
        let requestClone = request.clone(); // 拷贝原始请求
        return fetch(requestClone)
          .then(httpResponse => {
            // 请求失败，直接返回失败的结果
            if (!httpResponse || httpResponse.status !== 200) {
              return httpResponse;
            }
            // 请求成功，先缓存请求结果，再返回请求结果
            else {
              caches.open(DATA_CACHE)
                .then(cache => {
                  let responseClone = httpResponse.clone();
                  cache.put(request, responseClone);
                  console.log('[SW]:', '写入缓存', request.method, request.url);
                  return httpResponse;
                });
            }
          })
          // 无缓存 + 无网络情况
          .catch(() => {
            if (request.url.match(/\.(jpg|png|gif|svg|jpeg)(\?.*)?$/)) {
              return caches.match('/images/offline-image.png');
            } else {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

/**
 * Activate
 */

function removeOldCache() {
  return caches
    .keys()
    .then(keys =>
      Promise.all( // 等待所有旧的资源都清理完成
        keys
          .filter(key => key !== OFFLINE_CACHE && key !== DATA_CACHE) // 过滤不需要删除的资源
          .map(key => {
            console.log('[SW]:', '移除过时缓存:', key);
            caches.delete(key);
          }) // 删除旧版本资源，返回为 Promise 对象
      )
    )
}

self.addEventListener("activate", function (event) {
  console.log('[SW]:', '激活 Service Worker');
  event.waitUntil(Promise.all([
    // 更新客户端
    self.clients.claim(),
    removeOldCache()
  ]))
});
