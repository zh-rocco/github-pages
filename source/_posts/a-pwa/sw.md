---
layout: post
title: Service Worker
tags:
  - service worker
categories:
  - PWA
comments: true
date: 2017-11-17 13:50:00
updated: 2018-03-15 16:50:00
---

## Service Worker 有以下功能和特性：

1.  出于安全的考虑，必须在 HTTPS 环境下才能工作（host 为 localhost 或者 127.0.0.1 也可以）
2.  一个独立的 worker 线程，独立于当前网页进程，有自己独立的 worker context
3.  不能直接操作 DOM
4.  一旦被 install，就永远存在，除非被 uninstall
5.  需要的时候可以直接唤醒，不需要的时候自动睡眠（有效利用资源，此处有坑）
6.  可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）
7.  离线内容开发者可控
8.  能向客户端推送消息
9.  异步实现，内部大都是通过 Promise 实现

<!-- more -->

## 基础知识

* [Cache API](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)，Cache API 是 Service Worker 上的一个全局对象，可以用来缓存资源。
* [HTML5 fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)（网络请求）
* [Promise](https://developer.mozilla.org/zh-CN/docs/Web/javaScript/Reference/Global_Objects/Promise)

## 注册 Service Worker

### 注册

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js', { scope: '/' })
    .then(function(reg) {
      console.log('Service Worker 注册成功，域名: ', reg.scope);
    })
    .catch(function(err) {
      console.log('Service Worker 注册失败: ', err);
    });
}
```

**说明：**

1.  首先是要判断 Service Worker API 是否可用。
2.  如果浏览器支持，在页面 onload 的时候注册位于 `/sw.js` 的 Service Worker。
3.  每次页面加载成功后，就会调用 `register()` 方法，浏览器将会判断 Service Worker 线程是否已注册并做出相应的处理。
4.  `register()` 方法的 scope 参数是可选的，用于指定你想让 Service Worker 控制的内容的子目录，关于 `register()` 方法的 scope 参数，需要说明一下：
    Service Worker 线程将接收 scope 指定网域目录上所有事项的 fetch 事件，如果我们的 Service Worker 的 javaScript 文件在 `/a/b/sw.js`，不传 scope 值的情况下，scope 的值就是 `/a/b`，scope 的值的意义在于，如果 scope 的值为 `/a/b`，那么 Service Worker 线程只能捕获到 path 为 `/a/b` 开头的(/a/b/page1，/a/b/page2，...)页面的 fetch 事件，通过 scope 的意义我们也能看出 Service Worker 不是服务单个页面的，所以在 Service Worker 的 js 逻辑中全局变量需要慎用。
5.  `then()` 函数链式调用我们的 Promise，当 Promise resolve 的时候，里面的代码就会执行。
6.  最后面我们链了一个 `catch()` 函数，当 Promise rejected 的时候执行。

### 查看 Service Worker 是否注册成功

Chrome 地址栏中输入 chrome://serviceworker-internals 可以查看 Service Worker 详情。

### 注册失败的原因

* 不是 HTTPS 环境，不是 localhost 或 127.0.0.1；
* Service Worker 文件的地址没有写对，需要相对于 origin；
* Service Worker 文件在不同的 origin 下。

## Service Worker 的生命周期

生命周期分为这几个状态：installing、installed、activating、activated、redundant。

1.  installing（安装中）：这个状态发生在 Service Worker 注册之后，表示开始安装，触发 install 事件回调指定一些静态资源进行离线缓存，
    install 事件回调中有两个方法：

    * `event.waitUntil()`：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止。
    * `self.skipWaiting()`：self 是当前 context 的 global 变量，执行该方法表示强制当前处在 waiting 状态的 Service Worker 进入 activate 状态。

2.  installed（安装后）：Service Worker 已经完成了安装，并且等待其他的 Service Worker 线程被关闭；
3.  activating（激活中）：在这个状态下没有被其他的 Service Worker 控制的客户端，允许当前的 worker 完成安装，并且清除了其他的 worker 以及关联的旧缓存资源，等待新的 Service Worker 线程被激活，activate 回调中有两个方法：

    * `event.waitUntil()`：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止。
    * `self.clients.claim()`：在 activate 事件回调中执行该方法表示取得页面的控制权, 这样之后打开页面都会使用版本更新的缓存，旧的 Service Worker 脚本不再控制着页面，之后会被停止。

4.  activated（激活后）：在这个状态会处理 activate 事件回调 (提供了更新缓存策略的机会)，并可以处理功能性的事件 fetch (请求)、sync (后台同步)、push (推送)。
5.  redundant（废弃）：这个状态表示一个 Service Worker 的生命周期结束，这里特别说明一下，进入 redundant（废弃） 状态的原因可能为这几种：

    * 安装 (install) 失败。
    * 激活 (activating) 失败。
    * 新版本的 Service Worker 替换了它并成为激活状态。

## Service Worker 支持的事件

1.  install：Service Worker 安装成功后被触发的事件，在事件处理函数中可以添加需要缓存的文件。
2.  activate：当 Service Worker 安装完成后并进入激活状态，会触发 activate 事件，通过监听 activate 事件你可以做一些预处理，如对旧版本的更新、对无用缓存的清理等。
3.  message：Service Worker 运行于独立 context 中，无法直接访问当前页面主线程的 DOM 等信息，但是通过 postMessage API，可以实现他们之间的消息传递，这样主线程就可以接受 Service Worker 的指令操作 DOM。
4.  Service Worker 有几个重要的功能性的的事件，这些功能性的事件支撑和实现了 Service Worker 的特性。
5.  fetch (请求)：当浏览器在当前指定的 scope 下发起请求时，会触发 fetch 事件，并得到传有 response 参数的回调函数，回调中就可以做各种代理缓存的事情了。
6.  push (推送)：push 事件是为推送准备的，首先需要了解一下 [Notification API](https://developer.mozilla.org/zh-CN/docs/Web/API/notification) 和 [PUSH API](https://developer.mozilla.org/zh-CN/docs/Web/API/Push_API)，通过 PUSH API，当订阅了推送服务后，可以使用推送方式唤醒 Service Worker 以响应来自系统消息传递服务的消息，即使用户已经关闭了页面。
7.  sync (后台同步)：sync 事件由 background sync (后台同步)发出，background sync 配合 Service Worker 推出的 API，用于为 Service Worker 提供一个可以实现注册和监听同步处理的方法，但它还不在 W3C Web API 标准中。

## 安装 Service Worker

```javascript
const VERSION = '180315-01';
const OFFLINE_CACHE = 's-offline-' + VERSION;
// 需要缓存的离线页面
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/css/style.css',
  '/fancybox/jquery.fancybox.css',
  'https://cdn.bootcss.com/jquery/2.0.3/jquery.min.js',
  '/fancybox/jquery.fancybox.pack.js',
  '/js/script.js',
  '/images/favicon.ico',
  '/images/avatar.jpg',
  '/images/offline-image.png',
  '/css/images/banner.jpg',
  '/css/fonts/fontawesome-webfont.woff'
];

self.addEventListener('install', function(event) {
  console.log('[SW]:', '开始安装 Service Worker');

  event.waitUntil(
    caches
      .open(OFFLINE_CACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => console.log('[SW]:', '离线资源缓存完毕，当前版本:', OFFLINE_CACHE))
      .then(() => self.skipWaiting())
  );
});
```

**说明：**

1.  `self` 是 Service Worker 线程内的顶级对象，类似于浏览器内的 `window` 对象。
2.  首先新增一个 install 事件监听器。
3.  使用 `caches.open()` 方法可以打开一个缓存，调用后该方法会返回了一个 Promise，当它 resolved 的时候（执行 `then()`）就可以调用缓存实例上的 `addAll()` 方法，`addAll()` 方法接收一个相对于 origin 的 URL 组成的数组，这些 URL 就是想缓存的资源列表。
4.  如果 Promise 被 rejected，安装就会失败，在下次注册时会再次尝试缓存。
5.  在 install 事件中执行 `self.skipWaiting()` 方法可以跳过 waiting 状态，然后直接进入 activate 阶段，和 `self.clients.claim()` 一起使用可以确保更新 Service Worker 时立即生效。
6.  当 install 完成之后，就会激活 Service Worker。

## 自定义请求响应（fetch）

_任何被 Service Worker 控制的资源被请求到时，都会触发 fetch 事件，这些资源包括指定 scope 内的 html 文档，和这些 html 文档内引用的任何资源（比如 index.html 发起了一个跨域的请求来嵌入一个图片，这个也会通过 Service Worker）。_

```javascript
// 缓存版本
const CACHE_VERSION = 's-data-v1';

self.addEventListener('fetch', function(event) {
  const request = event.request;

  event.respondWith(
    caches.match(request).then(response => {
      // 如果匹配到缓存，就直接返回，减少一次 HTTP 请求
      if (response) {
        console.log('[SW]:', '读取缓存', request.method, request.url);
        return response;
      }

      // 如果未匹配到缓存，就直接发起网络请求
      const requestClone = request.clone(); // 拷贝原始请求
      return fetch(requestClone).then(httpResponse => {
        const responseClone = httpResponse.clone();
        caches.open(CACHE_VERSION).then(cache => {
          cache.put(request, responseClone);
          console.log('[SW]:', '写入缓存', request.method, request.url);
        });
        return httpResponse;
      });
    })
  );
});
```

**说明：**

1.  在 install 事件中缓存静态资源，在 fetch 事件中处理回调来代理页面请求从而实现动态地资源缓存；install 和 fetch 缓存的区别：

    * install 时缓存的优点是第二次访问即可离线，缺点是需要将需要缓存的 URL 在编译时插入到脚本中，增加代码量和降低可维护性。
    * fetch 时缓存的优点是无需更改编译过程，也不会产生额外的流量，缺点是需要多一次访问才能离线可用。

2.  接着调用 event 上的 `respondWith()` 方法来劫持 HTTP 响应。
3.  `caches.match()` 方法将网络请求的资源和 cache 里可获取的资源进行匹配，查看缓存中是否有相应的资源。
4.  由于请求/响应流只能被读取一次，为了给浏览器返回响应以及把它缓存起来，需要将请求/响应克隆一份。
5.  `fetch()` 方法必须接受一个参数：资源的路径；无论请求成功与否，它都返回一个 Promise 对象，resolve 时（`then()`）返回对应请求的 Response。
6.  使用 `caches.open()` 方法打开一个缓存，然后调用 `cache.put()` 方法将克隆的响应存储到缓存中。
7.  最后将原始的响应返回给浏览器（`return httpResponse;`）。

## 更新 Service Worker

```javascript
// 缓存版本
const CACHE_VERSION = 's-data-v2';

self.addEventListener('activate', function(event) {
  console.log('[SW]:', '激活 Service Worker');

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION) // 过滤出来需要删除的资源
          .map(key => {
            console.log('[SW]:', '移除过时缓存:', key);
            caches.delete(key);
          }) // 删除旧版本资源，caches.delete() 返回 Promise 对象
      )
    )
  );

  return self.clients.claim();
});
```

**说明：**

1.  更改 CACHE_VERSION 变量的值，当安装发生的时候，前一个版本依然在响应请求，新的版本正在后台安装，由于调用了一个新的缓存 s-data-v2，所以前一个 s-data-v1 版本的缓存依然存在。
2.  传给 `waitUntil()` 的 Promise 会阻塞其他的事件，直到它完成，所以可以确保清理操作（`caches.delete()`）会在此次 fetch 事件之前完成。
3.  使用 [Promise.all()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 保证所有过期的缓存被删除。
4.  使用 `Array.filter()` 过滤出来需要删除的资源
5.  最后调用 `caches.delete()` 方法删除过期的缓存。

## 参考

* [Lavas](https://lavas.baidu.com/)
* [您的第一个 Progressive Web App](https://developers.google.com/web/fundamentals/getting-started/codelabs/your-first-pwapp/)
* [网站渐进式增强体验(PWA)改造：Service Worker 应用详解](https://lzw.me/a/pwa-service-worker.html)

## 相关工具

* [sw-precache](https://github.com/GoogleChrome/sw-precache)
* [workbox](https://github.com/GoogleChrome/workbox)
