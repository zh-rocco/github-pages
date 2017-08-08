---
layout: post
title: Yarn
author: Simple
tags:
  - yarn
categories:
  - Node
comments: true
date: 2017-08-08 12:30:00

---

*[Yarn 官网](https://yarnpkg.com/)*


## 安装

[官方教程](https://yarnpkg.com/zh-Hans/docs/install)


## npm 迁移

|feature|npm|yarn|
|:---|:---|:---|
|初始化项目|`npm init`|`yarn init`|
|安装依赖包|`npm i`|`yarn install`|
|重新安装依赖包|`rm -rf node_modules && npm install`|`yarn upgrade`|
|安装生产依赖包|`npm i -S [package]`|`yarn add [package]`|
|安装开发依赖包|`npm i -D [package]`|`yarn add [package] -D`|
|全局安装包|`npm i -g [package]`|`yarn global add [package]`|
|全局更新包|`npm update -g  `|`yarn global upgrade`|
|移除生产依赖包|`npm uninstall -S [package]`|`yarn remove [package]`|
|移除开发依赖包|`npm uninstall -D [package]`|`yarn remove [package]`|
|清缓存|`npm cache clean`|`yarn cache clean`|
|查看全局安装的包|`npm list -g --depth=0`|`yarn global ls`|
|发布/登录/登出|`npm publish/login/logout`|`yarn publish/login/logout`|
|查看源|`npm config get registry`|`yarn config get registry`|
|设置源|`npm config set registry 'http://r.cnpmjs.org/'`|`yarn config set registry 'http://r.cnpmjs.org/'`|


## 解答

1. Windows 下 `yarn global add [package]` 后，新安装的包无法在命令行调用：重新打开命令行界面。
2. Yarn 安装慢：换源。
  ``` bash
# 安装 yrm
yarn global add yrm

# 查看源
yrm ls

# 测试源的延迟
yrm test npm
yrm test cnpm
yrm test taobao

# 使用速度最快的源（这里演示使用 cnpm）
yrm use cnpm
```

