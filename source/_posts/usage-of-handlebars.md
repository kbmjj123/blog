---
title: handlebars的用法
description: handlebars的用法
author: Zhenggl
date: 2022-11-22 06:12:30
categories:
  - [javascript, javascript模版引擎, handlebars]
tags:
  - javascript
  - javascript模版引擎
  - handlebarse
cover_picture: handlebars封面.png
---

### 前言
> 从`express`的脚手架中默认初始化的是`handlebars`模版引擎，那么它是怎样的一个引擎呢？平时在项目过程中是否有使用到它的一个场景呢？
> :point_right: 我打算搭建多另外一个站点，模仿`less`的关于文档的快捷在线浏览中文站点，不想仅仅单纯通过翻译别人的网站，而自己根本不清楚其中的一个使用相关原理，因此，我开始这个自建CMS站点之路，
> 而且从国内目前的前端来看，以前的前端一来就直接上手`jquery`，现在立马就进入`vue/react/angular`+`webpack`，但对比国外的开发佬，好像人家一来就是静态站点，然后配合相关的工具比如`grunt`打包，编写自己的CMS生态，
> 借助于`grunt`来实现的`grunt`生态体系，我也在另外一篇文章中详细阐述了`grunt`是什么以及如何使用的，本文主要分享一下关于`handlebars`是如何使用的，以及在使用的过程中有一些不清晰的概念以及用法，记录到文档中，方便自己
> 以及他人后续学习！

### 官方介绍
[官方链接](https://handlebarsjs.com/zh/)
> 什么是Handlebars?
> 使用模版和输入对象来生成HTML或其他文本格式，该模版看起来像常规的文本，但是它带有嵌入式的`Handlebars`表达式
> 首先先看看 :point_down: 的简单使用例子:
{% codepen slug_hash:'KKeeJrG' %}

:stars: 这里的的使用方式采用的是CDN引用js的方式，一般流程 :u6709: :point_down: 的使用流程：
1. 找到script模版对应的html字符串内容；
2. 使用`Handlebars.compile()`返回一个template函数的入口
3. 结合模版template函数，加上上下文对象一同执行，输出结果html字符串，展示到界面上

:point_up: 这种是最简单适用于例子/测试/demo类型的代码，实际在编码的过程中，更多的是使用包依赖管理来安装的，比如有以下的使用
```shell
  npm install handlebars
```
```javascript
const Handlebars = require("handlebars");
const template = Handlebars.compile("Name: {{name}}");
console.log(template({ name: "张三" }));
```

:stars: 使用handlebars预编译器，可以节省客户端时间并减少Handlebars库所需的运行时大小，这里我们不讨论关于在npm中全局安装handlebars，并使用这个handlebars命令来编译的过程，
我们主要关键share一下在`webpack`使用集成的方式来引入`handlebars`
1、[handlebars-loader](https://github.com/pcardune/handlebars-loader)
2、[handlebars-webpack-plugin](https://github.com/sagold/handlebars-webpack-plugin)

:point_down: **来介绍关于`handlebars`在使用过程中的关键技巧，以及难以理解的地方**

### 自定义助手
> 助手代码可以实现一些并非`Handlesbars`语言本身的功能，
> 通过调用`Handlebars.registerHelper`方法，可以从模版中的任何上下文访问`Handlebars`助手代码，如下代码所示：

{% codepen slug_hash:'poKZrNy' %}

:stars: :point_up: 这里我们定义了一个helper：loud，用于将接收到的参数转换为大写的字符串来展示，这里使用helper就像是在使用的一个`**js函数**`一样，通过接收的参数，将参数进行一个逻辑运算后输出结果

:trollface: 既然助手是一个函数，那么它应该是拥有函数所拥有的相关属性：
1. 允许接收多个参数；
2. 接收的参数可以是`key=value`格式的键值对；
3. 函数支持嵌套使用；

:stars: 这里针对上述三种情况进行一个整合，编写 :point_down: 的例子来加深理解：
{% codepen slug_hash:'zYaLdPP' %}

:stars: :point_up: :u6709: :two: 处地方需要 :warning: 一下的：
1. 使用`new Handlebars.SafeString()`来进行的转义字符串动作，需要在最接近`{{}}`的位置来进行整体的转义，也就是最外层；
2. 当使用`hash`的方式来获取传递的参数的时候，基本上可以接收无限多的参数；
3. `Handlebars.excapeExpression(string)`使得字符串可以安全地在HTML内容中渲染为文字。

#### 块助手代码
> 块助手代码使得调用通过传递上下文参数的代码块的迭代器或自定义函数成为可能，其定义的语法规则与自定义助手一样，使用`registerHelper`，只不过使用的方式有点不同，见 :point_down: 的代码
{% codepen slug_hash:'LYrBOZR' %}
![块助手代码的不同使用方式](块助手代码的不同使用方式.png)

:stars: :point_up: 我们使用了`Handlebars.registerHelp()`的方式来分别注册一个一个包裹的块助手代码与之前的自定义助手的区别，我自己称之为"**包裹的助手代码**"，它与之前的函数式的助手不同的 :u6709: ：
1. 使用`{{#助手名称}}{{表达式}}{{/助手名称}}`，一对包裹的助手标识符，中间被包裹的是一表达式，这里的表达式可以是普通表达式，还可以是函数式的助手代码调用；
2. 注册的"包裹的助手代码"，通过接收一`options`参数，在该参数中的fn与`Handlebar.template`函数功能一样，而this则为传递给`Handlebars.template`的上下文一致，因此，调用`options.fn(this)`就相当于是将目前的上下文对象作为上下文来渲染出对应的字符串；
![包裹的块助手代码](包裹的块助手代码.png)

:stars: 包裹的助手代码也是一个函数助手代码，因此也允许通过传递参数的方式来进行使用，这里分享一个关于如何结合包裹的助手代码以及函数助手代码
{% codepen slug_hash:'XWYBzBd' %}
![包裹的助手代码块](包裹的助手代码块.png)

#### 常用的包裹助手代码
1. with: `{{#with context}} {{/with}}`，代表在这个`context`上下文对象中的包裹代码块;
2. each: `{{#each objList}} {{/each}}`，代表遍历整个`objList`数组对象；
3. list: `{{#list objList}} {{/list}}`，代表遍历整个`objList`数组对象；
4. if: `{{#if isActive}} {{else if isInactive}} {{/if}}`，代表一个条件判断；
5. lookup: 

### 代码片段
> `Handlebars`允许复用代码片段，代码片段是一段普通的`Handlebars`模版，但他们可以直接有其他模版来调用，其用法如下：
> `Handlebars.registerPartial('片段名称，假如叫myPartial', 'Handlebars模版');`
> 将`Handlebars`模版传递给第二个参数实现对代码片段预编译，然后在对应的html标签中通过 :point_down: 的方式来引用
> `{{> myPartial }}`
> :point_right: 将渲染名为`myPartial`的代码片段，当代码片段执行时，它会共享当前的代码块的上下文！！

:trollface: 简单来说，代码片段其实就是一串字符串，通过字符串的注册，关联到某个名称下而已，这样子来理解就会比较清晰， :confused: 思考下如果这里的字符串模版，它是一个函数的返回值的话，那么我们不久可以
实现动态的模版，也就可以实现动态的代码片段了吗？？ :point_right: 答案也确实如此，通过 :point_down: 的方式(借助于`Handlebars.registerHelper()`)来实现一个动态的模版(官方管叫：动态代码片段)
```html
  {{> (dynamicPartial)}}
```
这里的`dynamicPartial`是一个函数的返回值，代表将返回值所对应的代码片段来作为这个最终的代码片段，完整的例子如下所示：
{% codepen slug_hash:'PoadZKg' %}

:stars: 代码片段也可以像代码助手一样，通过传递参数的方式(普通传参以及hash传参)来实现参数的传递，从而实现不同的结果代码片段，比如我们有一个列表，需要展示对应的信息，完整的例子如下：
{% codepen slug_hash:'GRGXoPb' %}
![partial从父级参数中获取对应的值](partial从父级参数中获取对应的值.png)

:stars: 如果尝试在html页面中引用一个不存在的`partial`的话，就会报错，如果我们想要阻止报错的话，可以是在代码块中嵌套代码片段的方式来表示引用失败的尝试操作
![使用了一个存在的partial将直接报错](使用了一个存在的partial将直接报错.png)
{% codepen slug_hash:'eYKLJaG' %}
:stars: 这里其实是组合了包裹的助手代码的逻辑，来实现包裹场景！

### 使用webpack以及插件的方式集成Handlebars
