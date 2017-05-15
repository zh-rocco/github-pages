---
layout: post
title: nginx 入门
author: Simple
tags:
  - nginx
categories:
  - Linux
comments: true
date: 2017-05-13 22:50:00

---

*环境：CentOS-7，root用户*

## 安装

```shell
# 安装
yum install nginx

# 查看 nginx 版本
nginx -v
```

<!-- more -->

## 编辑配置文件

```shell
# 安装 lrzsz(Xshell环境下用于文件上传和下载)，如已安装请忽略
yum install lrzsz

# 切换到 nginx 配置文件目录
cd /etc/nginx

# 从服务器取出 nginx.conf 文件
sz nginx.conf

# 修改 nginx.conf 后，上传
rz -y

# 重新加载 nginx 配置
systemctl reload nginx.service
```

