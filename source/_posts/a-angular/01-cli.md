---
layout: post
title: @angular/cli
author: Simple
tags:
  - cli
categories:
  - Angular
comments: true
date: 2017-09-18 23:30:00

---

## 基础语法

### 安装 & 更新
``` bash
yarn global add @angular/cli

# 查看版本
ng --version

# 更新 @angular/cli
yarn global remove @angular/cli
yarn cache clean
yarn global add @angular/cli@latest
```

### 新建项目
``` bash
ng new [name]

# 新建项目时不安装依赖(默认安装)
ng new [name] --skip-install
# 或, 简写
ng new [name] -si

# 新建项目时使用 scss (默认为 css)
ng new [name] --style=scss

# 新建项目时安装路由(默认不安装)
ng new [name] --routing

# 综合
ng new [name] -si --routing --style=scss
```

### 新建模块、组件、服务等
``` bash
# 新建模块
ng g module [path/name]

# 新建组件
ng g component [path/name]

# 其他支持命令行创建的模块
component、directive、pipe、service、class、guard、interface、enum、module
```

### 开发模式
``` bash
# 开启 dev 模式
ng server

# 开启 dev 模式(自动打开浏览器)
ng server -o

# 自定义端口号
ng server --port=4201
```

### 生产构建
``` bash
ng build --prod
```


## 参考

1. [angular-cli](https://github.com/angular/angular-cli)

