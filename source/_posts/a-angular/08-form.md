---
layout: post
title: 表单
author: Simple
tags:
  - form
categories:
  - Angular
comments: true
date: 2017-09-24 18:00:00

---

## 模板式表单

**适用于简单表单。**

### 常用指令
#### 1. NgForm
*会创建一个 `FormGroup` 的实例.*

1. 默认情况下 Angular 会给 form 标签添加 `NgForm` 指令, 来接管 form 处理, 例如即使添加 `action="/postForm"`, 点击提交页面也不会跳转.
2. 不想让 Angular 接管表单的话要在 form 标签上添加 `NgNoForm` 指令.
3. `NgForm` 会隐式创建一个 `FormGroup` 类, 来存储表单数据.
4. `NgForm` 可以用于其他标签(不限于 form 标签), 例如 `<div NgForm></div>`, 会被渲染为 form 表单.
5. 在 form 标签上添加本地模板指令 `#myForm="ngForm"`, 可以在模板中访问 `NgForm` 创建的对象.
6. `NgForm` 下提交表单会触发 `ngSubmit` 事件, 将 `(ngSubmit)="onSubmit(myForm.value)"` 添加到 form 标签上, 可以在 `onSubmit` 方法中提交表单.

#### 2. NgModel
*会创建一个 `FormControl` 的实例.*

1. 为 `NgForm` 下的 input 标签添加 `ngModel` 指令(注意: 此处不同于数据双向绑定 `[(ngModel)]`), 然后给 input 标签添加 name 属性, 可以把 input 的值绑定到 `ngForm` 对象上.
   例如: `<input type="text" #username="ngModel" ngModel name="username">`.

#### 2. NgModelGroup
*会创建一个 `FormGroup` 的实例.*

用于 `NgModel` 分组.


## 响应式表单

**适用于复杂表单。**

### FormControl

