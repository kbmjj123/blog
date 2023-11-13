---
title: 外部存储会话管理：koa-generic-session
description: 本文主要介绍关于使用外部缓存存储session，主要结合koa-redis，来进行外部存储的过程熟悉，并从源码层面来具体剖析其中的运行过程，同时也初步了解redis，以及如何通过ko-redis来使用redis
author: Zhenggl
date: 2023-07-14 21:55:07
categories:
  - [koa, middleware]
tags:
  - koa
  - middleware
cover: koa-generic-session封面.jpg
---

### 前言
> 之前我们介绍了关于`koa-session`的简单运用，了解了其中关于内存缓存级别(cookies)控制的客户端会话管理，现在我们来了解一波关于外部存储(koa-redis)的相关运用，来以免服务重启导致缓存数据丢失的问题！
> 这里的`koa-generic-session`其实就是针对原本的`koa-session`进行一个一层包装，通过追加的固定的配置以及对应额外的属性来丰富这个`session`原本提供的功能！
> 这里可以简单的理解是将原本应该存储在内存中的数据，现在都存储到了数据库，而且数据结构就是以简单的`key: value`键值对的方式来存储的，如下图所示
![redis中存储的信息](redis中存储的信息.png)

### 如何使用
```javascript
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const koa = require('koa');
const app = new koa();
app.keys = ['自定义keys'];
app.use(session({
  store: redisStore()
}));
app.use(async (ctx) => {
  let session = ctx.session;
  switch(ctx.request.path){
    case '/get':
      session.count = session.count || 0;
      session.count ++;
      ctx.body = session.count;
      break;
    case '/remove':
      ctx.session = null;
      ctx.body = 0;
      break;
    case '/regenerate':
      break;
  }
})
app.listen(8888)
```
:trollface: 从前言中的截图可以看出，它只是简单地将原本存储到`cookies`中的数据，给存储到外部存储数据库(这里是redis)中了而已，而且数据结构方面的都保持一致！

#### session({})参数一览
> 除了从`koa-session`上继承而来的属性之外，还包含 :point_down: 的额外属性:

| 属性 | 数据类型 | 默认值 | 描述 |
|---|---|---|:---|
| key | Sting | `koa.sid` | cookie名称，默认是`koa.sid` |
| store | Object | MemoryStore | 外部存储store，默认是`MemoryStore` |
| ttl | Number｜Function｜Object | null | sessionStore的过期时间(与cookie.maxAge不是同一个)，默认是null(表示将从`cookie.magAge`或者`cookie.expires`中获取ttl) |
| prefix | String | `koa:sess:` | 即将存储的key的前缀 |
| cookie | Object | `{path:'/',httpOnly:true,maxAge:null,overwrite:true,signed:true}` | 会话`cookie`设置，默认是一cookie对象的内容 |
| defer | Boolean | false | 当通过`ctx.session`获取session时，是否延迟创建`session`对象 |
| reconnectTimeout | Number | 10 | 当store断开链接时，不立刻跑出`store unavailable`错误，等待配置的时间后重新链接，默认时10s |
| rolling | Boolean | false | 是否自动重置会话的标识，默认为false |
| genSid | Function | uid2函数｜null | 生成sid的规则，默认由`uid2`来生成，如果传递一支持`promises/async`函数则说明将采用自定义的规则来生成sid |
| errorHandler | Function | null | 当`Store.get()/set()`异常时，通过这个异常捕获函数来捕捉异常 |
| valid | Function | null | 使用前对`session`值进行一个校验，函数格式为`valid(ctx, session)` |
| beforeSave | Function | null | 存储`session`前触发的回调，函数格式为`before(ctx, session)` |
| sessionIdStore | Object | null | 用于传递`session`会话对象，带有`get`、`set`、`reset`方法的对象 |

### 源码分析
结合之前关于 {% post_link koa-middleware-session koa-session %} 的相关学习，我们只需要往这个`koa-session`中传递对应的符合“格式”的`store`即可，如果没有传递这个符合格式的store的话，则默认使用的自带的`MemoryStore`内存缓存机制:
```javascript
class MemoryStore{
  constructor(){
    this.sessions = {}
  }
  get(sid){
    return this.sessions[sid]
  }
  set(sid, val){
    this.sessions[sid] = val
  }
  destory(sid){
    delete this.sessions[sid]
  }
}
```
:trollface: 只要是符合`一个对象，包含有get、set、destroy`方法的store，都是合法的store！如果我们自己有合适的外部存储store的话，也是可以直接使用自定义的store来实现存储业务的，还可以追加自定义的一些逻辑条件等等

:stars: `koa-generic-session`还包装了一层自定义的Store，使得所有的`store`拥有了额外的公共api以及属性，下面看一下追加的属性以及api都有哪些：
```javascript
const defaultOptions = {
  prefix: 'koa:sess:'
}
class Store extends EventTimtter{
  constructor(client, options){
    super()
    this.client = client
    this.options = options
    // 将默认的配置通过`copy-to`库追加到this.options中
    copy(options).and(defaultOptions).to(this.options)
    if(typeof client === 'function'){
      // 将client的连接相关回调，绑定到store的相关回调方法中
      client.on('disconnect', this.emit.bind(this, 'disconnect'))
      client.on('connect', this.emit.bind(this, 'connect'))
    }
  }
  async get(sid) {}
  async set(sid, sess) {}
  async destroy(sid) {
}
```
:trollface: 与之前所学习的`koa-session`相类似，这个store也是必须拥有`get`、`set`、`destroy`的相关api属性方法的对象，这里通过自定义的Store，实现了将`koa-session`所要求的store进行了一次封装，这里就是在其中的每一个动作执行时，追加了一个前缀以及`ttl`属性的判断，如下代码所示：
```javascript
async set(sid, sess){
  let ttl = typeof this.options.ttl === 'function' ? this.options.ttl(sess) : this.options.ttl;
  if(!ttl){
    const maxAge = sess.cookie && sess.cookie.maxAge
      if (typeof maxAge === 'number') {
        ttl = maxAge
      }
      // if has cookie.expires, ignore cookie.maxAge
      if (sess.cookie && sess.cookie.expires) {
        ttl = Math.ceil(sess.cookie.expires.getTime() - Date.now())
      }
  }
  sid = this.options.prefix + sid
  await this.client.set(sid, sess, ttl)
}
```
:stars: 关于`ttl`这里具体了解一下 :point_right: : 如果我们在`koa-generic-session`的配置中声明了`ttl`，这个`ttl`可以是一个函数也可以是一个对象，当存储的时候，获取到cookei中的maxAge以及expires，优先取expires，赋值剩余的可用时长毫秒数，也就是说最终的ttl是传递给`client`三方存储的！！！

### 学到什么
1. :confused: 假如我们只有一个`redis`数据库服务，然后在上面跑着不同的业务，那么需要针对不同的业务进行不同的区分，应该针对不同的业务分配一标识符，在后续的查询匹配中，才可以通过这个标识符来精准匹配，以及后续也好方便进行针对不同的项目进行维护管理，可以使用这个配置中的`prefix`前缀用来区分！ 
2. 当我们需要在一个对象中追加自定义属性的时候，我们可以模仿上面的自定义Store，将`koa-session`所需的Store进行包裹一层，只要保证当通过新的Store所创建出来的对象的“外观”也是一致的就可以了；
3. 