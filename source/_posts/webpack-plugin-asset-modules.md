---
title: AssetModulesPlugin.js
description: AssetModulesPlugin, webpack中关于asset资源的处理
author: Zhenggl
date: 2023-02-11 09:01:50
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
cover_picture: AssetModulesPlugin封面.jpg
---

### 我是谁
> `webpack`中与assets资源进行交互的模块，逐渐通过对`NormalModuleFacotry.hooks.createParser`、`NoemalModuleFactory.createGenerator`、`Compilation.hooks.renderManifest`等几个钩子容器函数的监听！
![AssetModules所做的钩子函数监听](AssetModules所做的钩子函数监听.png)

### 干预的钩子函数
> 通过提供的干预的钩子函数，创建对应的Parser以及Generator对象，来处理`webpack`中的默认的对`asset`资源加载的统一配置，也就是对配置的实现！

#### 1、NormalModuleFactory.hooks.createParser
> 针对不同类型的`createParser`创建对应的`Parser`对象，主要由以下 :point_down: 几种类型的asset：

| asset类型 | 对应创建的Parser |
|---|---|
| `asset` | AssetParser |
| `asset/inline` | AssetParser |
| `asset/resource` | AssetParser |
| `asset/source` | AssetSourceParser |


#### 2、NormalModuleFactory.hooks.createGenerator
> 针对不同类型的`createGenreator`创建不同参数的`Genreator`对象，主要由以下 :point_down: 几种类型的asset：


#### 3、Compilation.hooks.renderManifest
