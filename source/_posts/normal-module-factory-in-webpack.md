---
title: NormalModuleFactory的工作过程
description: NormalModuleFactory
author: Zhenggl
date: 2023-01-05 06:36:50
categories:
  - [webpack, NormalModuleFactory]
tags:
  - webpack
  - NormalModuleFactory
cover_picture: NormalModuleFactory封面.png
---

### 前言
> [官方链接](https://webpack.docschina.org/api/normalmodulefactory-hooks/)
> `Compiler`使用`NormalModuleFactory`模块生成各类模块，从`entry`入口开始，此模块回分解每个请求，解析配置文件`webpack.config.js`内容来查找进一步的请求，然后通过分解所有的请求以及解析新的文件来爬去全部的文件，最后，每个依赖项都会成为一个模块实例！！
> :confused: 那么`NormalModuleFactory`是如何从entry开始来解析的呢？解析过程是怎样的？
![NormalModuleFactory的创建过程](NormalModuleFactory的创建过程.png)

:point_up: 从这里我们可以清楚地知晓`NormalModuleFactory`是被`Compiler`所创建的，通过传递一个配置对象，来创建的`NormalModuleFactory`对象的，那么这个配置对象中的属性又是怎么一回事呢？
:point_right: 首先，webpack中的文件都是一个个的模块，也就是说要将文件“转变”为模块，需要fs文件模块，通过读取文件来进行的源文件的读取，但是node中仅仅只能够识别到普通的js/json/node等文件格式，像图片资源等这些，又如何被识别到呢？我们发现`webpack.config.js`中 :u6709: 一个`module`用来加载识别不同的文件后缀，然后来将其转变为可被识别到的模块的，因此我们可以得出 :point_down: 几个属性的描述：
1. fs: node环境下的文件系统工具，用来读取对应的文件资源；
2. resolverFactory: 提供`require.resolve`的方法工厂；
3. options: webpack.config.js中所定义的或者是在webpack中默认的module，用来匹配并识别对应的文件后缀资源服务

### enhanced-resolve
> [官方链接](https://www.npmjs.com/package/enhanced-resolve)
> 在开始进入学习之前，先来了解一下`enhanced-resolve`，这个是传递进来的`resolverFactory`对象，**它是一个方法工厂对象，旨在针对不同的类型提供不同的`resolve`方法对象，**
> 使用node.js 解析规则解析请求，提供了同步以及异步的API，创建方法允许创建自定义解析函数。
> 他拥有 :point_down: 几个特性：
1. 插件系统；
2. 提供自定义的文件系统；
3. 包含有同步与异步的nodejs文件系统；

使用方式如下：
```javascript
const resolve = require("enhanced-resolve");
resolve("/some/path/to/folder", "module/dir", (err, result) => {
	result; // === "/some/path/node_modules/module/dir/index.js"
});
resolve.sync("/some/path/to/folder", "../../dir");
// === "/some/path/dir/index.js"
const myResolve = resolve.create({
	// or resolve.create.sync
	extensions: [".ts", ".js"]
	// see more options below
});
myResolve("/some/path/to/folder", "ts-module", (err, result) => {
	result; // === "/some/node_modules/ts-module/index.ts"
});
```

:stars: 而`webpack`所提供的`ResolverFactory`，则是聚合了hooks以及`enhance-resolve`，通过“懒加载”的方式，来加载对应的resolve方法，从而用其来加载对应的文件资源，当创建一个`NormalModuleFactory`对象的时候，将会对应触发其属性`resolverFactory.get('loader', resolveOptions)`方法，来获取通过`webpack.config.js`配置文件中所传递的`resolve`对象属性来获取对应的`enhance-resolve`的工厂方法来resolve成为对应的模块
![底层调用的enhance-resolve来创建一个resolver](底层调用的enhance-resolve来创建一个resolver.png)
:point_up: 这里所创建的`loaderResolver`对象，其内部包含了`fs`模块，主要利用其来加载对应的模块

:stars: 综上所述，结合`webpack.config.js`中的`resolve`属性，我们不难想到，原来这个`webpack.config.js`中`resolve`可以说是同一个，也就是`webpack`对`enhanced-resolve`做了一层封装，那么两者所需的配置应该是一致的！

### NormalModuleFactory是什么？
> 与`Compiler`一样，`NormalModuleFactory`也聚合了`Tapable`类对象`hooks`，提供的相对应的钩子容器方法，如下图所示：
> ![NormalModuleFactory组成结构图](NormalModuleFactory组成结构图.png)

### NormalModuleFactory创建过程设置的钩子函数
> 在了解关于`NormalModuleFactory`的创建过程所涉及到的钩子函数时，先来看一下`NormalModuleFactory`中所拥有的钩子容器，如下图所示：

![NormalModuleFactory的钩子容器属性](NormalModuleFactory的钩子容器属性.png)

:star: 在创建一个`NormalModuleFactory`工厂对象的时候，注册了以下两个钩子函数：
1. factorize：在其回调方法中触发`resolve` --> `afterResolve` --> `createModule` --> `module`
2. resolve: 执行文件的resolve动作，从entry入口文件开始，将所依赖的项都 `point_right` 成为`module`

:stars: 最终生成一个个的`NormalModule`模块对象，这里的`NormalModule`对象的一个依赖关系是：
![NormalModule模块的继承关系](NormalModule模块的继承关系.jpg)

### NormalModuleFactory的create方法的执行过程是怎样的？
![NormalModuleFactory的create方法执行过程](NormalModuleFactory的create方法执行过程.jpg)

:confused: 这里有一个疑问，就是`Compiler`在创建完成这个`NormalModuleFactory`对象之后，就撒手不管了，放在这里，等到进入其`compilation`钩子方法的时候，因需通过依赖相关的文件而需要使用该`NormalModuleFactory.create`方法，这里咱们等到触发该方法时，调用对应的方法即可，此处预留相应的学习链接!!!