---
title: webpack中的代码生成插件
description: webpack中的代码生成插件, webpack是如何生成代码的
author: Zhenggl
date: 2023-02-01 08:36:44
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
  - 代码生成
cover: webpack中的代码生成插件.png
---

### 前言
> 作为`webpack`中的代码生成器插件，主要负责将对应的`chunk`生成对应的结果字符串内容！
> 在开始具体解析之前，首先，现看一下 :point_down: :two: 个最简单的结果生成情况对比！
```javascript
 (() => { // webpackBootstrap
 	var __webpack_modules__ = ({

/***/ "./src/module1.js":
/*!************************!*\
  !*** ./src/module1.js ***!
  \************************/
/***/ ((module) => {

module.exports = function test() {
  console.info("我是来自于模块一中的test方法");
};

/***/ })

 	});
/************************************************************************/
 	// The module cache
 	var __webpack_module_cache__ = {};
 	
 	// The require function
 	function __webpack_require__(moduleId) {
 		// Check if module is in cache
 		var cachedModule = __webpack_module_cache__[moduleId];
 		if (cachedModule !== undefined) {
 			return cachedModule.exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = __webpack_module_cache__[moduleId] = {
 			// no module.id needed
 			// no module.loaded needed
 			exports: {}
 		};
 	
 		// Execute the module function
 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
 	
 		// Return the exports of the module
 		return module.exports;
 	}
 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const testFun = __webpack_require__(/*! ./module1 */ "./src/module1.js");

testFun();
console.log("很高兴认识你，webpack");
})();

 })()
;
//# sourceMappingURL=main.js.map
```

### 生成内容分析
> 首先先对比一下在无外部依赖以及有外部依赖的情况下，不同生成的结果文件的内容：
![webpack打包结果文件对比](webpack打包结果文件对比.png)

#### 最简单的无依赖生成结果分析
> 先看一下 :point_down: 的一个简单结果代码分析：
```javascript
 (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
console.log("很高兴认识你，webpack");
 })()
;
//# sourceMappingURL=main.js.map
```
针对上述的打包结果js内容进行一个代码拆分的分析：
![webpack打包出来的js内容拆分分析](webpack打包出来的js内容拆分分析.jpg)
关于这里为什么要拆分为几段区域来分析的原因，将在后面的源码解读中详细阐述开来，这里仅做一个大致的情况了解！

:stars: 关于生成的结果文件 :u6709: :point_down: 几点的特性，使得浏览器引入时正常使用：
1. 打包出来的结果文件是一个IIFE函数，包裹所有的内容；
2. 固定的注释格式，可拆分为几段；
3. 定义了一变量`__webpack_exports__`缓存对象，用以存放导出的对象；
4. 每一个被导出的模块都拥有专属的注释！

:alien: 上述有两个疑问，需要自己来回答：
:confused: 这里为啥要导出的是一个**IIFE立即执行函数**呢？
:point_right: 因为IIFE能够对变量起到一定的保护机制，使得在IIFE中定义的变量可以被保护起来，不受全局污染！

:confused: 这里的`webpack_exports_`对象， :u6709: 什么用处？
:point_right: 单纯从上述的结果代码来看，是看不出有什么用途，我们将这个问题放到下方的带有依赖模块的分析中来回答！

#### 最简单的单依赖生成结果分析
> 那么当有外部依赖的模块被导入进来使用的时候，那么这个事情的情况是怎样的呢？ :point_up: [前言](#前言)中的代码即为简单的导入一外部模块函数来使用的方式所生成的结果文件，下面针对其整体的生成结果文件进行一个分析
```javascript
const testFun = require("./module1");
testFun();
console.log("很高兴认识你，webpack");
```
:stars: 而这里对应生成的代码即为引言中的代码，代码中代码量比较多，这边稍微整理为较为简单的结构：
![webpack导入模块的执行过程](webpack导入模块的执行过程.png)
:stars: 这里针对上述的简单导出结果做一个补充分析：
1. 程序可拆分为准备阶段以及执行阶段；
2. 额外定义的其他变量：`__webpack_modules__`、`__webpack_modulce_cache__`、`__webpack_require()__`，这三者与`__webpack_exports__`之间的一个配合工作，来实现程序的**自动懒加载、缓存执行机制**
:point_right: 相应地整理为一个伪代码的描述如下所示：
![依赖模块加载过程](依赖模块加载过程.png)

:warning: 上述这里其实还是没有使用到 `__webpacke_exports__`变量，我们针对这里做一个简单的调整：
```javascript
const test = require('./module1');
test();
console.log("很高兴认识你，webpack");
module.exports = {
	kk: 123
};
```
:point_up: 这里在执行成功后，返回了一对象，而对应生成的内容如下：
![被导出的默认模块](被导出的默认模块.png)
:stars: 由此可见这个`__webpacke_exports__`变量是维护的自身导出的模块的！

#### 动态导入的模块依赖结果分析
> 以下是原始的入口文件内容，从下面可以看出我们通过`import`语法的方式，实现了动态导入的机制！
```javascript
const test = require('./module1');
test();
import('./module2').then(test2 => {
	test2.default();
});
console.log("很高兴认识你，webpack");
```
:stars: 输出的结果文件列表如下：
![异步加载的结果文件](异步加载的结果文件.png)
:trollface: 在开始分析这个生成的异步导入的代码内容时，先同步一个信息：原始的网页在加载js的时候，是通过`<script></script>`的方式来加载一个js的，假如需要动态加载一个js的话，一般的，我们也是通过`document`来动态创建一个`script`标签，并赋予其`src`值的 :point_right: 同样地，webpakc中关于异步js的加载，也是如此， :point_down: 让我们来具体分析这个过程吧！！！

异步导入所生成的代码，较之前普通导入的 :u6709: 什么区别呢？首先，现简化一下额外新增的元素，如下代码所示：
```javascript
__webpack_require__.m = __webpack_modules__;
// 以下是一系列的IIFE函数包裹执行的代码，在各自的IIFE代码中，主要是对__webpack_require__函数对象追加属性！
// ...这里省略一系列的IIFE包裹函数执行代码！
(() => {
  __webpack_require__.e("src_module2_js")
    .then(__webpack_require__.bind(__webpack_require__, "./src/module2.js"))
    .then(test2 => {
      test2.default();
    });
})()
```
:stars: 通过对上述的代码进行一个分析后发现，程序最终调用了`__webpack_require__.e()`方法，来对应创建一个`promise`，当这个promise决议的时候，绑定执行`__webpack_require__`方法，并传入要导入的字符串路径，在下一个promise决议的时候，获取其中的资源`test2`，然后调用test2.default()方法，:confused: 那么在这个导入的过程，发生了什么事情呢？
![异步加载js的过程分析](异步加载js的过程分析.png)
通过 :point_up: 的加载过程分析，我们可以很清楚的知晓这个`webpack`异步加载js也是一样，通过创建一个`script`标签，来动态加载对应的模块js的，只不过它额外提供了懒加载/缓存的机制而已！！！

:confounded: 这里可能 :u6709: 一个疑惑：既然说webpack在`head`标签中会动态创建一个`script`标签来加载对应的模块，那么为什么我在浏览器中看不到呢？是的，没错，它的确是在head中创建了，但是，它加载完成后，又偷偷地将其给删除了，如下代码所示：
```javascript
var onScriptComplete = (prev, event) => {
 				// avoid mem leaks in IE.
 				script.onerror = script.onload = null;
 				clearTimeout(timeout);
 				var doneFns = inProgress[url];
 				delete inProgress[url];
 				script.parentNode && script.parentNode.removeChild(script);
 				doneFns && doneFns.forEach((fn) => (fn(event)));
 				if(prev) return prev(event);
 			};
```
:point_up: 这里在每一个module加载完成后，都对`script.onload以及onerror`都做了一个监听，就是当加载完成时，都自动将这个script给通过`document.node.removeChild()`的方式来移除掉，我在生成的代码中注释了一下这个移除的动作，就可以在对应的head标签中看到动态添加后的效果：
![非自动移除的script](非自动移除的script.png)

:confounded: 还有一个问题：被异步加载到的模块，它是如何被加载进来执行的呢？
这里需要分析一波被依赖的模块所打包出来的结果是怎样的：
```javascript
// 生成的module2的内容
(self["webpackChunk"] = self["webpackChunk"] || []).push([["src_module2_js"],{
	"./src/module2.js": ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
		__webpack_require__.r(__webpack_exports__);
		__webpack_require__.d(__webpack_exports__, {
			"default": () => (test2)
		});
		function test2() {
		  console.info('我是来自模块2中的方法');
		}
	}
}]);
```
通过上述代码的分析，我们可以得知这里的模块，无非就是往`self["webpackChunk"]`对象数组属性中添加两个元素，一个是模块名称，另外一个是一个健值对对象，该对象以模块路径命名，然后是对应地往`default`属性中添加对应的属性值内容，也就是原本模块中的内容，对外采用`default`属性来存储! :point_right: 再结合原本执行的`__webpack_require.e()__`方法，可以用一句话来概括这个异步加载并执行的过程：**采用promise方式从模块路径加载js，并存储到内存对象`selft['webpackChunk']属性`中，待随时访问执行备用**
![windows下的webpackChunk内容](windows下的webpackChunk内容.png)

### 内容是如何生成的？
> **根据依赖拼接字符串的过程！**
> 既然webpack也是生成普通传统的js，那么它是如何生成这个内容的呢？采用这种生成方式有什么好处呢？
> :point_right: 我想采用这种固定格式的生成结果，应该是为了让程序采用统一的执行路径来执行脚本吧！
**一切从回到`compilation.hooks.renderManifest`钩子容器说起**
:point_right: 当触发该钩子时，从钩子容器的参数对象`RenderManifestOptions`中获取相应的属性，并判断是否为拥有入口entry，如果是则执行赋值操作render=`renderMain()`否则`renderChunk`，实现最终的js内容生成赋值函数，当触发render函数的时候，触发对应的实际函数动作！ :point_down: 来具体来分析这两者与实际生成的过程！

#### renderMain、renderChunk、renderModule
> 生成入口js的函数
> 通过调用`renderBootstrap`以及`renderRequire`方法，来生成下述的部分：
![生成的中间js代码部分](生成的中间js代码部分.png)
:star: 在生成代码的内容过程中， :u6709: 频繁地引用到一个[RuntimeGlobals](https://github.com/webpack/webpack/blob/main/lib/RuntimeGlobals.js)中的一系列常量，主要用来统一限定所生成的js中的变量以及函数命名！

#### 生成过程的hooks的监听
![生成代码时的相关钩子容器函数](生成代码时的相关钩子容器函数.png)
:trollface: 在上述的钩子容器函数中，允许我们通过对应的钩子函数的监听，插入自己的一段代码，比如有这样子的一个插件：在生成的入口文件处插入自己的一段代码注释
```javascript
const JavascriptModulesPlugin = require('../lib/javascript/JavascriptModulesPlugin');
class CodeCommentPlugin {
	constructor(options) {
		this.options = options;
	}
	apply(compiler) {
		compiler.hooks.compilation.tap('CodeCommentPlugin', (compilation, params) => {
			const hooks = JavascriptModulesPlugin.getCompilationHooks(compilation);
			hooks.renderStartup.tap('CodeCommentPlugin', (source, module, startupRenderContext) => {
				source.add('// 我是郑耿林的注释！！！\n')
			});
		});
	}
}
module.exports = CodeCommentPlugin;
```
:point_up: 这里我们定义了 :one: 插件，对生成代码过程中的内容进行管控，往其生成的内容中插入一段注释，对应生成的js内容如下：
![在入口处添加的一段注释](在入口处添加的一段注释.png)

### 总结分析
> 从上述的关于webpack的生成内容，并结合浏览器的真实访问结果情况来看，其实webpack的目的也是与普通的浏览器中的js目的一样，生成结果目标内容，采用统一的规范，然后对外暴露统一的api给浏览器调用！其次，我们可以通过其对外暴露的钩子容器，往这个内容中插入自己所想要的代码/注释，实现统一的编译执行/打包过程**干预**的效果！