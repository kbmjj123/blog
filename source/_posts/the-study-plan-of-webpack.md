---
title: webpack学习计划
description: webpack学习计划
author: Zhenggl
date: 2022-12-30 08:54:59
categories:
  - [webpack]
tags:
  - webpack
cover_picture: webpack学习计划封面.jpg
---

### 前言
> 现在基本上每一个前端童鞋都与webpack在工作学习上都有所依赖，不管是以前还是未来，webpack都将占据非常重要的地位，而且都会与每一位前端童鞋息息相关，那么我是否可以像之前阅读其他的源码一样，来通过阅读`webpack`的源码，一步一步跟着代码来读懂这个`webpack`呢？起初我也是这么做的，然后我放弃了，其中的代码量之多，而且又超级复杂，错综复杂我觉得已经不能够用来形容这个`webpack`了，:tired_face: 不可能完全通过单纯的硬着头皮来阅读代码来理解，因此，我觉得需要整理一套方便自己来理解这个`webpack`的一整套方案来理解整个`webpack`框架

### webpack的组成结构
> 通过简单的通读`webpack`的相关源代码，自己整理了关于`webpack`的几个比较重要模块，如下图所示：
> ![Webpack的几个关键模块](Webpack的几个关键模块.png)
> 这边也将在后续的几篇文章中进行详细分析！

### webpack是什么？
![webpack是什么](webpack是什么.png)
> `webpack`是一个函数，一个接收`options`配置(比如webpack.config.js)以及一个回调函数(下称callback)的函数，而且这里的callback必传，否则，执行该函数时，将直接返回一个`Compiler`对象，然后再手动调用该对象的`run`方法，如下图所示：
![webpack就是一个接收配置以及回调函数的函数](webpack就是一个接收配置以及回调函数的函数.png)

### webpack的执行过程？
> 一般地，我们 :u6709: :two: 种方式来使用`webpack`进行打包动作，如下图所示：
> ![webpack被调用的方式](webpack被调用的方式.png)

:confused: 既然这个`webpack`是一个函数，那么他的执行过程是怎样的呢？？？
:point_right: `webpack`的执行过程相对比较简单，无非是创建一个`Compiler`，并将这个`Compiler`对象返回出来！webpack的执行过程就结束了，关键在于`Compiler`的创建过程，那么 :confused: 这个`Compiler`的创建过程是如何的呢？如下图所示：
![创建Compiler的过程](创建Compiler的过程.jpg)
:point_up: 从这里我们可以看出要理解`webpack`的使用，关键在于理解这个`Compiler`对象是如何被创建出来的，因为`webpack`创建完成`Compiler`对象之后，可以说他的任务就完成了，接下来将任务转交给`Compiler`对象来接管了！ :point_down: 来具体分析每一个步骤的过程都是怎样的！！

#### 1、将普通的webpack.config.js中的配置转换为标准的webpack配置对象
```javascript
// 位于lib/config/normalization.js的116行
const getNormalizedWebpackOptions = config => {
  return {...}
}
```
![webpack官方的核心组成](webpack官方的核心组成.png)
> 官方提供了关于输入、输出、loader、plugins、mode、浏览器兼容、环境等几个核心模块的解析，但是咱们这里上面这里的代码可以看出，其实`webpack.config.js`可以支持的配置远远不止这里几个，其中 :u6709: 未曾提及过的其他额外属性， :point_down: 结合[官方配置文档](https://www.webpackjs.com/configuration/#use-different-configuration-file)将一一列举并具体描述出来！
> [官方配置](https://www.webpackjs.com/configuration)

**相关的重要属性说明**

+ entry
  - 描述：webpack开始打包的应用程序的入口
  - 可接收的值：字符串 | 字符串数组 | 函数 | 对象(属性又可以是字符串、数组、对象(包含import属性))
  - 高级用法：传递函数作为入口，代表动态入口
  - 实现原理：关键在于`getNormalizedEntryStatic`方法的实现，关于此方法的实现逻辑如下图所示：
  ![entry的解析过程](entry的解析过程.jpg)
+ externals
  - 描述：外部扩展，用于防止将某些bundle打包到bundle，采用从外部(比如cdn)的方式来加载
  - 可接收的值：`string` `object` `function` `RegExp` `[string, object, function, RegExp]`
  - 官方链接：[官方链接](https://www.webpackjs.com/configuration/externals/)
+ module
  - 描述：在模块化编程中，开发者将程序分解为功能离散的 chunk，并称之为 模块
  - 官方链接：[官方链接](https://www.webpackjs.com/concepts/modules/)
  - 官方不同的loader：[不同的loader](https://www.webpackjs.com/loaders/)
+ optimization
  - 描述：会根据你选择的 mode 来执行不同的优化
  - 官方链接：[官方链接](https://www.webpackjs.com/configuration/optimization/)
  - 官方通用的分块策略：[SplitChunksPlugin](https://www.webpackjs.com/plugins/split-chunks-plugin/)
+ output
  - 描述：位于对象最顶级键(key)，包括了一组选项，指示 webpack 如何去输出、以及在哪里输出你的「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容」
  - 官方链接：[官方链接](https://www.webpackjs.com/configuration/output/)
+ plugins
  - 描述：选项用于以各种方式自定义 webpack 构建过程。webpack 附带了各种内置插件，可以通过 webpack.[plugin-name] 访问这些插件
  - 官方链接：[官方链接](https://www.webpackjs.com/configuration/plugins/)
  - 官方插件：[官方插件](https://www.webpackjs.com/plugins/)

#### 2、对webpack配置对象的options进行生效化
![追加日志属性](追加日志属性.png)

#### 3、执行webpack框架服务中的第一个插件：NodeEnvironmentPlugin，主要是提供日志、输入、输出流的支撑
![第一插件给Compiler追加日志属性](第一插件给Compiler追加日志属性.png)

#### 4、执行webpack.config.js中的plugins对应的插件
![插件被调用的时机](插件被调用的时机.png)
![插件定义的规范要求来源](插件定义的规范要求来源.png)
![自定义插件的实现](自定义插件的实现.png)

#### 5、对webpack基础的配置属性进行额外追加动作
> 详见`/lib/config/defaults.js`中的`applyWebpackOptionsDefaults`方法中的实现

#### 6、对compiler赋予公共的webpack基础性插件动作，实现公共的webpack打包动作流水线
> 此环节主要是`webpack`生态中的内部插件的使用，通过封装的公共的options中的属性参数，来决定是否使用`webpack`中的内部插件来提供额外的支撑，比如`webpack.config.js`中定义了以下的代码：
```javascript
module.exports = {
  //...
  externals: {
    jquery: 'jQuery',
  },
};
```
![externals额外的配置](externals额外的配置.png)
