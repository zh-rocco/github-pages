---
layout: post
title: 浏览器 window 对象
tags:
  - window
categories:
  - Common
comments: true
date: 2018-03-22 12:00:00
updated: 2018-03-22 12:00:00
---

## window.name

<!-- more -->

window 对象有个 name 属性，默认为空字符串，该属性有个特征：即在一个标签窗口(window)的生命周期内，窗口载入的所有的页面都是共享一个 window.name，每个页面对 window.name 都有读写的权限，window.name 是持久存在一个标签窗口载入过的所有页面中的。window.name 属性的神奇之处在于 name 值在不同的页面（甚至不同域名）加载后依旧存在（如果没修改则值不会变化），并且可以支持非常长的 name 值（2MB）。

```javascript
// 首先打开 https://www.baidu.com/，然后打开 Console 面板，依次执行以下脚本
window.name = JSON.stringify({ msg: 'message' });
window.location.href = 'https://www.google.com.hk/';
var msg = JSON.parse(window.name);
console.log(msg); // {msg: 'message'}
```
