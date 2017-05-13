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

## 安装(环境：Centos 7)

```shell
# 安装
yum install nginx

# 查看nginx版本
nginx -v
```

<!-- more -->

## 编辑配置文件

```shell
# 安装lrzsz(Xshell环境下用于文件上传和下载)，如已安装请忽略
yum install lrzsz

# 切换到nginx配置文件目录
cd /etc/nginx

# 从服务器取出nginx.conf文件
sz nginx.conf

# 修改nginx.conf后，上传
rz -y

# 重新加载nginx配置
systemctl reload nginx.service
```

