---
title: 路由配置中间件：koa-router
description: 路由配置中间件：koa-router
author: Zhenggl
date: 2023-07-12 05:04:07
categories:
  - [koa, middleware]
tags:
  - koa
  - middleware
cover_picture: koa-router封面.jpg
---
### 前言
{% link "koa-router官网" "https://github.com/koajs/router" true koa-router官网 %}
> `Koa`自身并没有提供关于对于不同的path、不同的method的处理中间件配置，假如我们在程序中采用一系列if判断，来识别不同的路径、不同的请求方式对应于不同的中间件函数的话，那么随着项目的迭代，产生的结果将会是毁灭性的！！
> 因此，需要 :u6709: 那么一个中间件，能够帮助我们管理好不同的路径、不同的请求方式下对应的中间件：`koa-router`，通过`koa-router`，可以满足这个情况的同时，还能够满足路由的叠加、嵌套，下面让我们来一一剖析一波！

### 如何使用
```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const app = new Koa();
const router = new Router();
router.get('/', (ctx, next) => {
  // ctx.router available
});
app
  .use(router.routes())
  .use(router.allowedMethods());
```
:trollface: 这里我们 :new: 了一个`router`路由器对象，然后针对该路由器对象进行了一个配置(即路径/请求方式与中间件的映射关系，应该是将中间件fn进行存储)，最后通过`router.routes()`获取所有这个`router`对象所配置的路由中间件！

#### koa-router的使用特性
:alien: 除了简单的请求方式与路径配置之后，`koa-router`还拥有 :point_down: 的一些特性，方便我们在日常的编码工作中更好的维护项目的路径与中间件关系(以下`~`代表一个中间件)：
1. 允许通过restful的方式来配置路由(也就是可以使用`router.get`、`router.post`、`router.put`等);
2. 允许使用命名路由参数(这有点类似于vue中的路由参数机制):`router.get('/users/:id', ~)`
```javascript
router.get('/:category/:title', (ctx, next) => {
  console.log(ctx.params);
  // => { category: 'programming', title: 'how-to-node' }
});
```
3. 允许使用命名路由，也就是给某个路由命名:`router.get('user', '/users/:id', ~)`;
4. 允许配置host匹配，代表只与`request.host`匹配的中间件:`new Router({ host: 'xxx.com' })`;
5. 允许配置405以及501响应;
6. 允许配置一个路由对应多个中间件：`router.get('/users/:id/', ~, ~)`，实现某个特定路由拆分为不同的中间件来响应；
7. 允许配置嵌套路由(这也有点类似于vue中的路由嵌套)：
```javascript
const forums = new Router();
const posts = new Router();
posts.get('/', (ctx, next) => {...});
posts.get('/:pid', (ctx, next) => {...});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());
// responds to "/forums/123/posts" and "/forums/123/posts/123"
app.use(forums.routes());
```
8. 允许配置路由前缀：`new Router({prefix: '/user'})`，后续在该路由器下的配置，均匹配`/user`前缀的路径，使得可以将业务拆分为不同的模块的路由中间件来处理;

#### koa-router的参数属性以及API
> 在使用`koa-router`的时候，有必要来了解一波关于`new Router()`的相关参数以及对应的`router`实例方法

**参数属性:**

| 属性 | 类型 | 默认值 | 描述 |
|----|----|----|:----|
| methods | Array | `['HEAD','OPTIONS','GET','POST','PUT','PATCH','DELETE']` | 配置的可响应的请求方式，一般无需重新配置 |
| exclusive | Boolean | false | 当有多个匹配项时，仅运行最后匹配的路由的控制器 |
| host | String｜Regexp | '' | 当前路由器对象匹配的主机名 |
| prefix | String | '' | 前缀路由器路径 |

**实例方法:**

| 实例方法 | 描述 |
|---|:---|
| restful系列() | 对应于不同的请求方式的api |
| use() | 中间件按照`.use()`定义的顺序运行，它们被顺序地调用，请求从第一个中间件开始，并沿着中间件堆栈“向下”工作。 |
| prefix() | 设置当前路由器对象的前缀 |
| routes()或者middleware() | 返回当前路由器对象的已配置的路由中间件 |
| allowedMethods() | 返回单独的中间件，用于响应具有包含允许的方法的“Allow”头的“OPTIONS”请求，以及根据需要使用“405 Method Not Allowed”和“501 Not Implemented”进行响应。 |
| all() | 通过all(也就是所有的methods)来注册路由 |
| redirect() | 以30x状态来重定向路由 |
| register() | 底层公共的创建并注册一个路由中间件 |
| route() | 通过给定的name来寻找一个路由中间件 |
| url() | 通过给定参数来返回对应的匹配路由路径 |
| match() | 匹配给定的`path`并返回相应的路由 |
| matchHost() | 将给定的“input”与允许的主机匹配 |
| param() | 运行命名路由参数的中间件，一般用于自动加载或验证 |

**部分api使用分析**

1. `router.param()`方法是Koa Router中的一个方法，用于定义全局参数处理函数，通过使用`router.param()`方法，可以在路由中定义一个特殊的中间件函数，用于处理指定名称的路由参数。该参数处理函数将在匹配到含有该参数的路由路径时被调用。
```javascript
/**
 * @desc: 当路由路径中含有指定名称的参数时，Koa Router会自动调用参数处理中间件函数，并将参数值、上下文对象和下一个中间件函数作为参数传递给该函数
 * @name: 要处理的路由参数的名称
 * @middleware: 参数处理中间件函数。它接受三个参数，分别是参数值、上下文对象（ctx）和下一个中间件函数（next）
*/
router.param(name, middleware);
// 以下是对应的使用方式
// 定义参数处理中间件函数，针对id参数进行过滤处理
router.param('id', async (id, ctx, next) => {
  // 处理参数值
  console.log(`参数值：${id}`);
  // 将参数值赋值给上下文对象
  ctx.params.id = id;
  // 调用下一个中间件函数
  await next();
});
// 定义路由
router.get('/users/:id', async (ctx) => {
  // 在路由处理函数中使用参数值
  console.log(`用户ID：${ctx.params.id}`);
  ctx.body = `用户ID：${ctx.params.id}`;
});
```
通过这种方式，可以将某个`router`对象配置一系列对某些参数的全局控制，可精确到针对某个参数发生时所对应的值的特殊判断！

2. `router.use()`router.use()方法是Koa Router中的一个方法，用于在路由中注册全局中间件函数，通过使用`router.use()`方法，可以将一个中间件函数应用到每个请求的路由上，这个中间件函数会在匹配到对应路由之前执行，可以用来实现一些通用的处理逻辑，如身份验证、错误处理等。
```javascript
/**
 * middleware: 要注册的中间件函数，接受三个参数，分别是上下文对象（ctx）、下一个中间件函数（next）和当前层级的路径
*/
router.use(middleware);
// 定义全局中间件函数
const logger = async (ctx, next) => {
  console.log('访问路径:', ctx.path);
  await next();
}
// 注册全局中间件
router.use(logger);
// 定义路由
router.get('/users', async (ctx) => {
  ctx.body = '获取用户列表';
});
```
:trollface: 这里`logger()`函数是一个自定义的全局中间件函数，用于打印访问路径，通过调用router.use()方法，并将logger函数作为参数传递进去，可以将这个中间件应用到每一个请求的路由上，当有请求到达时，logger函数会被先执行，打印访问路径，然后再将请求传递给下一个中间件函数或路由处理函数，使用`router.use()`方法可以实现在路由级别应用全局中间件，并且能够提供一种简便的方式来应用一些通用的处理逻辑。

3. `router.allowedMethods()`用于自动生成响应头中的Allow字段，指示服务器支持的请求方法，在HTTP协议中，服务器可以通过响应头中的`Allow`字段告知客户端服务器所支持的请求方法
```javascript
app.use(router.allowedMethods());
```
:alien: 在Koa应用中使用.use()方法来注册router.allowedMethods()中间件，这样，当请求到达路由时，中间件会自动检查请求的方法，并根据路由配置生成Allow字段的值，然后将其添加到响应头中

### 源码分析
> 通过源码的阅读，我们发现，其中关键核心的方法是这个`register()`，作为`koa-router`底层的注册方法，其中做了什么动作呢？使得`koa-router`的实例能够管理这个路由与中间件的关系？
:confused: 我想应该先要有一个fn的路由数组对象，用来维护已配置的中间件吧
```javascript
function Router(opts = {}) {
  this.stack = [];
}
Router.prototype.register = function (path, methods, middleware, opts = {}) {
  const router = this;
  const { stack } = this;
}
```
:stars: 上面这里的`stack`是用于存储`Layer`的数组！

:alien: 由于这个中间件允许接收数组类型的路径，那么，应该有针对数组类型的中间进行批量自我注册的逻辑吧
```javascript
if (Array.isArray(path)) {
  for (const curPath of path) {
    router.register.call(router, curPath, methods, middleware, opts);
  }
  return this;
}
```
:confused: `stack`中存储的`Layer`对象是什么？
```javascript
const route = new Layer(path, methods, middleware, {
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || '',
    ignoreCaptures: opts.ignoreCaptures
  });
stack.push(route);
function Layer(){
  // 存储中间件数组
  this.stack = Array.isArray(middleware) ? middleware : [middleware];
  // 解析路径为一正则表达式对象，并将对应的key相关存储与this.paramsName，以备后续使用
  this.regexp = pathToRegexp(path, this.paramNames, this.opts);
}
```
:stars: 初步看，像是针对`对应的路径+请求方法+中间件+配置=Layer`的一个对象，也就是将相关的信息存储在Layer中，也就是说中间件的响应处理动作其实是Layer对象的响应处理，`router`对象的注册动作其实就是创建一系列的`Layer`对象存储下来（存储于Layer对象中的stack数组）， :confused: 这里存储下来了之后，有什么用处呢？我们将在后面的内容中具体剖析！

:alien: 现在来看`app.use(router.routes())`这个方法具体做了什么动作，`app.use()`是使用路由中间件函数，那么这个`routes`方法应该是要返回一个`(ctx, next) => {}`的函数！
```javascript
Router.prototype.routes = Route.prototype.middleware = function(){
  const dispatch = function dispatch(ctx, next){}
  dispatch.router = this;
  return dispatch
}
```
:alien: 那么，当响应请求的时候(也就是执行这个dispatch方法的时候)，应该是需要拿当前上下文来匹配之前存储的路由`Layer`，根据匹配到的结果(应该是一个中间件数组)，然后批量执行这个中间件数组(使用`koa-compose`)，执行包装好的一个中间件执行链条
```javascript
// 这里mostSpecificLayer是通过路径匹配到的最佳Layer集合
const layerChain = (
  router.execlusive ? [mostSpecificLayer] : matchedLayers
).reduce(function(memo, layer){
  // 根据匹配到的layer组装好对应的一个个的中间件，主要是提供参数、属性
  memo.push(function(ctx, next){
    // 通过与路径匹配，将url中的参数给提取出来，放到layer.captures数组中
    ctx.captures = layer.captures(path, ctx.captures);
    // 从上述
    ctx.params = ctx.request.params = layer.params(
      path,
      ctx.captures,
      ctx.params
    );
    ctx.routerPath = layer.path;
    ctx.routerName = layer.name;
    ctx._matchedRoute = layer.path;
    if (layer.name) {
      ctx._matchedRouteName = layer.name;
    }
    return next();
  })
  //layer.stack是之前已配置存储的中间件
  return memo.concat(layer.stack);
}, [])
// 通过Array.reduce来将所有的匹配到的中间件存储于layerChain数组中，然后最后通过compose，返回一个串联好的待执行中间件链条
return compose(layerChain)(ctx, next);
```

:alien: 当经过`koa-router`中间件的处理之后，上下文`ctx`对象被添加了 :point_down: 几个属性：

| 属性 | 描述 |
|---|:---|
| captures | 一个数组，其中存储了通配符参数的值，当请求的URL与Layer对象的路径匹配时，`koa-router`会从URL中提取出对应的通配符参数值，然后将这些值存储在captures数组中，因此这个captures存储了参数值，且必须严格按照顺序来存储 |
| params | 包含URL参数的对象。例如，如果路由定义为/users/:id，那么在路由处理函数中可以通过`ctx.params.id`访问到对应的参数值 |
| routerPath | 注册的中间件路径字符串 |
| routerName | 匹配到的路由名称，一般是空的 |

### 学到什么
:trollface: 可以借助`koa-compose`，来实现自定义中间件时，以一个数组的方式来组合自己的中间件，满足一个动作由两个自定义的中间件来完成；还可以实现在自己自定义的中间件时，采用全局注册的方式，使得在存储原有中间件的同时(采用数组堆栈的方式来存储各个中间件)，然后全局注册的时候，将全局动作插入到整个堆栈之前，实现全局注册的目；还可以在现有的中间件中，通过参数匹配的方式(或者是自定义属性)，拦截部分中间件，做到高度自定义的目的！！