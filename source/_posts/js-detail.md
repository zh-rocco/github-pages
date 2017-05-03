---
layout: post
title: 细说 JavaScript
author: Simple
tags:
  - JavaScript
categories:
  - JavaScript
comments: true
date: 2017-05-02 22:50:00

---

## 1. new 操作符

执行 `var obj = new Base();` 时相当于做了以下三件事：

``` js
var obj = {};
obj.__proto__ = Base.prototype;
Base.call(obj);
```

<!-- more -->

## 2. 原型和原型链

### 1. 构造函数、实例和原型对象的区别

实例就是通过构造函数创建的（`new`）。实例一创造出来就具有 `constructor` 属性（指向构造函数）和 `__proto__` 属性（指向原型对象）；

构造函数中有一个 `prototype` 属性，这个属性是一个指针，指向它的原型对象。

原型对象内部也有一个指针（`constructor`属性）指向构造函数，所以：`Person.prototype.constructor === Person; //true`

实例可以访问原型对象上定义的属性和方法。

![](http://box.kancloud.cn/2016-05-20_573ed07addb26.png)
在这里 `person1` 和 `person2` 就是实例，`prototype` 是他们的原型对象。

### 2. `__ptoto__` 属性

`__ptoto__` 属性（IE浏览器不支持）是实例指向原型对象的一个指针，它的作用就是指向构造函数的原型属性 `constructor`，通过这两个属性，就可以访问原型里的属性和方法了。

Javascript中的对象实例本质上是由一系列的属性组成的，在这些属性中，有一个内部的不可见的特殊属性—— `__proto__`，该属性的值指向该对象实例的原型，一个对象实例只拥有一个唯一的原型。

### 3. `__proto__` 属性和 `prototype` 属性的区别

`prototype` 是 `function` 对象中专有的属性。

`__proto__` 是普通对象的隐式属性，在 `new` 的时候，会指向 `prototype` 所指的对象；

`__ptoto__` 实际上是某个实体对象的属性，而 `prototype` 则是属于构造函数的属性。`__ptoto__` 只能在学习或调试的环境下使用。

### 4. 原型模式的执行流程

1. 先查找构造函数实例里的属性或方法，如果有，就立即返回。  
2. 如果构造函数的实例没有，就去它的原型对象里找，如果有，就立即返回

**总结：**

1. `构造函数.prototype` = 原型对象
2. `原型对象.constructor` = 构造函数(模板)
3. `原型对象.isPrototypeof(实例对象)` = 判断实例对象的原型是不是当前对象

### 5. 工厂模式 VS 构造函数

工厂模式解决了实例化对象大量重复的问题，但还有一个问题，那就是根本无法搞清楚他们到底是哪个对象的实例。

使用构造函数的方法，既解决了重复实例化的问题，又解决了对象识别的问题。

**使用构造函数的方法和工厂模式的不同之处在于：**

1. 构造函数方法没有显示的创建对象(`new Object()`);
2. 直接将属性和方法赋值给 `this` 对象；
3. 没有 `return` 语句


## 3. 闭包

### 1. 定义

闭包是指有权访问另一个函数作用域中的变量的**函数**；创建闭包的最常见的方式就是在一个函数内创建另一个函数，通过另一个函数访问这个函数的局部变量。

### 2. javascript的垃圾回收原理

1. 在javascript中，如果一个对象不再被引用，那么这个对象就会被GC回收；
2. 如果两个对象互相引用，而不再被第3者所引用，那么这两个互相引用的对象也会被回收。

### 2. 优缺点

**优点：**

1\. 让一个变量长期驻扎在内存中，局部变量的累加。

``` js
function outer(){
    var x=10;
    return function(){ //函数嵌套函数
        x++;
        console.log(x);
    }
}
var y = outer(); //外部函数赋给变量y
y(); //y函数调用一次，结果为11，相当于outer()()
y(); //y函数调用第二次，结果为12，实现了累加
```

2\. 模块化代码，减少全局变量的污染。

``` js
var abc = (function(){ //abc为外部匿名函数的返回值
    var a = 1;
    return function(){
        a++;
        console.log(a);
    }
})();
abc(); //2 ；调用一次abc函数，其实是调用里面内部函数的返回值
abc(); //3
```

3\. 私有成员的存在。

``` js
var aaa = (function(){
    var a = 1;
    function bbb(){
        a++;
        console.log(a);
    }
    function ccc(){
        a++;
        console.log(a);
    }
    return {
        b: bbb, //json结构
        c: ccc
    }
})();
aaa.b(); //2
aaa.c(); //3
```

**缺点：**

闭包的缺点就是常驻内存，会增大内存使用量，使用不当很容易造成内存泄露。

过度使用闭包会导致性能的下降。函数里放匿名函数，则产生了闭包。

内存泄露问题，由于IE的JS对象和DOM对象使用不同的垃圾收集方法，因此闭包在IE中会导致内存泄露问题，也就是无法销毁驻留在内存中的元素。

``` js
function closure(){
    var oDiv = document.getElementById('oDiv'); //oDiv用完之后一直驻留在内存中
    oDiv.onclick = function () {
        alert('oDiv.innerHTML'); //这里用oDiv导致内存泄露
    };
}
closure();
//最后应将oDiv解除引用来避免内存泄露
function closure(){
    var oDiv = document.getElementById('oDiv');
    var test = oDiv.innerHTML;
    oDiv.onclick = function () {
        alert(test);
    };
    oDiv = null;
}
```
