# Service Worker

## Service Worker 有以下功能和特性：

- 出于安全的考虑，必须在 HTTPS 环境下才能工作（host 为 localhost 或者 127.0.0.1 也可以）
- 一个独立的 worker 线程，独立于当前网页进程，有自己独立的 worker context
- 不能直接操作 DOM
- 一旦被 install，就永远存在，除非被 uninstall
- 需要的时候可以直接唤醒，不需要的时候自动睡眠（有效利用资源，此处有坑）
- 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）
- 离线内容开发者可控
- 能向客户端推送消息
- 异步实现，内部大都是通过 Promise 实现


## 基础知识

- [Cache API](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)，\
Cache API 是 Service Worker 上的一个全局对象，可以用来缓存资源；
- [HTML5 fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)（网络请求）
- [Promise](https://developer.mozilla.org/zh-CN/docs/Web/javaScript/Reference/Global_Objects/Promise)


## 注册 Service Worker

### 注册

``` javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js', {scope: '/'})
    .then(function (registration) {
      console.log('Service Worker 注册成功，域名: ', registration.scope);
    })
    .catch(function (err) {
      console.log('Service Worker 注册失败: ', err);
    });
}
```

**说明：**

- 首先是要判断 Service Worker API 是否可用；
- 如果浏览器支持，在页面 `onload` 的时候注册位于 `/sw.js` 的 Service Worker；
- 每次页面加载成功后，就会调用 `register()` 方法，浏览器将会判断 Service Worker 线程是否已注册并做出相应的处理；
- `register()` 方法的 scope 参数是可选的，用于指定你想让 Service Worker 控制的内容的子目录，\
关于 `register()` 方法的 scope 参数，需要说明一下：Service Worker 线程将接收 scope 指定网域目录上所有事项的 fetch 事件，\
如果我们的 Service Worker 的 javaScript 文件在 `/a/b/sw.js`，\
不传 scope 值的情况下，scope 的值就是 `/a/b`，scope 的值的意义在于，如果 scope 的值为 `/a/b`，\
那么 Service Worker 线程只能捕获到 path 为 `/a/b` 开头的(/a/b/page1，/a/b/page2，...)页面的 fetch 事件，\
通过 scope 的意义我们也能看出 Service Worker 不是服务单个页面的，所以在 Service Worker 的 js 逻辑中全局变量需要慎用；
- `then()` 函数链式调用我们的 promise，当 promise resolve 的时候，里面的代码就会执行；
- 最后面我们链了一个 `catch()` 函数，当 promise rejected 的时候执行。

### 查看 Service Worker 是否注册成功

Chrome 输入 chrome://inspect/#service-workers 可以查看 Service Worker 是否已启用
Chrome 输入 chrome://serviceworker-internals 可以查看 Service Worker 详情

### 注册失败的原因

- 不是 HTTPS 环境，不是 localhost 或 127.0.0.1；
- Service Worker 文件的地址没有写对，需要相对于 origin；
- Service Worker 文件在不同的 origin 下。


## Service Worker 的生命周期

生命周期分为这几个状态：installing、installed、activating、activated、redundant；

- installing（安装中）：这个状态发生在 Service Worker 注册之后，表示开始安装，触发 install 事件回调指定一些静态资源进行离线缓存，\
install 事件回调中有两个方法：
  - `event.waitUntil()`：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止
  - `self.skipWaiting()`：self 是当前 context 的 global 变量，执行该方法表示强制当前处在 waiting 状态的 Service Worker 进入 activate 状态；
- installed（安装后）：Service Worker 已经完成了安装，并且等待其他的 Service Worker 线程被关闭；
- activating（激活中）：在这个状态下没有被其他的 Service Worker 控制的客户端，允许当前的 worker 完成安装，并且清除了其他的 worker 以及关联缓存的旧缓存资源，等待新的 Service Worker 线程被激活，\
activate 回调中有两个方法：
  - `event.waitUntil()`：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止。
  - `self.clients.claim()`：在 activate 事件回调中执行该方法表示取得页面的控制权, 这样之后打开页面都会使用版本更新的缓存，旧的 Service Worker 脚本不再控制着页面，之后会被停止
- activated（激活后）：在这个状态会处理 activate 事件回调 (提供了更新缓存策略的机会)，并可以处理功能性的事件 fetch (请求)、sync (后台同步)、push (推送)；
- redundant（废弃）：这个状态表示一个 Service Worker 的生命周期结束，
这里特别说明一下，进入 redundant（废弃） 状态的原因可能为这几种：
  - 安装 (install) 失败
  - 激活 (activating) 失败
  - 新版本的 Service Worker 替换了它并成为激活状态


## Service Worker 支持的事件

- install：Service Worker 安装成功后被触发的事件，在事件处理函数中可以添加需要缓存的文件；
- activate：当 Service Worker 安装完成后并进入激活状态，会触发 activate 事件，\
通过监听 activate 事件你可以做一些预处理，如对旧版本的更新、对无用缓存的清理等；
- message：Service Worker 运行于独立 context 中，无法直接访问当前页面主线程的 DOM 等信息，\
但是通过 postMessage API，可以实现他们之间的消息传递，这样主线程就可以接受 Service Worker 的指令操作 DOM；
- Service Worker 有几个重要的功能性的的事件，这些功能性的事件支撑和实现了 Service Worker 的特性；
- fetch (请求)：当浏览器在当前指定的 scope 下发起请求时，会触发 fetch 事件，并得到传有 response 参数的回调函数，回调中就可以做各种代理缓存的事情了；
- push (推送)：push 事件是为推送准备的，首先需要了解一下 [Notification API](https://developer.mozilla.org/zh-CN/docs/Web/API/notification) 和 [PUSH API](https://developer.mozilla.org/zh-CN/docs/Web/API/Push_API)，\
通过 PUSH API，当订阅了推送服务后，可以使用推送方式唤醒 Service Worker 以响应来自系统消息传递服务的消息，即使用户已经关闭了页面；
- sync (后台同步)：sync 事件由 background sync (后台同步)发出，background sync 配合 Service Worker 推出的 API，\
用于为 Service Worker 提供一个可以实现注册和监听同步处理的方法，但它还不在 W3C Web API 标准中。


## 安装 Service Worker

``` javascript
self.addEventListener('install', function (event) {
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
```

**说明：**

- 首先新增了一个 install 事件监听器；
- 然后调用事件的 `ExtendableEvent.waitUntil()` 方法，确保 Service Worker 在 `waitUntil()` 里面的代码执行完毕后再安装；
- 在 `waitUntil()` 内，使用 `caches.open()` 方法来创建了一个叫做 test-cache-v1 的新的缓存，\
该方法返回了一个 promise，当它 resolved 的时候（`then()` 方法），就可以调用在创建的缓存实例上的方法 `addAll()`，\
这个方法接收一个相对于 origin 的 URL 组成的数组，这些 URL 就是想缓存的资源列表；
- 如果 promise 被 rejected，安装就会失败，这个 worker 不会做任何事情，这也是可以的，因为你可以修复你的代码，在下次注册发生的时候，又可以进行尝试；
- 当安装成功完成之后，Service Worker 就会激活，在第一次你的 Service Worker 注册／激活时，这并不会有什么不同，但是当 Service Worker 更新的时候 ，就不太一样了。
