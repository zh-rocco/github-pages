---
layout: post
title: CSS 之 float
author: Simple
tags:
  - float
categories:
  - CSS
comments: true
date: 2017-05-30 09:50:00
updated: 2017-05-30 09:50:00

---

## 清除浮动 / 闭合浮动

给浮动的元素的父元素加上 `.clear-fix` 类名（需要的话）。如果 `float` 元素的父元素定宽定高就没必要再清除浮动了。

``` css
.clear-fix:before,
.clear-fix:after {
  content: '';
  display: table;
}

.clear-fix:after {
  clear: both;
}

// 兼容 IE6 IE7
.clear-fix {
  *zoom: 1;
}
```

<!-- more -->

### 在线例子

<script async src="//jsfiddle.net/singple/1gynLboL/embed/html,css,result/"></script>


## 未完待续...
