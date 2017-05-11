---
layout: post
title: 微信开发笔记
author: Simple
tags:
categories:
  - WeiXin
comments: true
date: 2017-05-10 16:06:00

---

## 一、微信 UA

#### 1. iOS

```html
Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 MicroMessenger/6.5.7 NetType/WIFI Language/zh_CN
```

#### 2. Android

```html
Mozilla/5.0 (Linux; Android 7.0; SM-G9300 Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043220 Safari/537.36 MicroMessenger/6.5.7.1041 NetType/WIFI Language/zh_CN
```

#### 3. UA 查询工具

微信打开: http://tool.lu/useragent

<!-- more -->

## 二、电脑端 Chrome 打开微信分享的页面

### 方式一:

1. **F12** 打开 **开发者工具**;
2. **Ctrl + Shift + M** 切换到 **手机模式**;
3. 点击 **Customize and control DevTools** (竖排的三个点);
4. 选择 **More tools** -> **Network conditions**;
5. 取消勾选 **Select automatically**, 选择 **Custom...**, 在 **Enter a custom user agent** 中粘贴 *微信UA*;

微信UA:

```html
Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 MicroMessenger/6.5.7 NetType/WIFI Language/zh_CN
```

### 方式二:

1. **F12** 打开 **开发者工具**;
2. **Ctrl + Shift + M** 切换到 **手机模式**;
3. 点击 **Responsive** 选择 **Edit**;
4. 点击 **Device** -> **Add custom device...**;
5. **Device name** 输入 **WeiXin-iOS**, **Device pixel ratio** 输入 **2**, **User agent string** 中粘贴 *微信UA*, 点击 **Add**;
6. 点击 **Responsive** 选择 **WeiXin-iOS**;

微信UA:

```html
Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 MicroMessenger/6.5.7 NetType/WIFI Language/zh_CN
```