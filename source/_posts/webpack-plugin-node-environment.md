---
title: webpack插件-NodeEnvironmentPlugin
description: webpack插件-NodeEnvironmentPlugin
author: Zhenggl
date: 2023-01-04 08:19:54
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
cover: NodeEnvironmentPlugin封面.jpg
---

### 前言
> `webpack`内部的自执行的插件，主要负责提供`infrastructureLogger`属性到`compiler`对象上，并创建对应的文件属性到`compiler`对象上，然后监听到`compiler.hooks.beforeRun`钩子容器中，将过程日志怼到标准输入中！
> **用于基础设施水平的日志选项**
>