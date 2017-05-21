---
layout: post
title: 服务器配置
author: Simple
tags:
  - nginx
  - https
  - firewall
categories:
  - Linux
comments: true
date: 2017-05-21 00:10:00
updated: 2017-05-21 00:10:00

---

*环境：腾讯云服务器，64位 CentOS-7，root用户*

## 连接服务器

### 打开多个 Shell 界面

鼠标移到已经连接的服务器 **标签**（标红处）上，点击右键，选择 **复制SSH渠道**。

![Xshell复制SSH渠道](/images/article/xshell-copy-ssh.jpg)

**参考：**
1. [腾讯云服务器部署 Node.js 应用](http://www.yedanbo.com/post/2017/qcloud-deploy-nodejs-application/)

<!-- more -->

## 安装必备软件

### 配置编译环境

``` bash
# 安装 make
yum -y install gcc automake autoconf libtool make

# 安装 g++
yum -y install gcc gcc-c++
```

### 安装 lrzsz（Xshell 环境下用于文件上传和下载）

``` bash
yum -y install lrzsz
```

### 选择源码安装目录

可以是任何目录，我选择的是 `/usr/local/src`。

``` bash
cd /usr/local/src
```

### 更新 SSL（OpenSSL）

``` bash
# 查看已安装的 SSL 版本
openssl version

# 如果显示 openssl 版本低于 1.02，则需要更新（为了后续开启 http2）
# 切换到源码安装目录
cd /usr/local/src

# 下载源码包
wget http://www.openssl.org/source/openssl-1.1.0e.tar.gz

# 解压
tar -zxvf openssl-1.1.0e.tar.gz

# 切换到源码目录内
cd openssl-1.1.0e

# 添加配置
./config --prefix=/usr/local/openssl

# 安装
make && make install

# 保存老版本的 openssl
mv /usr/bin/openssl /usr/bin/openssl.OFF
mv /usr/include/openssl /usr/include/openssl.OFF

# 创建软链
ln -s /usr/local/openssl/bin/openssl /usr/bin/openssl
ln -s /usr/local/openssl/include/openssl /usr/include/openssl
echo "/usr/local/openssl/lib">>/etc/ld.so.conf

# 检查是否安装成功
openssl version
```

**参考：**
1. [CentOS之——升级openssl为最新版](http://blog.csdn.net/l1028386804/article/details/53165252)

### 安装 Nginx

``` bash
# 切换到源码安装目录
cd /usr/local/src

# 下载源码包
wget http://nginx.org/download/nginx-1.12.0.tar.gz

# 解压
tar -zxvf nginx-1.12.0.tar.gz

# 添加配置
# --prefix=/usr/local/nginx --> 指定安装路径
# --conf-path=/etc/nginx/nginx.conf --> 指定配置文件的位置
# --with-http_ssl_module --> 启用 SSL 模块
# --with-http_v2_module --> 启用 http2 模块
./configure --prefix=/usr/local/nginx --conf-path=/etc/nginx/nginx.conf --with-openssl=../openssl-1.1.0e --with-pcre --with-zlib=../zlib-1.2.11 --with-http_ssl_module --with-http_v2_module

# 安装
make && make install

# 创建软链
ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx

# 检查是否安装成功
nginx -v
```

**参考：**
1. [nginx支持HTTP2的配置过程](http://www.cnblogs.com/bugutian/p/6628455.html)
2. [nginx的安装及配置](http://blog.csdn.net/vivid_110/article/details/50088349)
3. [Nginx网站服务器学习与入门](https://www.qcloud.com/community/article/593436)

### 安装 Git

``` bash
# 安装 Git
yum -y install git

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
```

现在可以通过 IP地址:3000 访问刚才部署的 Blog 了。

## 配置 Nginx

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
    server_name  singple.com; #换成你的域名
    return 301   http://www.singple.com$request_uri; #这里的 www.singple.com 换成你的域名或者 $server_name
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

# 重新加载 nginx 配置
systemctl reload nginx.service
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
