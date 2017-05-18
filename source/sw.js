"use strict";

const VERSION = 3;
const STATIC_CACHE = 'simple-static-' + VERSION;
const DATA_CACHE = 'simple-data-' + VERSION;

/* 需要缓存的文件集合 */
const filesToCache = [
  '/',
  '/css/fonts/FontAwesome.otf',
  '/css/fonts/fontawesome-webfont.eot',
  '/css/fonts/fontawesome-webfont.svg',
  '/css/fonts/fontawesome-webfont.ttf',
  '/css/fonts/fontawesome-webfont.woff',
  '/css/images/banner.jpg',
  '/css/style.css',
  '/js/script.js',
  '/images/avatar.jpg',
  '/images/favicon.ico'
];

self.addEventListener('install', installHookFunc);
self.addEventListener('activate', activateHookFunc);
self.addEventListener('fetch', fetchHookFunc);

/* 安装 Service Worker 线程 */
function installHookFunc(event) {
  console.log('[SW]:', '开始安装');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function (cache) {
        console.log('[SW]:', '开始缓存应用外壳');
        return cache.addAll(filesToCache)
      })
      .then(function () {
        console.log('[SW]:', '缓存完毕，当前版本:', STATIC_CACHE)
      })
  );
}

/* 更新 Service Worker 线程 */
function activateHookFunc(event) {
  console.log('[SW]:', '激活');

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
}
