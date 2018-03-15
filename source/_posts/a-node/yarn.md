---
layout: post
title: npm & yarn
tags:
  - npm
  - yarn
categories:
  - Node
comments: true
date: 2017-11-08 12:30:00
updated: 2018-03-09 16:50:00
---

[安装 yarn](https://yarnpkg.com/zh-Hans/docs/install)

<!-- more -->

## 常用命令

| npm                                            | yarn                                                    | 功能             |
| :--------------------------------------------- | :------------------------------------------------------ | :--------------- |
| `npm init`                                     | `yarn init`                                             | 初始化项目       |
| `npm i`                                        | `yarn install` 或 `yarn`                                | 安装依赖包       |
| `rm -rf node_modules && npm i`                 | `yarn upgrade`                                          | 重新安装依赖包   |
| `npm i [package] -S`                           | `yarn add [package]`                                    | 安装生产依赖包   |
| `npm i [package] -D`                           | `yarn add [package] -D`                                 | 安装开发依赖包   |
| `npm i [package] -g`                           | `yarn global add [package]`                             | 全局安装包       |
| `npm update -g`                                | `yarn global upgrade`                                   | 全局更新包       |
| `npm uninstall [package] -S`                   | `yarn remove [package]`                                 | 移除生产依赖包   |
| `npm uninstall [package] -D`                   | `yarn remove [package]`                                 | 移除开发依赖包   |
| `npm cache clean`                              | `yarn cache clean`                                      | 清缓存           |
| `npm list -g --depth=0`                        | `yarn global list`                                      | 查看全局安装的包 |
| `npm login/logout/publish`                     | `yarn login/logout/publish`                             | 登录/登出/发布   |
| `npm config list`                              | `yarn config list`                                      | 查看全局配置     |
| `npm config get registry`                      | `yarn config get registry`                              | 查看源（全局）   |
| `npm config set registry http://r.cnpmjs.org/` | `yarn config set registry https://registry.yarnpkg.com` | 设置源（全局）   |
| `npm help`                                     | `yarn help`                                             | 帮助             |

## 常见问题

### 1. 依赖包安装慢

```bash
# 更换淘宝源
npm config set registry https://registry.npm.taobao.org
yarn config set registry https://registry.npm.taobao.org

# 或者 npm 下使用 nrm
npm i nrm -g
# 查看源
nrm ls
# 测试源的延迟
nrm test
# 使用速度最快的源（这里演示使用 taobao）
nrm use taobao

# 或者 yarn 下使用 yrm
yarn global add yrm
# 查看源
yrm ls
# 测试源的延迟
yrm test
# 使用速度最快的源（这里演示使用 taobao）
yrm use taobao
```

### 2. 安装 puppeteer node-sass phantomjs 失败

**1. npm**

项目根目录下增加 .npmrc 配置文件

```plain
puppeteer_download_host=https://npm.taobao.org/mirrors/
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/
```

或者，修改 npm 全局配置

```bash
# 设置 puppeteer taobao源
npm config set puppeteer_download_host https://npm.taobao.org/mirrors/
# 设置 node-sass taobao源
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
# 设置 phantomjs taobao源
npm config set phantomjs_cdnurl https://npm.taobao.org/mirrors/phantomjs/
# 查看 config 信息
npm config list
```

**2. yarn**

yarn 没有类似于 .npmrc 的配置文件，只能修改 yarn 全局配置

```bash
# 设置 puppeteer taobao源
yarn config set puppeteer_download_host https://npm.taobao.org/mirrors/
# 设置 node-sass taobao源
yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
# 设置 phantomjs taobao源
yarn config set phantomjs_cdnurl https://npm.taobao.org/mirrors/phantomjs/
# 查看 config 信息
yarn config list
```
