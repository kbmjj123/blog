---
title: vue单页转多页优化实战
description: vue单页转多页优化实战, SPA转多页过程分析, 减少白屏时间
author: Zhenggl
date: 2023-04-18 06:19:55
categories:
  - [前端, 开发框架, vue]
tags:
  - 前端
  - vue
  - 实战
cover: 单页转多页实战封面.jpg
---

### 前言
> 在实际的vue正常项目迭代过程中，随着日常业务的正常迭代，存在 :u6709: 那么些场景需要快速访问的页面，减少白屏时间，提升用户体验，比如像一些中间状态页面、跳转页面、动态化因此政策相关文件等等！需要在vue项目的基础上，提供这样子的一个配置，假如直接就 :new: 一个组件作为路由来使用的话，将会加载到不必要的其他js，因此需要将项目进行多页应用转换，说白了就是生成多个html文件，不同的html文件代表着不同的SPA入口，而不同的SPA又可以共用同一套实现逻辑！！
> 因此，本文章将从单页转多页，并记录其中的优化过程，以免后续踩坑！

### 原本的单页应用的方式
```bash
  vue create bundle-test
```
使用官方的脚手架创建vue全家桶项目(vue2.0+系列)，并执行`npm run serve`命令，启动对应的前端服务
![常规的SPA的vue项目运行结果](常规的SPA的vue项目运行结果.png)
![vue脚手架自带的路由懒加载机制](vue脚手架自带的路由懒加载机制.png)
:point_up: 上面这里的路由懒加载机制，是`vue脚手架`自带的，可减少js的包过大的原因，关于这个路由的懒加载原理，之前在学习`webpack`的相关知识点的时候已经具体阐述了，可以在之前的文章[webpack动态导入实现懒加载机制](/2023/02/01/webpack-plugin-javascript-modules/#动态导入的模块依赖结果分析)

:stars: 细心的朋友可以发现，在访问这个站点的时候，浏览器预先加载了about.js另外一个未访问过的js文件，而且其中的request header中包含有一个属性：purpose=prefetch，如下图所示：
![预加载机制](预加载机制.png)
:point_right: 关于这个属性的描述如下 :point_down: ：
> 在`Http/2`协议中，可以使用`Purpose`请求头来指定请求的目的，该请求头指示了客户端发送请求的目的，以便于服务器对其进行优化，比如可以将某些请求标记为主要的或者次要的，然后根据需要对这些请求进行优先处理。
> 关于这个`Http/2`的相关协议，可以 {% link "http2介绍" "https://nodejs.91temaichang.com/official-api-arrangement/network/http2/readme.html" true http2介绍 %} 中习得！
> `purpose`的请求头可以有多个可选值：
> 1. prefetch: 用于预取资源，以便在将来的导航请求中使用；
> 2. preload: 用于预加载资源，以便在当前导航请求中使用；
> 3. prerender: 用于预渲染页面，以便在用户请求该页面时快速呈现；
> 4. none: 用于标记不需要特殊处理的请求
:warning: 有一个需要主要的是，加入疯狂的预取或预加载资源的话，可能会导致性能的下降，因此，应该根据实际情况进行调整！

:stars: 对应的打包出来的js如下图所示：
![vue常规的打包结果文件](vue常规的打包结果文件.png)

### 常规的多页应用改造
> 要自定义这个多页应用的方式，简单的创建一`vue.config.js`文件，并编写以下 :point_down: 的内容：
```javascript
module.exports = {
  pages: {
    index: {
      template: 'public/index.html',
      entry: 'src/main.js',
      filename: 'index.html'
    },
    more: {
      template: 'public/index.html',
      entry: 'src/more.js',
      filename: 'more.html'
    }
  }
};
```
![多页应用的输出结果](多页应用的输出结果.png)
:trollface: 从输出的结果可以看出，输出了对应的两个入口的html文件，以及两个入口html均采用了同一个`vender.*.js`文件

:confused: 假如随着业务不断的迭代，我们需要满足 :point_down: 几个场景，而且需要考虑到用户的访问体验，应该做如何相应的改造呢？
1. 共享公共的三方库代码；
2. 共享自定义的公共组件代码；
3. 不同的入口拥有不同的资源依赖引用；
4. 统一一套代码来管控，既要拥有单页应用的体验效果，又想拥有多页应用的访问速度

### 升级的多页应用改造
> 要满足 :point_up: 提及到的优化，可在上面的基础上，追加`optimization`的优化，关于`optimization`的优化，具体可查看官方的介绍：{% link "optimization优化" "https://www.webpackjs.com/configuration/optimization/" true optimization优化 %}

#### 接入文件清单
> 什么是文件清单？为什么需要引入这个文件清单呢？如何来使用文件清单？
> :question: `文件清单(manifest)`：由于不同的入口文件，可能需要引用不同的文件清单，因此需要将相关的资源进行抽离，拆分为不同的chunk，但不能直接去引用所有的chunk，因为这会导致一加载页面就疯狂加载很多的chunk资源(业务迭代的时候)，因此，需要将相关的文件，整理到一个类似于Map对象的清单文件中(manifest.*.js)，然后按需根据实际访问情况来加载对应的chunk文件！
![manifest清单文件的引用](manifest清单文件的引用.png)

> :question: `为什么要引入manifest`: 可以减少不同的入口因为资源的统一分配，导致加载了同一份资源(这份资源可能是另外一个SPA所不关心的)，可以有效的控制资源的引用！
> 一般可以简单的通过`optimization.runtimeChunk`来控制！
```javascript
module.exports = {
  chainWebpack(config) {
    // 为每个入口文件创建清单文件
    config.optimization.runtimeChunk({
        name: (entryPoint) => `manifest.${entryPoint.name}`,
    });
  }
};
```
![生成的清单文件](生成的清单文件.png)
:trollface: 这里通过创建清单文件，使得每个入口都引用对应的清单文件，但是这个时候访问的话，打包出来的运行结果是白屏的：
![访问白屏的入口](访问白屏的入口.png)
在 {% link "vue.config.js的pages属性" "https://cli.vuejs.org/zh/config/#pages" true vue.config.js的pages属性 %} 中有提及到关于这个入口的`chunks`属性： 提取出来的通用 `chunk` 和 `vendor chunk`，会被入口所引用
![被包含的多个入口](被包含的多个入口.png)
:confounded: 实际情况确是访问不到，这里猜测是这个入口文件`*.html`并没有引用到这个单独分离出来的chunk文件，从上面所生成的`*.html`来看，其中并无真正将对应的**单独提取出来的公共chunk进行引入**，因此才会出现对应的白屏效果！ :point_right: 因此，需要将对应生成的`chunk`给引用进来，在各个入口文件处:
```javascript
  const pages = {
  index: {
    template: 'public/index.html',
    entry: "src/main.js",
    filename: "index.html",
    chunks: [
      "chunk-vendors",
      "index",
      "manifest.index",
    ],
  },
  more: {
    template: 'public/index.html',
    entry: "src/main.js",
    filename: "more.html",
    chunks: [
      "chunk-vendors",
      "more",
      "manifest.more"
    ]
  }
};
```
![配置入口所引用的chunk](配置入口所引用的chunk.png)
:trollface: 这里可以看到入口将对应的`chunk`给引用进来了，才能够保证所有的资源能够正确被加载到了！！

#### 接入自定义代码分割: spliteChunk
> 关于自定义分割: {% link "SplitChunkPlugin官网" "https://www.webpackjs.com/plugins/split-chunks-plugin/#optimizationsplitchunks" true SplitChunkPlugin官网 %} 
> 自带的代码分割机制会将`node_modules`下的所有资源给打包到`chunk-vendors.*.js`，但是在随着业务的迭代，加入的三方库可能会越来越多，因此需要将其中的三方库给拆分为不同的分包chunk，而且统一采用自定义的命名：
```javascript
    config.optimization.splitChunks({
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 200000,
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },
          echarts: {
            name: "chunk-echarts",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?echarts(.*)/,
          },
        },
      });
```
除了引入的三方库，自己编写的代码也可以打包为单独的chunk来共自己访问到！
:point_up: 这里将`echarts`从`node_modules`中给抽离出来，使得可以在入口的`chunks`属性随意访问！

### 去除无效的资源预加载
![预先加载的资源](预先加载的资源.png)
:confused: 从之前的运行效果可以得知，vue脚手架打包出来的项目，默认会自动预先加载相关的资源，这在支持`Http/2.0`的机器上，将会预先加载未使用到的资源，如果预先加载的资源过大的话，那么一访问入口，则将会疯狂地加载不同的js资源
:questions: 如果想要按需来加载对应的js资源，去除无效的预加载资源机制，应当如何操作呢？
:stars: 我们可以在对应的打包输出结果中，将未访问到的资源进行去除！
```javascript
    Object.keys(pages).forEach((page) => {
        // 当有很多页面时，会导致太多无意义的请求
        config.plugins.delete(`prefetch-${page}`);
        config.plugins.delete(`preload-${page}`);
    });
```
![去除预先加载的资源](去除预先加载的资源.png)

{% link "相关的源码" "https://github.com/kbmjj123/bundle-test" true 相关的源码 %}
