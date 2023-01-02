---
title: webpack中的Compiler
description: webpack中的Compiler
author: Zhenggl
date: 2023-01-02 08:47:40
categories:
  - [webpack, Compiler]
tags:
  - webpack
cover_picture:
---

### 前言
> 上文中我们所提及到的`webpack`创建了一个`Compiler`对象，由它来进行相关的打包任务动作的启动等，而且作为所有的插件所共同访问的到的一个`编译器`对象，:confused: 那么，这个`Compiler`是什么呢？？它做了哪些事情呢？