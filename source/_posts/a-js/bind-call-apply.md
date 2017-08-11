---
layout: post
title: bind call apply
author: Simple
tags:
  - bind
  - call
  - apply
categories:
  - JavaScript
comments: true
date: 2017-08-11 11:30:00

---

## 语法

1. `func.bind(thisArg[, arg1[, arg2[, ...]]])`，返回值：返回由指定的 `this` 值和初始化参数改造的原函数拷贝；
1. `func.call(thisArg[, arg1[, arg2[, ...]]])`，返回值：无返回值；
1. `func.apply(thisArg, [argsArray])`，返回值：无返回值；


## 相同点

改变 `this` 指向，改变函数的 `arguments`


## 不同点

### 1. `bind()` 方法创建一个新的函数；`call()` 和 `apply()` 方法调用一个函数

**说明：**\
`func.bind(thisArg)` 后，函数 `func` 不会立即执行，要想执行需要 `func.bind(thisArg)()`；
`func.call(thisArg)`、`func.apply(thisArg)` 函数 `func` 会立即执行。

``` javascript
var name = 'window'
object = {}
object.name = 'object'
object.parent = function(arg1, arg2) {
    var _this = this
    function child() {
        console.log('child', this.name)
    }

    child() // console 输出: child window
    child.bind(_this) // 无输出，child 函数未执行
    child.bind(_this)() // console 输出: child object
    child.call(_this) // console 输出: child object
    child.apply(_this) // console 输出: child object
}

object.parent()
```


### 2. `bind()` 和 `call()` 方法接受的是若干个参数的列表，而 `apply()` 方法接受的是一个包含多个参数的数组

**说明：**\
`apply()` 方法如果要传入第二个参数，则第二个参数必须未数组，否则会报错。
``` javascript
object = {}
object.parent = function(arg1, arg2) {
    var _this = this

    function child() {
        console.log('child', arguments[0], arguments[1])
    }

    child() // console 输出: child undefined undefined
    child.bind(_this, arg1, arg2)() // console 输出: child hello world
    child.call(_this, arg1, arg2) // console 输出: child hello world
    child.apply(_this, [arg1, arg2]) // console 输出: child hello world
    child.apply(_this, arg1, arg2) // 报错
}

object.parent('hello', 'world')
```


## 其他

1. `bind()` 是 ES5 方法，不兼容 IE8 及其以下；
2. ES5 以后， `apply()` 第二个参数也可以接受类数组对象（如：`{'length': 2, '0': 'eat', '1': 'bananas'} `）；




## 参考

1. [MDN: `Function.prototype.bind()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
2. [MDN: `Function.prototype.call()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
3. [MDN: `Function.prototype.apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

