---
title: hexo是如何工作的
description: hexo是如何工作的, hexo的原理是什么, 如何扩展自定义hexo
author: Zhenggl
date: 2023-04-11 06:30:41
categories:
  - [html, 博客, hexo]
tags:
  - html
  - ejs
  - hexo
cover_picture: hexo封面.jpeg
---

### 前言
{% link "官方文档" "https://hexo.io/zh-cn/docs/" true 官方文档 %}
> 自己的博客运行了也有一段时间了，想了解一下自己的博客站点整体是如何工作的？以及自己可以做点什么，来往这个博客站点中植入自己的插件来满足自定义的需求！
> 本文将具体分析一下`hexo`是如何工作的？它都有哪些组成？我们可以在这个框架上如何自定义自己的需求？以及这个框架给我们代码的可学习的地方！！！

### hexo的组成
> 首先，不管怎么，代码到手，天下我有！ :point_right: 先来看一下对应的`hexo`的代码目录结构：
![hexo的代码组织结构](hexo的代码组织结构.png)
:space_invader: 通过`package.json`中的`main`，可以发现其中的入口在于`bin/hexo`文件
```js
#!/usr/bin/env node
'use strict';
require('hexo-cli')();
```
:space_invader: 而`hexo`则是调用的`hexo-cli`库来实现的，后面发现，`hexo-cli`则是反过来调用的`hexo`来进行 :point_right: 创建一个`Hexo`对象，并最终调用这个`Hexo`对象的`init()`方法 ！！
![hexo的执行顺序](hexo的执行顺序.png)

:stars: 也就是说这个`hexo-cli`充当了一个执行者的作用！！
![hexo的构成](hexo的构成.png)

:alien: 而这里的`Hexo`对象，则是继承于`EventEmitter`对象，可针对其过程进行一系列的监听(也就是监听其生命周期过程方法)！
![Hexo对象的组成](Hexo对象的组成.png)

#### 1. extend扩展

#### 2. warehouse本地json数据库

#### 3. render渲染引擎

### hexo是如何工作的
> **一句话概括：读取source目录下的文件夹中的可识别的文件内容，并根据对应的文件扩展名来渲染成为对应的html文件！！**
> 

### 能够做点什么

#### 1. 针对扩展新增自定义插件

### 学到的东西

#### 1. 模仿nodejs实现自定义的函数包裹，并从中获取额外的上下文对象
![hexo模仿的nodejs追加的module以及export对象](hexo模仿的nodejs追加的module以及export对象.png)

#### 2. 对外暴露extend对象代表不同阶段的扩展，实现插件编程范式

#### 3. 本地简易数据库warehouse-json编程