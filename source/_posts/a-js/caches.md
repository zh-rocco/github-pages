---
layout: post
title: Cache API
tags:
  - cache
  - pwa
categories:
  - JavaScript
comments: true
date: 2018-04-20 00:50:00
updated: 2018-04-20 00:50:00
---

## 能力检测

```javascript
if ('caches' in window) {
  // 支持
}
```

<!-- more -->

```javascript
// 打开 / 创建缓存
caches.open('test-cache').then(cache => {
  // 一次添加多个缓存
  cache.addAll(['/1.png', '/2.png']).then(() => {
    console.log('1 and 2 are cached.');
  });

  // 添加单个缓存
  cache.add('/3.png').then(() => {
    console.log('3 is cached.');
  });
});

// 查看是否存在缓存
caches.has('test-cache').then(flag => {
  console.log(flag);
});

// cache.add 方法会自动调用 fetch 获取资源，也可以手动获取资源后使用 cache.put 缓存
fetch('/4.png').then(response => {
  return caches.open('test-cache').then(cache => {
    return cache.put('/4.png', response);
  });
});

caches.open('test-cache').then(cache => {
  // 获取 test-cache 下的所有缓存
  cache.keys().then(cached => {
    console.log(cached);
  });
});

caches.open('test-cache').then(cache => {
  // 获取 test-cache 下的指定缓存
  cache.match('/3.png').then(matched => {
    console.log(matched);
  });
});

caches
  .open('test-cache')
  .then(cache => {
    // 删除单个缓存
    cache.delete('/4.png').then(() => {
      console.log('4 is deleted');
    });
  })
  .catch(error => {
    console.log(error);
  });

// 删除这个命名缓存
caches.delete('test-cache').then(() => {
  console.log('test-cache is deleted');
});
```

## 参考

* [Cache API](https://davidwalsh.name/cache)
