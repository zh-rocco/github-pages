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

<!-- more -->

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

> 题目：字符串中第一个出现一次的字符

请实现一个函数用来找出字符流中第一个只出现一次的字符。例如，当从字符流中只读出前两个字符「go」时，第一个只出现一次的字符是「g」。当从该字符流中读出前六个字符「google」时，第一个只出现一次的字符是「l」。

```javascript
function find(str) {
  for (let i = 0, len = str.length; i < len; i++) {
    let char = str[i];
    let reg = new RegExp(char, 'g');
    if (str.match(reg).length === 1) return char;
  }
}

function find2(str) {
  for (let i = 0, len = str.length; i < len; i++) {
    let char = str[i];
    if (str.indexOf(char) === str.lastIndexOf(char)) return char;
  }
}

console.log(find('google')); // l
console.log(find2('google')); // l
```

> 题目：将 `1234567` 变成 `1,234,567`，即千分位标注

```javascript
function exchange(num) {
  num += '';
  if (num.length <= 3) return num;

  num = num.replace(/\d{1,3}(?=(\d{3})+$)/g, v => {
    console.log(v);
    return v + ',';
  });
  return num;
}

console.log(exchange(1234567)); // 1,234,567

function exchange2(num) {
  num += '';
  if (num.length <= 3) return num;

  let arr = num.split('').reverse();
  for (let i = 2, len = arr.length; i < len; i += 3) {
    arr[i] = ',' + arr[i];
  }
  return arr.reverse().join('');
}

console.log(exchange2(1234567)); // 1,234,567
```

> 题目，请写出下面的代码执行结果

```javascript
var str = 'google';
var reg = /o/g;
console.log(reg.test(str), reg.lastIndex); // true 2
console.log(reg.test(str), reg.lastIndex); // true 3
console.log(reg.test(str), reg.lastIndex); // false 0
```

[RegExp.lastIndex | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex)

解决：

```javascript
const reg = /o/g;
function isHasO(str) {
  reg.lastIndex = 0; // 每次重置 lastIndex，就可以避免上述情况
  return reg.test(str);
}
var str = 'google';
console.log(isHasO(str)); // true
console.log(isHasO(str)); // true
console.log(isHasO(str)); // true
```

## 六、补充

### 分组

* (?:exp) 匹配 exp,不捕获匹配的文本，也不给此分组分配组号
* (?=exp) 匹配 exp 前面的位置
* test、exec、match、replace、search
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match
