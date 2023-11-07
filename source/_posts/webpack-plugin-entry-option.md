---
title: EntryOptionPlugin
author: Zhenggl
date: 2023-01-29 08:48:07
description: EntryOptionPlugin
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
cover: EntryOptionPlugin封面.png
---

### 前言
---
> **作为实际开始编译的入口**，该插件由`webpack`的核心默认插件自动加载，无需额外通过配置文件引入！
![EntryOptionPlugin设置以及执行的动作](EntryOptionPlugin设置以及执行的动作.png)

### 入口的开始
> ![入口程序的开始](入口程序的开始.png)
> 通过对该插件的代码阅读后发现，该插件主要针对两个钩子容器函数设置监听动作
1. compiler.hooks.compilation
2. compiler.hooks.make

:stars: 下面我们关键分析一下这个`compiler.hooks.make`触发时，做了什么动作！

### 一切编译动作的源头
> 在`compiler.hooks.make`方法触发时，在该插件中通过调用`compilation.addEntry`来从入口文件加载相关的依赖文件！
> 一切回到了 {% post_link compilation-in-webpack Compilation.js %}