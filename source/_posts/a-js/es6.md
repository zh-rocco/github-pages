---
layout: post
title: ECMAScript 6 入门
tags:
  - es6
categories:
  - JavaScript
comments: true
date: 2017-05-02 11:50:00
updated: 2018-03-02 16:50:00
---

## 变量

### 1. 二进制和八进制字面量

ECMAScript 很早就支持十六进制字面量（通过在字面量中添加 `0x` 作为前缀来表示）。在 ES6 中，可以通过在字面量中分别添加 `0b` 或 `0o` 作为前缀来表达二进制和八进制字面量。

<!-- more -->

```javascript
const num = {
  dec: 15, //10进制
  hex: 0xf, //16进制
  oct: 0o17, //8进制
  binary: 0b1111 //2进制
};

console.log(num.dec === num.hex); //true
console.log(num.dec === num.oct); //true
console.log(num.dec === num.binary); //true
```

### 2. 字符串模板和插值

ES6 引入了 **重音符** 字符串字面量（backtick string literal）。这个字面量允许使用重音符 (**`**) 表示支持字符串插值的字符串字面量。

> 重音符通常隐藏在美式键盘的左上角，位于 ESC 下方。

```javascript
let character = {
  firstName: 'Snow',
  lastName: 'Jon',
  age: '20'
};

let message = `The character '${character.firstName} ${character.lastName}' is ${character.age} years old.`;
console.log(message); //The character 'Snow Jon' is 20 years old.
```

### 3. 变量声明：let 和 const

#### let：

建议将 `var` 替换为 `let`，`let` 不可以重新声明；`var` 声明的变量作用域为包围它的函数，而 `let` 声明的变量作用域仅在它所在的块中。除此之外，`let` 的操作与 `var` 完全相同：

```javascript
var msg = 'Howdy';
var msg = 'Hello there'; //acceptable, just reassigns

let message = `This is your message.`;
let message = `This is another message.`; //ERROR!
```

#### const：

使用 `const` 声明的变量绝对不能修改：

```javascript
const message = `This is your message.`;
message = `This is your second message.`; //ERROR
```

尽管使用 `const` 声明的变量不能更改其值，但该变量指向的 object 不是常量，所以它仍是可修改的：

```javascript
const person = {
  name: 'Jon',
  age: 20
};
person = { name: 'Jon', age: 18 }; //ERROR
person.age = 18; //person.age -> 18
```

> 对象的属性或数组成员可以修改。

### 4. 代码块范围

```javascript
for (var p = 0; p < 5; p++) {
  setTimeout(function() {
    console.log(p); //55555
  }, 1000);
}
for (let q = 0; q < 5; q++) {
  setTimeout(function() {
    console.log(q); //01234
  }, 1000);
}
```

### 5. 解构赋值

_解构赋值_（destructuring assignment）允许从一个 **对象或数组** 向多个变量赋值：

```javascript
let names = ['Ted', 'Jenni', 'Athen'];
let [a, b, c] = names;
console.log(a); //Ted
console.log(a, b, c); //Ted Jenni Athen
```

> 注意：将变量声明放在数组中。这些括号告诉 ECMAScript，等号右侧需要一个数组。如果数组中的元素比声明的变量要多，那么数组中剩余的元素将被丢弃。（这些值仍在原数组中 — 数组的值被复制到变量中，原数组不受影响。）如果数组中的值比声明的变量少，ECMAScript 将为所有剩余的变量填入值 `undefined`。

对象也可以执行类似的解构类型：

```javascript
let point = { x: 2, y: 5 };
let { y, x } = point;
console.log(x, y); //console: 2 5
```

> 解构发生在对象上，并通过在右侧对象中找到同名的变量来绑定变量。也就是说，即使我们以相反顺序编写变量，x 的值仍会收到 point.x，y 仍会收到 point.y：

## 函数

### 1. 函数参数

> ES6 为函数调用引入了默认参数、剩余参数和展开运算符。

#### 默认参数：

```javascript
/* Before */
var sayHello = function(message) {
  if (message === undefined) {
    message = 'Hello World';
  }
  console.log(message);
};
sayHello(); //Hello World
sayHello('Hello'); //Hello

/* Now */
let sayHello = function(message = 'Hello World') {
  console.log(message);
};
sayHello(); //Hello World
sayHello('Hello'); //Hello
```

#### 剩余参数：

定义函数或方法来接受一个或多个固定参数，后跟一组通过用户定义方式细化或修改调用的可选参数。

在过去，可以通过访问静默构建并传递给每个函数调用的内置 `arguments` 参数来实现此目的：

```javascript
/* Before */
function greet(name) {
  var args = Array.prototype.slice.call(arguments, greet.length);
  console.log('Hello', name);
  if (args !== undefined)
    args.forEach(function(arg) {
      console.log(arg);
    });
}
greet('Jon'); //Hello Jon
greet('Jon', 'is', 'a', 'POV');
/*
 * Hello Jon
 * is
 * a
 * POV
 * */

/* Now */
function greet(name, ...args) {
  console.log('Hello', name);
  args.forEach(function(arg) {
    console.log(arg);
  });
}
greet('Jon'); //Hello Jon
greet('Jon', 'is', 'a', 'POV');
/*
* Hello Jon
* is
* a
* POV
* */
```

#### 展开运算符：

展开运算符（Spread operator）在某些方面与剩余参数的概念正好相反。剩余参数将会收集传入某个给定调用的一些可选值，展开运算符获取一个值数组并 “展开” 它们，基本上讲，就是解构它们以用作被调用的函数的各个参数。

```javascript
/* 使用展开运算符进行串联 */
let arr1 = [0, 1, 2];
let arr2 = [...arr1, 3, 4, 5];
console.log(arr2); //[0, 1, 2, 3, 4, 5]

/* 函数调用中的展开运算符 */
function printPerson(first, last, age) {
  console.log(first, last, age);
}
let args = ['Jon', 'Snow', 20];
printPerson(...args); //Jon Snow 20
```

> 注意：不同于剩余参数，展开运算符是在调用点上使用，而不是在函数定义中使用。

### 2. 函数语法和语义

#### 箭头函数：

> 箭头函数不能直接取代函数关键字。一般而言，应该继续使用 `function` 定义方法（即与一个对象实例关联的函数）。为与对象无关的场景保留箭头函数，比如 `Array.forEach` 或 `Array.map` 调用的主体。因为箭头函数对待 `this` 的方式与普通函数不同，所以在方法定义中使用它们可能导致意料之外的结果。

从 ES6 开始，可以使用所谓的粗箭头（与细箭头相对）创建函数字面量，就像这样：

```javascript
/* Before */
let names = ['Jon', 'Arya', 'Brandon'];
names.forEach(n => console.log(n));
/*
 * Jon
 * Arya
 * Brandon
 * */
```

有零或多个参数时，必须使用括号 ()。如果只有一个参数，可以选择省略括号：

```javascript
names.forEach(n => console.log(n));
```

如果主体代码不止一条语句或表达式，则必须使用花括号，而且返回的值必须通过 `return` 语句返回给调用方

#### 词法 this：

```javascript
let bob = {
  firstName: 'Snow',
  lastName: 'Jon',
  displayMe: function() {
    for (let m in this) {
      console.log(m, '=', this[m]);
    }
  }
};
bob.displayMe();
```

上面的 `this` 显然引用了实例 bob，并且打印出 `firstName`、`lastName` 和 `displayMe` 方法（因为它也是该对象的成员）的名称和值。

当在一个存在于全局范围的函数中引用 `this` 时，情况会变得有点怪异：

```javascript
let displayThis = function() {
  for (let m in this) {
    console.log(m);
  }
};
displayThis();
```

当在全局范围内的函数使用时，`this` 引用全局范围对象，在上面的情况中，打印出全局范围的每个成员，包括顶级全局变量、函数和对象（比如上面的示例中的 `console`）。

```javascript
let displayThis = function() {
  for (let m in this) {
    console.log(m);
  }
};
displayThis(); // this == global object
let bob = {
  firstName: 'Bob',
  lastName: 'Robertson',
  displayMe: displayThis
};
bob.displayMe(); // this == bob
```

> 箭头函数在定义函数时使用 `this` 值，而不是在执行它时。

> **采用规则：** 完全理解新 `this` 规则可能需要一段时间。新箭头函数规则并不总是这么直观。作为开发人员，可以对 “内联” 函数使用箭头函数，对方法使用传统函数。这么做，各个方面都会按预期工作。

#### 生成器函数：

```javascript
/* 一个使用生成器的有限值流 */
function* getName() {
  yield 'Ted';
  yield 'Charlotte';
  yield 'Michael';
  yield 'Matthew';
}
let names = getName();
console.log(names.next().value); //Ted
console.log(names.next().value); //Charlotte
console.log(names.next().value); //Michael
console.log(names.next().value); //Matthew
console.log(names.next().value); //undefined
```

> 该函数将按顺序打印出每个名称，当它用完所有名称时，它会不停地打印 `undefined`。

> 在语法上，`yield` 关键字看起来类似于 `return`，但事实上，它表示
> “返回但记住我在此函数中的位置，以便下次调用它时，从离开的位置开始执行。”
> 这显然比传统的 `return` 更复杂。新语法旨在尽可能地模拟迭代器。

#### for-of 关键字：

```javascript
function* fibonacci() {
  //a generator function
  yield 0;
  yield 1;
  let [prev, curr] = [0, 1];
  while (true) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

for (let n of fibonacci()) {
  console.log(n);

  //By the way, this is an infinite stream, so this loop will never terminate unless you break out of it
  //try 'while (true)' -> 'while (curr < 1000)'
}
```

## JavaScript 中的类

### 1. 对象简史

JavaScript 最初被设想和宣传为 Java 的轻量型版本，所以它通常被认为是一种面向对象的传统语言。得益于 `new` 关键词，它似乎在语法上类似于过去常常在 Java 或 C++ 中看到的语法。

事实上，JavaScript 不是基于类的环境，而 **是一个基于对象的环境**。如果你不熟悉或仅偶尔参与面向对象的开发，JavaScript 可能对您无关紧要，但理解它们的区别仍然很重要。
**在基于对象的环境中，不存在类。**
每个对象是从另一个现有对象克隆而来的，而不是来自类。**当克隆一个对象时，会保持对其原型对象的*隐式*引用。**

在基于对象的环境中工作有其优势，但在没有基于类的概念（比如属性和继承）的情况下能执行的操作上也存在局限。
ECMAScript 技术委员会曾经试图将面向对象的元素集成到 JavaScript 中，而不牺牲它的独特风格。在 ES6 中，委员会最终找到了实现途径。

### 2. 类定义

```javascript
/* 构造类实例 */
class Person {
  constructor(firstName, lastName, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
}

let ted = new Person('Ted', 'Neward', 45);
console.log(ted); //An object
```

### 3. 属性和封装

```javascript
/* 定义属性 */
class Person {
  constructor(firstName, lastName, age) {
    //console.log(arguments);
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }

  get firstName() {
    return this._firstName;
  }

  set firstName(value) {
    this._firstName = value;
  }

  get lastName() {
    return this._lastName;
  }

  set lastName(value) {
    this._lastName = value;
  }

  get age() {
    return this._age;
  }

  set age(value) {
    this._age = value;
  }
}

let ted = new Person('Ted', 'Neward', 45);
console.log(ted);
for (let m in ted) {
  console.log(m, ted[m]);
}
/*
* 仅以下属性是可枚举的：
* _firstName Ted
*_lastName Neward
* _age 45
* */
```

请注意 `getter` 和 `setter`（根据 ECMAScript 规范中的官方规定）是如何引用字段名称的，字段名称添加了一条下划线作为前缀。这意味着 Person 现在有 6 个函数和 3 个字段 - 每个属性有 2 个函数和 1 个字段。不同于其他语言，ECMAScript 中的 `property` 语法不会在创建属性时静默地引入后备存储字段。（后备存储 是存储数据的地方 - 换句话说，是实际字段本身。）

属性不需要逐个地直接反映类的内部状态。事实上，属性的封装性质很大程度上是为了部分或完整地隐藏内部状态：

### 4. 原型继承

```javascript
/* 原型继承 */
class Person {
  //... as before
}

class Author extends Person {
  constructor(firstName, lastName, age, subject) {
    super(firstName, lastName, age);

    this.subject = subject;
  }

  get subject() {
    return this._subject;
  }

  set subject(value) {
    this._subject = value;
  }

  writeArticle() {
    console.log(this.firstName, 'just wrote an article on', this.subject);
  }
}
let mark = new Author('Mark', 'Richards', 55, 'Architecture');
mark.writeArticle(); //Mark just wrote an article on Architecture
```

## 标准库中的新对象和类型

### 1. 模块

```javascript
/* 导出 output 函数 */
//output.js
export function output() {
  console.log('OUT: ', arguments);
}
```

在函数前输入关键字 export，这会告诉 ECMAScript 需要将此文件作为模块对待。因此，该函数将可供其他任何导入它的文件使用：

```javascript
/* 导入 output.js */
import { out } from 'output.js';
out("I'm using output!");
```

如果想获取从一个模块导出的所有名称，可以使用通配符 (\*) 导入语法，但您需要定义一个模块名称来限定它们的范围：

> 推荐使用上面的具名导入 `import {out} from 'output.js';`，

```javascript
/* 使用通配符导出 */
import * as Output from 'output.js';
Output.out("I'm using output!");
```

### 2. 符号

> Symbol 确保名称不会冲突。

如果你需要隐藏一些字段，可以先让它们可通过 `Symbol` 名称访问，而不是通过之前的标准字符串进行访问：

```javascript
class Person {
  constructor(firstName, lastName, age) {
    this[firstNameS] = firstName;
    this[lastNameS] = lastName;
    this[ageS] = age;
  }
}

let p = new Person('Fred', 'Flintstone', 45);
console.log(p['firstName']); // "undefined"
for (let m in p) {
  console.log(m, '=', p[m]);
} //不会有任何输出

p.firstName = 'Barney';
console.log(p['firstName']); //"Barney"
console.log(p[firstNameS]); //"Fred"
```

使用 `Symbol` 函数创建 `Symbol` 的实例。然后，每个实例可在关注的对象上用作名称。如果有人尝试 **使用正常的基于 String 的名称（比如 firstName）访问该字段，将会获得 `undefined`，** 因为数据不再位于该名称下。根据新规范，**JavaScript 在标准对象迭代期间甚至不会显示基于 `Symbol` 的名称**。任何尝试使用跨该对象的传统反射的行为都将失败。
**如果调用者拥有 firstName 的 `Symbol` 实例，依然可以访问到该字段的数据。**

Symbol 的主要功能是帮助程序员避免库之间的名称冲突：

```javascript
let fibonacci = {
  [Symbol.iterator]: function*() {
    let pre = 0,
      cur = 1;
    for (;;) {
      let temp = pre;
      pre = cur;
      cur += temp;
      yield cur;
    }
  }
};

for (let n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 1000) break;
  console.log(n);
}
```

### 3. 集合类型

> ES6 向标准 JavaScript 环境添加了两个集合类型： Map 和 Set。

#### Map：

Map 是一组 **名称/值对**，与 ECMAScript 对象非常相似。不同之处在于，Map 包含的方法使它比原始 ECMAScript 对象更容易使用：

1.  `get()` 和 `set()` 将分别查找和设置键/值对
2.  `clear()` 将完全清空集合
3.  `keys()` 返回 Map 中的键的一个可迭代集合
4.  `values()` 返回 Map 中的值的一个可迭代集合

另外，像 Array 一样，Map 包含受函数语言启发的方法，比如 `forEach()` 在 Map 自身上运行。

```javascript
let m = new Map();
m.set('key1', 'value1');
m.set('key2', 'value2');
m.forEach((value, key, map) => {
  console.log(key, '=', value, ' from ', map);
});
/*
 * key1 = value1  from  Map {"key1" => "value1", "key2" => "value2"}
 * key2 = value2  from  Map {"key1" => "value1", "key2" => "value2"}
 * */
console.log(m.keys());
console.log(m.values());
```

#### Set：

Set 看起来更像传统的对象集合，因为对象可简单地添加到集合中。但 Set 会依次检查每个对象，以确保它们未与集合中已存在的值重复：

```javascript
let s = new Set();
s.add('Ted');
s.add('Jenni');
s.add('Athen');
s.add('Ted'); //重复
console.log(s.size); //3
```

像 Map 一样，Set 之上也拥有方法，使它可以执行函数式交互，比如 `forEach()`。**从根本上讲，Set 像一个数组**，但没有尖角括号。它动态增长，而且 **缺少任何形式的排序机制。如果使用 Set，您不能像数组一样按索引来查找对象。**

#### 弱引用：

如果一个被用作 WeakMap 键/值对的对象仅能跟随从 WeakMap 内开始的引用链访问，那么这个键/值对就无法访问，会自动从 WeakMap 删除。
WeakSet 同样如此。

它们主要用于库代码（尤其是与缓存相关的代码），在应用程序代码中可能不会过多地出现。

## 参考：

[面向 JavaScript 开发人员的 ECMAScript 6 指南](https://www.ibm.com/developerworks/cn/web/wa-ecmascript6-neward-p1/index.html)
