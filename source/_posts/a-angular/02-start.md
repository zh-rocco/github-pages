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
#### 示例代码
``` typescript
/* app.component.ts */
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
}
```

#### 说明:
1. 首先使用 `import` 导入 `Component` 类.
2. `@`: 装饰器, 用以附加元数据.
   - 装饰器是一个函数;
   - 装饰器里的属性(如: selector, templateUrl, styleUrls 等)叫做元数据;
   - `@Component` 装饰器来将一个类标记为 Angular 组件(component);
3. `@Component` 里的 `selector` 声明使得当前组件可以通过 `<app-root></app-root>` 标签调用.
4. AppComponent 是一个 typescript 类, 定义了当前组件的控制器.
   控制器: 一个被 `@Component` 装饰器装饰的 typescript 类.
5. 装饰器、模板、控制器为组件的必备元素, 模板与控制器之间有数据绑定.
6. 组件可选的可注入对象还有: 输入属性(`@Inputs()`), 提供器(`providers`), 生命周期钩子(`Lifecycle Hooks`)等.
   - 输入属性: 用于接收外部传入的数据, 父组件直接传递数据给子组件;
   - 提供器: 用于依赖注入;
   - 生命周期钩子: 组件从创建到销毁之间可以用来触发业务逻辑的"钩子函数";
7. 组件可选的输出对象: 生命周期钩子(`Lifecycle Hooks`), 样式表(`styles`), 动画(`Animations`), 输出属性(`@Outputs`).


### 模块
#### 示例代码
``` typescript
/* app.module.ts */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

#### 说明:
1. `@NgModule` 装饰器的元数据有: declarations, imports, providers, bootstrap 等.
2. `declarations`: 此处只能声明 Component(组件), Directive(指令) 和 Pipe(管道).
3. `imports`: 此处声明当前模块 AppModule 正常运行依赖的其他模块.
4. `providers`: 此处只能声明 Service(服务).
5. `bootstrap`: 此处声明模块的主组件.
6. AppModule 同样也是一个带着装饰器的 typescript 类.


### 启动过程
#### 问题
1. 启动时加载了哪个页面？
2. 启动时加载了哪些脚本？
3. 这些脚本做了什么事？

#### 说明
angular 启动时加载 `src/index.html` 页面, 执行 `src/main.ts` 脚本, 详情查看 **.angular-cli.json** 文件.

**main.ts介绍：**

``` typescript
/* src/main.ts */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// 如果当前为生产环境, 就调用 enableProdMode() 方法, 关闭 angular 的开发者模式
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
```

1. 引入 `enableProdMode` 模块用来关闭 angular 的开发者模式.
2. 引入 `platformBrowserDynamic` 模块告诉 angular 使用哪个模块来启动整个应用.
3. `platformBrowserDynamic().bootstrapModule(AppModule)` 调用 AppModule 模块来启动整个应用.
4. 此处为 angular 应用运行的起点, 然后 angular 会分析 AppModule 及其所有子模块的所有依赖, 当加载完这些依赖后, angular 会在 `src/index.html` 内寻找 AppModule 的主组件(AppComponent)内声明的 CSS 选择器, 一般默认为 `<app-root></app-root>`, 然后 angular 会用主组件(AppComponent)的模板替换掉 `<app-root></app-root>` 里的内容.
5. 在替换掉 `<app-root></app-root>` 之前会先显示 `<app-root></app-root>` 标签内的内容.


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

#### 3. 安装类型描述文件 `@types/**`
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

