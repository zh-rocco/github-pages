---
layout: post
title: 应用清单 - PWA
tags:
  - manifest
categories:
  - PWA
comments: true
date: 2018-04-17 21:50:00
updated: 2018-04-17 21:50:00
---

## manifest.json 文件

```json
{
  "name": "Rocco's Blog",
  "short_name": "Rocco",
  "description": "An front-end engineer who loves and pursues simple.",
  "start_url": "/index.html",
  "theme_color": "#333",
  "background_color": "#fff",
  "display": "standalone",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/images/icons/icon-64.png",
      "sizes": "64x64",
      "type": "image/png"
    },
    {
      "src": "/images/icons/icon-128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/images/icons/icon-256.png",
      "sizes": "256x256",
      "type": "image/png"
    }
  ]
}
```

**说明：**

* `name` 指定提示用户安装应用时横幅上的文本
* `short_name` 指定应用安装后出现在用户主屏幕上的文本
* `start_url` 指定当用户从设备的主屏幕开启 Web 应用时所出现的第一个页面，如果你想追踪有多少人是通过主屏幕图标访问网站的，可以这样设置 start_url：`/index.html?from=screen`
* `theme_color` 指定浏览器地址栏的颜色
* `background_color` 指定当用户从设备的主屏幕开启 Web 应用时
* `icons` 指定 Web 应用被添加到设备主屏幕时所显示的图标
* `display` 指定 Web 应用的显示模式，是可选项，默认为 browser 模式
  * `fullscreen` 打开 Web 应用并占用整个可用的显示区域。
  * `standalone` 打开 Web 应用以看起来像一个独立的原生应用。此模式下，用户代理将排除诸如 URL 栏等标准浏览器 UI 元素，但可以包括诸如状态栏和系统返回按钮的其他系统 UI 元素。
  * `minimal-ui` 此模式类似于 fullscreen，但为终端用户提供了可访问的最小 UI 元素集合，例如，后退按钮、前进按钮、重载按钮以及查看网页地址的一些方式。
  * `browser` 使用操作系统内置的标准浏览器来打开 Web 应用。

**在 HTML 中引入：**

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Progressive Web Application</title>
  <link rel="manifest" href="/manifest.json">
</head>

<body>

</body>

</html>
```

## 添加到主屏幕

### 添加到桌面横幅出现条件

* 需要 manifest.json 文件
* 清单文件需要启动 URL
* 需要 144x144 的 PNG 图标 \*?\*
* 网站正在使用通过 HTTPS 运行的 Service Worker
* 用户需要至少浏览网站两次，并且两次访问间隔在五分钟之上 \*?\*

### 高级用法

#### 取消提示

```javascript
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  return false;
});
```

代码会监听 `beforeinstallprompt` 事件并防止操作栏的默认行为触发。代码使用了标准 JavaScript 的 `preventDefault()` 功能来取消事件并返回 `false`，两处代码都是需要的，以确保操作栏不会出现。

#### 用户点击统计

```javascript
window.addEventListener('beforeinstallprompt', function(event) {
  event.userChoice.then(result => {
    console.log(result.outcome);
    if (result.outcome == 'dismissed') {
      // 发送数据以进行分析
    } else {
      // 发送数据以进行分析
    }
  });
});
```

#### 推迟提示

这可以让用户控制是否要添加你的网站，而不是浏览器决定何时显示横幅。

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Progressive Web Application</title>
  <link rel="manifest" href="/manifest.json">
</head>

<body>
  <!-- 点击此按钮会显示安装横幅 -->
  <button id="btnSave" disabled>Click this to show the prompt</button>
</body>
<script>
  window.addEventListener('DOMContentLoaded', function () {
    let btnSave = document.getElementById('btnSave');
    let savedPromptEvent;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          // 注册成功
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(error => {
          // 注册失败 :(
          console.log('ServiceWorker registration failed: ', error);
        });
    }

    window.addEventListener('beforeinstallprompt', function (event) {
      event.preventDefault();
      btnSave.removeAttribute('disabled');
      savedPromptEvent = event;
      return false;
    });

    btnSave.addEventListener('click', function () {
      if (savedPromptEvent !== undefined) {
        savedPrompt.prompt();
        savedPrompt.userChoice.then(result => {
          if (result.outcome == 'dismissed') {
            console.log('User dismissed homescreen install');
          } else {
            console.log('User added to homescreen');
          }
          savedPrompt = null;
        });
      }
    });
  });
</script>

</html>
```

## 参考

* [网络应用清单 - Google](https://developers.google.com/web/fundamentals/web-app-manifest/)
