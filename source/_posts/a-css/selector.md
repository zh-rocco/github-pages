---
layout: post
title: CSS 选择器权重（记一次笔试经历）
tags:
categories:
  - CSS
comments: true
date: 2018-03-26 12:00:00
updated: 2018-03-26 12:00:00
---

笔试时遇到一个很有意思的 CSS 权重题目：

HTML：

```html
<div class="outer" id="app">
  <div class="inner">
    <p class="highlight">测试文本</p>
  </div>
</div>
```

CSS：

```css
#app .inner:not(#div) .highlight {
  color: red;
}

#app .highlight:nth-of-type(1):nth-last-of-type(1) {
  color: blue;
}
```

请问 **测试文本** 的颜色为？

根据很久之前看过的一篇[博文](https://www.w3cplus.com/css/css-specificity-things-you-should-know.html)，隐约记得里面有一个权重口诀：

> 从 0 开始，一个行内样式 +1000，一个 id +100，一个 class / 属性选择器或者伪类 +10，一个元素名或者伪元素 +1，通配符 \* 不计权重。

我天真的选择了：<span style="color: blue;">测试文本</span>，蓝色。😭

<!-- more -->

正确答案为：<span style="color: red;">测试文本</span>，红色！

**权重计算：**

1.  要特别注意 `:not()` 伪类，在优先级计算中不会被看作是伪类，但是在计算选择器数量时会把 **其中的选择器** 当做普通选择器进行计数，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)

2.  权重为：100 (`#app`) + 10 (`.inner`) + 100 (`#div`) + 10 (`.highlight`) = 220
    ```css
    #app .inner:not(#div) .highlight {
      color: red;
    }
    ```
3.  权重为：100 (`#app`) + 10 (`.highlight`) + 10 (`:nth-of-type(1)`) + 10 (`:nth-last-of-type(1)`) = 130
    ```css
    #app .highlight:nth-of-type(1):nth-last-of-type(1) {
      color: blue;
    }
    ```
4.  所以最终颜色为红色

## 权重等级

根据选择器种类的不同可以分为四类，也决定了四种不同等级的权重值。

### 行内样式

行内样式包含在你的 html 中 对你的元素产生直接作用，比如:

```html
<h1 style="color: #fff;">header</h1>
```

### ID 选择器

Id 也是元素的一种标识，比如 `#div`

### 类，属性选择器和伪类选择器

这一类包括各种 class；属性选择器，比如： `[title]`；伪类选择器，比如 `:hover` 等等

### 元素和伪元素

元素跟伪元素选择器，比如 `div`、`::before`、`::after`、`::first-letter`、`::first-line`、`::selecton`

## 如何快速确定权重

> 记忆口诀：从 0 开始，一个行内样式 +1000，一个 id +100，一个 class / 属性选择器或者伪类 +10，一个元素名或者伪元素 +1，通配符 \* 不计权重。

**例如：**

```css
body #content .data img:hover {
}
```

最终权重为：1 (`body`) + 100 (`#content`) + 10 (`.data`) + 1 (`img`) + 10 (`:hover`) = 122

## 权重的基本规则

1.  不同的权重，权重值高则生效
2.  相同的权重：以后面出现的选择器为最后规则
3.  无论多少个元素组成的选择器，都没有一个 class 选择器权重高（不要被元素 +1，class +10 迷惑）
4.  要特别注意 `:not()` 伪类，在优先级计算中不会被看作是伪类，但是在计算选择器数量时会把 **其中的选择器** 当做普通选择器进行计数

## 关于 `!important`

`!important` 会覆盖任何其他的样式声明。

这个规则有点毒，除非特殊情况，不然不要使用。

## 参考：

* [你应该知道的一些事情——CSS 权重](https://www.w3cplus.com/css/css-specificity-things-you-should-know.html)
* [优先级 - CSS | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)
