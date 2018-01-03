---
layout: post
title: MySQL 5.7 安装教程（Windows 平台）
author: Simple
tags:
  - mysql
categories:
  - MySQL
comments: true
date: 2018-01-02 22:30:00
---

## 安装 MySQL

1. 选择免安装版 mysql，[官网下载](https://dev.mysql.com/downloads/mysql/)。

2. 将下载的 zip 包解压至 `D:\Program Files\` 目录。

3. 将 mysql 的 bin 目录（`D:\Program Files\mysql-5.7.20-winx64\bin`）添加至系统环境变量。

4. 新建 mysql.ini，并编辑内容为：

   ```plain
   [mysqld]
   basedir=D:\Program Files\mysql-5.7.20-winx64\
   datadir=D:\Program Files\mysql-5.7.20-winx64\data\
   port=3306
   skip-grant-tables

   # basedir 表示 mysql 安装路径
   # datadir 表示 mysql 数据文件存储路径
   # port 表示 mysql 端口
   # skip-grant-tables 表示忽略密码
   ```

5. 以管理员权限启动 CMD 或 PowerShell，并将路径切换至 MySQL 的 bin 目录（`D:\Program Files\mysql-5.7.20-winx64\bin`），然后输入 `mysqld -install`。

6. 命令行输入 `mysqld --initialize` 自动生成带随机密码的 root 用户。

7. 命令行输入 `net start mysql` 启动 mysql 服务。

8. 修改 root 用户的随机密码：

   * 打开 mysql 安装目录下的 data 文件夹（`D:\Program Files\mysql-5.7.20-winx64\data`）；
   * 找到 `*.err` 格式的文件，打开，搜索 `root@localhost:`，复制后面的密码；
   * 命令行输入 `mysql -u root -p`，键入密码，以 root 身份进入 mysql 管理界面；
   * 进入 mysql 管理界面后（出现 `mysql>` 标识）键入 `SET PASSWORD FOR "root"@"localhost" = PASSWORD("123456");`（注意不要漏掉最后的 `;`）；
   * 命令行输入 `flush privileges;` 刷新权限；
   * 命令行输入 `quite` 推出 mysql 管理界面；

9. 修改 mysql.ini 文件删除最后一句 `skip-grant-tables`；

10. 命令行输入 `net stop mysql` 停止 mysql 服务；

11. 命令行输入 `net start mysql` 重启 mysql 服务；

## 参考

1. [MySQL 5.7 免安装版配置](http://blog.csdn.net/qq_33472557/article/details/77861692/)
2. [【解决方案】MySQL-5.7.9 服务无法启动-“NET HELPMSG 3534”](http://blog.csdn.net/i_am_wangbo/article/details/49999407/)
3. [MySQL 修改 root 密码的多种方法](https://www.cnblogs.com/liufei88866/p/5619215.html)
