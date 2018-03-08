---
layout: post
title: meta 标签设置
categories:
  - HTML
comments: true
date: 2017-05-02 11:50:00
updated: 2018-03-02 16:50:00
---

## 一、PC 端

### 1. viewport 模板

```html
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="ie=edge, chrome=1">
    <meta name="format-detection" content="telephone=no, email=no">
    <link rel="shortcut icon" type="image/x-icon" href="">
    <title>标题</title>
    <meta name="description" content="不超过150个字符">
    <meta name="keywords" content="">
</head>

<body> 这里开始内容 </body>

</html>
```

<!-- more -->

## 二、移动端

### 1. viewport 模板

```html
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="ie=edge, chrome=1">
    <meta name="format-detection" content="telephone=no, email=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <!-- IOS添加到主屏后的标题和图标 -->
    <meta name="apple-mobile-web-app-title" content="标题">
    <link rel="apple-touch-icon-precomposed" sizes="76x76" href="">

    <link rel="shortcut icon" type="image/x-icon" href="">
    <title>标题</title>
    <meta name="description" content="不超过150个字符">
    <meta name="keywords" content="">

    <link rel="stylesheet" href="index.css">
</head>

<body> 这里开始内容 </body>

</html>
```

## 三、meta 标签详细说明

**1. H5 页面窗口自动调整到设备宽度，并禁止用户缩放页面**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

属性基本含义：

1.  `width=device-width` - 控制 `viewport` 的大小，`device-width` 为设备的宽度
2.  `initial-scale` - 初始的缩放比例
3.  `minimum-scale` - 允许用户缩放到的最小比例
4.  `maximum-scale` - 允许用户缩放到的最大比例
5.  `user-scalable` - 用户是否可以手动缩放

**2. 启用 360 浏览器的极速模式(webkit)**

```html
<meta name="renderer" content="webkit">
```

**3. ie=edge 告诉 IE 使用最新的引擎渲染网页，chrome=1 则可以激活 Chrome Frame**

```html
<meta http-equiv="X-UA-Compatible" content="ie=edge, chrome=1">
```

**4. 取消微信/百度对网站的自动转码**

```html
<meta http-equiv="Cache-Control" content="no-transform">
<meta http-equiv="Cache-Control" content="no-siteapp">
```

**5. 国产浏览器强制显示**

```html
<!-- UC强制竖屏 -->
<meta name="screen-orientation" content="portrait">
<!-- QQ强制竖屏 -->
<meta name="x5-orientation" content="portrait">
<!-- UC强制全屏 -->
<meta name="full-screen" content="yes">
<!-- QQ强制全屏 -->
<meta name="x5-fullscreen" content="true">
<!-- UC应用模式 -->
<meta name="browsermode" content="application">
<!-- QQ应用模式 -->
<meta name="x5-page-mode" content="app">
```

**6. 忽略将页面中的数字识别为电话号码**

```html
<meta name="format-detection" content="telephone=no">
```

**7. 忽略 Android 平台中对邮箱地址的识别**

```html
<meta name="format-detection" content="email=no">
```

**8. 当网站添加到主屏幕快速启动方式，可隐藏地址栏，仅针对 ios 的 safari**

```html
<meta name="apple-mobile-web-app-capable" content="yes">
```

**9. 将网站添加到主屏幕快速启动方式，仅针对 ios 的 safari 顶端状态条的样式**

```html
<meta name="apple-mobile-web-app-status-bar-style" content="black"> <!– 可选default、black、black-translucent –>
```

**10. 需要在网站的根目录下存放 favicon 图标，防止 404 请求(使用 fiddler 可以监听到)，在页面上需加 link 如下：**

```html
<link rel="shortcut icon" href="/favicon.ico">
```

**11. QQ 聊天框中发送网站 URL，预览内容修改方法：**

```html
<meta name="description" itemprop="description" content="摘要">
<meta itemprop="name" content="标题">
<meta itemprop="image" content="图片">
```
