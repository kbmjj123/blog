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

### Compiler的组成
![Compiler](Compiler.png)

### Compiler是什么?执行过程是怎样的？
> Compiler 模块是 webpack 的主要引擎，它通过 CLI 或者 Node API 传递的所有选项创建出一个 `compilation` 实例。 它扩展（extends）自 [Tapable](Tapable) 类，用来注册和调用插件。 大多数面向用户的插件会首先在 `Compiler` 上注册。
> 首先，先来看一下 :point_down: 的一副Compile的`run`方法的执行过程所触发的钩子函数，以及都有哪些插件在对应的钩子容器中添加了各自的钩子函数动作：
![Compiler的run方法触发的钩子函数](Compiler的run方法触发的钩子函数.png)
:point_up: 我们可以清楚地了解到`run`方法的执行过程， :point_down: 将一一来分析每一个节点过程

#### 1、触发beforeRun方法
> 在开始执行一次构建之前调用，`compiler.run` 方法开始执行后立刻进行调用

| 描述 | 值 |
|:---|:---|
| 传递参数 | `Compiler`对象 |
| 调用方式 | AsyncSeriesHook |
| 相关插件 | {% post_link webpack-plugin-progress ProgressPlugin.js %}、{% post_link webpack-plugin-node-environment NodeEnvironmentPlugin.js %} |

:point_up: 两个插件，主要做的动作有：
1. `ProgressPlugin`负责进行进度的输出信息；
2. `NodeEnviromentPlugin`负责日志环境以及相关的`fs`环境的赋值操作等！

#### 2、进入run方法
> 开始进入run动作，目前`webpack`中只有`ProgressPlugin`触发了对应的钩子函数！上面已经具体介绍过，这里就不再重复阐述

#### 3、readRecords方法
> 读取之前是否有缓存过的相关记录动作，该方法对应的介绍如下：

| 描述 | 值 |
|:---|:---|
| 传递参数 | 当前调用的plugin对象，以及一个回调函数，作为异步回调通知的动作 |
| 调用方式 | AsyncSeriesHook |
| 相关插件 | {% post_link webpack-plugin-sync-module-ids SyncModuleIdsPlugin.js %} |

:point_up: 插件`SyncModuleIdsPlugin`做的主要事情有：
:point_right: 获取`Compiler`对象中的`intermediateFileSystem`属性，用来从之前缓存中获取已经存储的信息

#### 4、创建模块工厂对象normalModuleFactory
![创建编译所需的参数](创建编译所需的参数.png)
> 将创建好的`NormalModuleFactory`对象缓存到`_lastNormalModuleFactory`属性中，触发`NormalModuleFactory`对象被创建的钩子动作

| 描述 | 值 |
|:---|:---|
| 传递参数 | 当前调用的`normalModuleFactory`对象 |
| 调用方式 | AsyncSeriesHook |
| 相关插件 | {% post_link webpack-plugin-ignore IgnorePlugin.js %}、{% post_link webpack-plugin-normal-module-replacement NormalModuleReplacement.js %} |

**具体的过程描述如下：**
:point_down: 创建一个`NormalModuleFactory`对象，并触发`hooks.normalModuleFactory`钩子方法，将`normalModuleFactory`作为参数传递过去！

**IgnorePlugin所做的事情：**
![IgnorePlugin间接对NormalModuleFactory以及ContextModuleFactory设置钩子监听](IgnorePlugin间接对NormalModuleFactory以及ContextModuleFactory设置钩子监听.png)
:point_up: 所做的事情主要是间接设置对`normalModuleFactory.hooks.beforeResolve`以及`contextModuleFactory.hooks.beforeResolve`钩子函数的监听，当这两个钩子容器触发的时候，调用自身的checkIgnore方法

**NormalModuleReplacement所做的事情：**
:point_right: 针对`NormalModuleFactory.hooks.beforeResolve以及afterResolve`设置监听，当由`NormalModuleFactory`来创建的时候，触发该动作，实现采用正则匹配的方式，来替换即将导入的依赖文件，比如将文件A替换为文件B等骚操作！

#### 5、创建上下文工厂对象contextModuleFactory

#### 6、进入beforeCompile方法
> 通过 :point_up: 第4、5步中创建的`params(包含有：normalModuleFactory、contextModuleFactory)`参数，进入`beforeCompile`钩子容器，将params作为参数来进行触发`beforeCompile`方法

| 描述 | 值 |
|:---|:---|
| 传递参数 | `{normalModuleFactory, contextModuleFactory}` |
| 调用方式 | AsyncSeriesHook |
| 相关插件 | {% post_link webpack-plugin-dll-reference DllReferencePlugin.js %}、{% post_link webpack-plugin-lazy-compilation LazyCompilationPlugin.js %} |

**插件DllReferencePlugin的执行过程如下：**
![beforeCompile阶段DllReferencePlugin的执行过程](beforeCompile阶段DllReferencePlugin的执行过程.png)
简单描述： :point_right: 读取通过`webpack.config.js`传递进来的插件配置，并获取该配置中的`manifest`属性，将这个属性的值进行解析获取，并最后将解析的结果值存储在当前对象中的`_compilationData`属性中，以便于后续使用

**插件LazyCompilationPlugin的执行过程如下(内部插件)：**
![LazyCompilationPlugin的实验性使用](LazyCompilationPlugin的实验性使用.png)
简单描述： :point_right: 该插件是一个实验性的插件，由`webpack.config.js`通过`experiments.lazyCompilation`配置属性来进行配置，目的是使用动态导入的方式来编译！

#### 7、触发compile方法
> 触发compile方法，并传递`{normalModuleFactory, contextModuleFactory}`对象作为参数

| 描述 | 值 |
|:---|:---|
| 传递参数 | `{normalModuleFactory, contextModuleFactory}` |
| 调用方式 | AsyncSeriesHook |
| 相关插件 | {% post_link webpack-plugin-dll-reference DllReferencePlugin.js %}、DelegatedPlugin.js、ExternalsPlugin.js |

**插件DllReferencePlugin的执行过程如下：**
简单描述： :point_right: 获取从上一步(`beforeCompile`)阶段所缓存下来的`_compilationData`属性中的值，并结合当前插件所传递的dll配置参数，组装成为一个`externals`对象，然后触发`ExternalModuleFactoryPlugin`插件以及`DelegatedModuleFactoryPlugin`插件，并同时以`NormalModuleFactory`作为参数来进行传递!

:alien: 而这里的`ExternalModuleFactoryPlugin`插件，则是对`NormalModuleFactory.hooks.factorize`设置监听，当监听被触发时，将从额外的插件中将dll给单独打包！

:alien: 这里的`DelegatedModuleFactoryPlugin`插件，则是根据Dll配置参数的前缀属性`scope`，来对应分别对`NormalModuleFactory.hooks.factorize`或者是`module`钩子容器添加监听函数，然后返回最终的`DelegatedModule`模块交给`NormalModuleFactory`模块的对应钩子函数去执行操作，它是实现从dll以及externals中外部导入或者剔除打包的具体实现！

#### 8、thisCompilation创建一个Compilation对象，并触发hooks.compilation方法
> 首先，先看一下`Compilation`对象的创建过程，如下图所示：
> ![Compiler创建Compilation对象](Compiler创建Compilation对象.png)
> :point_up: 通过创建一`Compilation`对象，并将其作为参数，触发钩子容器中的：`thisCompilation`以及`compilation`方法
> 关于这里具体调用的那些插件的动作，可见

#### 9、开始make进行打包动作，完成打包finishMake
![Compiler执行make动作并触发真正的编译动作](Compiler执行make动作并触发真正的编译动作.png)
**从这里开始，进入编译阶段**，具体可以浏览 {% post_link webpack-plugin-entry-option EntryOptionPlugin插件 %}

然后是`finishMake`阶段，一般来说，该阶段暂无具体的插件干预，除了*ProvideSharedPlugin*，在完成`finishMake`阶段之后，将自动执行`compilation.finish()`以及`compilation.seal()`完成模块的编译以及内容的生成和优化动作，具体可分别查看
[compilation.finish阶段](/2023/01/11/compilation-in-webpack/#模块完成–finish)以及[compilation.seal阶段](/2023/01/11/compilation-in-webpack/#模块封存–seal)

#### 10、收尾工作afterCompile
> 收尾工作主要由`AutomaticPrefetchPlugin`来完成，通过该插件，获取编译阶段的module，并将其进行缓存下来

#### 11、是否通知shouldEmit
> 此阶段完成`Compiler.run(callback)`方法的执行，并进入其callback方法(onCompiled)的回调，
> 随后将调用自身的`emitAssets()`方法来根据`compilation`所生成的module来打包输出文件！
> 并触发`compiler.hooks.emit`钩子方法，告知即将要结果字符串写入到文件中了，在这个阶段，可以在文件被输出时，拦截获取其文件以及对应的内容，如下插件所示：
```javascript
class OutputLogPlugin {
	constructor(options) {
		this.options = options;
	}
	apply(compiler) {
		compiler.hooks.emit.tapAsync('OutputLogPlugin', (compilation, callback) => {
			console.info(compilation.getAssets());
			callback && callback();
		});
	}
}
module.exports = OutputLogPlugin;
```
![emit阶段获取文件以及其内容](emit阶段获取文件以及其内容.png)
:stars: 通过`compilation.getAssets()`可获取即将要生成的文件内容！

#### 12、完成所有工作done以及afterDone
> 此阶段仅有在设置了对`compilation.hooks.needAdditionalPass`进行了监听并返回了true结果的情况下，才会触发该动作!
> done在 `compilation` 完成时执行
> 
