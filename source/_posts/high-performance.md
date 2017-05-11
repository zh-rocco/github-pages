---
layout: post
title: JavaScript 性能优化
author: Simple
tags:
  - performance
categories:
  - JavaScript
comments: true
date: 2017-05-02 11:50:00

---

### 1. 避免全局查找
在一个函数中会用到全局对象存储为局部变量来减少全局查找，因为访问局部变量的速度要比访问全局变量的速度更快些

``` js
function search() {
    //当我要使用当前页面地址和主机域名
    alert(window.location.href + window.location.host);
}
//最好的方式是如下这样，先用一个简单变量保存起来
function search() {
    var location = window.location;
    alert(location.href + location.host);
}
```

<!-- more -->

### 2. 字符串连接
在一个函数中会用到全局对象存储为局部变量来减少全局查找，因为访问局部变量的速度要比访问全局变量的速度更快些

``` js
/* 1 */
//如果要连接多个字符串，应该少使用 +=，如
s += a;
s += b;
s += c;

//应该写成：
s += a + b + c;

/* 2 */
//而如果是收集字符串，比如多次对同一个字符串进行 += 操作的话，最好使用一个缓存，使用JavaScript数组来收集，最后使用 join 方法连接起来
var buf = [];
for (var i = 0; i < 100; i++) {
    buf.push(i.toString());
}
var all = buf.join("");
```


### 3. 避免 with 语句
和函数类似，with语句会创建自己的作用域，因此会增加其中执行的代码的作用域链的长度，由于额外的作用域链的查找，在with语句中执行的代码肯定会比外面执行的代码要慢，**在能不使用with语句的时候尽量不要使用with语句。**

``` js
with(a.b.c.d) {
    property1 = 1;
    property2 = 2;
}
//可以替换为：
var obj = a.b.c.d;
obj.property1 = 1;
obj.property2 = 2;
```


### 4. 数字转换成字符串、浮点数转换成整型
1\. 最好用 `"" + num` 来将数字转换成字符串，虽然看起来比较丑一点，但事实上这个效率是最高的，性能上来说：
`("" + num) > String() > .toString() > new String()`

2\. 很多人喜欢使用 `parseInt()`，其实 `parseInt()` 是用于将字符串转换成数字，而不是浮点数和整型之间的转换，我们应该使用 `Math.floor()` 或者 `Math.round()`


### 5. 使用直接量
``` js
// 不要 var aTest = new Array(); //替换为：
var aTest = [];

// 不要 var aTest = new Object(); //替换为：
var aTest = {};

// 不要 var reg = new RegExp(); //替换为：
var reg = /../;

//如果要创建具有一些特性的一般对象，也可以使用字面量，如下：
var oFruit = new Object();
oFruit.color = "red";
oFruit.name = "apple";
//前面的代码可用对象字面量来改写成这样：
var oFruit = {color: "red", name: "apple"};
```


### 6. 使用 DocumentFragment 优化多次 append
一旦需要更新DOM，请考虑使用文档碎片来构建DOM结构，然后再将其添加到现存的文档中。

``` js
for (var i = 0; i < 1000; i++) {
    var el = document.createElement('p');
    el.innerHTML = i;
    document.body.appendChild(el);
}
//可以替换为：
var frag = document.createDocumentFragment();
for (var i = 0; i < 1000; i++) {
    var el = document.createElement('p');
    el.innerHTML = i;
    frag.appendChild(el);
}
document.body.appendChild(frag);
```


### 7. 使用一次 innerHTML 赋值代替构建DOM元素
对于大的DOM更改，使用innerHTML要比使用标准的DOM方法创建同样的DOM结构更快，但差别并不大。

``` js
var frag = document.createDocumentFragment();
for (var i = 0; i < 1000; i++) {
    var el = document.createElement('p');
    el.innerHTML = i;
    frag.appendChild(el);
}
document.body.appendChild(frag);
//可以替换为：
var html = [];
for (var i = 0; i < 1000; i++) {
    html.push('<p>' + i + '</p>');
}
document.body.innerHTML = html.join('');
```


### 8. 通过模板元素 clone 替代 createElement
使用 `cloneNode()` 可以减少属性的设置次数——同样如果需要创建很多元素，应该先准备一个样板节点。大多数浏览器中，克隆节点更有效率，但提高不多

``` js
var frag = document.createDocumentFragment();
for (var i = 0; i < 1000; i++) {
    var el = document.createElement('p');
    el.innerHTML = i;
    frag.appendChild(el);
}
document.body.appendChild(frag);
//替换为：
var frag = document.createDocumentFragment();
var pEl = document.getElementsByTagName('p')[0];
for (var i = 0; i < 1000; i++) {
    var el = pEl.cloneNode(false);
    el.innerHTML = i;
    frag.appendChild(el);
}
document.body.appendChild(frag);
```


### 9. 使用 firstChild 和 nextSibling 代替 childNodes 遍历DOM元素
老IE中，`nextSibling` 的效率更高，其他情况下，没太多差别

``` js
var nodes = element.childNodes;
for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    //……
}
//可以替换为：
var node = element.firstChild;
while (node) {
    //……
    node = node.nextSibling;
```


### 10. 删除DOM节点、使用事件代理
1\. 删除DOM节点之前，一定要删除注册在该节点上的事件, 否则将会产生无法回收的内存。另外，在 `removeChild` 和`innerHTML = ''`二者之间，尽量选择后者。因为在 sIEve(内存泄露监测工具)中监测的结果是用 `removeChild` 无法有效地释放DOM节点。

2\. 对于内容动态增加并且子节点都需要相同的事件处理函数的情况，可以把事件注册提到父节点上，这样就不需要为每个子节点注册事件监听了。


### 11. 重复使用的调用结果，事先保存到局部变量
使用 `cloneNode()` 可以减少属性的设置次数——同样如果需要创建很多元素，应该先准备一个样板节点。大多数浏览器中，克隆节点更有效率，但提高不多

``` js
//避免多次取值的调用开销
var h1 = element1.clientHeight + num1;
var h2 = element1.clientHeight + num2;
//可以替换为：
var eleHeight = element1.clientHeight;
var h1 = eleHeight + num1;
var h2 = eleHeight + num2;
```


### 12. 循环优化
1\. 减值迭代：大多数循环使用一个从0开始、增加到某个特定值的迭代器，在很多情况下，从最大值开始，在循环中不断减值的迭代器更加高效；

2\. 简化终止条件：避免属性查找或者其它的操作，最好是将循环控制量保存到局部变量中；

3\. 简化循环体：循环体是执行最多的，所以要确保其被最大限度的优化；

4\. 使用后测试循环：循环中 `for(var elem in ...)` 的效率极差，尽量少用。`while` 循环的效率要优于 `for` 循环，`for` 循环和 `while` 循环都是前测试循环，而如 `do-while` 这种后测试循环，可以避免最初终止条件的计算，因此运行更快；

5\. 使用查表法替代循环：
``` js
var results = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10];
return results[value];
```


### 13. 避免双重解释
1\. 尽量少使用 `eval` 函数：使用 `eval` 相当于在运行时再次调用解释引擎对内容进行运行，需要消耗大量时间，而且使用 `eval` 带来的安全性问题也是不容忽视的。

2\. 不要使用Function构造器：不要给 `setTimeout` 或者 `setInterval` 传递字符串参数。
``` js
var num = 0;
setTimeout('num++', 10);
//可以替换为：
var num = 0;
function addNum() {
    num++;
}
setTimeout(addNum, 10);
```


### 14. 缩短否定检测
``` js
if (oTest != '#ff0000') {
    //do something
}
if (oTest != null) {
    //do something
}
if (oTest != false) {
    //do something
}
//虽然这些都正确，但用逻辑非操作符来操作也有同样的效果：
if (!oTest) {
    //do something
}
```


### 15. 条件分支
1\. 将条件分支，按可能性顺序从高到低排列：可以减少解释器对条件的探测次数；

2\. 条件分支多(>2)时，使用 `switch` 优于 `if`：`switch` 分支选择的效率高于 `if`，在IE下尤为明显。4分支的测试，IE下 `switch` 的执行时间约为 `if` 的一半；

3\. 使用三目运算符替代条件分支：
``` js
if (a > b) {
    num = a;
} else {
    num = b;
}
//可以替换为：
num = a > b ? a : b;
```


### 16. 使用常量
1\. 重复值：任何在多处用到的值都应该抽取为一个常量；

2\. 用户界面字符串：任何用于显示给用户的字符串，都应该抽取出来以方便国际化；

3\. URLs：在Web应用中，资源位置很容易变更，所以推荐用一个公共地方存放所有的URL；

4\. 任意可能会更改的值：每当你用到字面量值的时候，你都要问一下自己这个值在未来是不是会变化，如果答案是“是”，那么这个值就应该被提取出来作为一个常量。


### 17. 避免与 null 进行比较
1\. 如果值应为一个引用类型，使用 `instanceof` 操作符检查其构造函数；

2\. 如果值应为一个基本类型，作用 `typeof` 检查其类型；

3\. 如果是希望对象包含某个特定的方法名，则使用 `typeof` 操作符确保指定名字的方法存在于对象上。


### 18. 避免全局变量
``` js
myNameSpace = function () {
    var current = null;

    function init() {
        //...
    }

    function change() {
        //...
    }


    function verify() {
        //...
    }

    //所有需要在命名空间外调用的函数和属性都要写在return里面
    return {
        init: init,
        //甚至你可以为函数和属性命名一个别名
        set: change
    };
};
```


### 19. 循环引用 ？
如果循环引用中包含DOM对象或者ActiveX对象，那么就会发生内存泄露。

``` js
function init() {
    var el = document.getElementById('MyElement');
    el.onclick = function () {
        //……
    }
}
init();
```

`init` 在执行的时候，当前上下文我们叫做 `context`。这个时候，`context` 引用了 `el`，`el` 引用了 `function`，`function` 引用了 `context`；这时候形成了一个循环引用。

**解决方案：**

1\. 置空DOM对象：将 `el` 置空，`context` 中不包含对DOM对象的引用，从而打断循环应用：
``` js
function init() {
    var el = document.getElementById('MyElement');
    el.onclick = function () {
        //……
    };
    try {
        return el;
    } finally {
        el = null;
    }
}
init();
```

2\. 构造新的 `context`：把 `function` 抽到新的 `context` 中，这样，`function` 的 `context` 就不包含对 `el` 的引用，从而打断循环引用：
``` js
function elClickHandler() {
    //……
}
function init() {
    var el = document.getElementById('MyElement');
    el.onclick = elClickHandler;
}
init();
```


### 20. 释放DOM元素占用的内存、释放 JavaScript 对象
1\. 将DOM元素的 `innerHTML` 设置为空字符串，可以释放其子元素占用的内存；

2\. 及时释放对对象的引用，让GC能够回收这些内存控件；

3\. 对象：`obj = null`；

4\. 对象属性：`delete obj.myproperty`；

5\. 数组item：使用数组的 `splice` 方法释放数组中不用的item；


### 21. 松散耦合
1\. `JavaScript` 和 `HTML` 的紧密耦合：直接写在 `HTML` 中的 `JavaScript`、使用包含内联代码的 `<script>` 元素、使用 `HTML` 属性来分配事件处理程序等；

2\. `HTML` 和 `JavaScript` 的紧密耦合：`JavaScript` 中包含 `HTML`，然后使用 `innerHTML` 来插入一段 `HTML` 文本到页面；

3\. 解耦 CSS/JavaScript
显示问题的唯一来源应该是 `CSS`，行为问题的唯一来源应该是 `JavaScript`，层次之间保持松散耦合才可以让你的应用程序更加易于维护，所以像以下的代码 `element.style.color = "red"` 尽量改为 `element.className = "edit"`，而且不要在 `CSS` 中通过表达式嵌入 `JavaScript`；

4\. 解耦应用程序/事件处理程序
将应用逻辑和事件处理程序相分离：**一个事件处理程序应该从事件对象中提取**，并将这些信息传送给处理应用逻辑的某个方法中。这样做的好处首先可以让你更容易更改触发特定过程的事件，其次可以在不附加事件的情况下测试代码，使其更易创建单元测试；


### 22. == 和 === 的区别
`==` 和 `!=` 操作符会进行类型强制转换。

``` js
var valueA = "1";
var valueB = 1;
if (valueA == valueB) {
    alert("Equal");
} else {
    alert("Not equal");
}
//output: "Equal"
if (valueA === valueB) {
    alert("Equal");
} else {
    alert("Not equal");
}
//output: "Not equal"
```


### 23. 何时用单引号，何时用双引号
虽然在 `JavaScript` 当中，双引号和单引号都可以表示字符串, 为了避免混乱，建议在 `HTML` 中使用双引号，在 `JavaScript` 中使用单引号，但为了兼容各个浏览器，也为了解析时不会出错，定义 `JSON` 对象时，最好使用双引号。


### 24. 函数返回统一类型
`JavaScript` 是弱类型的，对于函数来说，前面返回整数型数据，后面返回布尔值在编译和运行都可以正常通过，但为了规范和以后维护时容易理解，应保证函数应返回统一的数据类型。

### 25. 浏览器 UI 线程
1\. 每个时刻只有其中的一个操作得以执行，也就是 `JavaScript` 代码运行时用户界面不能对输入产生反应，反之亦然。管理好JS运行时间对网页应用的性能很重要；

2\. 一个单一的JS操作应当使用的总时间（最大）是100毫秒，如果有些JS任务因为复杂性原因不能在100毫秒或更少的时间内完成，这种情况下，理想方法是让出对UI线程的控制，让UI更新可以进行，用定时器让出时间片；

3\. 定时器小于15将在IE中导致浏览器锁定，所以最小值建议为25毫秒；

4\. 低频率的重复定时器（间隔在1秒或1秒以上），几乎不影响整个网页应用的响应；

5\. 多个重复定时器使用更高的频率（间隔在100到200毫秒之间）性能更低，最好合并成一个单独的重复定时器，每次执行多个操作。


### 25. 性能方面的注意事项
1\. 尽量使用原生方法；

2\. `switch` 语句相对 `if` 较快，通过将 `case` 语句按照最可能到最不可能的顺序进行组织；

3\. 巧用 `||` 和 `&&` 布尔运算符；

``` js
function eventHandler(e) {
    if (!e) e = window.event;
}
//可以替换为：
function eventHandler(e) {
    e = e || window.event;
}
```