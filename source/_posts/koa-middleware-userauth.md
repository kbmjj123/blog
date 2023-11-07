---
title: koa用户认证抽象层中间件
description: 本文分析了关于如何使用koa-userauth中间件，用来解决部分资源是需要授权登录通过之后才能够允许访问的场景，并通过koa-userauth的配置来控制路由匹配规则、登录成功后的跳转等等，并从源码层面理解这种场景的具体实现，加深对koa-userauth的理解
author: Zhenggl
date: 2023-07-19 16:35:02
categories:
  - [koa, middleware]
tags:
  - koa
  - middleware
cover: koa-userauth封面.jpg
---

### 前言
> `koa-userauth`用户认证抽象层中间件，主要用于在某些场景下，某些资源是必须授权(一般是登录)通过之后才能够访问的，当未登录去访问需要的资源时，由于该资源是需要授权才能够访问到的(可选择从session中获取)，因此将自动重定向到，再重定向到原本目标资源的访问
![用户认证授权流程](用户认证授权流程.png)

### 如何使用
```javascript
const koa = require('koa');
const userauth = require('koa-userauth');
const session = require('koa-generic-session');
const app = new koa();
app.keys['I am secret'];
app.use(session());
app.use(userauth({
  match: '/user',
  loginURLFormatter: (url) => {
    return '即将重定向的登录页面?redirect=' + url
  }，
  getUser: async ctx => {
    const token = this.query.token;
    // 这里一般是从请求中获取到token，然后从数据库或者是其他的缓存中根据token那用户信息，然后将这个用户信息返回
    return user;
  }
}));
app.listen(3000)
```
:trollface: `koa-userauth`是基于`koa`或者`koa-generic-session`的基础上来工作的，通过对外暴露的`userauth({配置})`方法，来配置并创建对应的一中间件，初步猜测应该是通过匹配每一次客户端请求的资源的路径`ctx.request.path`来进行对应的动作分配的！这边将在后续的源码分析中具体剖析一波！

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|:---|
| match | String｜Regex｜Function｜null | null | null | `(pathname, ctx) => {}`用于匹配哪个链接需要用户鉴权，**当传递的空字符串的时候，将匹配到所有的链接** |
| ignore | String｜Regex｜Function｜| null | null | 用于匹配哪个链接无需用户鉴权，如果存在`match`属性则忽略`ignore`属性 |
| loginURLFormatter | Function | null | `(url, rootPath, ctx) => {}`，设置格式化的登录url，也就是需要重定向到的登录页面链接地址 |
| rootPath | String | '/' | 默认的appurl的跟路径 |
| loginPath | String | '/login' | 登录的路径 |
| loginCallbackPath | String | loginPath + '/callback' | 登录成功后的回调路径地址 |
| logoutPath | String | '/logout' | 退出登录的路径 |
| userField | String | 'user' | 登录成功后，将会在`this.session`上使用的登录用户字段名，也就是可以通过`this.session.user`来访问到对应的登录用户信息 |
| getUser | Function | null | `ctx => {}`，获取用户函数，使用从`req`中获取用户信息 |
| loginCallback | Function | null | `(ctx, user) => {}`，用户登录处理逻辑回调，一般是登录成功了，需要那登录后的用户信息来做其他的操作，而且这里返回的`redirectUrl`，将控制着是否要在登录成功后，飞到其他的地方，返回`[user, redirectUrl]` |
| loginCheck | Function | null | `ctx => {}`，返回true则表示已登录，默认值为true |
| getRedirectTarget | Function | null | `ctx => {}`，自定义在登录之后如何重定向到目标链接 |
| logoutCallback | Function | null | `(ctx, user) => {}`，用户退出登录的逻辑回调，当用户触发推出登录操作时候，将自动触发该方法，该方法可通过返回一字符串，改变原本的退出登录重定向链接地址 |

### 源码分析
> `koa-userauth`这么多的配置参数，那么它是如何结合这些参数来进行工作的呢？
> 一切从调用的方法入口开始：
```javascript
const defaultOptions = {
  userField: 'user',
  rootPath: '/',
  loginPath: '/login',
  logoutPath: '/logout'
}
module.exports = function(options){
  copy(defaultOptions).to(options)  // 将默认的配置与传递进来的配置进行一个合并操作，同步到传递进来的options中
  // ...这里省略一系列的赋值操作
  // 既然是koa中间件，那么就必须返回对应的中间件格式的函数
  return async function userauth(ctx, next){
    if(!ctx.session){
      // 如果用户未登录则直接返回这个登录的中间件
      return loginHandler(ctx);
    }
    if(ctx.path === options.loginPath){
      // 匹配到koa-userauth中的登录路径
      return loginHandler(ctx);
    }
    if(ctx.path === options.loginCallbackPath){
      // 匹配到当前请求资源地址为登录成功后的回调地址，以一个登录回调中间件来处理事件
      return loginCallbackHandler(ctx)
    }
    if(ctx.path === options.logoutPath){
      // 访问的推出登录的path
      return logoutHandler(ctx)
    }
    if(!loginRequired){
      // 被忽略的鉴权资源
      return next()
    }
    if(ctx.session[options.userField] && options.loginCheck(ctx)){
      // 用户已登录且登录有效，则直接返回
      return next()
    }
    // ... 以下省略执行与loginCallback默认的动作一致，从options.getUser、options.loginCallback相关回调方法中获取用户信息以及对应的回调地址
    return next()
  }
}
```

#### 登录中间件loginHandler
:stars: 关于这个`loginHandler(ctx)`登录中间件的定义如下：
```javascript
  function login(options){
    return async function loginHandler(ctx){
      // ... 这里根据已经拼装好的loginURL，登录链接地址，最终调用的ctx.redirect()动作进行跳转
      redirect(ctx, loginURL)
    }
  }
```
:star: 也就是说，在执行到这个`loginHandler`中间件的时候，将自动拼装好即将要登录的loginURL，进行对应的跳转，这里没有使用`next()`，意味着一旦执行到这个中间件的时候，就直接飞往另外的一个地址了！！！

#### 登录回调中间件loginCallback
:stars: 一般情况下，我们在用户登录成功后，允许对用户进行一个干预操作，比如说要追加或者记录等操作！因此可以根据这个`loginCallback`来进行回调处理
```javascript
function loginCallback(options){
  return async function loginCallbackHandler(ctx){
    // ...这里隐藏referer的相关操作
    let user = ctx.session[options.userField];  // 获取只用通过这个userField字段来缓存的用户信息
    if(user){
      // 用户之前已经登录过，直接重定向
      return redirect(ctx, referer);
    }
    // 从用户自定义的方式中捞取用户信息
    user = await options.getUser(ctx);
    if(!user){
      // 自定义获取用户信息的方式，为空或者是获取不到，直接重定向
      return redirect(ctx, referer);
    }
    // 用户已存在，看是否需要额外的信息或者动作，由自定义的loginCallback来返回[user, redirectURL]
    const res = await options.loginCallback(ctx, user);
    const loginUser = res[0]
    const redirectURL = res[1]
    ctx.session[options.userField] = loginUser
    if(redirectURL){
      referer = redirectURL
    }
    redirect(ctx, referer)
  }
}
```
#### 访问退出登录中间件loginHandler
```javascript
function logout(options){
  return async function logoutHandler(ctx){
    const user = ctx.session[options.userField]
    if(!user){
      return redirect(ctx, referer)
    }
    const redirectURL = await options.logoutCallback(ctx, user)
    ctx.session[options.userField] = null
    if(redirectURL){
      referer = redirectURL
    }
    redirect(ctx, referer)
  }
}
```

### 学到什么
:stars: 在自定义中间件的时候，可以将自身的不同业务场景下的中间件，根据自身封装的逻辑分支，拆分为不同的中间件来返回，满足于不同场景下的自定义业务，还可以通过将逻辑通过`options`参数化的形式来进行对外暴露！！
