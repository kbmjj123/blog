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

#### 编译动作触发的开始：加载模块--load并生成module
> 一切从`compiler.hooks.make` --> `EntryPlugin中触发` --> `Compilation.addEntry`操作！
> 而在这个`addEntry`方法中，最终进入到了`addModuleTree`以及`handleModuleCreation`阶段，然后到了`addModule`，该方法则是实际的`module-build`阶段！
> :stars: ==> 最终在这个`handleModuleCreation`方法中，调用的`_handleModuleBuildAndDependencies()`方法中，通过AsyncQueue的processor，来触发到了`_buildModule(module, callback)`。
> 真正通过每个`NormalModule`对象自身的`build`方法，通过传递的参数，来进行每个module自身的build动作

:point_right: parser解析动作的过程：
在`NormalModule`对象中，都拥有一个`parser`属性，该属性代表着当前模块的一个解析器对象，关于这个`NormalModule`的解析过程，具体可以看 [NormalModule](/2023/01/29/module-and-its-children/#NormalModule)

:alien: 至此，已经完成的module的加载，其中的依赖树也已经形成

#### 模块完成--finish
> **此阶段实现chunk的生成动作！！！**
**以下是对应的module，然后由module来生成chunk的生成过程**
![module以及chunk的生成过程](module以及chunk的生成过程.png)

:confused: 这里为什么要生成`module`以及`chunk`呢？ :point_right: 从 [代码的生成过程](/2023/02/01/webpack-plugin-javascript-modules/#最简单的单依赖生成结果分析) 中我们可以知道，对于在模块中引用的外部模块，将会在最终的结果代码内容中被`__webpack_require__()`方法所引入，而这里的`chunk`就是存储着即将被引用的内容，比如`"./src/module1.js"`

#### 模块封存--seal
> **此阶段实现将chunk生成在js中引用的外部依赖内容，并结合框架注释以及其他相关代码实现目标代码的生成！！！**
> 在开始进行这个阶段的具体分析之前，先来了解一下`webpack`中的`sources`源代码机制

##### source体系
> `webpack`中的源代码表现形式为一`source`对象，而它则是由[webpack-sources](https://www.npmjs.com/package/webpack-sources)库来提供的，**包含代表一个源的多个类。可以向 `Source` 询问源代码、大小、源映射和哈希**，其体系组成结构如下图所示：
![Source以及其子类](Source以及其子类.png)

:alien: 从上图可以看出`Source`作为所有source的抽象基类，其提供了对子类的`source()`的公共访问api(这里不同的子类对不同的api都有不同的访问机制，因此每一次的调用，都将会是比较"昂贵"的)，主要 :u6709: 以下几个：
1. source(): 将表示的源代码返回为字符串或缓冲区，由各个子类去实现，直接调用父类的将会报错，其返回结果定义如下：
   ```javascript
    Source.prototype.source() -> String | Buffer
   ```
2. buffer(): 将表示的源代码返回为`Buffer`，字符串被转换为 `utf-8`;
3. size(): 返回表示的源代码的大小（以字节为单位）;
4. map(): 将表示的源代码的 `SourceMap` 作为 `JSON` 返回，如果没有 `SourceMap` 可用，可能会返回 null，其返回结果定义如下：
   ```javascript
    Source.prototype.map(options?: Object) -> Object | null
   ```
5. sourceAndMap(): 返回source code(source()方法返回的内容)以及source map(map()方法返回的内容)，此方法可能比起单独调用source()以及map()来调用具有更好的性能，其返回的结果定义如下：
   ```javascript
    Source.prototype.sourceAndMap(options?: Object) -> {
      source: String | Buffer,
      map: Object | null
    }
   ```
6. updateHash(): 使用表示的源代码的内容更新提供的 `Hash` 对象。 （Hash 是一个有更新方法的对象，用字符串值调用）;
  
:point_down: 是子类的相关介绍：

| 子类 | 描述 | 使用方式 |
|---|---|:---|
| RawSource | 表示没有 `SourceMap` 的源代码 | `new RawSource(sourceCode: String ｜ Buffer)` |
| OriginalSource | 表示源代码，它是原始文件的副本 | `new OriginalSource(sourceCode: String ｜ Buffer, name: String)` |
| SourceMapSource | 用 `SourceMap` 表示源代码，可以选择为原始源添加一个额外的 `SourceMap` | `new SourceMapSource(sourceCode: String ｜ Buffer,name: String,sourceMap: Object ｜ String ｜ Buffer,originalSource?: String ｜ Buffer,innerSourceMap?: Object ｜ String ｜ Buffer,removeOriginalSource?: boolean)` |
| CachedSource | 包装一个Source，将map、source、buffer、size、sourceAndMap的返回结果缓存到内存中，而`updateHash`未缓存。它尝试重用来自其他方法的缓存结果以避免计算，比如当 `source` 已经被缓存时，调用 size 将从缓存的 source 中获取大小，调用 `sourceAndMap` 只会在包装的 `Source` 上调用 map。 | `new CachedSource(source: Source ｜ () => Source, cachedData?: CachedData)` |
| PrefixSource | 使用提供的字符串为装饰源的每一行添加前缀 | `new PrefixSource(prefix: String,source: Source ｜ String ｜ Buffer)` |
| ConcatSource | 将多个源或字符串连接到一个源 | `new ConcatSource(...items?: Source ｜ String)` |
| ReplaceSource | 用源代码的替换和插入装饰 Source | - |
| CompatSource | 将类似于Source对象转换为真正的 `Source` 对象 | `CompatSource.from(sourceLike: any ｜ Source)` |
| SizeOnlySource | 表示只有尺寸大小的源代码 | `new SizeOnlySource(size: Number)` |

:trollface: 这里着重介绍一下**CachedSource**以及**ReplaceSource**两个对象
**CachedSource**
---
:star: 描述：包装一个Source，将map、source、buffer、size、sourceAndMap的返回结果缓存到内存中，尝试重用来自其他方法的缓存结果以避免计算！

:star: 构造方法：
```javascript
new CachedSource(source: Source);
new CachedSource(() => Source, cachedData? CachedData);
```
:stars: 一般的可以通过传递一个回调函数，通过返回一个source，使得`CachedSource`被包裹起来，而且仅被触发一次，后续针对这个source的相关访问，都由其包裹api来提供服务！

:star: 对外暴露的api
+ getCachedData(): 返回传递给构造函数的缓存数据，缓存的数据都会被转换为缓冲区，并避免使用字符串；
+ original(): 返回源代码对象`Source`;
+ originalLazy(): 懒加载的方式来返回源代码对象或者函数
 
**ReplaceSource**

:star: 描述：用源代码的替换和插入装饰 `Source`

:star: 对外暴露的api
+ replace(): 替换源代码的从某个开始位置到结束位置为另外一个字符串；
+ insert(): 往源代码的某个位置来插入另外一个字符串；

:warning: 这里的位置并不受其他的替换或者插入动作的影响！

##### generator关系图
> 在开始进行代码生成的时候，针对不同的文件扩展名，对应会有不同的解析协议，而`generator`就是作为不同解析的服务对象，对外暴露统一的方法api，实现运行时确认解析类型，以及针对类型生成不同的`source`源代码对象
![Generator继承关系图](Generator继承关系图.jpg)
:confused: 在开始之前，先来看以下的一个例子：
```javascript
import data from './data.json';
console.info(data);
```
:trollface: 这段代码在webpack执行的过程时，与"*.js"的解析， :u6709: 什么区别呢？
我们知道，这个"js"文件的解析，是由`JavascriptModulesPlugin`插件所提供的服务的，那么"*.json"是由谁来提供解析服务的呢？同样的，
```javascript
  // 在`WebpackOptionsApply.js`中的第280行中
  new JsonModulesPlugin().apply(compiler);
```
由`JsonModulesPlugin`插件来提供对json文件的代码解析生成源代码`Source`对象服务！
![json文件代码解析器以及生成器](json文件代码解析器以及生成器.png)

:stars: `JavascriptGenerator`与`JsonGenerator`都是`Generator`的子类，通过其公共的方法`generate`，来生成统一的`Source`子类，比如`JsonGenerator`生成的是`RowSource`，表示生成的是没有源代码的Source
```javascript
generate(
		module,
		{
			moduleGraph,
			runtimeTemplate,
			runtimeRequirements,
			runtime,
			concatenationScope
		}
	) {
    // ... 省略对json内容的处理
    return new RawSource(content);
  }
```

##### dependency关系图


> 在此阶段，`chunk`将会被转换为"可替换的对象"，等待被替换，具体过程，可以见 :point_down: 的关于seal阶段中的chunk转换过程：



#### 模块优化--optimeze

#### 模块分块--chunk

#### 模块哈希--hash

#### 模块重创--restore

### 我能够做点什么？


