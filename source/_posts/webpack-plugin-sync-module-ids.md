---
title: SyncModuleIdsPlugin
description: SyncModuleIdsPlugin
author: Zhenggl
date: 2023-01-05 06:00:39
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
cover: SyncModuleIdsPlugin封面.png
---

### 前言
> 维护着一个`data`属性，主要负责记录与读取之前的构建记录，关于这个构建记录，官方的描述是：*webpack 的 "records" 记录 - 即「用于存储跨多次构建(across multiple builds)的模块标识符」的数据片段*，一般可以通过与`webpack.config.js`配合配置，直接讲对应的文件给输出出来，可以使用此文件来跟踪在每次构建之间的模块变化。只要简单的设置一下路径,就可以生成这个 JSON 文件

### 如何使用
> 配合`webpack.config.js`，在构建打包的时候输出对应的文件，便于调试调整优化打包配置文件，如下图所示：
![SyncModuleIdsPlugin与webpack.config.js的配合使用](SyncModuleIdsPlugin与webpack.config.js的配合使用.png)

### 监听的钩子生命周期有
1. Compiler.hooks.readRecords: 从之前的缓存(data，map对象)中读取缓存过的构建记录；
2. Compiler.hooks.emitRecords: 写入构建缓存记录
3. Compiler.hooks.thisCompilation: