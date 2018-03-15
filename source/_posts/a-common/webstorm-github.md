---
layout: post
title: WebStorm 开启 GitHub 支持
tags:
  - webstorm
categories:
  - Common
comments: true
date: 2017-03-12 16:50:00
updated: 2018-03-09 16:50:00
---

_教程前提：1. 本机安装 WebStorm；2. 拥有 GitHub 账号。_

## 一、本机安装 Git

1.  [Git 下载地址](https://git-scm.com/download)。
2.  根据您的操作系统选择对应的 Git 版本。
3.  下载完成后，左键双击安装包，然后一直选择 Next 直到完成安装。
4.  安装完成后，可以在系统的程序列表中看到 Git Bash、Git CMD、Git GUI 三个快捷方式。

**附加：** [Git 官方中文教程](https://git-scm.com/book/zh/v2)，Git 进阶必备。

<!-- more -->

## 二、创建 SSH 密钥并添加到 GitHub

### 1. 创建 SSH 密钥

1.  点击系统程序列表中的 Git Bash 快捷方式，打开 Git Bash。
2.  在打开的 Bash 界面内输入如下命令，将 your_email@example.com 换成您登陆 GitHub 的邮箱，单击回车键；

    `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`

3.  Bash 界面内有提示就按回车键，连按 3 次。

### 2. 将 SSH 密钥添加到 GitHub

1.  在 "C:\Users\xxx(计算机用户名)\.ssh\" 目录下找到 id_rsa.pub 文件，记事本打开，复制里面的内容。
2.  打开您的 GitHub，鼠标点击 **自己的头像 --> Settings --> SSH and GPG keys --> New SSH key**，在打开的界面内：

    * **Title** 可以随意定义
    * **Key** 将上面复制的内容粘贴到这里
    * 点击 **Add SSH key** 按钮完成 SSH 密钥添加

## 三、在 WebStorm 中添加 GitHub 账号

### 1. 打开 WebStorm，然后使用快捷键 `Ctrl+Alt+S` 打开设置窗口

### 2. 选择 **Version Control | Git**

![配置 Git](/images/article/webstorm_01.jpg)

1.  上图中的 **Path to Git executable** 为启用本地的 Git，点击 **Path to Git executable** 输入框后的 `···` 按钮，选择本机已安装的 `git.exe`；

    **说明：** 例如我的 Git 安装在 "D:" 盘，所以选择的目录为 "D:\Program Files\Git\bin\git.exe"
    **注意：** "git.exe" 在 "bin" 目录下

2.  点击 **Test** 按钮，弹出 **Git executed successfully** 提示，窗证明已成功添加 "git.exe"。

### 3. 选择 **Version Control | GitHub**

![添加 GitHub 账号](/images/article/webstorm_02.jpg)

1.  上图中的 **Auth Type** 为 GitHub 密码认证类型。

    * **Password** 如果选择该选项并且您的 GitHub 帐户设置中启用了[two-factor authentication](https://help.github.com/articles/about-two-factor-authentication/)，则每次 WebStorm 需要登录到 GitHub 时，系统都会要求您输入密码。
    * **Token** GitHub 推荐的第三方应用认证方式，这种方式不需要 WebStorm 记住您的密码。

2.  我选择的是 **Password**，然后输入自己的 GitHub 登陆邮箱和密码。
3.  点击 **Test** 按钮，弹出 **Success** 提示窗，证明已成功添加 GitHub 账号。
4.  点击 WebStorm 设置窗口右下角的 **OK** 或者 **Apply** 按钮，保存设置。

## 四、从 GitHub 上克隆代码

![从 GitHub 上克隆代码](/images/article/webstorm_02.jpg)

1.  如上图所示，点击 **Check out from Version Control** 然后选择 GitHub 选项。
2.  在弹出的 **Clone Repository** 提示窗内：

    * **Git Repository URL** 您 GitHub 上的一个仓库地址，点击 **蓝色下拉按钮** 能看到您 GitHub 上所有的仓库，鼠标点击可以切换到任意仓库，点击 **Test** 按钮，弹出 **Test Connection** 提示窗，提示 success \*\*\* 的话证明已成功连接到 GitHub 仓库。
    * **Parent Diretory** 您想保存到本机的位置，手动输入绝对路径或者点击输入框后的 `···` 按钮选择目录。
    * **Directory Name** 存放项目的目录名称，这里 WebStorm 默认会使用您选择的 GitHub 仓库的名字。
    * 点击 **Clone** 按钮克隆仓库。

**说明：** 例如我的 **Parent Diretory** 设置为 "E:\GitHub"，**Directory Name** 设置为 "gulp"，最后会将我 GitHub 上的 "gulp" 仓库克隆到本地的 "E:\GitHub\gulp\" 目录下。

## 五、将本地项目上传至 GitHub

1.  WebStorm 界面左侧，项目目录中鼠标左键单击选中需要上传的项目文件夹。
2.  点击 WebStorm 工具栏上的 **VCS**，选择 **Import into Version Control --> Share Project on GitHub**。
3.  在弹出的 **Share Project on GitHub** 提示窗内输入相关信息，点击 **Share** 按钮。

    * **New repository name** 仓库名称。
    * **Remote name** 未知，这里我设置它跟 **New repository name** 同名。
    * **Description** 对仓库的描述。

4.  在弹出的 **Add Files For Initial Commit** 提示窗内点击 **OK** 按钮。
5.  在弹出的 **Push Commits** 提示窗内点击 **PUSH** 按钮。
6.  若 WebStorm 右下角提示上传失败，点击 WebStorm 工具栏上的 **VCS**，选择 **Commit Changes**，在弹出的 **Commit Changes** 提示窗内：勾选项目下所有要提交的文件，在 **Commit Message** 中添加本次提交的说明（必填），鼠标移动到 **Commit** 按钮上，点击 **Commit and Push...**，然后在弹出的 **Push Commits** 提示窗内点击 **PUSH** 按钮。

**说明：**VCS:(Version control system)，版本控制。

## 六、修改代码后上传

**同：** 五、将本地项目上传至 GitHub 6. **Commit Changes**。

## 参考：

* [Generating a new SSH key and adding it to the ssh-agent](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)
* [Adding a new SSH key to your GitHub account](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)
* [如何创建公钥](https://gist.github.com/yisibl/8019693)
* [使用 webstorm 上传代码到 github](http://www.jianshu.com/p/752613f4b1c9)
