---
title: webpack中的Compiler
description: webpack中的Compiler
author: Zhenggl
date: 2023-01-02 08:47:40
categories:
  - [webpack, Compiler]
tags:
  - webpack
cover_picture: Compiler封面.jpg
---

### 前言
> 上文中我们所提及到的`webpack`创建了一个`Compiler`对象，由它来进行相关的打包任务动作的启动等，而且作为所有的插件所共同访问的到的一个`编译器`对象，:confused: 那么，这个`Compiler`是什么呢？？它做了哪些事情呢？

### Compiler是什么
> Compiler 模块是 webpack 的主要引擎，它通过 CLI 或者 Node API 传递的所有选项创建出一个 compilation 实例。 它扩展（extends）自 [Tapable](Tapable) 类，用来注册和调用插件。 大多数面向用户的插件会首先在 Compiler 上注册。
> 首先，先来看一下 :point_down: 的一副Compile的`run`方法的执行过程所触发的钩子函数，以及都有哪些插件在对应的钩子容器中添加了各自的钩子函数动作：
![Compiler的run方法触发的钩子函数](Compiler的run方法触发的钩子函数.png)

### Compiler的组成
![Compiler](Compiler.png)