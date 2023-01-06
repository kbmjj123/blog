---
title: NormalModuleReplacementPlugin
description: NormalModuleReplacementPlugin
author: Zhenggl
date: 2023-01-06 06:30:05
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
cover_picture: NormalModuleReplacementPlugin封面.png
---

### 前言
[官方链接](https://www.webpackjs.com/plugins/normal-module-replacement-plugin/)
> NormalModuleReplacementPlugin 允许我们将与 `resourceRegExp` 匹配的资源替换为 `newResource`。如果 `newResource` 是相对的，则它是相对于先前资源解析的。如果 `newResource` 是一个函数，它应该覆盖所提供资源的请求属性。
> :point_up: 官方的描述有点绕，简而言之，就是模块的在加载之前进行一个替换，这个替换按照正则表达式`resourceRegExp`所定义的表达式来实现替换，可以实现到类似于`cross-env`工具的效果：通过自定义变量的方式来达到根据不同的变量来尽性替换的目的！

### 如何使用(官方例子)
比如我们 :u6709: :point_down: 的一个`webpack.config.js`配置文件：
```javascript
  module.exports = function(env){
    var appTarget = env.APP_TARGET || 'VERSION_A';
    return {
      // ... 此处隐藏其他的配置
      plugins: [
        new NormalModuleReplacement(/(.*)-APP_TARGET(\.*)/, function (resource) {
          resource.request = resource.request.replace(
            /-APP_TARGET/,
            `-${process.env.APP_TARGET}`
          );
        })
      ]
    }
  }
```
![NormalModuleReplacement的简单使用](NormalModuleReplacement的简单使用.png)
![简单使用对应输出结果](简单使用对应输出结果.png)

### 源码解析
![NormalModuleReplacement正则匹配并替换的过程](NormalModuleReplacement正则匹配并替换的过程.png)
:point_up: 当正则匹配到的时候，执行它的回调方法，也就是说这个插件的构造方法中的第一个参数是一个正则表达式，第二个参数可以是一个回调函数(实现动态替换)，也可以是一个字符串