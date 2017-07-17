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

### 2. 历史命令

``` bash
history <选项> <历史命令保存文件>
```

**<选项>：**

- -c：清空历史命令；
- -w：把缓存中的历史命令写入历史命令保存文件   /root/.bash_history

`cat .bash_history` 可以查看这个文件，默认关机时会执行 `history -w` 命令；

历史命令默认保存 1000 条，可以在环境变量配置文件 /etc/profile 中进行修改，修改 `HISTSIZE` 的值；

`!n`       可以重复执行 history 里第 n 条命令；

`!!`       重复执行上一条命令；

`!字符串`   重复执行最后一条已该字符串开头的命令；

### 3. 输出重定向（很有用）

`date > date.log`                  将时间信息输入到 date.log 文件中，而不是显示输出；

`date >> date.log`                 将时间信息追加到 date.log 文件中，而 > 是覆盖；

`date &>> date.log`                同时保存正确和错误信息，如果有错误信息；

`date >> date.log 2>> error.log`    保存正确信息到 date.log，保存错误信息到 error.log；

### 4. 输入重定向

``` bash
wc <选项> <文件名>
```

**<选项>：**

- -c：统计字节数；
- -w：统计单词数；
- -l：  统计行数；

例如：`wc < date.log` 或者直接 `wc date.log` 统计 date.log 文件里的字节数、单词数、行数；

### 5. 管道符

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

### 6. 通配符

``` bash
?      ：匹配一个任意字符；
*      ：匹配0个或任意多个任意字符，也就是可以匹配任何内容；
[ ]    ：匹配中括号内的任意一个字符，例如：[abc] 代表一定匹配一个字符，或者是a、或者是b、或者是c；
[ - ]  ：匹配中括号内的任意一个字符，- 代表一个范围，例如：[a-z] 代表匹配一个小写字母；
[ ^ ]  ：逻辑非，表示匹配不是中括号内的一个字符，例如：[^0-9] 代表匹配一个不是数字的字符；
```

### 7. 第一个脚本

**a. 首先新建并打开一个文件**

``` bash
vim hello.sh
# 或者
vi hello.sh
```

**b. 然后编辑内容**

``` bash
#!/bin/bash            脚本开头必须内容
#The first program     注释
echo -e "hello"
```

**c. 脚本执行**

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


## 目录切换与查询

``` bash
# 进入当前用户的家目录，命令英文原意：change directory
cd ~
# 或者
cd

# 进入上次目录
cd -

# 进入上一级目录
cd ..

# 进入当前目录（比 cd .. 少一个 .）
cd .

# 进入根目录
cd /

# 查询所在目录位置，命令英文原意：print working directory
pwd
```

**补充：Linux 目录说明**
- 根目录下的 `bin` 和 `sbin`、`usr` 目录下的 `bin` 和 `sbin`，这四个目录都是用来保存系统命令的；
`bin` 下的命令所用用户都可以执行，而 `sbin` 下的命令只有超级用户才可以执行。
- `dev` 目录内是一些硬件文件，没事别动。
- `etc` 目录下是系统的默认配置文件。
- `lib` 目录下是函数库，用的时候可以调用，不用就没必要调用，这样可以避免 Linux 变得臃肿。
- `proc` 和 `sys` 目录不能直接操作，这两个目录保存的是内存的挂载点，也就是内存的盘符。
- `tmp` 是临时目录。
- `var` 保存系统的可变文档目录。


## 显示目录下的文件

``` bash
ls <选项> <文件或目录>
```

**<选项>：**

- `-a`    显示所有文件，包括隐藏文件
- `-l`    显示详细信息（`ll` = `ls -l`）
- `-d`    查看目录属性
- `-h`    人性化显示文件大小
- `-i`    显示inode，查看id号


## 获取帮助

``` bash
# 获取指定命令的帮助，manual（手册）缩写
man <命令>

# 查询shell命令，如 cd
help <命令>
```


## 查看用户登录信息

``` bash
# 详细信息
w

# 简洁信息
who

# 查询当前登录和过去登陆的用户信息
last

# 查询所有用户的最后一次登录时间
lastlog
```


## 文件操作

### 创建目录

``` bash
mkdir <目录名>

# 递归创建，在没有 xiaomi 目录的前提下创建 xiaomi/redmi 必须加 -p
mkdir -p xiaomi/redmi
```

### 目录复制

``` bash
# 格式
cp <选项> <原文件或目录> <目标目录>

# 连带文件属性复制
cp -p <原文件或目录> <目标目录>

# 若原文件是链接文件，则复制链接属性
cp -d <原文件或目录> <目标目录>

# 复制目录
cp -r <原文件或目录> <目标目录>

# 相当于 -pdr
cp -a <原文件或目录> <目标目录>

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


## 创建软链

``` bash
# 格式
ln -s <原文件> <目标文件>

# 创建软链
ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx

# 删除软链
rm 软链
```


## 搜索文件/命令/字符串

### 搜索文件

#### locate

``` bash
# 在后台数据库中按文件名搜索，搜索速度快
# 注意：locate命令搜索的是后台数据库，新建的文件需要 updatedb 后才能搜索到（因为，mlocate 数据库并不是实时更新）
locate <文件名>
```

#### find

``` bash
# 耗费资源，比较慢，但是功能非常强大
# 注意：避免大范围的搜索
find <搜索范围> <搜索条件>
```

**搜索条件：**
- `-name`：  按文件名索搜，只显示文件名一模一样的文件
- `-iname`： 不区分大小写

**通配符：**（放在搜索格式结尾）

- `*`：             匹配任意内容
- `?`：             匹配任意一个字符
- `[]`：            匹配任意一个中括号内的字符
- `-user <用户名>`： 按照所有者搜索
- `-nouser`：       查找没有所有者的文件
- `-mtime <num>`：  修改文件内容时间
- `-atime <num>`：  文件访问时间
- `-ctime <num>`：  改变文件属性时间
  - `-10`：         10 天内修改的文件
  - `10`：          10 天当天修改的文件
  - `+10`：         10 天前修改的文件；
- `-size <num>`：   按文件大小查找
  - `-10k`：        小于 10KB 的文件  /  `-10M`：小于 10MB 的文件（注意大小写）
  - `10k`：         等于 10KB 的文件
  - `+10k`：        大于 10KB 的文件；
- `-inum <节点数>`： 按 i 节点查找；（`ls -i` 查看文件的 i 节点）

**例子：**
`find /etc -size +20k -a -size -50k -exec ls -lh {} \`

**解释：**

- 查找 `/etc` 目录下大于 20KB 小于 50KB 的文件，
- `-a`：                and  逻辑与，两个条件都满足，
- `-o`：                or  逻辑或，两个条件满足一个即可，
- `-exec <命令> {} \`：  对搜索结果执行操作；

### 搜索命令

#### whereis

``` bash
# 搜索命令所在路径以及帮助文档所在位置
whereis <选项> <命令名>
```

**选项：**
   
- `-b`：  只查找可执行文件；
- `-m`：  只查找帮助文件；

#### which

``` bash
# 搜索命令的所在位置以及命令的别名（如果有的话，pwd 便没有别名）
# 注意：whereis 和 which 无法搜索到 cd 命令，因为 cd 命令是 shell 自带的命令
which <命令名>
```


### 搜索字符串

``` bash
# 在文件当中匹配符合条件的字符串
grep <选项> <字符串> <文件名>
```

**选项：**

- `-i`：  忽略大小写；
- `-v`：  排除指定字符串，也就是取反；


## 压缩与解压

### .zip 格式压缩（可以压缩目录和文件）

``` bash
# 压缩文件，原文件保留
zip <压缩文件名> <原文件>

# 压缩目录，原目录保留
zip -r <压缩文件名> <原文件夹>

# 解压缩 .zip 文件，原文件保留，解压后默认和压缩文件保存在同一目录
unzip <原文件>
```

### .gz 格式压缩（可以压缩目录和文件）

``` bash
# 压缩为 .gz 格式的文件，原文件会消失
gzip <原文件>

# 压缩为 .gz 格式的文件，原文件保留
gzip -c <原文件> > <压缩文件>
# 例如
gzip -c meizu > meizu.gz

# 压缩目录下所有的子文件，但是不能压缩目录，原文件会消失
gzip -r <目录>

# 解压缩文件，原文件会消失
gzip -d <压缩文件名>

# 解压缩文件，原文件会消失
gunzip <压缩文件名>
```

### .bz2 格式压缩（只可以压缩文件）

``` bash
# 压缩为 .bz2 格式的文件，原文件会消失
bzip2 <原文件>

# 压缩为 .bz2 格式的文件，原文件保留
bzip2 -k <原文件>

# 解压缩文件，原文件会消失；（加 -k 可以保存）
bzip2 -d <压缩文件名>

# 解压缩文件，原文件会消失；（加 -k 可以保存）
bunzip2 <压缩文件名>
```

### 打包命令 tar（会保留原文件）

``` bash
# 打包
tar -cvf <打包文件名> <原文件>
# 例如
tar -cfg meizu.tar meizu

# 解打包
tar -xvf <打包文件名>
# 例如
tar -xvf meizu.tar
```

**选项：**

- `-c`：  打包
- `-v`：  显示过程
- `-f`：  指定打包后的文件名
- `-x`：  解打包

### .tar.gz 格式压缩（可以压缩目录和文件）（会保留原文件）

其实 `.tar.gz` 格式是先打包为 `.tar` 格式，再压缩为 `.gz` 格式。

``` bash
# 同时将两个文件打包压缩到一个压缩文件下
tar -zcvf <压缩包名.tar.gz> <原文件> (<另一个原文件>)

# 解压缩 .tar.gz 格式的文件
tar -zxvf <压缩包名.tar.gz>
```

**选项：**

- `-c`：  压缩为 `.tar.gz` 格式
- `-x`：  解压缩 `.tar.gz` 格式的文件

### .tar.bz2 格式压缩（可以压缩目录和文件）（会保留原文件）

其实 .tar.bz2 格式是先打包为 .tar 格式，再压缩为 .bz2 格式。

``` bash
# 压缩
tar -jcvf <压缩包名.tar.bz2> <原文件>

# 解压缩
tar -jxvf <压缩包名.tar.bz2>

# 解压缩到指定目录
tar -jxvf <压缩包名.tar.bz2> -C <其他目录>
# 例如
tar -jxvf meizu.tar.bz2 -C /tmp/；

# 只查看里面的内容，而不解压
tar -jtvf <压缩包名.tar.bz2>
```

**选项：**

- `-j`：  压缩为 `.tar.bz2` 格式
- `-x`：  解压缩 `.tar.bz2` 格式的文件
- `-t`：  查看里面的内容


## 查询和挂载

### 查询命令

``` bash
# 查询系统中已经挂载的设备
mount

# 依据配置我文件 /etc/fstab 的内容自动挂载
mount -a
```

### 挂载命令

``` bash
mount <-t 文件系统> <-o 特殊选项> <设备文件名> <挂载点>
```

**<选项>：**
- `-t` 文件系统：加入文件系统类型来指定挂在的类型，可以 ext3、ext4、iso9660 等文件系统；
- `-o` 特殊选项：可以制定挂载的额外选项；

### 挂载光盘

``` bash
# 建立挂载点
mkdir /mnt/cdrom

# 挂载光盘（推荐使用 sr0）
mount -t iso9660 /dev/sr0 /mnt/cdrom

# 或者
# 挂载光盘（cdrom 和 sr0 是软链接关系）
mount -t iso9660 /dev/cdrom /mnt/cdrom

# 或者
# 挂载光盘（简写）
mount /dev/sr0 /mnt/cdrom
```

### 卸载光盘命令（挂载后必须卸载）

``` bash
umount <设备文件名或挂载点>

# 通过文件名卸载光盘
umount /dev/sr0

# 或者
# 通过挂载点卸载光盘
umount /mnt/cdrom
```

### 挂载U盘

``` bash
# 查看U盘设备文件名
fdisk -l

# 建立挂载点
mkdir /mnt/usb

# 挂载U盘
mount -t vfat /dev/ <U盘设备文件名> /mnt/usb
```


## 关机 / 重启 / 退出登录

### 关机命令

``` bash
# 安全，关机时会正确保存正在运行的任务
shutdown -h now

# 或者
halt

# 或者
poweroff

# 或者
init 0
```

### 重启命令

``` bash
shutdown -r now

# 或者
reboot

# 或者
init 6
```

### 退出登录命令

``` bash
logout
```


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

### Nginx 常用命令：

``` bash
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
