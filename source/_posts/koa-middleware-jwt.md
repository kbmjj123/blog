---
title: 验证json-web-token的koa中间件：koa-jwt
description: 整理了关于什么是Json Web Token，它与传统的用户cookie认证方式由什么区别、有何优弱势？以及如何私用koa-jwt来实现这样子的一个场景，整理适合使用JWT的场景！
author: Zhenggl
date: 2023-07-27 09:27:57
categories:
  - [koa, middleware]
tags:
  - koa
  - middleware
cover_picture: koa-jwt封面.jpg
---

### 前言
> JSON Web Token（以下简称JWT）是一个开放标准，它定义了一种紧凑且自包含的方式，用于作为JSON对象在各方之间安全地传输信息。此信息可以被验证和信任，因为它是数字签名的。JWT可以使用秘密（使用HMAC算法）或使用RSA或ECDSA的公钥/私钥对来签名。
> 简而言之，就是使用一个加密的以及base64编码组成的字符串，用于解决跨域认证问题的一个机制！

#### 传统的用户认证流程
> 传统的用户认证流程一般如下：
1. 用户想服务器端发送用户名以及密码；
2. 服务器端认证通过后，将用户信息存储于当前会话(session)中，比如有用户信息、登录时间等等；
3. 服务器端向用户返回一个sessionId，写入到用户的cookie中；
4. 随后用户的每一次请求，都会通过cookie来携带上sessionId，传回给服务器，告知已认证通过，并进行认证通过许可后的资源访问；
5. 服务器从cookie中捞到sessionId之后，认证通过后，放行继续往下执行；

:confused: 这里方式是拥有一定的弊端的，加入是单机的，一般没有什么太大的问题，但是如果是集群或者是跨域多服务的情况下，就需要将`sessionId`来进行共享，每台服务器都要能够读取到这个`sessionId`， :point_right: 我们可以考虑将这个`sessionId`给持久化(存储到数据库/文件)，但这也意味着每次都需要往db中捞这个`sessionId`，短平快项目还好，长期的话，估计维护惨了！

:stars: 因此，可以考虑使用另外一种方案，就是服务器端索性就不维护这个`sessionId`数据了，所有的数据都由每一个客户端自行维护，当客户端发起请求的时候，顺带将这个`sessionId`一同发给服务器端，

### 什么是JWT
> 在传统服务器端认证通过后，生成一个JSON对象(类似于 :point_down: )，返回给客户端
```json
  {
    "name": "李四",
    "actor": "超级管理员",
    "expired": "2023-07-28 08:26"
  }
```
:star: 以后客户端与服务器端通信的时候，都会带上这个json，服务器的认证就完完全全靠这个json来认定用户的唯一身份， :warning:为防止用户篡改数据，服务器在生成这个对象的时候，会加上签名！

#### JWT的结构
> JWT以紧凑的形式由三个部分组成，这些部分由点（.）分隔开，也就是`header.payload.signature`，分别是：
+ header: 标题
+ payload: 有效载荷
+ signature: 签名

1. header：JSON对象，用于描述`JWT`的元数据，一般如下格式：
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
`alg`表示签名的算法，默认是`HMAC SHA256(简写为HS256)` ，也可以是使用"RSA"，而`type`属性则表示这个令牌的类型，一般统一写为`JWT`，最后，将整个json对象转换为Base64Url编码字符串！

2. payload：JSON对象，用于存放实际需要传递的用户信息以及附加数据的声明
:stars: 而一般的生命包括有 :point_down: 三种类型的声明：
+ 注册声明：一组预定义的声明，不是强制性的，而是推荐的，以提供一组有用的、可互操作的声明，包括有以下几个属性：
  - iss: isuser，签发人；
  - exp: expiration time，过期时间；
  - aud: audience，受众；
  - sub: subject，主题
+ 公共声明：由JWT的人随意定义，但为避免冲突，可以添加命名空间(类似于java中的包名)；
+ 私人声明：这些是为旨在同意使用它们的各方之间共享信息而创建的自定义声明。

:stars: 除了 :point_up: 几个属性之外，还可以有其他的属性：
  - nbf: not before，生效时间；
  - iat: issued at，签发时间；
  - jti: JWT ID，编号

:alien: 除了官方定义的7个属性之外，我们还可以自定义属性，如下所示：
```json
{
  "sub": "主题",
  "name": "自定义用户名",
  "admin": true
}
```
:point_up: 这里我们定义了两个属性`name`以及`admin`

:warning: `JWT`默认是不加密的，任何人都可以读取到，因此不要把一些隐私性的信息放在这个`payload`中！

3. signature：对`header`以及`payload`的签名，放置数据被篡改，一般需要指定一个密钥，比如我们要使用这个`HMAC SHA256`算法，则将通过以下方式来创建签名：
```shell
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload), secret
)
```
![json-web-token的解析结果](json-web-token的解析结果.png)

#### JWT如何工作
1. 服务器端认证通过后，返回JWT给客户端，客户端进行本地存储；
2. 随后每次客户端发起的请求，通常在http的请求头中加入类似于`Authorization: <token>`的方式来追加`JWT`;
3. 服务器端在校验成功`JWT`字符串之后，就返回继续往下执行的相关操作

#### JWT需要注意的地方
1. JWT默认是不加密的，但也可以是加密的，生成原始的token之后，可以使用密钥再加密一次；
2. JWT不加密的情况下，不能将秘密数据写入JWT中；
3. JWT不仅可以用于认证，也可以用于交换信息，有效使用JWT，可降低服务器查询数据库的次数；
4. JWT的最大缺点是，由于服务器不保存session状态，因此无法再使用过程中废止某个token，或者更改某个token的权限，也就是说一旦服务器讲token发给客户端了，在到期之前就会始终有效，除非服务器端追加了额外的逻辑；
5. JWT本身包含了认证信息，一旦泄漏，任何人都可以获取这个令牌的所有权限，为了减少盗用token的情况，JWT的有效期应该设置短一些，甚至于二次鉴权！！

### 如何使用
```javascript
const koa = require('koa');
const jwt = require('koa-jwt')
const app = new koa();
app.use((ctx, next) => {
  return next().catch(err => {
    if(401 === err.status){
      ctx.status = 401
      ctx.body = '被保护的资源，请使用授权通过的请求头来请求资源'
    }else{
      throw err
    }
  })
});
app.use((ctx, next) => {
  if(ctx.url.match(/^\/public/)){
    ctx.body = '无需保护的资源'
  }else{
    return next()
  }
});
app.use(jwt({secret: 'jwt加密密钥'}))
app.use(ctx => {
  if(ctx.url.match(/^\/api/)){
    ctx.body = '被保护的资源'
  }
})
app.listen(3000)
```

#### koa-jwt的配置

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|:---|
| passthrough | Boolean | false |  |
| debug | Boolean | false | 是否开启了调试模式的标志 |
| getToken | Function | null | `(ctx, opts)=>{}`，自定义获取token的方法，将优先执行自定义的getToken方法来自定义获取token的动作 |
| isRevoked |  |  |  |
| key | String | user |  |
| tokenKey | String |  |  |

### 学到什么