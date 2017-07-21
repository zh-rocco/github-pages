---
layout: post
title: sw-precache（译）
author: Simple
tags:
  - service worker
  - sw-precache
categories:
  - PWA
comments: true
date: 2017-07-21 13:30:00

---

*[sw-precache](https://github.com/GoogleChrome/sw-precache)*


## 安装

``` bash
// Local build integration:
npm install --save-dev sw-precache

// Global command-line interface:
npm install --global sw-precache
```


## 使用

### 概述

1. 确保你的网站启用了 HTTPS 服务！Service Worker 功能仅适用于通过 HTTPS 访问的页面。（为了方便调试，http://localhost 也可以运行 Service Worker）
2. 将 *sw-precache* 引入到 Node 构建脚本中。它应该适用于 gulp 或 grunt 或其运行在 Node 上的构建脚本。
