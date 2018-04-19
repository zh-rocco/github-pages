---
layout: post
title: Fetch API
tags:
  - fetch
categories:
  - JavaScript
comments: true
date: 2018-04-17 21:50:00
updated: 2018-04-17 21:50:00
---

> Fetch API 是近年来被提及将要取代 XHR 的技术新标准，是一个 HTML5 的 API。
> Fetch 并不是 XHR 的升级版本，而是从一个全新的角度来思考的一种设计。

## 语法

```javascript
Promise<Response> fetch(input[, init]);
```

<!-- more -->

### 参数

**input 定义要获取的资源**

* 一个  [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString)  字符串，包含要获取资源的 URL。一些浏览器会接受  `blob:`  和  `data:`  作为 schemes。
* 一个  [`Request`](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)  对象。

**init 配置项对象（可选）**

* `method`：请求使用的方法，如  `GET`、`POST`。
* `headers`：请求的头信息，形式为  [`Headers`](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers)  的对象或包含  [`ByteString`](https://developer.mozilla.org/zh-CN/docs/Web/API/ByteString)  值的对象字面量。
* `body`：请求的 body 信息：可能是一个  [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)、[`BufferSource`](https://developer.mozilla.org/zh-CN/docs/Web/API/BufferSource)、[`FormData`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)、[`URLSearchParams`](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)  或者  [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString)  对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
* `mode`：请求的模式
  * cors：允许跨域，要求响应中 `Acess-Control-Allow-Origin` 这样的头部表示允许跨域。
  * no-cors：只允许使用 `HEAD`、`GET`、`POST` 方法。
  * same-origin：只允许同源请求，否则直接报错。
  * navigate：支持页面导航。
* `credentials`：表示是否发送 cookie
  * omit：不发送 cookie。
  * same-origin：仅在同源时发送 cookie。
  * include：发送 cookie。
* `cache`：表示处理缓存的策略，请求的 cache 模式: `default`、 `no-store 、` `reload 、` `no-cache 、` `force-cache`或者  `only-if-cached 。`
* `redirect`：表示发生重定向时，可用的 redirect 模式
  * `follow`：自动重定向。
  * `error`：如果产生重定向将自动终止并且抛出一个错误。
  * `manual`：手动处理重定向。在 Chrome 中，Chrome 47 之前的默认值是 follow，从 Chrome 47 开始是 manual。
* `referrer`：一个  [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString 'USVString 对应于所有可能的 unicode标量值序列的集合。')  可以是  `no-referrer`、`client` 或一个  URL。默认是  `client`。
* `integrity`：包含一个用于验证资资源完整性的字符串。

## 示例

**GET:**

```javascript
fetch('/some/url', { method: 'GET' })
  .then(response => {
    // 成功
    console.log('Request success: ', response);
  })
  .catch(error => {
    // 出问题了
    console.log('Request failure: ', error);
  });
```

**POST:**

```javascript
fetch('/some/url', {
  method: 'POST',
  headers: { token: '123456' },
  body: JSON.stringfy({ name: 'rocco', password: 'rocco_123' })
})
  .then(response => {
    console.log('Request success: ', response);
  })
  .catch(error => {
    console.log('Request failure: ', error);
  });
```

## 参考

* [了解 Fetch API](https://aotu.io/notes/2017/04/10/fetch-API/index.html)
* [WorkerOrGlobalScope.fetch() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/fetch)

<!-- more -->
