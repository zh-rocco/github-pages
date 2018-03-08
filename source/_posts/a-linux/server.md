---
layout: post
title: 服务器配置（Nginx，Node，PM2，HTTPS，HTTP2）
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
updated: 2018-03-02 16:50:00
---

_环境：腾讯云服务器，64 位 CentOS-7，root 用户_

## 连接服务器

### 通过 Xshell 连接服务器

#### 1. 安装

略

#### 2. 新建 SSH 连接

![新建 SSH 连接](/images/article/xshell-new.jpg)

<!-- more -->

![绑定服务器主机 IP](/images/article/xhell-ip.jpg)

输入完成后点击 "确定";

![输入用户名](/images/article/xshell-user.jpg)

![输入密码](/images/article/xshell-password.jpg)

点击确定连接。

**参考：**

1.  [腾讯云服务器部署 Node.js 应用](http://www.yedanbo.com/post/2017/qcloud-deploy-nodejs-application/)

### 打开多个 Shell 界面

鼠标移到已经连接的服务器 **标签**（标红处）上，点击右键，选择 **复制 SSH 渠道**。

![Xshell复制SSH渠道](/images/article/xshell-copy-ssh.jpg)

## 更新系统和软件包

```bash
yum clean all
yum update
yum upgrade
```

## 安装必备软件

### 配置编译环境

```bash
# 安装 make
yum -y install gcc automake autoconf libtool make

# 安装 g++
yum -y install gcc gcc-c++
```

### 安装 lrzsz（Xshell 环境下用于文件上传和下载）

```bash
yum -y install lrzsz
```

### 选择源码安装目录

可以是任何目录，我选择的是 `/usr/local/src`。

```bash
cd /usr/local/src
```

### 更新/安装 OpenSSL

```bash
# 查看已安装的 SSL 版本
openssl version

# 如果显示 openssl 版本低于 1.02，则需要更新（为了后续开启 http2）
# 切换到源码安装目录
cd /usr/local/src

# 下载源码包
wget https://www.openssl.org/source/openssl-1.0.2l.tar.gz

# 解压
tar -zxvf openssl-1.0.2l.tar.gz

# 切换到源码目录内
cd openssl-1.0.2l

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

1.  [CentOS 之——升级 openssl 为最新版](http://blog.csdn.net/l1028386804/article/details/53165252)

### 安装 Nginx

```bash
# 切换到源码安装目录（如果更换其他目录，下面引用的路径同样需要修改）
cd /usr/local/src

# 下载源码包
wget http://nginx.org/download/nginx-1.12.0.tar.gz
wget https://www.openssl.org/source/openssl-1.0.2l.tar.gz
wget http://zlib.net/zlib-1.2.11.tar.gz
wget https://ftp.pcre.org/pub/pcre/pcre-8.35.tar.gz

# 解压
tar -zxvf nginx-1.12.0.tar.gz
tar -zxvf openssl-1.0.2l.tar.gz
tar -zxvf pcre-8.35.tar.gz
tar -zxvf zlib-1.2.11.tar.gz

# 切换目录
cd nginx-1.12.0

# 创建一个 nginx 目录用来存放运行的临时文件夹
mkdir -p /var/cache/nginx

# 添加配置
# --prefix=/usr/local/nginx --> 指定安装路径
# --conf-path=/etc/nginx/nginx.conf --> 指定配置文件的位置
# --with-http_ssl_module --> 启用 SSL 模块
# --with-http_v2_module --> 启用 http2 模块

# 转义符："\" 可以实现在多行输入一句命令
./configure --prefix=/usr/local/nginx \
            --sbin-path=/usr/sbin/nginx \
            --conf-path=/etc/nginx/nginx.conf \
            --error-log-path=/var/log/nginx/error.log \
            --http-log-path=/var/log/nginx/access.log \
            --pid-path=/var/run/nginx.pid \
            --lock-path=/var/run/nginx.lock \
            --http-client-body-temp-path=/var/cache/nginx/client_temp \
            --http-proxy-temp-path=/var/cache/nginx/proxy_temp \
            --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
            --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
            --http-scgi-temp-path=/var/cache/nginx/scgi_temp \
            --user=nobody \
            --group=nobody \
            --with-openssl=/usr/local/src/openssl-1.0.2l \
            --with-pcre=/usr/local/src/pcre-8.35 \
            --with-zlib=/usr/local/src/zlib-1.2.11 \
            --with-http_ssl_module \
            --with-http_v2_module \
            --with-http_realip_module \
            --with-http_addition_module \
            --with-http_sub_module \
            --with-http_dav_module \
            --with-http_flv_module \
            --with-http_mp4_module \
            --with-http_gunzip_module \
            --with-http_gzip_static_module \
            --with-http_random_index_module \
            --with-http_secure_link_module \
            --with-http_stub_status_module \
            --with-http_auth_request_module \
            --with-mail \
            --with-mail_ssl_module \
            --with-file-aio \
            --with-ipv6 \
            --with-http_v2_module \
            --with-threads \
            --with-stream \
            --with-stream_ssl_module \
            --with-threads \
            --with-debug

# 安装
make && make install

# 重新启动 Xshell，或者重启 Shell 窗口 !!!
# 检查是否安装成功
nginx -V

# 配置 systemctl 服务
vim /usr/lib/systemd/system/nginx.service

# 复制代码
# 按 i 输入以下内容

[Unit]
Description=nginx - high performance web server
Documentation=http://nginx.org/en/docs/
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t -c /etc/nginx/nginx.conf
ExecStart=/usr/sbin/nginx -c /etc/nginx/nginx.conf
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target

# 按 Esc 推出 vim 编辑模式，输入 :wq 然后点击 Enter，保存并退出

# 重新启动 Xshell，或者重启 Shell 窗口 !!!
# 重启 nginx
systemctl start nginx.service

# 开机自启 nginx
systemctl enable nginx.service
```

**参考：**

1.  [nginx 支持 HTTP2 的配置过程](http://www.cnblogs.com/bugutian/p/6628455.html)
2.  [nginx 的安装及配置](http://blog.csdn.net/vivid_110/article/details/50088349)
3.  [Nginx 网站服务器学习与入门](https://www.qcloud.com/community/article/593436)
4.  [nginx 如何启用对 HTTP2 的支持](http://blog.csdn.net/littlesmallless/article/details/59173287)
5.  [CentOS 7 中 Nginx1.9.5 编译安装教程 systemctl 启动](http://bbs.qcloud.com/thread-10429-1-1.html)

### 安装 Git

```bash
# 安装 Git
yum install git

# 查看 Git 版本
git --version
```

### 安装 Node 和 PM2

```bash
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

```bash
# 我将博客放在了 /home 挂载点内
# 将 Node 静态服务模板克隆到 /home/blog 目录下
git clone https://github.com/no-nothing/server.git /home/blog

# 切换到 blog 目录内
cd /home/blog

# 安装依赖
npm i
```

### 部署 Blog 页面

```bash
# 克隆自己的 Blog 页面到 /home/blog/public 目录下
git clone https://github.com/no-nothing/no-nothing.github.io.git /home/blog/public
```

**或者上传本地的 Blog 页面：**

先将本地的网页压缩成 zip 包（Centos 默认支持解压 zip 文件）

```bash
# 切换到 blog 目录内
cd /home/blog

# 上传
rz -y

# 解压缩包到 /home/blog/public 目录下
unzip 压缩包名.zip -d /home/blog/public
```

### 启用 Node 服务

```bash
# 切换到 blog 目录内
cd /home/blog

# 以 blog 为 PM2 进程名称
pm2 start app.js --name blog

# 设置 pm2 启动的服务开机自启
pm2 save
pm2 startup
```

现在可以通过 _IP 地址:3000_ 访问刚才部署的 Blog 了。

## 配置 Nginx（同时开启 https）

_需要先完成域名解析_

### 获取证书

1.  打开[腾讯云-SSL 证书管理](https://console.qcloud.com/ssl)，点击 **申请证书**，按提示一步步操作；
2.  下载证书；
3.  解压下载好的压缩包，选择符合自己服务环境的证书；

### 将证书上传至服务器

```bash
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

```bash
cd /etc/nginx

sz nginx.conf
```

#### 2. 修改 nginx.conf 文件

```nginx
...

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
    listen 443 ssl http2 default_server;
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

...
```

**补充：**

[完整的 nginx.conf 文件](https://github.com/no-nothing/github-pages/blob/master/nginx/nginx.conf)

#### 3. 上传修改后的 nginx.conf，并重新加载 nginx 配置

```bash
# 修改 nginx.conf 后，上传
rz -y

# 重启 nginx
nginx -s reload

# 开机自启 nginx
systemctl enable nginx.service
```

#### 4. 如果无法访问

```bash
# 启用https服务
firewall-cmd --permanent --zone=public --add-service=https

# 开启 443 端口(https)
firewall-cmd --zone=public --add-port=443/tcp --permanent

# 重新加载防火墙，使新添的规则生效
firewall-cmd --reload
```

**参考:**

1.  [个人网站如何开启 HTTPS？](https://www.qcloud.com/community/article/667588001491218602)
2.  [Redirect all HTTP requests to HTTPS with Nginx](https://www.bjornjohansen.no/redirect-to-https-with-nginx)

## 开启防火墙

### 安装

```bash
# 查看版本
firewall-cmd --version

# 若提示 command not found，安装 firewalld
yum install firewalld firewall-config
```

### 开启/关闭指定端口

```bash
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

## 附录：

### Systemd 常用命令：

```bash
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

1.  [systemd-ArchWiki](https://wiki.archlinux.org/index.php/Systemd)
2.  [Systemd 入门教程：命令篇](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)

### Nginx 常用命令：

```bash
# nginx 启动
# 其中参数 -c 指定 nginx 启动时加载的配置文件，当然也可以不指定配置文件，省略 -c，也可以启动，表示使用默认的配置文件
nginx -c /etc/nginx/nginx.conf
# OR
nginx

# nginx 停止
# 例如在我们的编辑环境中已经安装好了 nginx，并且已启动，在命令提示符下直接输入 nginx -s stop 就可以停止了
nginx -s stop
# OR
nginx -s quit
# OR
pkill -9 nginx

# nginx 重载配置
nginx -s reload

# 检查配置文件是否正确
nginx -t
```

**参考:**

1.  [systemd-ArchWiki](https://wiki.archlinux.org/index.php/Systemd)
2.  [Systemd 入门教程：命令篇](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)

### firewalld 常用命令：

```bash
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

**参考:**

1.  [centos7 firewall 防火墙 命令](http://www.cnblogs.com/phpshen/p/5842118.html)

### PM2 常用命令：

```bash
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

**参考：**

1.  [PM2 官网](http://pm2.keymetrics.io/)
2.  [腾讯云服务器部署 Node.js 应用](http://www.yedanbo.com/post/2017/qcloud-deploy-nodejs-application/)
