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

HTML 中的 `<script src="xxx">`、`<img src="xxx">`、`<link href="xxx">` 不受同源策略限制。<br>
因此：

* `<script>` 和 `<link>` 可以使用 CDN。
* `<img>` 可以用来做埋点统计。
* `<script>` 还可以实现 JSONP。

注意：所有的跨域请求方式，最终都需要信息提供方来做出相应的支持和改动。

## JSONP
