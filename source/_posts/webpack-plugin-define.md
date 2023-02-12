---
title: DefinePlugin在webpack中是如何使用的
description: DefinePlugin.js, webpack中编译期间的变量替换, 如何使用DefinePlugin
author: Zhenggl
date: 2023-02-13 06:04:38
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
cover_picture: DefinePlugin封面.jpg
---

### 前言
{% link "DefinePlugin官网链接" "https://www.webpackjs.com/plugins/define-plugin/" true DefinePlugin官网链接 %}
> 允许在`编译时`将你代码中的变量**替换**为其他值或表达式，它并不是变量赋值，而是在编译期间进行字符串的精准匹配与替换！
> 可以理解为，我们在webpack打包的项目中，通过在配置文件(webpack.config.js)中使用插件`DefinePlugin`，并传递给该插件对应的变量/表达式，都可以在项目中的*.js文件中访问到这些变量/表达式的定义，而无需重复地在所有的文件中进行二次定义！
> 这意味着我们可以定义全局开关等控制，来对代码进行区别式运行的操作！

### 用法
```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      // 此处是相关的变量/表达式的配置
      a: 999
    })
  ]
}
```
关于该插件中每个健值对可以 :u6709: :point_down: 的定义方式：
1. 如果该值为字符串，它将被作为代码片段来使用;
2. 如果该值不是字符串，则将被转换成字符串（包括函数方法）;
3. 如果值是一个对象，则它所有的键将使用相同方法定义（也就是遍历key来替换）;
4. 如果键添加 `typeof` 作为前缀，它会被定义为 `typeof` 调用

:stars: 这些值将内联到代码中，从而允许通过代码压缩来删除冗余的条件判断
```javascript
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify('5fa3b9'),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: '1+1',
  'typeof window': JSON.stringify('object'),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
});
```

:warning: 在为 process 定义值时，'process.env.NODE_ENV': JSON.stringify('production') 会比 process: { env: { NODE_ENV: JSON.stringify('production') } } 更好，后者会覆盖 process 对象，这可能会破坏与某些模块的兼容性，因为这些模块会在 process 对象上定义其他值。

### 项目实战
1. 配置文件引入插件：
```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      // 此处是相关的变量/表达式的配置
      a: 999
    })
  ]
}
```
2. 代码中使用该变量
```javascript
module.exports = function test() {
	console.info(a);
	console.info("我是来自于模块一中的test方法");
};
```
3. 观察打包结果产物
  ![DefinePlugin插件替换变量的结果](DefinePlugin插件替换变量的结果.png)
  从上述的流程可以看出，这个变量`a`被替换成了`999`了！


### 插件思考
> :confused: 既然这个变量可以是通过全局定义的方式，而无需在任意的一个*.js文件中去定义，它会帮我们做好对应的变量/表达式替换操作，那么，就会 :u6709: 对应的一个不怎么好的编码体验：在实际进行代码阅读的过程中，不知道变量是在哪里被定义的？ :point_right: 因此，关于`webpack`打包类型的相关项目，应当优先阅读其配置文件(**webpack.config.js**)，并记录相关的全局变量/表达式(如果有使用到`DefinePlugin`)的话！
> :stars: 这里 :u6709: 另外一个想法：假如代码可以针对不同模式下的项目提供完整的一套配置的话，那么是可以做到根据不同的配置进行生成不同的项目所需要的配置信息的，可以是在根目录中创建对应的项目配置文件，然后依据当前的打包环境提供对应完整的一套配置文件清单列表，而无须徒增项目配置文件的大小！
