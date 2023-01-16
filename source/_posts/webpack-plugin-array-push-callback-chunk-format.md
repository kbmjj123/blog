---
title: ArrayPushCallbackChunkFormatPlugin
description: ArrayPushCallbackChunkFormatPlugin
author: Zhenggl
date: 2023-01-14 08:29:31
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
cover_picture:
---

### 前言
> 作为真实chunk内存生成的执行者，借助于`StarupHelpers`工具对象，从而来生成最终的js中比较`奇怪`的内容

### 如何引进调用
> `ArrayPushCallbackChunkFormatPlugin`插件，由`WebpackOptionsApply`中内置集成调用，主要是根据`webpack.config.js`中的`output.chunkFormat(等于'array-push')`时集成进来！如下图所示：
> ![集成方式](集成方式.png)

### 做了什么事
> 只针对`Compilation`对象的`hooks.thisCompilation`钩子函数设置了监听动作，当触发`Compilation.hooks.thisCompilation`时，优先调用该方法，在该方法回调中主要做了 :point_down: 几个操作：
1. 通过接收传递的`compilation`对象参数，再额外对`compilation.hooks.additionalChunkRuntimeRequirements`设置了监听；
   //TODO 这里的监听动作待补充完善
2. 从`compilation`中创建出全新的临时`hooks`，该hooks的内容如下：
   ![从compilation中创建出来的全新hooks](从compilation中创建出来的全新hooks.png)
3. 针对全新的`hooks`的`renderChunk`以及`chunkHash`钩子函数设置监听动作


### 全新hooks关键动作具体解析
// TODO 什么时候被触发的呢？待学习
> 

#### 目标chunk内容生成的具体实现--renderChunk

#### 更新chunk的hash值--chunkHash 

#### 关键生成js内容的帮助对象--StarupHelpers
