---
layout: post
title: Git 常用命令
author: Simple
tags:
  - git
categories:
  - Git
comments: true
date: 2017-05-31 15:20:00
updated: 2017-05-31 15:20:00

---

## 分支操作

### 查看、创建、切换

``` bash
# 查看本地分支
git branch

# 查看本地和远程分支
git branch -a

# 新建分支
git branch <branchName>

# 切换分支
git checkout <branchName>

# 新建并切换至新建的分支
git checkout -b <branchName>
```

### 删除

``` bash
# 删除本地的某个分支
git branch -D <branchName>

# 删除远程的分支
git branch -r -d origin/<branchName>
git push origin :<branchName>

# 解释：
# git branch -r -d origin/<branchName> 只是删除本地的索引，而不是真正删除远程分支的内容
# 要想真正删除远程分支上的内容，把一个空分支 push 到 server 上，等于删除该分支，git push origin :<branchName>
# 注意：冒号前面的空格不能少
```

<!-- more -->


## 撤销提交

### 复位
``` bash
# 该命令撤消上一个commit，但保留add的文件，使得Git暂存所有的因复位带来的差异，但不提交它
git reset --soft

# 强制复位前一个提交
git reset --hard HEAD^
```

**参考：**

1. [Git撤销提交和修改相关操作](http://www.cnblogs.com/binyue/p/5148928.html)

### 反转
