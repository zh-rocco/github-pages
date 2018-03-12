---
layout: post
title: 踩坑记
tags:
  - experience
categories:
  - Common
comments: true
date: 2018-03-12 16:50:00
updated: 2018-03-12 16:50:00
---

### localStorage

`localStorage.setItem` 这种写法，使用时尽量加入到 `try-catch` 中，某些浏览器是禁用这个 API 的。
