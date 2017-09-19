---
layout: post
title: angular 基础
author: Simple
tags:
  - basics
categories:
  - Angular
comments: true
date: 2017-09-19 23:30:00

---

## 基础介绍

### 组件

``` typescript
/* app.component.ts */
import { Component } from '@angular/core'; // 导入 Component 类

// @: 装饰器, 用以附加元数据; 装饰器里的属性(如: selector, templateUrl, styleUrls 等)就叫做元数据
// 这里叫做组件元数据装饰器
@Component({
  selector: 'app-root', // 此组件可以通过 <app-root></app-root> 标签调用
  templateUrl: './app.component.html', // 模板
  styleUrls: ['./app.component.scss']
})
// AppComponent 是一个 typescript 类, 定义了当前组件的控制器
// 控制器: 一个被 Component 装饰器装饰的 typescript 类
export class AppComponent {
  title = 'app';
}
```

1. 装饰器、模板、控制器为组件的必备元素，模板与控制器有数据绑定.
2. 组件可选的可注入对象还有：输入属性(`@Inputs()`)、提供器(`providers`)、生命周期钩子(`Lifecycle Hooks`)等.
   - 输入属性：用于接收外部传入的数据，父组件直接传递数据给子组件；
   - 提供器：用于依赖注入；
   - 生命周期钩子：组件从创建到销毁之间可以用来触发业务逻辑的"钩子函数"；
3. 组件可选的输出对象：生命周期钩子(`Lifecycle Hooks`)、样式表(`styles`)、动画(`Animations`)、输出属性(`@Outputs`).

### 模块

``` typescript
/* app.module.ts */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// 此装饰器的元数据有: declarations, imports, providers, bootstrap 等
@NgModule({
  // 此处只能声明 Component(组件), Directive(指令) 和 Pipe(管道)
  declarations: [AppComponent],
  // 此处声明当前模块 AppModule 正常运行依赖的其他模块
  imports: [BrowserModule, AppRoutingModule],
  // 此处只能声明 Service(服务)
  providers: [],
  // 此处声明模块的主组件
  bootstrap: [AppComponent]
})
// 同样是一个带着装饰器的 typescript 类
export class AppModule {}
```

### 启动过程

**查看 .angular-cli.json 文件**

``` json
/* .angular-cli.json */
{
  ...,
  "apps": [
    {
      "root": "src",
      "outDir": "dist",
      "assets": ["assets", "favicon.ico"],
      "index": "index.html", // 启动时加载了 src/index.html 页面
      "main": "main.ts", // 启动时加载了 src/main.ts 脚本
      "polyfills": "polyfills.ts",
      "test": "test.ts",
      "tsconfig": "tsconfig.app.json",
      "testTsconfig": "tsconfig.spec.json",
      "prefix": "app",
      "styles": ["styles.scss"],
      "scripts": [],
      "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
      }
    }
  ],
  ...
}
```

1. 启动时加载了哪个页面？
2. 启动时加载了哪些脚本？
3. 这些脚本做了什么事？

``` typescript
/* src/main.ts */
import { enableProdMode } from '@angular/core'; // 此模块用来关闭 angular 的开发者模式
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; // 此模块告诉 angular 使用哪个模块来启动整个应用

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// 如果当前为生产环境, 就调用 enableProdMode() 方法, 来关闭 angular 的开发者模式
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule) // 调用 AppModule 启动整个应用
  .catch(err => console.log(err));

// 此处为 angular 应用运行的起点, 然后 angular 会分析 AppModule 及其所有子模块的所有依赖, 当加载完这些依赖后,
// angular 会在 src/index.html 内寻找 AppModule 的主组件(AppComponent)内声明的 selector 标签, 一般为 <app-root></app-root>,
// 然后 angular 会用主组件(AppComponent)的模板替换掉 <app-root></app-root> 的内容.

// 其他说明: 在替换掉 <app-root></app-root> 之前会先显示 <app-root></app-root> 标签内的内容.
```

### 引入第三方库

#### 1. 安装依赖

``` bash
yarn add jquery
yarn add bootstrap
```

#### 2. 修改 .angular-cli.json 文件

``` json
/* .angular-cli.json */
{
  ...,
  "apps": [
    {
      ...,
      "styles": [
        "styles.scss",
        "../node_modules/bootstrap/dist/css/bootstrap.min.css"
      ],
      "scripts": [
        "../node_modules/jquery/dist/jquery.min.js",
        "../node_modules/bootstrap/dist/js/bootstrap.min.js"
      ],
      ...
    }
  ],
  ...
}
```

#### 3. 安装 `@types/**`

让 typescript 认识 javascript 库.

``` bash
yarn add @types/jquery -D
yarn add @types/bootstrap -D
```

#### 4. 修改 tsconfig.app.json 文件

``` json
/* tsconfig.app.json */
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../out-tsc/app",
    "baseUrl": "./",
    "module": "es2015",
    "types": ["jquery"] // 添加 jquery
  },
  "exclude": ["test.ts", "**/*.spec.ts"]
}
```



## 参考

1. [Angular引入第三方库](http://blog.csdn.net/yuzhiqiang_1993/article/details/71215232)

