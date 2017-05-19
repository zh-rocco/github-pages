"use strict";

let VERSION = 'v2';
let STATIC_CACHE = 'simple-static-' + VERSION;
let DATA_CACHE = 'simple-data-' + VERSION;

/* 需要缓存的文件集合 filesToCache */
let FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/images/favicon.ico',
  '/manifest.json'
];

let HOSTNAME_WHITELIST = [
  self.location.hostname,
  "www.singple.com",
  "cdn.bootcss.com"
];

/* 安装 Service Worker 线程 */
function installHookFunc(event) {
  console.log('[SW]:', '***开始安装');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function (cache) {
        console.log('[SW]:', '开始缓存应用外壳');
        return cache.addAll(FILES_TO_CACHE)
      })
      .then(function () {
        console.log('[SW]:', '缓存完毕，当前版本:', STATIC_CACHE)
      })
  );
}

/* 更新 Service Worker 线程 */
function activateHookFunc(event) {
  console.log('[SW]:', '***激活');

  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (key) {
          if (key !== STATIC_CACHE && key !== DATA_CACHE) {
            console.log('[SW]:', '移除过时缓存:', key);
            return caches.delete(key);
          }
        }));
      })
  );

  return self.clients.claim();
}

/* 响应请求 */
function fetchHookFunc(event) {
  console.log('[SW]:', '请求:', event.request.url);

  if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
    event.respondWith(
      caches.open(DATA_CACHE)
        .then(function (cache) {
          return fetch(event.request)
            .then(function (response) {
              cache.put(event.request.url, response.clone());
              return response;
            })
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          return response || fetch(event.request);
        })
    );
  }
}

self.addEventListener('install', installHookFunc);
self.addEventListener('activate', activateHookFunc);
self.addEventListener('fetch', fetchHookFunc);
