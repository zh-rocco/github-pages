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

<!-- more -->

#### 2. ngModel
*会创建一个 `FormControl` 的实例.*

1. 为 `NgForm` 下的 input 标签添加 `ngModel` 指令(注意: 此处不同于数据双向绑定 `[(ngModel)]`), 然后给 input 标签添加 name 属性, 可以把 input 的值绑定到 `ngForm` 对象上.
   例如: `<input type="text" #username="ngModel" ngModel name="username">`.

#### 2. NgModelGroup
*会创建一个 `FormGroup` 的实例.*

用于 `NgModel` 分组.


## 响应式表单

**适用于复杂表单。**

1. 区分模板式表单和响应式表单: 响应式表单 HTML 模板里是 `form*` 开头的指令; 模板式表单 HTML 模板里是 `ngModel, ngModelGroup`.
2. 响应式表单不可以通过 `#myForm` 这种模板本地变量引用.
3. 第一步创建一个数据模型, 第二步使用指令将 HTML 模板元素链接到创建的数据模型.

### 类名
#### 1. FormControl
是构成响应式表单的基本单位; 保存着与其关联 HTML 元素当前的值, 校验状态, 以及是否被点击过.

``` typescript
username: FormControl = new FormControl('aaa');
```

#### 2. FormGroup
既可以代表一个表单的一部分, 也可以代表整个表单, 是多个 FormControl 的集合.

``` typescript
formModel: FormGroup = new FormGroup({
  from: new FormControl(),
  to: new FormControl()
});
```

#### 3. FormArray
1. 类似于 FormGroup, 多了 length 属性.
2. 相较于 FormGroup, FormArray 通常用来代表一个可以增长的字段集合.
3. 无 key, 只能通过索引获取每个元素.

``` typescript
emails: FormArray = new FormArray([
  new FormControl('a@a.com'),
  new FormControl('a@b.com')
]);
```

### 指令
1. formControl(formControlName)
2. formGroup(formGroupName)
3. (formArrayName)

#### 说明
1. 给 form 标签添加 `[formGroup]="formModel"` 指令(其中 `formModel` 为一个 `FormGroup` 类型的数据模型), 会将表单变成响应式表单.
2. 给 form 标签添加 `(ngSubmit)="onSubmit()"` 指令, 可以在 `onSubmit` 方法中提交表单.
3. 给 formGroup 分组标签添加 `formGroupName="dateRange"`.
4. `formControlName` 指令必须声明在 `formGroup` 指令范围之内, 可以链接模板与数据模型, 如: `formControlName="from"`.
5. `formArrayName` 指令必须声明在 `formGroup` 指令范围之内.
6. `formControl` 指令不能声明在 `formGroup` 指令范围之内, 可以用 `formControlName` 指令.

#### 伪代码
``` html
<form [formGroup]="formModel" (submit)="onSubmit()">
  <div formGroupName="dateRange">
    起始日期: <input type="date" formControlName="from">
    截止日期: <input type="date" formControlName="to">
  </div>
  <ul formArrayName="emails">
    <li *ngFor="let email of formModel.get('emails').controls; let i = index;">
      <input type="email" [formControlName]="i">
    </li>
  </ul>
  <button type="button" (click)="addEmail()">增加 Email</button>
  <div>
    <button type="submit">保存</button>
  </div>
</form>
```

``` typescript
formModel: FormGroup = new FormGroup({
  dateRange: new FormGroup({
    from: new FormControl(),
    to: new FormControl()
  }),
  emails: new FormArray([
    new FormControl('a@a.com'),
    new FormControl('a@b.com')
  ])
});

onSubmit() {
  console.log(this.formModel.value);
}

// 动态增加 FormControl
addEmail() {
  let emails = this.formModel.get('emails') as FormArray;
  emails.push(new FormControl());
}
```


