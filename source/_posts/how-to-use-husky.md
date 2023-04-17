---
title: husky是如何实现自动化代码管理的
description: husky是如何实现自动化代码管理的, 将代码规范结合程序进行自动化管控
author: Zhenggl
date: 2023-04-17 15:38:56
categories:
  - [前端, 编码规范, 自动化]
tags:
  - 前端
  - 编码规范
  - 自动化
  - husky
cover_picture: husky封面.png
---

### 前言
> 在日常的代码管理中，没有严格按照代码规范来编写代码，提交的`git message`不规范，很难从提交日志中看出调整了什么内容，其他同事使用的ide与我的不一致，其他同事与我的编码有空格冲突，又不能一口气直接替换，花费大量的时间来进行代码的合并，解决空格冲突等等，我们的编码工作，不应该是在这个重复的低效的工作上的！！
> :point_right: 因此，**husky(哈士奇)**就闪亮 :stars: 登场了！
> :confused: 第一次听到这个中文翻译时，有些许疑惑，按照 {% link "官方文档" "https://typicode.github.io/husky/" true 官方文档 %} 所描述的！
> *当您提交或推送时，您可以使用它来整理您的提交消息、运行测试、lint 代码等*

### 什么是husky?
> *当您提交或推送时，您可以使用它来整理您的`提交消息`、`运行测试`、`lint` 代码等*
> 这个是官方的介绍，`husky`支持所有的[git勾子](https://git-scm.com/docs/githooks)，实际在使用的过程中，除了这个勾子动作之外，应该还可以支持到`npm`的[相关勾子动作](https://www.npmjs.cn/)
> 

### 如何使用husky(npm方式)
`husky-init`是用`husky`快速初始化项目的一次性命令！
```bash
  npx nusky-init && npm install
```
:point_up: 上述这里的命令，将设置`husky`，同时修改`package.json`，在其`script`中创建一个`pre-commit`脚本动作，这里我们可以修改默认的脚本动作！
![用husky推荐方式来初始化项目](用husky推荐方式来初始化项目.png)
:stars: 执行完成该命令后，将对应的在当前项目的`.husky`目录中创建相关资源目录以及文件：
![初始化后的目录](初始化后的目录.png)
:point_down: 对应地在`package.json`中创建的命令：
![初始化后的husky自动创建的脚本](初始化后的husky自动创建的脚本.png)
:stars: 从这个默认的命令中，我们可以看出它执行的是`npm test`动作！

:confused: 如果我们需要新增自定义的勾子呢？
```bash
  npx husky add .husky/commit-msg 'npx --no --commitlint --edit "$1"'
```
:point_up: 这里我们将在`package.json`中的`script`添加一个动作：*commit-msg*，然后这个勾子对应执行的内容是：'npx --no --commitlint --edit "$1"'

:trollface: 当然，我们也可以直接在对应的`package.json`中添加勾子以及勾子对应的程序动作！无须去专门记住这个`husky`的相关脚本！

### 与husky的延伸扩展