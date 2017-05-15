---
layout: post
title: 个人网站/服务器 开启HTTPS
author: Simple
tags:
  - https
categories:
  - Linux
comments: true
date: 2017-05-16 00:10:00

---

*环境：CentOS-7，root用户*

## 获取证书

1. 打开[腾讯云-SSL证书管理](https://console.qcloud.com/ssl)，点击 **申请证书**，按提示一步步操作；
2. 下载证书；
3. 解压下载好的压缩包，选择符合自己服务环境的证书；

<!-- more -->

## 将证书上传至服务器

``` bash
# 我是通过 yum install nginx 安装的 nginx，所以 nginx 根目录在 /etc/nginx
cd /etc/nginx

# 创建 ssh 文件夹存放证书
mkdir ssh

cd ssh

# 通过 lrzsz (Xshell环境下用于文件上传和下载)上传证书
rz
# 选择 *.crt 和 *.key 两个文件
```

## 修改 nginx 配置文件

1\. 从服务器取出 nginx.conf 文件

``` bash
sz nginx.conf
```

2\. 修改 nginx.conf 文件

``` config
server {
    listen       80;
    server_name  www.singple.com; #换成你的域名
    return 301   https://$server_name$request_uri;
}

server {
    listen 443;
    server_name  www.singple.com; #换成你的域名
    root         /usr/share/nginx/html;

    ssl                        on;
    ssl_certificate            ssl/1_www.singple.com_bundle.crt; #证书文件
    ssl_certificate_key        ssl/2_www.singple.com.key; #秘钥文件
    ssl_session_timeout        5m;
    ssl_protocols              TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers                ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers  on;

    location / {
    }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
}
```

3\. 上传修改后的 nginx.conf，并重新加载 nginx 配置

``` bash
# 修改 nginx.conf 后，上传
rz -y

# 重新加载 nginx 配置
systemctl reload nginx.service
```

4\. 如果无法访问

``` bash
# 启用https服务
firewall-cmd --permanent --zone=public --add-service=https

# 开启 443 端口(https)
firewall-cmd --zone=public --add-port=443/tcp --permanent

# 重新加载防火墙，生效新添的规则
firewall-cmd --reload
```


**参考:**
1. [个人网站如何开启HTTPS？](https://www.qcloud.com/community/article/667588001491218602)


