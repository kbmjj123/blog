---
title: 文件上传中间件：koa-multer
description: koa-multer文件上传中间件主要在express-multer的基础上进行的二次封装，本文从具体如何使用koa-multer，了解关于koa-multer是如何封装express的中间件，以及了解关于express-multer文件上传中间件的相关配置以及对应的使用方式，体验官方readme.md文档所没有提及到的相关API，体验更多的文件上传功能！
author: Zhenggl
date: 2023-07-18 08:00:24
categories:
  - [koa, middleware]
tags:
  - koa
  - middleware
cover: koa-multer文件上传封面.jpg
---

### 前言
> 文件上传，应该是web应用开发中最常见的动作了，一般有单文件上传、多文件上传、文件与数据一同上传等方式，而`koa`中使用了`koa-multer`来进行文件的上传服务，下面让我们来了解一波关于文件上传服务的使用！

### 如何使用
```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const multer = require('@koa/multer');

const app = new Koa();
const router = new Router();
const upload = multer({});  // 这里可以通过传递参数来控制文件上传的配置
// 以下是定义的文件上传路由
router.post('/upload-multiple-files', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'boop', maxCount: 2 }
]), ctx => {
  console.log('ctx.request.files', ctx.request.files);
  console.log('ctx.files', ctx.files);
  console.log('ctx.request.body', ctx.request.body);
  ctx.body = 'done';
});
// 单文件上传
router.post('/upload-single-file', upload.single('avatar'), ctx => {
  console.log('ctx.request.files', ctx.request.files);
  console.log('ctx.files', ctx.files);
  console.log('ctx.request.body', ctx.request.body);
  ctx.body = 'done';
})
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000)
```
以下是对应的输出结果
![单文件上传与多文件上传的存储区别](单文件上传与多文件上传的存储区别.jpg)
:trollface: 这里我们定义了两个路由，一个是处理多个文件的，一个是处理单个文件的，而且，通过配置的参数名称，将对应地在请求上下文`ctx`中对应存储着相应的字段

#### 往上下文追加的属性
1. ctx.request.file/ctx.file: 提交的单个文件
2. ctx.request.files/ctx.files: 提交的多个文件
3. ctx.request.body: 提交上来的非文件数据

### 源码学习
> 由于`koa-multer`的实现主要是基于`espress-multer`来实现的，因此关于`koa-multer`的相关API，其实基本上都是`express-multer`来提供的，如下代码所示：
```javascript
let originalMulter = require('fix-esm').require('multer')
function multer(options){
  const m = originalMulter(options);  // 创建express-multer对象
  makePromise(m, 'any');
  makePromise(m, 'array');
  makePromise(m, 'fields');
  makePromise(m, 'none');
  makePromise(m, 'single');
  return m;
}
module.exports = multer;
```
:stars: 这里我们看到`koa-multer`基本上都没有实现自身的业务，它也就是简单地通过代理来执行对应函数而已，将`any`、`array`、`fields`、`none`、`single`方法直接定义在创建出来的multer对象中，因为我们才可以直接通过`multer.fields`等API方法的直接调用， :confused: 而我们平时所使用的中间件是类似这样子的格式：`(ctx, next) => {}`，因此通过这个`makePromise()`函数来将原本的`express`中间件给转换成`koa`所能够识别的中间:
```javascript
function makePromise(multer, name){
  const fn = multer[name];  //从express中获取即将要转换的函数，比如single
  return async (ctx, next) => {
    // 这里的this将会是请求上下文ctx
    const middleware = Reflect.apply(fn, this, arguments)
    await new Promise((resolve, reject) => {
      middleware(ctx.req, ctx.res, err => {
        if(err) return reject(err)
        if('request' in ctx){
          //... 这里将原本ctx.req中的信息转存到ctx.request以及ctx.file以及ctx.request.file(s)
        }
      })
    })
  }
}
```
:trollface: 从上面我们可以看出就是直接代理(通过`Reflect.apply()`)的方式，来直接调用`express-multer`中的相关API的，这里所涉及到的API都有：`any`、`array`、`fields`、`none`、`single`

:confused: 那么关于这个`express-multer`的配置属性以及对应的API都 :u6709: 哪些呢？

### express-multer相关API
> `express-multer`是一个用于处理multipart/form-data的node.js中间件，主要用于上传文件，只会处理包含`multipart/form-data`的表单数据
> `express-multer`将body对象和file或files对象添加到request对象，body对象包含表单文本字段的值，file或files对象包含通过表单上传的文件
> **请确保自行处理用户上传的文件，而不要将`multer`作为全局的中间件，因为有可能恶意的用户会将文件上传到预想不到的路径中！！**

#### 相关配置参数
> `express-multer`接收一个options对象，该对象的属性描述如下所示：

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|:---|
| dest | String | null | 该属性告诉multer将文件上传到哪个位置，如果忽略此选项对象，则文件将被保留在内存中，永远不会被写入到磁盘中 |
| storage | String | DiskStorage｜MemoryStorage | 磁盘缓存或内存缓存的对象 |
| fileFilter | Function | 用以控制接收哪些文件的函数 |  |
| limits | Object | null | 用来限制上传的数据 |
| preservePath | String |  | 保留文件的完整路径，而并非是基本的文件名称 |

##### Storage
**上述属性中有一个`storage`，可接收的属性值为`DiskStorage`或者是`MemoryStorage`，代表当使用内存控制时，可凭借`MemoryStorage`来进行详细的控制，当使用磁盘缓存时，可凭借`DiskStorage`来进行具体的控制！**

###### DiskStorage
> 磁盘存储引擎可以让我们完全控制存储文件到磁盘的整个过程
```javascript
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, '/tmp/my-uploads')
  },
  filename: function(req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({
  storage: storage
})
```
:stars: 一般情况下，`DiskStorage`接收两个选项`destination`和`filename`，`destination`确定文件存储的路径，如果没有提供则用的系统默认的目录(这里需要注意的是目录需要提前创建好)，而`filename`则确定文件存储的名称，如果没有提供该属性则默认为每个文件赋予一个随机名称，该名称不包括扩展名，multer并不会为我们追加任何的文件扩展名，因此这个`filename`应该返回一个完整的文件名和文件扩展名

###### MomoryStorage
> 内存存储引擎将文件作为`Buffer`对象存储在内存中，是`multer`的默认选择
```javascript
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
```

#### 对外暴露的API
1. multer.single(fieldname): 接受名称为fieldname的单个文件，将存储单个文件在`req.file`属性中；
2. multer.array(fieldname[, maxCount]): 接受一个文件数组，所有的文件名称都是fieldname，如果出现错误，则可选上传的文件超过`maxCount`，上传的文件数组将存储在`req.files`;
3. multer.fields(fields): 接受由`fields`指定的混合文件，具有文件数组的对象将存储在`req.files`中，`fields`是类似于`{ name: 'avatar', maxCount: 1 }`这种格式的对象；
4. multer.none(): 仅接受文本字段，禁止上传文件；
5. multer.any(): 接受所有通过网络传输的文件，文件数组将存储在`req.files`中

### 学到什么
> 有时可能没有现成的`koa`框架的中间件，但是可以借助于`express`的中间件进行一个包装，转换为属于`koa`的中间件来使用