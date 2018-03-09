---
layout: post
title: 正则表达式
tags:
  - regex
categories:
  - JavaScript
comments: true
date: 2017-03-12 16:50:00
updated: 2018-03-09 16:50:00
---

**在线工具 https://regexr.com/**

## 一、入门

### 特殊字符

| Character | Meaning                                      |
| --------- | -------------------------------------------- |
| \         | 1. 转移，如：`/\*/` <br> 2. 特殊，如：`/\d/` |
| `^`       | 1. 匹配输入的开始，如：`/^abc/` <br> 2.      |
| `$`       | 结束                                         |
| `.`       | 匹配除换行符以外的任意字符                   |
| `\w`      | 字母、数字、下划线、汉字                     |
| `\s`      | 空格                                         |
| `\d`      | 数字                                         |
| `\b`      | 边界符                                       |

## 二、基本元素

### 反义（对应大写）

| Character | Meaning                              |
| --------- | ------------------------------------ |
| `\W`      | `非\w` -> 非字母，数字，下划线，汉字 |
| `\S`      | `非\s` -> 非空格                     |
| `\D`      | `非\d` -> 非数字                     |
| `\B`      | `非\b` -> 非边界符                   |

### 常用限定符

| Character | Meaning        |
| --------- | -------------- |
| `\*`      | 重复零或多次   |
| `+`       | 重复一次或多次 |
| `?`       | 重复零或一次   |
| `{n}`     | 重复 n 次      |
| `{n,}`    | 重复 n 次以上  |
| `{n,m}`   | 重复 n-m 次    |

## 三、语法

### 贪婪与懒惰

| Character | Meaning                           | string  |   regex   |       result        |
| --------- | --------------------------------- | :-----: | :-------: | :-----------------: |
| `\*`      | 重复零或多次                      | aababab | /a.\*b/g  |     ["aababab"]     |
| `+`       | 重复一次或多次                    | aababab |  /a.+b/g  |     ["aababab"]     |
| `?`       | 重复零或一次                      | aababab |  /a.?b/g  | ["aab", "ab", "ab"] |
| `\*?`     | 重复任意次，但尽可能少重复        | aababab | /a.\*?b/g | ["aab", "ab", "ab"] |
| `+?`      | 重复 1 次或更多次，但尽可能少重复 | aababab | /a.+?b/g  |   ["aab", "abab"]   |
| `??`      | 重复 0 次或 1 次，但尽可能少重复  | aababab | /a.??b/g  | ["aab", "ab", "ab"] |

## 五、实战

```javascript
function version() {
  var version =
    ua.match(/flowpay\/(\d+\.\d+\.\d+\.\d+)/) ||
    ua.match(/flowpay\/(\d+\.\d+\.\d+)/) ||
    ua.match(/flowpay\/(\d+\.\d+)/);
  return version ? version[1] : '';
}

function getQueryString(key) {
  var url = document.location;
  if (key) {
    return (decodeURIComponent(url.search).match(new RegExp('(?:^\\?|&)' + key + '=(.*?)(?=&|$)')) || ['', null])[1];
  } else {
    var params = decodeURIComponent(url.search),
      reg = /(?:^\?|&)(.*?)=(.*?)(?=&|$)/g,
      temp,
      args = {};
    while ((temp = reg.exec(params)) != null) args[temp[1]] = decodeURIComponent(temp[2]);
    return args;
  }
}
```

## 六、补充

### 分组

* (?:exp) 匹配 exp,不捕获匹配的文本，也不给此分组分配组号
* (?=exp) 匹配 exp 前面的位置
* test、exec、match、replace、search
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match
