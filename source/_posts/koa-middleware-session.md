---
title: 会话管理中间件：koa-session
description: 整理了关于koa-session的使用，详细从整个请求/响应过程来具体分析session的工作过程，并从运行过程代码剖析了关于内部存储与外部存储，加深对koa-session的理解
author: Zhenggl
date: 2023-07-13 08:19:41
categories:
  - [koa, middleware]
tags:
  - koa
  - middleware
cover: koa-session封面.jpg
---
### 前言
{% link "koa-session官网" "https://github.com/koajs/session" true koa-session官网 %}
> 对于浏览器端的session，通常会使用cookie来存储session标识。在用户首次访问服务端时，服务端会生成一个唯一的session标识，并将其存储在cookie中返回给浏览器。
> 随后，每次浏览器发送请求到服务端时，会自动携带上一次存储在cookie中的session标识。服务端通过解析请求中的session标识，可以识别出当前请求属于哪个session。
> 服务端会根据session标识来查找相应的session数据，并进行相应的处理。在处理完请求之后，服务端会更新session数据，并将最新的session标识返回给浏览器，以便下次请求使用。
> 这种基于cookie的session机制可以确保同一个浏览器在一次会话中持续保持与服务端的连接，并共享会话数据。通过每次请求携带最新的session标识，可以保证同一个session会话的持续性和一致性。此外，为了防止篡改或伪造session标识，可以结合使用签名（sig）等方式，增加session的安全性。
> `Koa`简单的会话管理中间件，基于cookie机制，并支持外部存储(比如redis、db数据库等存储方式)
> 默认配置是不带数据库的，也就是基于内存的存储，这虽然访问快，但是一旦服务重启，所存储的信息就无效了，因此一般需要结合对应的数据库存储库来保证数据的持久有效性！
:point_down: 是session在浏览器中的一个工作过程以及对应的执行结果：
![session工作过程](session工作过程.png)
![session的工作机制](session的工作机制.jpg)

### 如何使用
```javascript
const session = require('koa-session');
const Koa = require('koa');
const app = new Koa();
app.keys = ['一个安全密钥'];
// 定义session的配置
const CONFIG = {
  key: 'koa.sess',  //cookie key(默认是koa.sess)，这将会在对应的浏览器中request/response展示出来
  maxAge: 86400000, //有效时长，默认是1天，以毫秒ms为单位
  autoCommit: true, // 是否自动提交到请求头中
  overwrite: true,  // 是否允许覆盖
  httpOnly: true,   // 是否仅在http中有效
  signed: true,     // 是否签名
  rolling: false,   // 是否强制在每个响应上设置会话标识符cookie，过期时间为maxAge
  renew: false,     // 当会话即将超时时是否自动更新会话，这可以保持一致有效
  secure: true,     // 是否安全cookie
  sameSite: null    // cookie相同站点选项
};
app.use(session(CONFIG, app))
app.use(ctx => {
  if(ctx.path === '/favicon.icon') return;
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + ' views';
})
app.listen(3000);
```
:trollface: 上述中的`CONFIG`配置除了key之外的其他属性，都将通过`ctx.cookies.get()`或者`ctx.cookies.set()`方法来进行设置到网络请求的配置中

#### 参数说明
> `koa-session`中配置的参数不只上述提及到的， :point_down: 将具体分析各个参数已经其使用方式：
![koa-session配置参数](koa-session配置参数.png)
:trollface: 上述中的`store`与`ContextStore`两者有一个微妙的不同，虽然都是必须要拥有`get`、`set`、`destroy`方法，但两者是互斥的，而且`ContextStore`的优先级要大于`store`，具体关于两者的使用以及运行过程，将在下面的源码分析中说明！

### 源码分析
> `koa-session`默认采用内部存储，可以理解为存储在内存中，然后针对每次客户端的请求，都自动去内存中匹配到对应的上次请求用户的标识，用以区分用户，这个在最开始的前言我们也已经具体讲解过了，现在我们要从入口开始，具体分析这个`koa-session`的执行过程，一切从调用的入口开始：
```javascript
module.exports = function(opts, app){
  opts = formatOpts(opts) // 这里进行参数的初始化已经外部存储的校验
  extendContext(app.context, opts)  // 扩展请求上下文ctx追加当前中间件所新增的属性
  return async function session(ctx, next){
    // 这里将自动通过Object.defineProperties()来创建一个ContextSession对象并返回
    const sess = ctx[CONTEXT_SESSION]
    if(sess.store) await sess.initFromExternal()
    try{
      await next()
    }catch(err){}finally{
      if(opts.autoCommit){
        // 自动提交存储动作！
        await sess.commit()
      }
    }
  }
}
```
:alien: 这里通过扩展请求上下文，也就说明了为什么我们使用了`koa-session`中间件之后，可以通过`ctx.session`来访问到上下文会话了，因为每一次的请求，都会创建一新的`session`来作为请求上下文的访问，通过`session`可以进行相关的读写操作，这里的`session`其实就是`SessionContext`中的`session`

#### 上下文中新增的参数
> 经过`koa-session`中间件之后，新增的属性有：`session`、`sessionOptions`、`Symbol类型的ContextSession`
```javascript
// 自定义的扩展请求体上下文的方法
function extendContext(context, opts){
  Object.defineProperties(context, {
    [CONTEXT_SESSION]: {},
    session: {}
    sessionOptions: {}
  })
}
```
:confused: 而这个`CONTEXT_SESSION`被访问的时候，它是采用一种懒加载的方式来执行的，如下所示：
```javascript
  [CONTEXT_SESSION]: {
    get(){
      if(this[_CONTEXT_SESSION]) return this[_CONTEXT_SESSION];
      this[_CONTEXT_SESSION] = new ContextSession(this, opts);
      return this[_CONTEXT_SESSION]
    }
  }
```
:point-right: 因此，当通过`const sess = ctx[CONTEXT_SESSION]`的时候，将自动创建一`ContextSession`对象，这个对象就是主要负责管理`session`会话的所有功能
```javascript
class ContextSession{
  constructor(ctx, opts){
    this.store = this.opts.ContextStore ? new this.opts.ContextStore(ctx) : this.opts.store;
  }
}
```
:stars: 当响应一个请求的时候，该中间件将创建对应的`ContextSession`上下文会话，并将其`store`属性与`ContextStore`或者`外部存储store`关联，也就是说，如果我们传递了`ContextStore`或者`store`的话，那么后续关于session的key的获取与赋值，将从传递进来的外围store来处理， :confused: 这里有一个区别，就是`ContextStore`都是以`ctx`作为其中的参数，因此我们可以在使用外围store处理session的key时候，结合`ctx`中的信息来进行一个组合判断校验！

:alien: 当我们通过在中间件中使用`this.session.views`的时候，将会自动执行`ContextSession.get()`方法(这里假设我们没有使用外部存储，默认用cookie)，则将自动访问`ContextSession.initFromCookie()`方法，从cookie中来创建一个会话！
```javascript
initFromCookie(){
  const cookie = ctx.cookies.get(opts.key, opts)
  if(!cookie){
    // 如果是第一次请求，cookie中不存在目标key的值，则创建一个新的key值
    this.create()
    return
  }
  // 非第一次请求，从获取到的之前的cookie中获取值
  let json = opts.decode(cookie)
  this.create(json) //这里创建一个新的session，作为后续直接访问使用
  // 缓存上一次的session的内容，一般有几种类型：changed、renew、rolling、空
  this.prevHash = util.hash(this.session.toJSON())
}
// 创建一个session会话对象，并存储于当前上下文会话中，作为后续commit用途
create(val, externalKey){
  this.session = new Session(this, val, this.externalKey)
}
```
:stars: 这里我们平时所使用的`this.session`其实就是`koa-session`库中的`Session`对象，我们可以直接使用其相关的api：
1. toJSON(): 获取session会话中的key的所组成的对象，我们上述所传递的自定义属性`views`就直接存储于此；
2. length: 获取session会话存储的对象的key的数量；
3. maxAge: 获取session会话超时时长；
4. externalKey: 获取配置的外部键；
5. save(): 将当前请求中的会话给存储下来；
6. regenerate(): 重新生成一个新的会话；
7. manuallyCommit(): 手动commit一个session；
8. commit(): 触发当前session所在的上下文会话中的commit方法，实现会话的存储；

#### 真正commit的过程
> 当`commit`动作发生的时候，最终由`ContextSession`中的`commit({})`来完成最终的提交保存动作
```javascript
async commit({ save = false, regenerate = false } = {}){
  const reason = save || regenerate || session._requireSave ? 'force' : this._shouldSaveSession();
  if(!reason) return;
  if(typeof opts.beforeSave === 'function'){
    // 如果配置session的时候传递了beforeSave()函数，则在保存session前触发对应的回调
    opts.beforeSave(ctx, session);
  }
  const changed = reason === 'changed'
  await this.save(changed)
}
```
:stars: 这里的`commit`其实是提交前的准备工作，根据`_shouldSaveSession()`的返回值来判断是否需要执行最终的`save()`操作，`_shouldSaveSession()`主要用于结合过期参数(`expire`、`maxAge`)来决定是否要执行保存动作，然后最终触发`save()`进行session会话的存储，一般默认是存储于`cookies`中，因此在最开始的前言中我们可以看到在浏览器客户端中的请求响应tou中的cookies可以看到所存储的值！
```javascript
async save(changed){
  let json = this.session.toJSON()
  let maxAge = opts.maxAge ? opts.maxAge : ONE_DAY  //默认一天时间内有效
  if(maxAge === 'session'){
    opts.maxAge = undefined
    json._session = true
  }else{
    // 每次的请求过期时间都是在当前响应时间上自动加上超时时长，因此每次的session会话都延长时间了
    json._expire = maxAge + Date.now()
    json._maxAge = maxAge
  }
  //... 这里隐藏关于store的存储相关的
  json = opts.encode(json)  // 加密json串内容
  this.ctx.cookies.set(key, json, opts)
}
```
:stars: 这里我们可以发现默认的session都存储于cookies中！！

### 学到什么
1. 当我们需要在对象中定义某些属性，然后不想外部直接放回到这些属性，可以采用在对象内部定义Symbol参数，然后以Symbol作为属性，然后对其进行相应的赋值操作；
2. 当我们想要懒加载对象的时候，可以等到需要访问到对象的时候才进行该对象的初始化工作，这种我称之为显示的懒加载，还存在另外一种懒加载的方式：通过`Object.defineProperty()`的方式，通过重载其`get()`方法，使得我们在访问的时候，直接无视初始化的工作；
3. `ContextStore`可以结合请求上下文ctx，实现上下文与cookies结合，并开放额外的方法api，可配合数据库，进行session的存取毁工作！