---
title: HtmlWebpackPlugin
description: HtmlWebpackPlugin, html生成, webpack快捷打包html, 自定义html生成内容 
author: Zhenggl
date: 2023-02-17 09:03:27
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
  - html
cover_picture: HtmlWebpackPlugin封面.jpg
---

### 前言
{% link 官方文档 https://github.com/jantimon/html-webpack-plugin true 官方文档 %}
> 关于`HtmlWebpackPlugin`插件的时间，相信不少童鞋应该都是比较熟悉的了，在一些现成的脚手架(像`vue-cli`、`react-cli`等开源三方脚手架)中，都被集成进去成为其核心成员脚手架模块，负责将结果目标内容文件给输出出来， :zero: 配置的方式来快速开发这个业务项目， :confused: 但是，在实际的项目开发过程中，避无可避地需要针对现有的采用脚手架搭建起来的项目进行定制化的配置，来满足不断变更的业务需求，提升编码的效率，因此，很有必要来对所使用的相关插件(`HtmlWebpackPlugin`)进行深入的了解！
> 关于官方的解释是：`HtmlWebpackPlugin` 简化了 HTML 文件的创建，以便为你的 `webpack` 包提供服务。这对于那些文件名中包含哈希值，并且哈希值会随着每次编译而改变的 `webpack` 包特别有用。你可以**让该插件为你生成一个 HTML 文件，使用 `lodash` 模板提供模板，或者使用你自己的 `loader`。**
> :space_invader: 这里提及的使用默认的`lodash`模版来生成Html文件，还可以使用自己的loader，比如像`handlerbars-loader`、`html-loader`、`vue-loader`等等，实现将由不同编码实现的相关代码，打包出统一的html文件效果目的！！！

### HtmlWebpackPlugin是如何使用的？
> `HtmlWebpackPlugin`是 :one: webpack插件，那么它也就像其他普通的插件一样，通过导入，并在对应的webpack.config.js配置文件中定义好使用的姿势即可！如下代码所示：
```javascript
  // webpack.config.js配置文件
  const HtmlWebpackPlugin = require(/**这里指定webpack的路径*/'../..');
  module.exports = {
    plugins: [
      new HtmlWebpackPlugin({
        // 这里隐藏相关的插件配置，也可使用默认的HtmlWebpackPlugin配置！
      })
    ]
  };
```
而默认的`HtmlWebpackPlugin`配置内容如下：
![默认的HtmlWebpackPlugin配置](默认的HtmlWebpackPlugin配置.png)
:point_right: 也就是说，如果我们在该插件中没有传递任何的配置，那么则采用 :point_up: 这里默认的配置来进行文件的打包动作！！

#### html模版中可使用的变量
![模版中能够使用的变量](模版中能够使用的变量.png)
:point_up: 这里所提及的变量，其具体参数格式以及用法，可参见 {% link options参数一览 https://github.com/jantimon/html-webpack-plugin#options true HtmlWebpackPlugin参数一览 %}


:space_invader: 而对于在实际运用过程中，我们还可以在`模版html`文件中使用 :point_down: 几个变量：
![HtmlWebpackPlugin在html中支持的变量](HtmlWebpackPlugin在html中支持的变量.png)
:stars: 也就是说，我们可以通过在模版html文件中引用 :point_up: 几个变量，进而直接创建html元素，从`webpack`打包编译过程，到最终文件输出，形成有js :point_right: 的单向通讯！

:confused: 这里 :u6709: :one: 疑问，就是这个在`html模版`中所使用的变量，它是如何最终渲染成为对应的html到界面上的呢？？？这个问题，将在下方的对`HtmlWebpackPlugin`的执行过程进行一个具体的分析时顺带提及一下，主要还是借助于[Lodash三方库](https://www.lodashjs.com/)所提供的支持！！

### HtmlWebpackPlugin的执行过程是怎样的？
> 要分析这个`HtmlWebpackPlugin`它是如何执行的话，需要先准备一下源码，以及对源码的调试分析过程！
> :confounded: **个人感觉这个源码就是一promise地狱，疯狂地promiese以及then嵌套，程序的执行顺序到处飞！**

#### 源码调试小技巧
> 一般地，要熟悉了解关于相关库代码里面具体是如何执行的，我一般是借助于`vscode`自带的可视化调试服务，而这个`HtmlWebpackPlugin`是基于`webpack`上运行的，我不大可能将其代码挂到`webpack`的源码上，因此，
> 我采用的是在其可执行程序目录中(`node_modules/.bin/webpack`)，将这个`webpack`程序copy到根目录中，然后配合调试配置文件：`.vscode/launcher.json`
```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "启动程序",
      "skipFiles": [
        // "<node_internals>/**"
      ],
      "runtimeVersion": "12.3.1",
      "program": "${workspaceFolder}/webpack",
      "args": [
        "-c", "${workspaceFolder}/examples/default/webpack.config.js"
      ]
    }
  ]
}
```
:stars: 这里我指定程序运行的node版本为12.3.1，执行的具体程序为当前根目录下的`webpack`程序，以及传递的参数为`-c examples/default/webpack.config.js`，
也就是等同于在根目录中执行以下对应脚本：
```bash
  webpack -c example/default/webpack.config.js
```
然后启动vscode的调试模式，则可以进入到源码层面的调试工作，入下图所示：
![调试HtmlWebpackPlugin插件](调试HtmlWebpackPlugin插件.png)

#### 打包产物分析
> 在对上述最简单的demo项目的结果做一个简单的分析之前，先 :confused: 思考一下，如果我们的css文件、js程序需要在对应html文件中能够被运行到，那么应该是需要在对应的html文件中引入对应的文件标签(`<style></style>`、`<script><script>`)文件的引用，:point_right: 那么这个`HtmlWebpackPlugin`也是如此，如下图所示：
![生成的html文件](生成的html文件.png)
![实际生成的内容](实际生成的内容.png)
从上述的实际运行结果来看主要是在`index.html`文件中引入了一个`bundle.js`文件，**然后由bundle.js文件来创建对应的style标签以及填充对应的样式内容**！

:point_right: 也就是说通过这个bundle.js文件，将自动创建对应的html标签节点！

####  HtmlWebpackPlugin所提供的钩子容器函数都有哪些
:point_down: 是`HtmlWebpackPlugin`所提供的钩子容器函数的执行顺序以及`HtmlWebpackPlugin`的成员角色：
![HtmlWebpackPlugin所提供的钩子函数的生命周期](HtmlWebpackPlugin所提供的钩子函数的生命周期.png)
![HtmlWebpackPlugin钩子容器函数](HtmlWebpackPlugin钩子容器函数.png)

**:warning: `HtmlWebpackPlugin` 本身并没有在钩子容器函数中做任何的处理动作，它只是将其生命周期给暴露出来给到外部的插件来进行干预使用！！！**

:confused: 那么，我们可以对它做点什么呢？ :u6709: :point_down: 一个场景，我们可以通过这个这个自定义插件(MyPlugin.js)，对生成的html进行做一个干预动作，对每一个即将要生成的html追加一js
```javascript
const { getHtmlWebpackPluginHooks } = require('../../lib/hooks');
class MyPlugin{
  constructor(options){}
  apply(compiler){
    compiler.hooks.thisCompilation.tap('MyPlugin', compilation => {
      getHtmlWebpackPluginHooks(compilation).beforeAssetTagGeneration.tapPromise('MyPlugin', ({assets, outputName, plugin}) => {
        return new Promise(resolve => {
          console.info('MyPlugin插件干预');
          assets.js = assets.js.concat(['https://lib.baomitu.com/jquery/1.12.4/jquery.js']);
          console.info(assets);
          console.info(outputName);
          console.info(plugin);
          resolve({assets});
        });
      });
    });
  }
}
module.exports = MyPlugin;
```
:point_up: 这里对应输出的内容为：
![干预输出-追加统一的js](干预输出-追加统一的js.png)

:alien: 从上面我们可以看出其实这个`HtmlWebpackPlugin`给我们所提供的插件，就是让我们能够干预到输出的html内容，只要我们根据`tapable`所提供的钩子容器函数的使用方式来使用并传递对应的参数即可，这里都是采用的`AsyncSeriesWaterfallHook`类型，因此我们只需要对应整一个`Promise`来包裹并返回出来最终的结果即可！！！

#### 模版中的变量是如何被加载为html中的内容的？
![使用默认的loader](使用默认的loader.png)

:space_invader: 从上述我们可以看出`HtmlWebpackPlugin`默认使用其自带的loader来对这个模版文件进行加载，而这个loader最终调用的`lodash`库的`template`方法来渲染的，而关于这里为什么要使用`!`来将loader与实际的ejs文件给分割开来，这个在之前关于 [webpack中的loader](/2023/02/15/loader-work-in-wepback/#如何使用Loader？) 一文中已经详细介绍过了！

![使用lodash渲染模版字符串](使用lodash渲染模版字符串.png)
:point_down: 是渲染完成后的字符串内容(这边做了一个换行符的相关替换)：
```javascript
var HTML_WEBPACK_PLUGIN_RESULT;
/******/ 
(() => { 
// webpackBootstrap
/******/ 	var __webpack_modules__ = ({
/***/ 685:
/***/ ((module) => {

var _ = require("/Users/zhenggl/Desktop/wait_to_study/webpack/源码/插件源码/html-webpack-plugin-main/node_modules/lodash/lodash.js");
module.exports = function (templateParams) {
 with(templateParams) {
 return (function(data) {
 var __t, __p = '';
 __p += '<!DOCTYPE html>\\n<html>\\n  <head>\\n    <meta charset="utf-8">\\n    <title>' +
 ((__t = ( htmlWebpackPlugin.options.title) == null ? '' : __t) +
'</title>\n </head>\n </body>\n </html>\n';
 return __p;
 /******/ 	})();
 /******/ 	
 /************************************************************************/
 /******/ 	
 /******/ // startup
 /******/ // Load entry module and return exports
 /******/ __webpack_require__(295);
 /******/ // This entry module is referenced by other modules so it can't be inlined
 /******/ var __webpack_exports__ = __webpack_require__(685);
 /******/ HTML_WEBPACK_PLUGIN_RESULT = __webpack_exports__;
 /******/
 /******/ })()
 	;;
 	HTML_WEBPACK_PLUGIN_RESULT
```

:smiling_imp: 最终借助于`vm`来针对这个字符串来创建生成对应的可执行程序js，通过使用`with`语法，来实现将`htmlWebpackPlugin.options.title`做实际的一个替换工作，然后最终将结果输出到`HTML_WEBPACK_PLUGIN_RESULT`变量中！

:clown_face: 关于这个`lodash.template()`方法，具体可见 {% link lodash的template方法 "https://www.lodashjs.com/docs/lodash.template" true lodash的template方法 %} 的使用描述!!

:point_down: **附带上关于`HtmlWebpackPlugin`插件的完整执行过程！！！**

![HtmlWebpackPlugin的执行过程](HtmlWebpackPlugin的执行过程.jpg)

#### 依赖库及其使用说明
> `HtmlWebpackPlugin`插件中使用了 :point_down: 几个依赖库，下面简单说明一下

| 依赖库 | 当前使用说明 |
|---|:---|
| lodash | 作为模版渲染引擎来使用 |
| `html-minifier-terser` | 优化html字符串 |
| tapable | 钩子容器函数的实现者 |
| vm | 用于执行模版内容输出的可执行字符串函数，并输出替换后的结果 |


### 官方提供的基于HtmlWebpackPlugin的三方插件
{% link 三方插件 https://github.com/jantimon/html-webpack-plugin#plugins true 三方插件 %}

### 我能够做点什么？
> 在通过对`HtmlWepbackPlugin`插件的学习之后，我想我可以更好的来了解关于自己所研发的项目的执行过程，从比较全局的层面来更好的维护整个项目，这边整理了 :point_down: 几个点！
1. 在实际的项目研发中，尽量多采用自定义的模版html文件，可做到对项目在满足不同的场景的下的统一配置；
2. 可尝试从零搭建自己的一个项目loader，比如vue、react、handlerbars等等，尝试搭建自己的开发框架，以此更好的了解项目框架的执行过程；
3. 可通过对`HtmlWebpackPlugin`的相关钩子容器函数进行干预，追加对内容的输出的控制(比如上方的例子)；