---
layout: post
title: 解决移动端 300ms 延迟
author: Simple
tags:
  - JavaScript
  - mobile
categories:
  - JavaScript
comments: true
date: 2017-05-02 11:50:00

---

**问题：**

1. 移动端 `click` 屏幕产生 200-300 ms的延迟响应。
2. 移动设备上的web网页是有 300ms 延迟的，往往会造成按钮点击延迟甚至是点击失效。

**解决方案：**

1. `fastclick` 可以解决在手机上点击事件的 300ms 延迟
2. `zepto` 的 `touch` 模块，`tap` 事件也是为了解决在 `click` 的延迟问题
3. 解决 300ms 延迟的问题，也可以通过绑定 `ontouchstart` 事件，加快对事件的响应

**说明：**

触摸事件的响应顺序：

1. `ontouchstart`
2. `ontouchmove`
3. `ontouchend`
4. `onclick`

