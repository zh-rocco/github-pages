'use strict';

let VERSION = '070809';
let OFFLINE_CACHE = 's-offline-' + VERSION;
let DATA_CACHE = 's-data-' + VERSION;

// 需要缓存的离线页面
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/images/banner.jpg',
  '/js/script.js',
  '/offline.html',
  '/images/offline-image.png'
];

// 不需要缓存的地址
const IGNORE_FILES = [
  /https?:\/\/hm.baidu.com\//,
  /https?:\/\/www.google-analytics.com\//,
  /https?:\/\/jsfiddle.net\//
];

/**
 * 通用函数
 */

// 不需要缓存的请求
function shouldAlwaysFetch(request) {
  return request.method !== 'GET' || IGNORE_FILES.some(regex => request.url.match(regex));
}

// 需要缓存的请求，例如：HTML页面
function shouldFetchAndCache(request) {
  return (/text\/html/i).test(request.headers.get('Accept'));
}

/**
 * Install 安装
 */

function onInstall(event) {
  console.log('[SW]:', '开始安装 Service Worker');

  event.waitUntil(
    caches.open(OFFLINE_CACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => console.log('[SW]:', '离线资源缓存完毕，当前版本:', OFFLINE_CACHE))
      .then(() => self.skipWaiting())
  );
}

/**
 * Fetch
 */

// 当网络离线或请求发生了错误，使用离线资源替代 request 请求
function offlineResponse(request) {
  console.log('[SW]:', '离线模式', request.method, request.url);
  if (request.url.match(/\.(jpg|png|gif|svg|jpeg)(\?.*)?$/)) {
    return caches.match('/images/offline-image.png');
  } else {
    return caches.match('/offline.html');
  }
}

// 从缓存读取或使用离线资源替代
function cachedOrOffline(request) {
  return caches.match(request)
    .then((response) => response || offlineResponse(request));
}

// 从网络请求，并将请求成功的资源缓存
function networkedAndCache(request) {
  return fetch(request)
    .then(response => {
      const copy = response.clone();

      caches.open(DATA_CACHE)
        .then(cache => {
          cache.put(request, copy);
        });

      console.log('[SW]:', '写入缓存', request.method, request.url);
      return response;
    });
}

// 优先从 cache 读取，读取失败则从网络请求并缓存。网络请求也失败，则使用离线资源替代
function cachedOrNetworked(request) {
  return caches.match(request)
    .then((response) => {
      console.log('[SW]:', response ? '读取缓存' : '未匹配缓存', request.method, request.url);
      return response ||
        networkedAndCache(request)
          .catch(() => offlineResponse(request));
    });
}

// 优先从网络请求，失败则使用离线资源替代
function networkedOrOffline(request) {
  return fetch(request)
    .then(response => {
      console.log('[SW]:', '网络请求', request.method, request.url);
      return response;
    })
    .catch(() => offlineResponse(request));
}

function onFetch(event) {
  const request = event.request;

  // 应当永远从网络请求的资源
  // 如果请求失败，则使用离线资源替代
  if (shouldAlwaysFetch(request)) {
    console.log('[SW]:', 'AlwaysFetch request: ', event.request.url);
    event.respondWith(networkedOrOffline(request));
    return;
  }

  // 应当从网络请求并缓存的资源
  // 如果请求失败，则尝试从缓存读取，读取失败则使用离线资源替代
  if (shouldFetchAndCache(request)) {
    event.respondWith(
      networkedAndCache(request).catch(() => cachedOrOffline(request))
    );
    return;
  }

  event.respondWith(cachedOrNetworked(request));
}

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

function onActivate(event) {
  console.log('[SW]:', '激活 Service Worker');
  event.waitUntil(Promise.all([
    // 更新客户端
    self.clients.claim(),
    removeOldCache()
  ]))
}

self.addEventListener('install', onInstall);
self.addEventListener('fetch', onFetch);
self.addEventListener("activate", onActivate);
