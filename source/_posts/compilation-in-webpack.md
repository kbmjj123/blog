---
title: webpack中的Compilation
description: webpack中的Compilation
author: Zhenggl
date: 2023-01-11 09:40:34
categories:
  - [webpack, Compilation]
tags:
  - webpack
cover_picture: Compilation封面.jpg
---

### 前言
{% link 官方链接 "https://www.webpackjs.com/api/compilation-hooks/" true 官方链接 %}
> `webpack`中真正的"编译器执行者"，`Compilation`实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。 它会对应用程序的依赖图中所有模块， 进行字面上的编译(literal compilation)。 在编译阶段，模块会被加载(`load`)、封存(`seal`)、优化(`optimize`)、 分块(`chunk`)、哈希(`hash`)和重新创建(`restore`)。
> :point_down: 是关于`Compilation`对象的组成结构：

### Compilation的工作流程是怎样的呢？
> :alien: 其实`Compilation`自身并没有做任何的动作，而是一堆的插件它们负责来实现的！因为`Compiler`创建完这个`Compilation`对象之后，就没有针对这个`Compilation`对象进行调用其相关的API了，而是将`Compilation`以及`params`作为参数，来触发`Complier.hooks.thisCompilation`

![最简单webpack对应的Compilation的待执行插件队列](最简单webpack对应的Compilation的待执行插件队列.png)

:trollface: 首先，针对一个上面最简单的`webpack.config.js`进行一个针对`thisCompilation`事件的一个插件执行队列分析，从上图中我们可以对应整理对应的执行队列：

:point_down: 表中的"是否webpack内置集成"，指的是在`WebpackOptionsApply.js`中默认集成的！

| 插件名称 | 是否webpack内置集成 | 描述 |
|---|---|:---|
| ArrayPushCallbackChunkFormatPlugin | :white_check_mark: | 格式化输出`*.js`中的内容执行者 |
| JsonpChunkLoadingPlugin | :x: |  |
| StartupChunkDependenciesPlugin | :x: |  |
| FetchCompileWasmPlugin | :x: |  |
| FetchCompileAsyncWasmPlugin | :x: |  |
| WorkerPlugin | :white_check_mark: |  |
| SplitChunksPlugin | :white_check_mark: | 根据“条件”自动拆分chunks |
| ResolverCachePlugin | :white_check_mark: |  |

#### 编译动作触发的开始：加载模块--load
> 一切从`compiler.hooks.make` --> `EntryPlugin中触发` --> `Compilation.addEntry`操作！
> 而在这个`addEntry`方法中，最终进入到了`addModuleTree`以及`handleModuleCreation`阶段，然后到了`addModule`，该方法则是实际的`module-build`阶段！
> :stars: ==> 最终在这个`handleModuleCreation`方法中，调用的`_handleModuleBuildAndDependencies()`方法中，通过AsyncQueue的processor，来触发到了`_buildModule(module, callback)`。
> 真正通过每个`NormalModule`对象自身的`build`方法，通过传递的参数，来进行每个module自身的build动作

:point_right: parser解析动作的过程：
在`NormalModule`对象中，都拥有一个`parser`属性，该属性代表着当前模块的一个解析器对象，关于这个`NormalModule`的解析过程，具体可以看 [NormalModule](/2023/01/29/module-and-its-children/#NormalModule)

:alien: 至此，已经完成的module的加载，其中的依赖树也已经形成

#### 模块封存--seal


#### 模块优化--optimeze

#### 模块分块--chunk

#### 模块哈希--hash

#### 模块重创--restore

### 我能够做点什么？


