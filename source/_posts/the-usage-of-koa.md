---
title: koa的使用与常用中间件一览
description: 本文主要介绍koa，从应用层面以及源码层面来剖析关于koa是什么？koa如何使用？了解koa生态所需的常用中间以及这些中间的运用？了解如何根据实际情况编写自己的中间件
author: Zhenggl
date: 2023-07-10 13:49:22
categories:
  - [nodejs, koa]
tags:
  - nodejs
  - koa
cover: koa封面.jpeg
---

### 前言
{% link "Koa官网" "https://koa.bootcss.com/" true Koa官网 %}
> `Koa`，基于Node.js平台的下一代web开发框架!
> 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 
> 通过利用 `async` 函数，`Koa`` 帮你丢弃回调函数，并有力地增强错误处理。 
> `Koa`` 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

### koa是什么?
> `Koa` 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。 
> `Koa` 类似于你可能遇到过的许多其他中间件系统，例如 Ruby 的 Rack ，Connect 等，然而，**一个关键的设计点是在其低级中间件层中提供高级“语法糖”**。 
> 这提高了互操作性，稳健性，并使书写中间件更加愉快。
> 这包括诸如内容协商，缓存清理，代理支持和重定向等常见任务的方法。 
> 尽管提供了相当多的有用的方法 Koa 仍保持了一个很小的体积，因为没有捆绑中间件。

#### 如何使用koa?
```javascript
const Koa = require('koa');
const app = new Koa();
app.use(async ctx => {
  ctx.body = 'Hello World';
});
app.listen(3000);
```
:point_up: 是最简单的`Koa`的一个使用，通过`app.listen()`，其底层其实是调用的`http`模块来创建一个`server`并监听对应的端口号，同时对响应的过程做了一层二次的封装，也就是对`request`以及`response`进行了一个包装！

#### koa的构成
> `Koa`的构成相当简单，只有简单的4个js文件，其他的服务都由其生态下的中间件来提供的服务
![Koa](Koa.png)

##### 监听模式的实现
> `Koa`采用继承于`Emitter`，因而拥有了`on/off/emit`等事件监听动作！
```javascript
  module.exports = class Application extends Emitter {}
```
:trollface: 因此，我们可以通过`app.on('error')`的方式来监听这个程序在执行过程中所产生的异常，并做对应的处理，比如发送邮件，自动重启服务等等，因为这里的`error`由上下文context所抛出来的！
```javascript
// context.js
onerror(){
  // delegate
    this.app.emit('error', err, this)
}
```

##### 运行过程
> 一切从监听的callback开始，当有来自客户端的请求时，进入到对应的callback方法中
```javascript
  callback(){
    const fn = this.compose(this.middleware)
    if(!this.listenerCount('error')) this.on('error', this.onerror)
    const handleRequest = (req, res) => {
      // 针对每一次回调处理都创建一个上下文
      const ctx = this.createContext(req, res)
      if(!this.ctxStorage){
        return this.handleRequest(ctx, fn)
      }
      return this.ctxStorage.run(ctx, async () => {
        return await this.handleRequest(ctx, fn)
      })
    }
    return handleRequest
  }
  handleRequest(ctx, fnMiddleware){
    const res = ctx.res
    res.statusCode = 404  // 这里默认的都是404，因此如果没有配置对应的路由处理时，将默认返回404
    const onerror = err => ctx.onerror(err)
    const handleResponse = () => respond(ctx)
    onFinished(res, onerror)
    return fnMiddleware(ctx).then(handleResponse).catch(onerror)
  }
```
:stars: 从上述的回调执行过程，我们可以看出有 :point_down: 几个关键点：
1. 对于每一次客户端的的请求，都自动创建与请求相关的上下文对象context来处理；
2. 对于客户端的请求，如果没有与之对应的处理中间件函数，则默认都是404来响应；
3. 在创建出来的上下文context对象中，采用state来作为中间件数据通信的载体

![koa串联中间件执行过程](koa串联中间件执行过程.png)
:confused: 那么上面的`compose(this.middleware)`方法执行的时候，做了什么事情呢？为什么我们在使用中间件的时候，它是以一种洋葱的执行顺序来执行的呢？下面将分析一波对`compose()`方法，来加深对这个洋葱执行顺序的理解：
```javascript
function compose(middleware){
  // ...这里隐藏一系列对于middleware函数的判断逻辑
  return function(context, next){
    let index = -1
    return dispatch(0)
    function dispatch(i){
      if(i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if(i === middleware.length) fn = next
      if(!fn) return Promise.resolve()
      try{
        // 这里是关键所在，它决定了各个中间件的执行顺序是从middleware中设置的顺序绑定的
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      }catch(err){
        return Promise.reject(err)
      }
    }
  }
}
```
:trollface: 当我们使用的`use(fn)`的时候，也就是将每一个fn函数添加到`this.middleware`中的过程，然后在响应请求的时候，`compose()`将所有的中间件`this.middleware`数组给按照顺序且采用Promise的方式来串起来执行，因此有以下例子的一个执行顺序：
![洋葱执行顺序的中间件](洋葱执行顺序的中间件.png)
:trollface: 一般的，当我们要执行某个中间件时，需要先执行`next()`方法，当我们先执行了`next()`方法的时候，意味着先执行上述代码中的`dispatch()`方法中的下一个中间件方法，按照这种套路的话，越晚`use`的中间件将越晚被执行到！

:confused: 假如这个我们的某个中间件执行比较耗时的话，应该怎样做确保还是能够按照这个先进后出的执行顺序来执行呢？
![耗时执行的中间件](耗时执行的中间件.png)
:stars: 针对这种情况，通过追加`await`关键词以及采用`Promise`将异步操作给包裹起来，实现等待上一个中间件执行完毕后，再继续执行下一个中间件的目的：
![针对异步的方式保证执行顺序的操作](针对异步的方式保证执行顺序的操作.png)

### 常用中间件
:point_down: 是官网的核心框架以及常用的中间件
{% link "核心框架以及中间件" "https://github.com/koajs/koa/wiki#middleware" true 核心框架以及中间件 %}
> 以下整体在实际编码过程中，常用的koa相关的中间件，并具体阐述关于各个中间件是如何使用，如何搭配社区推荐的中间件来完善完成后台的服务的搭建：

| 中间件名称 | 中间件地址 | 描述 |
|---|---|:---|
| 路由 | [https://github.com/koajs/router](https://github.com/koajs/router) | 针对不同的路径以及请求方法、请求参数配置对应的响应中间件 |
| 参数解析 | [https://github.com/koajs/bodyparser](https://github.com/koajs/bodyparser) | 解析请求中的参数到body中 |
| 静态资源服务 | [https://github.com/koajs/static](https://github.com/koajs/static) | 将当前某个目录原封不动响应输出到客户端 |
| jwt | [https://github.com/koajs/jwt](https://github.com/koajs/jwt) | jsonwebtoken的处理工具 |
| 文件上传 | [https://github.com/koajs/multer](https://github.com/koajs/multer) | 处理文件上传服务 |
| redis缓存 | [https://github.com/koajs/koa-redis](https://github.com/koajs/koa-redis) | 处理redis数据缓存 |
| 日志输出 | [https://github.com/koajs/bunyan-logger](https://github.com/koajs/bunyan-logger) | 统一的日志输出 |
| session会话 | [https://github.com/koajs/session](https://github.com/koajs/session) | 前端session会话管理 |
| 跨域配置 | [https://github.com/koajs/cors](https://github.com/koajs/cors) | 跨域资源请求配置 |
| csrf | [https://github.com/koajs/csrf](https://github.com/koajs/csrf) | 伪造请求识别 |
| 关系型数据库orm | [https://sequelize.org/](https://sequelize.org/) | 关系型数据库的ORM库 |
| mongodb orm | [https://mongoosejs.com/](https://mongoosejs.com/) | mongodb数据库的ORM库 |

### 如何编写自己的中间件
> 在实际的业务编码过程中，我们可能会遇到官方/社区所提供的中间件不够满足我们所需，比如在每一次响应时，输出自定义的日志到某个文件位置，按照日期的文件命名来存储，或者是针对所有的结果响应采用统一的数据结构来输出，需要在原有的中间件基础上，新增自定义中间件，那么应该如何来编写这个中间件呢？
1. 首先，中间件是对外导出一个函数，该函数接收两个参数：上下文ctx和下一个中间件函数next;
2. 根据当前中间件的作用，来决定优先执行`next()`，还是在当前中间件业务逻辑执行之后再执行`next()`;
3. 一般执行`next()`时需要`await`来等待执行;
4. 中间件的配置(`use()`)的顺序，如果无需为后续中间件服务，则可忽略执行顺序，如果需要在`ctx.state`中存储数据为后续中间件所用，则需要将该中间件作为最后配置，并将数据存储至`ctx.state`中备用

### 组装常用中间件搭建后台快速开发的脚手架
> 既然上述我们提及了这么多的中间件，那么，当我们需要开启一个全新的项目的进行研发，并采用`Koa`作为项目的基础服务框架的时候，可以搭建自定义的一个脚手架程序，将相关的中间件给加载进来，并按照顺序配置好对应的中间件，以便于快速开发一个新项目，而无需重复从零开始搭建项目，只需要一个命令即可完成后台项目框架的搭建！！