---
layout: post
title: JavaScript 常用数组操作
tags:
  - array
categories:
  - JavaScript
comments: true
date: 2017-06-07 22:10:00
updated: 2018-03-02 16:50:00
---

## 检测数组

1.  instanceof 关键字

    ```javascript
    let arr = [];
    let flag = arr instanceof Array; // true
    ```

<!-- more -->

2.  Array.isArray() 方法
    **注意：** 只支持 ie9+，firefox 4+，safari 5+，opera 10.5+ 和 chrome。

    ```javascript
    let arr = [];
    let flag = Array.isArray(arr); // true
    ```

3.  不要使用 `typeof` 关键字

## 获取元素在数组中的索引 indexOf / lastIndexOf

1.  `indexOf()`：从数组的开头（位置 0）开始向后查找，返回第一个匹配值的索引。
2.  `lastIndexOf()`：从数组的末尾开始向前查找，返回第一个匹配值的索引。

这两个方法都返回查找的项在数组中的位置（索引），或者在没找到的情况下返回-1。\
在比较第一个参数与数组中的每一项时会使用 **全等操作符**，也就是说，要求查找的项必须严格相等。

```javascript
let fruits = ['Strawberry', 'Banana', 'Mango', 'apple', 'Banana'];
let index1 = fruits.indexOf('Banana'); // 1
let index2 = fruits.lastIndexOf('Banana'); // 4
```

## 删除指定位置的元素 splice

**说明：** splice: 拼接；接合；使结婚。

`arr.splice(position, count)`：从第 `position` 个元素起，删除 `count` 个元素，改变原数组。

`splice()` 方法始终都会返回一个数组，该数组中包含从原始数组中删除的项（如果没有删除任何项，则会返回一个空数组）。

```javascript
let vegetables = ['Cabbage', 'Turnip', 'Radish', 'Carrot'];
let pos = 1,
  n = 2;
let removedItems = vegetables.splice(pos, n);

console.log(vegetables); // ["Cabbage", "Carrot"] (the original array is changed)
console.log(removedItems); // ["Turnip", "Radish"]
```

## 将元素插入到指定位置 splice

`arr.splice(position, 0, item)`：从第 `position` 个元素起，删除 0 个元素，插入 `item`，改变原数组。

`splice()` 方法始终都会返回一个数组，该数组中包含从原始数组中删除的项（如果没有删除任何项，则会返回一个空数组）。

```javascript
let myFish = ['angel', 'clown', 'mandarin', 'surgeon'];

let removed = myFish.splice(2, 0, 'drum');
//运算后的 myFish 为 ["angel", "clown", "drum", "mandarin", "surgeon"]
//被删除元素数组 removed 为 []，没有元素被删除
```

## 替换指定位置的元素 splice

`arr.splice(position, 1, item)`：从第 `position` 个元素起，删除 1 个元素，插入 `item`，改变原数组。

`splice()` 方法始终都会返回一个数组，该数组中包含从原始数组中删除的项（如果没有删除任何项，则会返回一个空数组）。

```javascript
let myFish = ['angel', 'clown', 'mandarin', 'surgeon'];

let removed = myFish.splice(2, 1, 'drum');
//运算后的 myFish 为 ["angel", "clown", "drum", "mandarin", "surgeon"]
//被删除元素数组 removed 为 []，没有元素被删除
```

## 复制数组

1.  通过数组的 `slice()` 方法（浅复制）

```javascript
let fruits = ['Strawberry', 'Banana', 'Mango'];

// 浅复制
let shallowCopy = fruits.slice();
```

2.  通过 `JSON.stringify()` 和 `JSON.parse()` 方法（深复制）

```javascript
let fruits = ['Strawberry', 'Banana', 'Mango'];

// 深复制
let deepCopy = JSON.parse(JSON.stringify(fruits));
```

## 数组转字符串

1.  toString

**注意：** 不要使用 `toLocalString`，存在不确定性。

```javascript
let fruits = ['Strawberry', 'Banana', 'Mango'];
let str = fruits.toString(); // "Strawberry,Banana,Mango"
```

2.  join

```javascript
let fruits = ['Strawberry', 'Banana', 'Mango'];
let str = fruits.join(','); // "Strawberry,Banana,Mango"
```

## 数组排序

### 反序 reverse

```javascript
let fruits = ['Strawberry', 'Banana', 'Mango'];
fruits.reverse();
console.log(fruits); // ["Mango", "Banana", "Strawberry"]
```

### 自定义排序 sort

1.  直接调用 `sort()` 方法会按 **升序** 重排数组项---最小的值位于最前面，最大的值排在最后面。

**说明：** 为了实现排序，`sort()` 方法会调用每个数组项的 `toString()` 转型方法，然后比较得到的字符串，以确定如何排序。即使数组中的每一项都是数值，`sort()` 方法也会先将其转化为字符串再进行比较。

```javascript
let fruits = ['Strawberry', 'Banana', 'Mango'];
fruits.sort();
console.log(fruits); // ["Banana", "Mango", "Strawberry"]

let values = [0, 1, 5, 10, 15];
values.sort();
console.log(values); // [0, 1, 10, 15, 5]
```

为什么 '10' 和 '15' 在 '5' 前面？

**注意：** `sort()` 方法根据测试字符串的结果改变原来的顺序，虽然元素 5 小于 10，但在进行字符串比较时，'10' 则位于 '5' 的前面。

2.  传入排序函数 `sort(compare)`

```javascript
let values = [0, 8, 1, 18, 5];

// 此方法返回的是正序
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
console.log(values); // [0, 1, 5, 8, 18]
```

**注意：** `value1 < value2` 返回 -1（负值） 表示正序，返回 1（正值） 表示倒序。

```javascript
// 此方法返回的是正序
function compare(value1, value2) {
  return value1 - value2;
}
```

## 数组连接

`concat()` 方法用于合并两个或多个数组；此方法不会更改现有数组，而是返回一个新数组。

**注意：**

* 对象引用（非对象直接量）：`concat()` 方法会复制对象引用放到组合的新数组里，原数组和新数组中的对象引用都指向同一个实际的对象，所以当实际的对象被修改时，两个数组也同时会被修改。
* 字符串和数字（是原始值，而不是包装原始值的 String 和 Number 对象）：`concat()` 方法会复制字符串和数字的值放到新数组里。

```javascript
// 连接两个数组
let arr1 = ['a', 'b', 'c'],
  arr2 = ['d', 'e', 'f'];

let arr3 = arr1.concat(arr2);

console.log(arr3); // ["a", "b", "c", "d", "e", "f"] (results in a new array)
console.log(arr1); // ["a", "b", "c"]
console.log(arr2); // ["d", "e", "f"]

// 连接多个数组
let num1 = [1, 2, 3],
  num2 = [4, 5, 6],
  num3 = [7, 8, 9];

let nums = num1.concat(num2, num3); // 组成新数组[1, 2, 3, 4, 5, 6, 7, 8, 9]; 原数组 num1, num2, num3 未被修改

// 将非数组值合并到数组里
let alpha = ['a', 'b', 'c'];

let alphaNumeric = alpha.concat(1, [2, 3]); // 组成新数组 ["a", "b", "c", 1, 2, 3], 原alpha数组未被修改
```
