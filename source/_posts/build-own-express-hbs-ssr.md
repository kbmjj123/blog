---
title: 使用express+hbs搭建自己的服务端渲染框架
description: 使用express+hbs搭建自己的服务端渲染框架, express+handlebars实现SSR, SSR快速开发框架
author: Zhenggl
date: 2023-02-23 06:10:01
categories:
  - [nodejs, express]
  - [javascript, 模版引擎]
tags:
  - nodejs
  - express
  - handlebars
  - javascript
cover_picture: express-hbs-框架搭建封面.jpg
---

### 前言
> 在刚开始接触这个`express`框架的时候，利用其脚手架命令，来创建项目的过程中，发现其中 :u6709: 一种渲染引擎: `handlebars`，这种引擎在之前的学习文档中 {% post_link usage-of-handlebars handlebars的学习与使用用 %} 已经有具体提及到，本章节主要想将自己在使用`express + hbs`搭建这个SSR渲染页面的过程给记录下来，方便后续自己 :u6709: 来及时查阅！

### 一、express项目初始化
> 借助于`express`{% link 应用程序生成器 https://www.expressjs.com.cn/starter/generator.html true express应用程序生成器 %}，进行项目的初始化工作
```bash
  express --view=hbs express-hbs-demo
```
:point_up: 命令则在当前目录中创建了一个名为`express-hbs-demo`的express项目，进入该目录，并安装相应的依赖，然后执行对应的脚本程序，将程序运行起来:
```bash
  npm install && npm run start
```
运行结果如下：
![初次运行起来的express](初次运行起来的express.png)
:space_invader: 与此相对应的生成的文件目录结构如下：
![express的目录结构](express的目录结构.png)

### 二、追加express-hbs库的支持
> 要让程序能够支持`handlebars`的相关特性(比如helper、partials)，那么我们可以是借助于 {% link express-hbs https://www.npmjs.com/package/express-hbs true express-hbs %} 三方库，通过在应用程序入口`app.js`中对其进行相关的配置，可实满足与`handlebars`在日常研发中的特性配置！
```javascript
//  ...此处隐藏其他无关的代码
  function relative(rPath) {
    return path.join(__dirname, rPath);
  }
  const hbs = require('express-hbs');
  app.engine('hbs', hbs.express4({
    partialsDir: relative("views/partials"),
    layoutsDir: relative("views/layouts"),
    defaultLayout: relative("views/layouts/default.hbs"),
    beautify: true
  }));
  app.set('views', relative('views'));
  app.set('view engine', 'hbs');
```
:thinking_face: 上述这里使用了`express-hbs`库，进行了相关的配置，比如设置`partials`目录、设置`layout`目录等等！

:stars: 关于`express-hbs`的其他相关配置如下表所示：

| express-hbs属性 | 数据类型 | 描述 |
|---|---|:---|
| partialsDir | `String|Array` | 代表partials模版的路径 |
| **以下是非必填属性** | - | - |
| blockHelperName | String | 提供的覆盖block的helper的名称 |
| contentHelperName | String | 提供的覆盖helper的`contentFor` |
| defaultLayout | String | 默认layout模版的绝对路径地址(一般可借助于`path.join()`来定义) |
| extname | String | layout以及partials的文件扩展名，默认是`.hbs` |
| handlebars | Module | 使用额外的`handlebars`来替代`express-hbs`这所依赖的`handlebars` |
| i18n | Object | i18n 对象 |
| layoutsDir | String | layout模版所在的路径 |
| templateOptions | Object | 传递给`Handlebars.template()`方法的对象(统一配置) |
| beautify | boolean | 是否格式化输出HTML |
| onCompile | function | 重载默认的`Handlebars.compile()`方法，可自定义或者追加额外的操作 |

:star: 上面的例子中定义了`defaultLayout`作为默认的模版，那么，只要在路由中没有特殊说明的话，都默认用的这个模版：
![制定不同的layout](制定不同的layout.png)
![不同的layout对应的运行效果](不同的layout对应的运行效果.png)

:confused: 而关于这个layout的使用，则仅仅需要在其`body`标签中定义好"三箭头包裹的body"占位符即可
![layout模版中的占位符](layout模版中的占位符.png)

:star: 而关于这个`partial`模版的使用，则与官网所描述的一致，可以认为是一静态的html标签内容，也可以是动态的可接收参数进行配置化使用的标签节点！
![partial的内容](partial的内容.png)

**关于这个helper的配置**
---
> `express-hbs`中并没有提供针对helper统一配置(像partialsDir那样搬来配置使用的方式)，这边模仿了它的一个机制，通过提供的统一的对外入口，直接实现一键式配置接入`helpers`，如下代码所示
```javascript
  //调用的方式
  const injectHelper = require('./views/helpers/index');
  injectHelper(hbs);
  // ******* 以下是定义的内容，在对应的helpers/index.js中*******
  const { readdir } = require('fs');
  const path = require('path');
  //自定义的动态注册当前的modules目录下的
  module.exports = function(hbs){
    readdir(path.join(process.cwd(), "views", "helpers", "modules"), (err, files) => {
      if(err){
        console.error(err);
      }else{
        files.forEach(item => {
          const key = item.replace(/.js/g, '');
          console.info(key);
          hbs.registerHelper(key, require(path.join(process.cwd(), "views", "helpers", "modules", item)));
        });
      }
    })
  }
```
:stars: 通过上述的方式，可实现将`helpers/modules`目录下的'*.js'文件，以其文件作为helper的key，而以其内容来作为对各个helper内容的定义，对于需要往项目中追加的helper，都只需要在modules中新增对应的js文件即可！然后，就可以在对应的.hbs文件中直接使用对应的helper了
```hbs
  {{test '我是被测试的字符串~~'}}
```

:thinking_face: 如果我们要使用的官方的 {% link handlebars-helper https://github.com/sparkartgroup/handlebars-helper true handlebars-helper %} 
通过阅读官方的源码，我们可以采用 :point_down: 的方式来接入这个`handlebars-helper`
```javascript
// 由于安装不了，升级了一下相关的库
const { help } = require('c-handlebars-helper');
help(hbs.handlebars);
```
:stars: 这里通过`help()`方式实现的批量对helper的注册，实现我们所想要的一键注册！
添加注册成功后，我们就可以直接的.hbs文件中注册
```hbs
<p>以下是三方的helper</p>
{{lowercase "LIQUID!"}}
```