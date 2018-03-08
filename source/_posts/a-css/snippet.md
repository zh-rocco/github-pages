---
layout: post
title: 常用 CSS 片段
tags:
categories:
  - CSS
comments: true
date: 2017-05-13 18:50:00
updated: 2018-03-02 10:50:00
---

## 清除浮动 / 闭合浮动

给浮动的元素的父元素加上 `.clear-fix` 类名（需要的话）。如果 `float` 元素的父元素定宽定高就没必要再清除浮动了。

<!-- more -->

```css
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

**示例：**

<iframe src="https://codesandbox.io/embed/my58jnp7yp?hidenavigation=1&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## 文字抗锯齿

```css
text-rendering: optimizeLegibility;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
-moz-font-feature-settings: 'liga', 'kern';
```

## 去除设置 `display: inline-block;` 时产生的间隙

1.  设置父元素 `font-size: 0`;
    ```css
    ul {
      list-style: none;
      font-size: 0;
    }
    ul li {
      display: inline-block;
      font-size: 1rem;
    }
    ```
2.  让当前元素 `float: left;`
    ```css
    ul {
      list-style: none;
    }
    ul li {
      float: left;
    }
    ```
3.  设置父元素 `display: flex;`
    ```css
    ul {
      list-style: none;
      display: flex;
    }
    ul li {
    }
    ```

## 解决 iOS 滑动卡顿

`-webkit-overflow-scrolling: touch;`

## 媒体查询

```css
body {
  background-color: grey;
}

@media screen and (max-width: 960px) {
  body {
    background-color: red;
  }
}

@media screen and (max-width: 768px) {
  body {
    background-color: orange;
  }
}

@media screen and (max-width: 550px) {
  body {
    background-color: yellow;
  }
}

@media screen and (max-width: 320px) {
  body {
    background-color: green;
  }
}
```

## 解决老版本 `IE(<9)` 不支持 `HTML5` 标签

```html
<!--[if lt IE 9]>
<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
```

html5shiv.js 必须在 `<head></head>` 中加载。

其他：

* HTML5 shiv 与其他主流浏览器不同, Internet Explorer 8 及之前的版本会忽略它们不原生支持的元素的 CSS。
* HTML5 shiv 是专门用于解决这一问题的一段 JavaScript。（有时也称作 HTML5 shim）

## 文字超出隐藏

**white-space:**

* `normal` 默认。空白会被浏览器忽略；
* `pre` 空白会被浏览器保留。其行为方式类似 `HTML` 中的 `<pre>` 标签；
* `nowrap` 文本不会换行，文本会在在同一行上继续，直到遇到 `<br>` 标签为止；
* `pre-wrap` 保留空白符序列，但是正常地进行换行；
* `pre-line` 合并空白符序列，但是保留换行符；
* `inherit` 规定应该从父元素继承 `white-space` 属性的值。

显示一段文本的缩略，剩余的用 "..." 表示：

```css
white-space: nowrap; // 强制单行显示
overflow: hidden; // 超出隐藏
text-overflow: ellipsis; // 出现省略号
```
