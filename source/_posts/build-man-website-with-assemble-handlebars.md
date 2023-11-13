---
title: 使用assemble+hbs来构建基础在线man站点
description: 使用assemble+hbs来构建基础在线man站点
author: Zhenggl
date: 2022-12-13 03:59:48
categories:
  - [工具插件, grunt]
tags:
  - 工具插件
  - grunt
  - handlebars
  - assemble
cover: 使用assemble+hbs来构建基础在线man站点封面.jpg
---

### 前言
> 基于`less`的基础上进行的二次改造，项目主要是基于`grunt` + `assemble` + `handlebars`来进行搭建的，借助于`handlebars-help`所提供的便捷helpers工具类，来快速的对页面进行输出，并通过自定义的相关额外的`helpers`工具类，来实现文档的自动关联、自动锚点、自动配置的数据、按照既定的模版规范来输出对应的html页面内容

### 如何搭建

#### 一、安装相关的依赖
```shell
#第一步，执行命令：进行这个assemble模块的安装
npm i assemble --save-dev

#第二步，执行命令：安装对应版本的grunt
npm i grunt@0.4.3 --save-dev

#第三步，执行命令：安装对应的grunt命令，主要是为了方便配合调试用的
npm i grunt-cli --save-dev
```

#### 二、初始化相关的配置以及环境
:stars: 根据官方的`assemble`的相关介绍，进行项目的初始化，对应的相关目录以及代码如下：
![初次执行结果](初次执行结果.png)

:stars: 初始化`Gruntfile.js`文件内容：
![初始化Gruntfile文件内容](初始化Gruntfile文件内容.png)

:stars: 创建对应的模版文件以及相关的页面文件
![创建对应的模版文件以及代码块文件](创建对应的模版文件以及代码块文件.png)

:stars: 在调试、编写代码的过程中，难免会遇到或这或那的bug，因此有时需要深入到源码中进行一个调试，本文主要是基于`vscode`来进行的调试，配置的过程如下图所示：
![配置调试环境](配置调试环境.png)
![本地grunt指向](本地grunt指向.png)

:stars: 配置对`grunt`以及`assemble`的依赖
![完成对grunt以及assemble依赖的安装](完成对grunt以及assemble依赖的安装.png)

:warning: 由于版本原因，因此需要额外安装`grunt-assemble`来保证正常运行
![由于版本原因最新版本不支持assemble的task](由于版本原因最新版本不支持assemble的task.png)

:stars: 开启文件监听并实时预览
![开启文件监听并实现实时预览](开启文件监听并实现实时预览.png)

:stars: 最终生成的文件目录结构如下：
├─assets: 公共的资源目录，包括有js、css、img、font等静态资源；
├─content: 该网站的内容文件，以`md`文件来命名，在使用的时候，一般以对应的名称来引用；
├─data: 局部的数据资源，主要以`*.json`以及`*.yml`格式为主；
├─dest: 生成的目标文件所在的目录
├─styles: 该网站的所使用的样式文件，一般可以是采用一个入口文件来引入其他的样式文件；
├─templates: 所有的`*.hbs`文件所在的目录，主要有相关的`帮助类`、`模版文件`、`代码块`目录
  ├─ _helpers: 自定义的额外的`helpers`帮助类目录，主要提供`mk`以及`rel`等代码块助手；
  ├─ _plugins: 自定义的额外的插件，在assemble渲染页面之前执行的一方法；
  ├─ includes: 公共的`partial`代码块目录，以文件名称来直接引用；
  ├─ layouts: 公共的模版文件目录
└─*.hbs: 对应即将需要单独生成的html文件 

### 踩坑排雷
1. 在进行此项目的搭建时，就算是对着源码来进行调试，也难免会出现问题，因此需要针对搭建的代码进行一个调试，需要搭建自身代码的一个调试机制，使得能够在项目中断点以及输出相应的信息，在`hbs`中尤为困难，因此模仿了官方，实现了一个代码块助手，将某个模版或者页面的上下文对象或者某个属性进行结果的输出；
```javascript
module.exports.register = function (Handlebars, options, params) {
  Handlebars.registerHelper('info', function (msg, context) {
    console.log(chalk.cyan(msg), context);
  });
  Handlebars.registerHelper('success', function (msg, context) {
    console.log(chalk.green('  ' + msg), context);
  });
  Handlebars.registerHelper('warn', function (msg, context) {
    console.log(chalk.yellow('  ' + msg), context);
  });
  Handlebars.registerHelper('fail', function (msg, context) {
    console.log(chalk.red('  ' + msg), context);
  });
};
```
然后对应的在`*.hbs`文件中调用`info`代码助手的方式即可
:stars: 在实际的项目编码过程中，需要针对环境进行相应的配置，比如开发环境需要有相应的log日志，而到了生产环境，则需要禁止输出对应的调试日志代码，那么这里 :confused: 可以如何来实现呢？
:point_right: 可以通过一变量并与脚本命令进行一个关联，通过node参数，来实现的环境与日志的关联输出！

2. 有时需要深入到`grunt`脚本层面进行对应的断点调试，因此需要借助于`grunt-cli`以及`vscode`的调试助手，来实现本地源码的断点调试；
3. `grunt`调试比较麻烦，我们可以借助于`grunt --stack`的方式，让其在执行的过程中，进行相关的详细日志的输出，如下图所示：
   ![grunt调试](grunt调试.png)