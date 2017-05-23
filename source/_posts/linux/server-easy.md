---
layout: post
title: 服务器配置 - 简易版
author: Simple
tags:
  - lrzsz
  - openssl
  - nginx
  - https
  - systemctl
  - firewall
  - pm2
categories:
  - Linux
comments: true
date: 2017-05-23 00:10:00
updated: 2017-05-23 00:10:00

---

*环境：腾讯云服务器，64位 CentOS-7，root用户*

## 连接服务器

### 打开多个 Shell 界面

鼠标移到已经连接的服务器 **标签**（标红处）上，点击右键，选择 **复制SSH渠道**。

![Xshell复制SSH渠道](/images/article/xshell-copy-ssh.jpg)

**参考：**
1. [腾讯云服务器部署 Node.js 应用](http://www.yedanbo.com/post/2017/qcloud-deploy-nodejs-application/)

<!-- more -->

## 更新系统和软件包

``` bash
yum clean all
yum update
yum upgrade
```

## 安装必备软件

### 安装 lrzsz（Xshell 环境下用于文件上传和下载）

``` bash
yum install lrzsz
```

### 安装 OpenSSL

``` bash
# 查看已安装的 SSL 版本
openssl version

# 若提示 command not found，安装 openssl
yum install openssl openssl-devel
```

### 安装 Nginx

``` bash
# 安装 Nginx
yum install nginx

# 查看 Nginx 版本
nginx -V

# 启动 Nginx
nginx
```

### 安装 Git

``` bash
# 安装 Git
yum install git

# 查看 Git 版本
git --version
```

### 安装 Node 和 PM2

``` bash
# 安装 Node.js
yum install nodejs

# 查看 Node 版本
node -v
# 查看 NPM 版本
npm -v

# 全局安装 PM2
npm i -g pm2
```

## 搭建 Blog

### 部署 Node 服务器环境

``` bash
# 我将博客放在了 /home 挂载点内
# 将 Node 静态服务模板克隆到 /home/blog 目录下
git clone https://github.com/no-nothing/server.git /home/blog

# 切换到 blog 目录内
cd /home/blog

# 安装依赖
npm i
```

### 部署 Blog 页面

``` bash
# 克隆自己的 Blog 页面到 /home/blog/public 目录下
git clone https://github.com/no-nothing/no-nothing.github.io.git /home/blog/public
```

**或者上传本地的 Blog 页面：**

先将本地的网页压缩成 zip 包（Centos 默认支持解压 zip 文件）

``` bash
# 切换到 blog 目录内
cd /home/blog

# 上传
rz -y

# 解压缩包到 /home/blog/public 目录下
unzip 压缩包名.zip -d /home/blog/public
```

### 启用 Node 服务

``` bash
# 切换到 blog 目录内
cd /home/blog

# 以 blog 为 PM2 进程名称
pm2 start app.js --name blog

# 设置 pm2 启动的服务开机自启
pm2 save
pm2 startup
```

现在可以通过 IP地址:3000 访问刚才部署的 Blog 了。

## 开启防火墙

### 安装

``` bash
# 查看版本
firewall-cmd --version

# 若提示 command not found，安装 firewalld
yum install firewalld firewall-config
```

### 开启/关闭指定端口

``` bash
# 启动 firewalld
systemctl start firewalld.service

# 获取 firewalld 状态
firewall-cmd --state

# 开机自启 firewalld
systemctl enable firewalld.service

# firewalld 默认会关闭所有端口访问

# 开启 80 端口(此时只有 80 端口可以访问)
# --permanent 永久
firewall-cmd --zone=public --add-port=80/tcp --permanent

# 启用https服务
firewall-cmd --zone=public --add-service=https --permanent

# 开启 443 端口(https)
firewall-cmd --zone=public --add-port=443/tcp --permanent

# 重新加载防火墙，生效新添的规则
firewall-cmd --reload

# 查看 public 下开启的端口列表
firewall-cmd --zone=public --list-ports
```

## 配置 Nginx（同时开启https）

*需要先完成域名解析*

### 获取证书

1. 打开[腾讯云-SSL证书管理](https://console.qcloud.com/ssl)，点击 **申请证书**，按提示一步步操作；
2. 下载证书；
3. 解压下载好的压缩包，选择符合自己服务环境的证书；

### 将证书上传至服务器

``` bash
# 我是通过 yum install nginx 安装的 nginx，所以 nginx 根目录在 /etc/nginx
cd /etc/nginx

# 创建 ssl 文件夹存放证书
mkdir ssl

cd ssl

# 通过 lrzsz (Xshell环境下用于文件上传和下载)上传证书
rz
# 选择 *.crt 和 *.key 两个文件
```

### 修改 nginx 配置文件

#### 1. 从服务器取出 nginx.conf 文件

``` bash
cd /etc/nginx

sz nginx.conf
```

#### 2. 修改 nginx.conf 文件

``` nginx
# 设定实际的服务器列表
upstream blog {
    server 127.0.0.1:3000;
}

# http 请求重定向到 https
server {
    listen       80;
    server_name  singple.com www.singple.com; #换成你的域名
    return 301   https://www.singple.com$request_uri; #这里的 www.singple.com 换成你的域名或者 $server_name
}

# https 配置
server {
    listen 443;
    server_name  www.singple.com; #换成你的域名

    ssl                        on;
    ssl_certificate            ssl/1_www.singple.com_bundle.crt; #证书文件
    ssl_certificate_key        ssl/2_www.singple.com.key; #秘钥文件
    ssl_session_timeout        5m;
    ssl_protocols              TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers                ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers  on;

    location / {
        proxy_pass   http://blog;
    }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
}

# 其他的 URL 请求返回 501 （可选配置）
server {
    listen       80 default;
    return       501;
}
```

#### 3. 上传修改后的 nginx.conf，并重新加载 nginx 配置

``` bash
# 修改 nginx.conf 后，上传
rz -y

# 重启 Nginx
nginx -s reload

# 开机自启 Nginx
systemctl enable nginx.service
```

#### 4. 如果无法访问

``` bash
# 启用https服务
firewall-cmd --permanent --zone=public --add-service=https

# 开启 443 端口(https)
firewall-cmd --zone=public --add-port=443/tcp --permanent

# 重新加载防火墙，使新添的规则生效
firewall-cmd --reload
```

**参考:**
1. [个人网站如何开启HTTPS？](https://www.qcloud.com/community/article/667588001491218602)
2. [Redirect all HTTP requests to HTTPS with Nginx](https://www.bjornjohansen.no/redirect-to-https-with-nginx)


## 附录：

### Systemd 常用命令：

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

### firewalld 常用命令：

``` bash
# 查看版本
firewall-cmd --version

# 获取 firewalld 状态
firewall-cmd --state

# 查看开启的端口列表
firewall-cmd --list-ports

# 查看 public 下开启的端口列表
firewall-cmd --zone=public --list-ports

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
# --permanent 永久
firewall-cmd --zone=public --add-port=80/tcp --permanent

# 启用https服务
firewall-cmd --permanent --zone=public --add-service=https

# 开启 443 端口(https)
firewall-cmd --zone=public --add-port=443/tcp --permanent

# 重新加载防火墙，生效新添的规则
firewall-cmd --reload
```


### PM2 常用命令：

``` bash
# 1. 启动
pm2 start app.js
# 以 process-name 为 PM2 进程名称
pm2 start app.js --name process-name
# 根据 CPU 核数启动进程个数
pm2 start app.js -i 0
# 实时监控 app.js 的方式启动，当 app.js 文件有变动时，PM2 会自动reload
pm2 start app.js --watch

# 2. 查看进程
pm2 list
# 查看进程详细信息，0 为 PM2 进程 id
pm2 show 0
# 或者
pm2 info 0

# 3. 监控
pm2 monit

# 4. 停止
# 停止 PM2 列表中所有的进程
pm2 stop all
# 停止 PM2 列表中进程为 0 的进程
pm2 stop 0

# 5. 重载
# 重载 PM2 列表中所有的进程
pm2 reload all
# 重载 PM2 列表中进程为 0 的进程
pm2 reload 0

# 6. 重启
# 重启 PM2 列表中所有的进程
pm2 restart all
# 重启 PM2 列表中进程为 0 的进程
pm2 restart 0

# 7. 删除 PM2 进程
# 删除 PM2 列表中所有的进程
pm2 delete all
# 删除 PM2 列表中进程为 0 的进程
pm2 delete 0

# 8. 日志操作
# 显示所有进程日志
pm2 logs
# 清除所有日志
pm2 flush
# 重载所有日志
pm2 reloadLogs

# 9. 升级 PM2
# 安装最新的 PM2 版本
npm install pm2@lastest -g
# 升级 PM2
pm2 updatePM2

# 10. 更多命令参数请查看帮助
pm2 --help
```
