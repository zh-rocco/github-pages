---
layout: post
title: JavaScript 常用数组操作
author: Simple
tags:
  - array
categories:
  - JavaScript
comments: true
date: 2017-06-07 22:10:00
updated: 2017-06-07 22:10:00

---

## 检测数组

1. instanceof

``` javascript
let arr = [];
let flag = arr instanceof Array;    // true
```

2. Array.isArray()

**注意：** 只支持ie9+，firefox 4+，safari 5+，opera 10.5+ 和 chrome。

``` javascript
let arr = [];
let flag = Array.isArray(arr);    // true
```

3. 不要使用 typeof


## 获取元素在数组中的索引 indexOf

``` javascript
let fruits = ["Strawberry", "Banana", "Mango"];
let index = fruits.indexOf("Banana");    // 1
```


## 删除指定位置的元素 splice

**说明：** splice: 拼接；接合；使结婚。

`arr.splice(position, count)`：从 `position` 索引起，删除 `count` 个元素，改变原数组。

``` javascript
let vegetables = ['Cabbage', 'Turnip', 'Radish', 'Carrot'];
let pos = 1, n = 2;
let removedItems = vegetables.splice(pos, n);

console.log(vegetables);    // ["Cabbage", "Carrot"] (the original array is changed)
console.log(removedItems);    // ["Turnip", "Radish"]
```


## 复制数组

``` javascript
let fruits = ["Strawberry", "Banana", "Mango"];

// 浅复制

let shallowCopy = fruits.slice();
```


### 数组转字符串

1. toString

**注意：** 不要使用 `toLocalString`，存在不确定性。

``` javascript
let fruits = ["Strawberry", "Banana", "Mango"];
let str = fruits.toString();    // "Strawberry,Banana,Mango"
```

2. join

``` javascript
let fruits = ["Strawberry", "Banana", "Mango"];
let str = fruits.join(',');    // "Strawberry,Banana,Mango"
```


## 数组排序

### 反序 reverse

``` javascript
let fruits = ["Strawberry", "Banana", "Mango"];
fruits.reverse();
console.log(fruits);    // ["Mango", "Banana", "Strawberry"]
```

### 自定义排序 sort

1. 直接调用 `sort()` 方法会按 **升序** 重排数组项---最小的值位于最前面，最大的值排在最后面。

**说明：** 为了实现排序，`sort()` 方法会调用每个数组项的 `toString()` 转型方法，
然后比较得到的字符串，以确定如何排序。即使数组中的每一项都是数值，`sort()` 方法也会先将其转化为字符串再进行比较。

``` javascript
let fruits = ["Strawberry", "Banana", "Mango"];
fruits.sort();
console.log(fruits);    // ["Banana", "Mango", "Strawberry"]

let values = [0, 1, 5, 10, 15];
values.sort();
console.log(values);    // [0, 1, 10, 15, 5]
```

为什么 '10' 和 '15' 在 '5' 前面？

**注意：** `sort()` 方法根据测试字符串的结果改变原来的顺序，虽然元素 5 小于 10，
但在进行字符串比较时，'10' 则位于 '5' 的前面。

2. 传入排序函数 `sort(compare)`

``` javascript
let values = [0, 8, 1, 18, 5];

function compare(value1, value2) {
  if (value1 < value2) {
    return -1;
  } else if (value1 === value2) {
    return 0;
  } else {
    return 1;
  }
}

values.sort(compare);
console.log(values);    // [0, 1, 5, 8, 18]
```

**注意：** `value1 < value2` 返回 -1（负值） 表示正序，返回 1（正值） 表示倒序。
