---
layout: post
title: firewall 开启/关闭指定端口访问
author: Simple
tags:
  - firewalld
categories:
  - Linux
comments: true
date: 2017-05-15 09:30:00

---

*环境：CentOS-7，root用户*

## 安装

``` bash
# 查看版本
firewall-cmd --version

# 若无法获取版本信息，执行安装命令

# 安装
yum install firewalld firewall-config
```

<!-- more -->

## 基本命令

``` bash
# 获取 firewalld 状态
firewall-cmd --state

# 查看开启的端口列表
firewall-cmd --list-ports

# 查看 public 下开启的端口列表
firewall-cmd --zone=public --list-ports
```

## 开启/关闭指定端口

``` bash
# 启动 firewalld
systemctl start firewalld.service

# 重启 firewalld
systemctl restart firewalld.service

# 开机自启 firewalld
systemctl enable firewalld.service

# 关闭开机自启 firewalld
systemctl disable firewalld.service

# firewalld 默认会关闭所有端口访问

# 开启 80 端口(此时只有 80 端口可以访问)
firewall-cmd --zone=public --add-port=80/tcp --permanent

# 重新加载防火墙，生效新添的规则
firewall-cmd --reload
```

