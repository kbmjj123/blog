---
title: 解析请求body中间件：koa-bodyparser
description: Koa body 解析中间件，基于co-body.支持json、xml、form和text类型body，并从源码层面来分析关于bodyparser的运行过程，加深对bodyparser的理解
author: Zhenggl
date: 2023-07-11 08:25:31
categories:
  - [koa, middleware]
tags:
  - koa
  - middleware
cover: koa-bodyparser封面.jpg
---

### 前言
{% link "bodyparser官网" "https://github.com/koajs/bodyparser" true koa bodyparser官网 %}
> 作为消息请求体(body)的解析器，基于{% link "co-body" "https://www.npmjs.com/package/co-body" true koa co-body %}进行的body的解析，可支持`json`、`form`、`text`、`xml`类型的body的解析！
> 在处理程序之前，在中间件中解析传入的请求体，解析完成后，将在`Koa`上下文`ctx.request`中追加`body`参数，使得后续所有的中间件可以通过`ctx.request.body`属性来访问到解析后的参数，从而获取请求参数！！

### 如何使用
```javascript
const Koa = require('koa');
const bodyParser = require('@koa/bodyparser');
const app = new Koa();
app.use(bodyParser({}));
app.use(ctx => {
  ctx.body = ctx.request.body
  console.info(ctx.request.rowBody)
})
```
:stars: 上述代码是`bodyparser`的简单运用，通过bodyParser函数的运行结果(应该是接收ctx+next作为参数的函数)，来作为响应的中间，这里`bodyParser()`函数运行传递options参数，从而来自定义`bodyparser`的解析行为，这里 :u6709: :two: 个新增的属性在`request`中:
1. body: 解析后的参数对象
2. rawBody: 解析后的对象序列化字符串

:point_down: 是参数options的属性说明：

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|:---|
| patchNode | Boolean | false | 将patch请求方法的body添加到`ctx.req`中 |
| encoding | String | utf-8 | 请求体的编码格式 |
| formLimit | String | 56kb | urlencoded请求体的大小，如果超过限制，则返回413错误 |
| jsonLimit | String | 1mb | json请求体的大小，如果超过限制，则放回413错误 |
| textLimit | String | 1mb | text请求体的大小，如果超过限制，则放回413错误 |
| xmlLimit | String | 1bm | xml请求体的大小，如果超过限制，则放回413错误 |
| jsonStrict | Boolean | true | 控制请求体严格要求为对象或者数组，从而避免类型判断 |
| detectJSON | Function | null | 自定义json请求体检测函数，用于对json请求体检测的自定义函数 |
| extendTypes | Object | null | 可支持的扩展类型 |
| enableTypes | Array | `['json'、'xml']` |  |
| onError | Function | null | 自定义异常处理，用于处理当解析body发生异常时的操作 |
| enableRawChecking | Boolean | false | 是否从raw中检查并解析出对应的body，将解析出来的值覆盖payload的body |
| parsedMethods | Array | `['POST','PUT','PATCH']` | 定义的哪些请求方法的body即将被解析 |
| disableBodyParser | Boolean | false | 禁用对body的解析，实际运用一般通过`ctx.disableBodyParser=true`来控制对某些条件下禁用对body的解析，实现动态启用与禁用的解析目的 |

### 源码分析
> 所有的中间件都是返回的一接收ctx+next作为参数的函数：`(ctx, next) => {}`
![bodyparser中间件代码框架](bodyparser中间件代码框架.png)
```javascript
  (ctx, next) => {
    // ...隐藏一系列的免解析判断
    try{
      // 使用co-body来解析，且强制使用returnRawBody=true，将使得所有的解析结构都以{parsed:true, row: str}的形式来返回
      const response = await parseBody(ctx);
      // 这里就是在ctx.request中追加的body属性来源
      ctx.request.body = 'parsed' in response ? response.parsed : {};
      if (ctx.request.rawBody === undefined) ctx.request.rawBody = response.raw;
    }catch(err){
      if(!onError) throw err;
      onError(err, ctx);
    }
    return next();
  }
```
:warning: 注意这里的`next()`方法调用的时机，是在当前中间件执行完毕之后才执行的，也就是意味着当其他中间件`next()`到当前中间件的时候，会优先执行当前中间件，然后将请求体body解析到了之后，并进行相关的存储之后，才去执行其他的中间件！ :point_right: 这样子可以确保在当下中间件执行完毕之后，才去执行其他的中间件，使得其他的中间件能够访问到`bodyparser`中间件所产生的body参数！

### 学到什么
:trollface: 从`body-parser`的代码框架中我们可以学习到，通过包裹的高阶函数，来满足统一的中间件函数规范的同时，采用高阶函数将参数进行存储，作为高阶函数的中间变量，与高阶函数进行一个捆绑。
还学习到关于`next()`函数的调用顺序时机，原本的`Koa`中间件的执行顺序并非真正意义上的洋葱顺序(先use后触发)的，而是要看`next()`函数的一个执行顺序，如果所有的中间件都按照先执行`next()`再执行自身中间件的逻辑的话，则是严格按照洋葱顺序的执行顺序，但是如果部分中间件如果先执行自身的逻辑再执行`next()`的话，则没有按照原先既定的顺序了！！！