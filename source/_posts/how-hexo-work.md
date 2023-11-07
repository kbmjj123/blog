---
title: hexo是如何工作的
description: hexo是如何工作的, hexo的原理是什么, 如何扩展自定义hexo
author: Zhenggl
date: 2023-04-11 06:30:41
categories:
  - [html, 博客, hexo]
tags:
  - html
  - ejs
  - hexo
cover: hexo封面.jpeg
---

### 前言
{% link "官方文档" "https://hexo.io/zh-cn/docs/" true 官方文档 %}
> 自己的博客运行了也有一段时间了，想了解一下自己的博客站点整体是如何工作的？以及自己可以做点什么，来往这个博客站点中植入自己的插件来满足自定义的需求！
> 本文将具体分析一下`hexo`是如何工作的？它都有哪些组成？我们可以在这个框架上如何自定义自己的需求？以及这个框架给我们代码的可学习的地方！！！

### hexo的组成
> 首先，不管怎么，代码到手，天下我有！ :point_right: 先来看一下对应的`hexo`的代码目录结构：
![hexo的代码组织结构](hexo的代码组织结构.png)
:space_invader: 通过`package.json`中的`main`，可以发现其中的入口在于`bin/hexo`文件
```js
#!/usr/bin/env node
'use strict';
require('hexo-cli')();
```
:space_invader: 而`hexo`则是调用的`hexo-cli`库来实现的，后面发现，`hexo-cli`则是反过来调用的`hexo`来进行 :point_right: 创建一个`Hexo`对象，并最终调用这个`Hexo`对象的`init()`方法 ！！
![hexo的执行顺序](hexo的执行顺序.png)

:stars: 也就是说这个`hexo-cli`充当了一个执行者的作用！！
![hexo的构成](hexo的构成.png)

:alien: 而这里的`Hexo`对象，则是继承于`EventEmitter`对象，可针对其过程进行一系列的监听(也就是监听其生命周期过程方法)！
![Hexo对象的组成](Hexo对象的组成.png)

#### 1. extend扩展(以console.clean为例)
![Hexo扩展对象.png](Hexo扩展对象)
:star: 从上面可以看出，`Hexo`通过其`extend`对象中的各个属性，对外提供的可随意针对不同阶段进行扩展自定义业务的机制，也就是我们可以编写自己的插件来交付给`hexo`，让他来帮执行我们的需求！！

:point_right: 这里我们仅分析一个插件，他是如何来编写以及如何被植入到扩展中的(以`console`为例)！！
![注册的console的clean命令.png](注册的console的clean命令)
:confused: 这里的`console.register()`方法，他做的一个怎样的动作的呢？？来看一下对应的`register()`函数：
![Console插件服务](Console插件服务.png)
:point_down: 是对应的简写版的`register()`函数内容：
```javascript
// this.store = {};
// this.alias = {};
/**
 * @name: 注册的hexo命令名称
 * @desc: 对该命令的一个描述
 * @options: 该命令所需的参数
 * @fn: 该命令所对应的执行动作
*/
register(name, desc, options, fn){
  //... 此处隐藏一系列的参数个数兼容赋值操作
  if(fn.length > 1){
    fn = Promise.promisify(fn);
  }else{
    fn = Promise.method(fn);
  }
  const c = fn;
  this.store[name.toLowerCase()] = c;
  c.options = options;
  c.desc = desc;
  this.alias = abbrev(Object.keys(this.store));
}
```
:trollface: 这里的`register()`方法对外提供了一个方法，用于将外部插件fn以及对应的描述和参数通过`abbrev`生成关键词参数，存储在`store`对象中，以便于后续`Hexo`拿来使用！

:stars: 这里的`abbrev`三方库：可将一系列字符串参数转换为每个单词依次追加的对象，主要用于命令行的命令声明使用，如下图说明所示：
![abbrev的效果](abbrev的效果.png)

:stars: 而于此同时，我们所传递进来的`fn`它可以是一个函数数组，也可以是一个普通的函数，如果传递的函数数组则表示我们将在这个命令上计划执行N个按照数组顺序排列执行的函数，每一个函数都是一个个待被执行的`promise`

:point_down: 是对应的`clean.js`的程序内容！
```javascript
function cleanConsole(args) {
  return Promise.all([
    deleteDatabase(this),
    deletePublicDir(this),
    this.execFilter('after_clean', null, {context: this})
  ]);
}
//**** 此处隐藏一系列代码 ****
module.exports = cleanConsole;
```
:stars: 针对上述的代码进行一个简单的分析，通过对外暴露一个方法函数，该函数接受一个`args`参数，执行3个动作：
1. 删除Database数据库；
2. 删除public目录；
3. 触发过滤器`after_clean`，并传递当前的上下文对象

:trollface: 这里有一需要 :warning: 的地方，在**插件中直接调用的`this.execFilter`方法**，:confused: 那么这里的`this`指向的是谁呢？
![插件所需的上下文是如何传递进来的](插件所需的上下文是如何传递进来的.png)
![Hexo注册插件的过程](Hexo注册插件的过程.png)

#### 2. warehouse本地json数据库
> 具有模型、模式和灵活查询接口的 `JSON` 数据库，可以理解为是一个`JSON文件`，然后可通过其API来对其进行增删改查操作！
{% link "官方文档" "https://hexojs.github.io/warehouse/" true 官方文档 %}
:stars: 先来看一下这个`warehouse`的一般用法：
![warehouse的一般使用](warehouse的一般使用.png)
:space_invader: 与一般的db操作类似，创建db的引用(类似于连接)，然后关联对应的数据表`Schema`，然后就可针对不同的数据表`Schema`进行增删查改操作，然后需要将操作缓存到json数据库中(这个save动作必须要执行，否则对应的json文件将没有任何的用处)！

:confused: 那么这个`warehouse`数据库的结构组成是怎样的呢？我们可以先看一下 :point_down: 在内存中的数据库的内容形式：
![warehouse中的database存储形式](warehouse中的database存储形式.png)

:stars: 结合实际的源码，我们可以得出 :point_down: 的一个`warehouse`的组成结构图：
![Warehouse数据库](Warehouse数据库.png)

:trollface: `warehouse`所支持的数据表字段类型`SchemaType`有：

| 数据表字段 | 描述 |
|---|---|
| array | 数组类型 |
| boolean | 布尔值类型 |
| buffer | 文件缓存类型 |
| cuid | 随机id类型 |
| date | 日期 |
| integer | 整型类型 |
| number | 数值类型 |
| object | 对象类型 |

:star: 那么我们在定义数据表的时候， :confused: 假如需要将对应表的字段给声明出来，不同的表对应用不同的`Schema`来表示，那么假如我们需要定义不同类型的字段，应该如何来声明呢？
```javascript
db.model('customs2', new Schema({
    cate: { type: Enum, value: [1,2,3,4] },
    content: { type: Object, default: {} },
    list: { type: Array, default: [] },
    c: { type: CUID }
  }));
```
![不同参数字段的数据表](不同参数字段的数据表.png)

:alien: 在实际的coding过程中，我们还可以将`Model`的创建与数据的管理给分离开来：
![database与model分开维护的方式](database与model分开维护的方式.png)

:trollface: `hexo`中是如何来运用这个`warehouse`的呢？
![hexo如何使用warehouse的](hexo如何使用warehouse的.png)
:point_up: 这里其实与我们平时使用类似，都是面向接口编程，统一操作database，由database自行去维护好与model之间的一个关联关系！

#### 3. render渲染引擎(hexo server)
> 当我们执行的`hexo server`命令的时候，从 :point_up: 的学习可以得知，最终会执行到`Hexo.call()`方法，该方法主要负责从`console`已注册的扩展动作中取出函数来执行！，如下代码所示：
```javascript
call(name, args, callback) {
  const c = this.extend.console.get(name);
  // 以Reflect的方式，来执行一个fn，并传递参数设置回调callback
  if (c) return Reflect.apply(c, this, [args]).asCallback(callback);
  return Promise.reject(new Error(`Console \`${name}\` has not been registered yet!`));
}
```
:confounded: 这里我们并没有在`Console`中找到关于`hexo server`对应的函数实现是怎样的，实际上这也是`hexo`实现插件化编程的灵活之处，将对于这个命令的实现，交由`hexo-server`另外一个库来实现！！！

##### hexo-server的实现过程
![插件如何编写](插件如何编写.png)
> **一切在`hexo`中运行的插件，都可以直接访问到hexo上下文对象**
> 由于可以直接访问到hexo上下文对象，因此可以直接针对`hexo.extend`来进行额外动作的补充
```javascript
hexo.extend.console.register('server', 'Start the server.', {
  // ... 此处隐藏相关的options的定义
}, require('./lib/server'));
```
因此，执行的`hexo server`其实就是调用的`lib/server`方法！
:point_right: 而这里的动作无非也就是监听html相关文件的生成，并借助于`connect` + `serve-static`来监听运行在端口上的静态网站站点！！

### 能够做点什么
> 在学习完成了`hexo`的相关知识点后，发现有不少可值得学习的地方：

#### 1. 针对扩展新增自定义插件(新增的插件都是不能访问浏览器资源的)

#### 2. 优化现有的站点

### 学到的东西

#### 1. 模仿nodejs实现自定义的函数包裹，并从中获取额外的上下文对象
![hexo模仿的nodejs追加的module以及export对象](hexo模仿的nodejs追加的module以及export对象.png)

#### 2. 对外暴露extend对象代表不同阶段的扩展，实现插件编程范式

#### 3. 本地简易数据库warehouse-json编程
> 可以将当下的后台一些无须复杂数据库方能实现的逻辑，交由`warehouse`来实现！！