---
layout: post
title: systemd/systemctl 常用命令
author: Simple
tags:
  - systemctl
categories:
  - Linux
comments: true
date: 2017-05-15 10:30:00

---

*环境：CentOS-7，root用户*

## 常用命令

```shell
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

# 禁用一个单元（禁用后，间接启动也是不可能的）：
systemctl mask <单元>

# 取消禁用一个单元：
systemctl unmask <单元>

# 显示单元的手册页（必须由单元文件提供）：
systemctl help <单元>

# 重新载入 systemd，扫描新的或有变动的单元：
systemctl daemon-reload
```

<!-- more -->

# 参考
[systemd(简体中文)-ArchWiki](https://wiki.archlinux.org/index.php/systemd_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))
