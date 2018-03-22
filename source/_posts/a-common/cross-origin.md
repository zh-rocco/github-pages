---
layout: post
title: 跨域
tags:
  - cross-origin
categories:
  - Common
comments: true
date: 2018-03-12 16:50:00
updated: 2018-03-12 14:00:00
---

浏览器有 **同源策略**。

若 URL 的 **协议、域名、端口** 不同就会视为跨域。

<!-- more -->

HTML 中的 `<script src="xxx">`、`<img src="xxx">`、`<link href="xxx">` 不受同源策略限制。

因此：

* `<script>` 和 `<link>` 可以使用 CDN。
* `<img>` 可以用来做埋点统计。
* `<script>` 还可以实现 JSONP。

注意：所有的跨域请求方式，最终都需要信息提供方来做出相应的支持和改动。

## JSONP

原理：通过添加一个 script 标签，向服务器请求 JSON 数据，这种做法不受同源政策限制；服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。

```javascript
function callback(data) {
  console.log(data);
}

var script = document.createElement('script');
script.src = 'http://example.com/';
document.body.appendChild(script);

// 服务器收到这个请求以后，会将数据放在回调函数的参数位置返回，如：callback({msg: 'message'});
// 由于 script 标签请求的脚本，直接作为代码运行。这时，只要浏览器定义了 callback 函数，该函数就会立即调用。可以通过回调函数的参数拿到数据。
```

## WebSocket

WebSocket 是一种通信协议，使用 ws://（非加密）和 wss://（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

## CORS（Cross-Origin Resource Sharing）

跨域资源共享（CORS）机制允许 Web 应用服务器进行跨域访问控制，从而使跨域数据传输得以安全进行。浏览器支持在 API 容器中（例如 XMLHttpRequest 或 Fetch ）使用 CORS，以降低跨域 HTTP 请求所带来的风险。

> CORS 需要客户端和服务器同时支持。目前，所有浏览器都支持该机制。

### 1. 简单请求

不会触发 CORS 预检的请求。

使用下列方法之一：

* `GET`
* `HEAD`
* `POST`

Content-Type 的值仅限于下列三者之一：

* `text/plain`
* `multipart/form-data`
* `application/x-www-form-urlencoded`

CORS 标准新增了一组 HTTP 首部字段，允许服务器声明哪些源站有权限访问哪些资源。

```html
Access-Control-Allow-Origin: <origin> | *
```

其中，origin 参数的值指定了允许访问该资源的外域 URI。对于不需要携带身份凭证的请求，服务器可以指定该字段的值为通配符，表示允许来自所有域的请求。

### 2. 预检请求

与前述简单请求不同，“需预检的请求”要求必须首先使用 OPTIONS 方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求。“预检请求”的使用，可以避免跨域请求对服务器的用户数据产生未预期的影响。

使用下列方法之一：

* `PUT`
* `DELETE`
* `CONNECT`
* `OPTIONS`
* `TRACE`
* `PATCH`

Content-Type 的值不属于下列三者之一：

* `text/plain`
* `multipart/form-data`
* `application/x-www-form-urlencoded`

浏览器检测到，从 JavaScript 中发起的请求需要被预检。首先会发送一个使用 OPTIONS 方法的“预检请求”。 OPTIONS 是 HTTP/1.1 协议中定义的方法，用以从服务器获取更多信息。该方法不会对服务器资源产生影响。预检通过后会接着发送后续请求。

### 3. 附带身份凭证的请求

Fetch 与 CORS 的一个有趣的特性是，可以基于 HTTP cookies 和 HTTP 认证信息发送身份凭证。一般而言，对于跨域 XMLHttpRequest 或 Fetch 请求，浏览器不会发送身份凭证信息。如果要发送凭证信息，需要设置 XMLHttpRequest 的某个特殊标志位。

说明：将 XMLHttpRequest 的 withCredentials 标志设置为 true，从而向服务器发送 Cookies。

**对于附带身份凭证的请求，服务器不得设置 Access-Control-Allow-Origin 的值为“\*”。**

## 参考

* [HTTP 访问控制（CORS）| MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
