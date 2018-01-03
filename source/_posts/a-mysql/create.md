---
layout: post
title: 使用 Navicate 建库建表
author: Simple
tags:
  - mysql
categories:
  - MySQL
comments: true
date: 2018-01-02 22:30:00
---

## 安装 Navicate

1. [官网下载](https://www.navicat.com.cn/download/navicat-for-mysql/)。

2. 安装。

## 开启 MySQL 服务

1. 以管理员权限启动 CMD 或 PowerShell，键入 `net start mysql`。

## Navicate 连接数据库

1. 打开 Navicate，点击左上角的 **连接**，打开 **新建连接** 弹窗，输入连接名（MySQL）、密码，点击 **确定**。

2. 界面左侧出现刚才添加的 _连接_：MySQL，鼠标右键点击 MySQL，然后选择 **打开连接**，MySQL 变成绿色表示连接成功。

## 新建 blog 数据库

1. 鼠标右键点击 MySQL，打开 **新建数据库** 弹窗，输入数据库名（blog_db）、字符集（utf8）、排序规则（默认即可，空），点击 **确定**。

2. 鼠标右键点击刚才新建的数据库：blog_db，然后选择 **打开数据库**，blog_db 变成绿色表示数据库连接成功。

## 新建 article 数据表

1. 鼠标右键点击 blog_db 下的 **表**，然后选择 **新建表**，界面中部打开建表区。

2. 添加第一条记录，名：id、类型：int、长度：255、不是 null：选中、键：点击设为主键，底部默认，勾选自动递增、无符号。

3. 点击 **添加字段**，添加第二条记录，名：title、类型：varchar、长度：255、不是 null：选中。

4. 点击 **添加字段**，添加第三条记录，名：author、类型：varchar、长度：255、不是 null：选中。

5. 点击 **添加字段**，添加第四条记录，名：content、类型：varchar、长度：255、不是 null：选中。

6. 点击 **保存**，打开 **输入表名** 弹窗，输入 article，点击 **确定**。
