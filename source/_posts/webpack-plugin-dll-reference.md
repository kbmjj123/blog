---
title: DllReferencePlugin
description: DllReferencePlugin
author: Zhenggl
date: 2023-01-11 12:47:12
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
cover: DllReferencePlugin封面.jpg
---
### 前言
> {% link 官方链接 https://www.webpackjs.com/plugins/dll-plugin/ true 官方链接 %}
> **DllPlugin一般与DllReferencePlugin配套使用**， :confused: 为什么这么说呢？
> 1. DllPlugin一般用来在webpack中创建一个单独的`dll-only-bundles`，同时生成一个名为`manifest.json`文件；
> 2. DllReferencePlugin则是会通过引用上述第一步所创建出来的`manifest.json`文件，来告知如何加载模块；
> 一般在`webpack.config.js`中使用，此插件会把 `dll-only-bundles` 引用到需要的预编译的依赖中，用某种方法实现了拆分 bundles，同时还大幅度提升了构建的速度，从字面意思上称之为："动态链接引用插件+对应json配置使用"

### dll动态链接库
> **动态链接库(Dynamic-link library，简写为DLL)**，是在winsows系统中实现共享函数库的一种方式，一般就是把一些经常回共享的代码制作成DLL文档，当可执行文件调用到DLL文档中的函数的时候，才会将DLL加载到内存中，当程序有需求时函数才进行过滤，可大幅降低存储！

:alien: DLL其实就是一个缓存文档，使用的时候，不用重复打包，减少打包时间，一般通过输出一个目标target文件以及对应的该文件的一个映射表，来提供给实际调用方来使用！

### 使用方式(额外配置，非`webpack`内部自动配置)
> 一般通过在`webpack.config.js`中额外配置使用，在webpack内部中并无自动集成。
> 下面 :point_down: 通过对两个插件的配置与实际使用场景进行具体的分析一波

#### DllPlugin配置与使用
> :confused: 既然`DllPlugin`是用来生成单独的`dll-only-bundles`的，那么它是如何被使用来生成这个`dll`文件的呢？
```javascript
module.exports = {
  resolve: {
    extensions: [".js", ".jsx"]
  },
  entry: {
    alpha: ["./alpha", ".a", "module"],
    beta: ["./beta",  "./b", "./c"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "MyDll.[name].js",
    library: "[name]_fullhash"
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dist", "[name]-manifest.json")
    })
  ]
};
```
:point_up: 这里通过`DllPlugin`告知webpack如何来生成、在哪里生成、生成的文件名称、入口等配置信息，而这里被alpha以及beta所依赖的文件内容如下：
![dll中被引用的文件内容](dll中被引用的文件内容.png)
这里每个文件的目的都是简单的导出一个字符串供使用！！！
对应的输出结果文件已经对应的内容如下：
![DllPlugin生成的结果](DllPlugin生成的结果.png)
在 :point_up: 这个输出的文件中包含了从require和import中request到模块id的映射，供下方 :point_down: 的`DllReferencePlugin`来使用！

:point_up: 过程中的配置属性定义如下：

| 参数 | 是否必填 | 描述 |
|---|---|:---|
| context | 否 | `manifest`文件中请求的context，默认是webpack的context |
| format | 否 | boolean值，是否格式化输出manifest.json的内容 |
| name | 是 | 暴露出来的Dll的函数名称`[fullhash]&[name]` |
| path | 是 | 即将输出的manifest.json文件的**绝对路径** |
| entryOnly | 否 | boolean值，是否仅仅暴露入口 |
| type | 否 | `dll-only-bundle`的类型 |

#### DllReferencePlugin配置与使用
1. 配置dll的使用
```javascript
module.exports = {
	plugins: [
    // 配置使用dll动态链接
		new webpack.DllReferencePlugin({
			context: path.join(__dirname, "..", "dll"),
			manifest: require("../dll/dist/alpha-manifest.json") // eslint-disable-line
		}),
		new webpack.DllReferencePlugin({
			scope: "beta",
			manifest: require("../dll/dist/beta-manifest.json"), // eslint-disable-line
			extensions: [".js", ".jsx"]
		})
	]
};
```
2. 根据配置打包输出资源
```javascript
var path = require("path");
var webpack = require("../../");
module.exports = {
	// mode: "development || "production",
	entry: "./example.js",
	// 当前debug目录
	context: __dirname,
	// development模式
	mode: "development",
	// 配置source-map
	devtool: "source-map",
	plugins: [
		new webpack.DllReferencePlugin({
			context: path.join(__dirname, "..", "dll"),
			manifest: require("../dll/dist/alpha-manifest.json") // eslint-disable-line
		}),
		new webpack.DllReferencePlugin({
			scope: "beta",
			manifest: require("../dll/dist/beta-manifest.json"), // eslint-disable-line
			extensions: [".js", ".jsx"]
		})
	],
	output: {
		path: path.join(__dirname, "./dist")
	}
};


```
4. 在实际的代码中使用
```javascript
// 常规引用方式调用
console.log(require("../dll/alpha"));
console.log(require("../dll/a"));
// 前置引用方式调用
console.log(require("beta/beta"));
console.log(require("beta/b"));
console.log(require("beta/c"));
console.log(require("module"));
```
5. 使用打包后的结果js文件
![dll输出结果使用](dll输出结果使用.png)

:stars: 关于其中的参数定义如下 :point_down:

| 参数 | 是否必填 | 描述 |
|---|---|:---|
| context | 是 | **(绝对路径)** manifest (或者是内容属性)中请求的上下文 |
| extensions | 否 | 用于解析 dll bundle 中模块的扩展名 (仅在使用 `scope` 时使用) |
| manifest | 是 | 包含 `content` 和 `name` 的对象，或者是一个字符串 —— 编译时用于加载 `JSON manifest` 的绝对路径 |
| content | 否 | 请求到模块 id 的映射（默认值为 `manifest.content`） |
| name | 否 | dll 暴露地方的名称（默认值为 `manifest.name`） |
| scope | 否 | dll 中内容的前缀，默认是`..` |
| sourceType | 否 | dll 是如何暴露的 |


### 这对工具在什么场景下使用？
> 任何的插件都 :u6709: 其使用场景，`DllPlugin`与`DllReferencePlugin`也不例外，那么这对插件的使用场景是怎样的呢？
> :confused: 假如我开发了一个工具库或者工具方法，可以通过单独打包的方式，先打包出来一个干净的dll动态链接库，然后对应地提供其配置方法(即`manifest.json`)，然后直接在要集成使用的项目中来使用！