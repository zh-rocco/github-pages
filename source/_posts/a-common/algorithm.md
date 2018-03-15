---
layout: post
title: 算法相关
tags:
  - algorithm
categories:
  - Common
comments: true
date: 2017-08-12 16:50:00
updated: 2018-03-15 20:50:00
---

## 复杂度

常见的时间复杂度有：

* 常数阶 `O(1)`
* 对数阶 `O(logN)`
* 线性阶 `O(n)`
* 线性对数阶 `O(nlogN)`
* 平方阶 `O(n^2)`
* 立方阶 `O(n^3)`
* !k 次方阶 `O(n^k)`
* 指数阶 `O(2^n)`

随着问题规模 n 的不断增大，上述时间复杂度不断增大，算法的执行效率越低。

<!-- more -->

### 分析算法的复杂度

```javascript
let i = 0; // 语句执行一次
while (i < n) {
  // 语句执行 n 次

  console.log(`Current i is ${i}`); // 语句执行 n 次
  i++; // 语句执行 n 次
}
```

根据注释可以得到，算法复杂度为 `1 + n + n + n = 1 + 3n`，去除常数项，为 `O(n)`。

```javascript
let number = 1; // 语句执行一次
while (number < n) {
  // 语句执行 logN 次
  number *= 2; // 语句执行 logN 次
}
```

上面代码 `while` 的跳出判断条件是 `number < n`，而循环体内 `number` 增长速度是`(2^n)`，所以循环代码实际执行 `logN` 次，复杂度为：`1 + 2 * logN = O(logN)`。

```javascript
for (let i = 0; i < n; i++) {
  // 语句执行 n 次
  for (let j = 0; j < n; j++) {
    // 语句执行 n^2 次
    console.log('I am here!'); // 语句执行 n^2 次
  }
}
```

上面代码是两个 `for` 循环嵌套，很容易得出复杂度为：`O(n^2)`。

### 快速斐波那契算法

> 题目：求斐波那契数列（兔子数列） 1,1,2,3,5,8,13,21,34,55,89...中的第 n 项。

下面的代码中 `count` 记录递归的次数。

```javascript
// 快速算法（使用缓存）
let count = 0;
function fn(n) {
  let cache = {};
  function _fn(n) {
    if (cache[n]) return cache[n];
    count++;
    if (n == 1 || n == 2) return 1;
    const prev = _fn(n - 1);
    cache[n - 1] = prev;
    const next = _fn(n - 2);
    cache[n - 2] = next;
    return prev + next;
  }
  return _fn(n);
}

// 普通算法
let count2 = 0;
function fn2(n) {
  count2++;
  if (n == 1 || n == 2) return 1;
  return fn2(n - 1) + fn2(n - 2);
}

console.log(fn(20), count); // 6765 20
console.log(fn2(20), count2); // 6765 13529
```

### 快排和二分查找

快排和二分查找都基于一种叫做「分治」的算法思想，通过对数据进行分类处理，不断降低数量级，实现 `O(logN)`（对数级别，比 `O(n)` 这种线性复杂度更低的一种）的复杂度。

#### 快速排序

快排的大概流程是：

1.  随机选择数组中的一个数 A，以这个数为基准。
2.  其他数字跟这个数进行比较，比这个数小的放在其左边，大的放到其右边。
3.  经过一次循环之后，A 左边为小于 A 的，右边为大于 A 的。
4.  这时候将左边和右边的数再递归上面的过程。

具体代码如下：

```javascript
const arr = [85, 24, 63, 45, 17, 31, 96, 50];
function quickSort(arr) {
  const length = arr.length;
  if (length <= 1) return arr;
  const pivotIndex = Math.floor(length / 2);
  const pivot = arr.splice(pivotIndex, 1)[0];
  let left = [];
  let right = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  // 递归
  return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort(arr));
```

#### 二分查找

二分查找法主要是解决「在一堆有序的数中找出指定的数」这类问题，不管这些数是一维数组还是多维数组，只要 **有序**，就可以用二分查找来优化。

二分查找的大概流程是：

1.  数组中排在中间的数字 A，与要找的数字比较大小。
2.  因为数组是有序的，所以：
    * A 较大则说明要查找的数字应该从前半部分查找
    * A 较小则说明应该从查找数字的后半部分查找。
3.  这样不断查找缩小数量级（扔掉一半数据），直到找完数组为止。

> 题目：在一个二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

```javascript
function Find(target, array) {
  let i = 0;
  let j = array[i].length - 1;
  let length = array.length;
  while (i < length && j >= 0) {
    if (array[i][j] < target) {
      i++;
    } else if (array[i][j] > target) {
      j--;
    } else {
      return true;
    }
  }
  return false;
}

console.log(Find(10, [[1, 2, 3, 4], [5, 9, 10, 11], [13, 20, 21, 23]]));
```

> 题目：现在我有一个 1~1000 区间中的正整数，需要你猜下这个数字是几，你只能问一个问题：大了还是小了？问需要猜几次才能猜对？

其实这个问题就是个二分查找的算法时间复杂度问题，二分查找的时间复杂度是 `O(logN)`，所以求 `log1000` 的解就是猜的次数。我们知道 `2^10=1024`，所以可以快速估算出：`log1000` 约等于 10，最多问 10 次就能得到这个数！
