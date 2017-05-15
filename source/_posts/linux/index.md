---
layout: post
title: Linux 基础与常用命令
author: Simple
tags:
  - bash
  - systemd
categories:
  - Linux
comments: true
date: 2017-05-13 10:50:00

---

## 起步

``` bash
命令行前的 [root@localhost ~]# 是什么

root:        当前登录用户
localhost:   主机名
~:           当前所在目录（家目录）
#:           超级用户的提示符（普通用户的提示符是$）
```

``` bash
# 查看当前目录索引
pwd
```

<!-- more -->

## Linux文件权限

``` bash
-rw-r--r-- (其中, r: 读, w: 写, x: 执行)
共10位

第1位:     文件类型(共7种, 常用3种 -: 文件, d: 目录, l: 快捷方式)
第2~4位:   所有者(u)权限
第5~7位:   所属组(g)权限
第8~10位:  其他人(o)权限
```

## Shell 和 Bash

### 1. 常用快捷键

- `ctrl+c`    强制终止当前命令；
- `ctrl+l`    清屏；
- `ctrl+a`    光标移动到命令行首；
- `ctrl+e`    光标移动到命令行尾；
- `ctrl+u`    从光标所在位置删除到行首；
- `ctrl+z`    把命令放入后台；
- `ctrl+r`    在历史命令中 搜索；
- `Tab`       自动补全目录或者命令

### 2. 管道符

**多命令顺序执行：**

``` bash
命令1 ;  命令2    多个命令顺序执行，命令之间没有任何逻辑联系
命令1 && 命令2    逻辑与，只有当命令1正确执行，则执行命令2
命令1 || 命令2    逻辑或，只有当命令1执行不正确，才执行命令2
```

**管道符：（命令1 和 2 有数据传递）**

``` bash
# 命令1的正确输出作为命令2的操作对象
命令1 | 命令2
```

### 3. 通配符

``` bash
?      ：匹配一个任意字符；
*      ：匹配0个或任意多个任意字符，也就是可以匹配任何内容；
[ ]    ：匹配中括号内的任意一个字符，例如：[abc] 代表一定匹配一个字符，或者是a、或者是b、或者是c；
[ - ]  ：匹配中括号内的任意一个字符，- 代表一个范围，例如：[a-z] 代表匹配一个小写字母；
[ ^ ]  ：逻辑非，表示匹配不是中括号内的一个字符，例如：[^0-9] 代表匹配一个不是数字的字符；
```

### 4. 第一个脚本

**1. 首先新建并打开一个文件**

``` bash
vim hello.sh
# 或者
vi hello.sh
```

**2. 然后编辑内容**

``` bash
#!/bin/bash            脚本开头必须内容
#The first program     注释
echo -e "hello"
```

**3. 脚本执行**

``` bash
# 赋予脚本执行权限，直接运行
chmod 755 hello.sh

# 然后相对路径调用
./hello.sh  

# 或者绝对路径调用
/root/hello.sh

# 或者通过 Bash 调用执行脚本
bash hello.sh
```

## 文件操作

### 目录复制

``` bash
# 把 folder1 里面的文件和文件夹等复制到 folder2 目录下
cp -rf folder1/* folder2
```

### 目录移动

``` bash
# 把 folder1 里面的文件和文件夹等移动到 folder2 目录下
mv folder1/* folder2
```

### 目录重命名

``` bash
# 把 folder1 重命名为 folder2
mv folder1 folder2
```

### 文件/目录删除

``` bash
# 删除文件
rm <文件名>

# 删除目录
rm -rf <目录名>
```

**参考:**
1. [linux下文件夹的创建、复制、剪切、重命名、清空和删除命令](http://blog.csdn.net/numbibi/article/details/8026841)

## Systemd

``` bash
# 立即激活单元
systemctl start <单元>

# 立即停止单元：
systemctl stop <单元>

# 重启单元：
systemctl restart <单元>

# 重新加载配置：
systemctl reload <单元>

# 输出单元运行状态：
systemctl status <单元>

# 检查单元是否配置为自动启动：
systemctl is-enabled <单元>

# 开机自动激活单元：
systemctl enable <单元>

# 取消开机自动激活单元：
systemctl disable <单元>
```

**参考:**
1. [systemd-ArchWiki](https://wiki.archlinux.org/index.php/Systemd)
2. [Systemd 入门教程：命令篇](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)
