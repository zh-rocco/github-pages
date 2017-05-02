---
layout: post
title: JS 中的相等性判断
author: Simple
tags:
  - JavaScript
categories:
  - JavaScript
comments: true
date: 2017-05-02 11:50:00

---

JavaScript 提供三种不同的比较操作符：

1. 严格相等，使用 `===`。
2. （非严格）相等，使用 `==`。
3. 以及 `Object.is`。（ES 6 新特性）

<!-- more -->

## 严格相等 ===

1. 一个值只与自身全等。
2. 浮点数 `0` 不分正负，全等操作符认为 `+0` 和 `-0` 全等。
3. 全等操作符认为 `NaN` 与其他任何值都不全等，包括它自己。（等式 `(x !== x)` 成立的唯一情况是 `x` 的值为 `NaN`）

```javascript
console.log(-0 === +0); //true
console.log(-1 === +1); //false
console.log(NaN === NaN); //false

console.log(null === null); //true
console.log(undefined === undefined); //true
```

## 非严格相等 ==

1. 相等操作符比较两个值是否相等，在比较前将两个被比较的值转换为相同类型 **（String、Boolean 都会先转化为 `number` 型）**。
2. 在转换后（等式的一边或两边都可能被转换），最终的比较方式等同于全等操作符 `===` 的比较方式。
3. 相等操作符满足交换律。

```javascript
console.log(2 == true); //false
console.log('2' == true); //false
console.log(2 == false); //false
console.log('2' == false); //false

console.log(1 == true); //true
console.log(0 == false); //true
```

**注意：** 进行非严格相等比较时，布尔值会转化为 `number` 型，`true` -> `1`，`false` -> `0`

## Object.is

`Object.is(value1, value2)`;

> 返回一个布尔值，表明传入的两个值是否是同一个值。

```javascript
Object.is([], []); //false
Object.is(-0, +0); //false
Object.is(NaN, NaN); //true
```

## === == Object.is 比较

![image](https://github.com/no-nothing/fe-notes/blob/master/assets/if-equal/compare.jpg)

## 一些例题

### Question 1

奇特的 `++[[]][+[]]+[+[]]` ：

```javascript
let c = ++[[]][+[]]+[+[]];
console.log(c); //10
```

#### 解答：

> **复习：** [运算符优先级（MDN）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

**详细计算过程：**

1. 先把 `++[[]][+[]]+[+[]]` 分解一下：

```javascript
++[[]][+[]]
+
[+[]]
```

2. 在 JS 里，`+` 可以把其他类型转化成 `number`，这里可以把空数组转化成 0：

```javascript
console.log( +[] === 0 ); //true
```

所以 `++[[]][+[]]+[+[]]` 变成：

```javascript
++[[]][0]
+
[0]
```

3. `[[]][0]` 表示从 `[[]]` 中取出第一个元素，所以：

```javascript
++[]
+
[0]
```

4. '2' 里说过 **`+` 可以把其他类型转化成 `number`**，`++` 也可以把其他类型转化成 `number`，并且再增加 1：

```javascript
1
+
[0]
```

5. 在 JS 中 `[0] == '0'` 是真：

```javascript
console.log([0] == '0'); //true
```

所以：

```javascript
1
+
'0'
```

6. 最后 `++[[]][+[]]+[+[]]` 转化为 `1 + '0'`，**number + string = string**，所以最后得 `'10'`。

## 参考：

1. [JavaScript 中的相等性判断（MDN）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness)
2. 针对布尔值的隐式转换：

![针对布尔值的隐式转换](https://segmentfault.com/img/bVr9H6)
