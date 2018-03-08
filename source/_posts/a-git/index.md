---
layout: post
title: Git 常用命令
categories:
  - Git
comments: true
date: 2017-05-31 15:20:00
updated: 2018-03-02 16:50:00
---

## 生成 SSH keys

```bash
# 查看 SSH keys 是否存在
ls -al ~/.ssh

# 生成新的 SSH key
ssh-keygen -t rsa -C "rocco.mormont@gmail.com"
```

<!-- more -->

## 查看/创建/切换 分支

```bash
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

## 删除分支

```bash
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

## 撤销提交（复位）

```bash
# 该命令撤消上一个commit，但保留add的文件，Git 会暂存所有的因复位带来的差异，但不提交它们
git reset --soft HEAD^

# 强制复位前一个提交
git reset --hard HEAD^
```

**参考：**

1.  [Git 撤销提交和修改相关操作](http://www.cnblogs.com/binyue/p/5148928.html)

## 清空当前分支

```bash
# 清空当前分支
# 注意不要遗漏 -r 后面的 .
git rm --cached -r .
git clean -f -d

# 创建空的 commit
git commit --allow-empty -m "[empty] initial commit"

# 推送空分支
git push
```

## 新建空分支

```bash
# 新建空分支
# 注意不要遗漏 -r 后面的 .
git branch -b <new_branch>
git rm --cached -r .
git clean -f -d

# 创建空的 commit
git commit --allow-empty -m "[empty] initial commit"

# 推送空分支
git push origin <new_branch>
```
