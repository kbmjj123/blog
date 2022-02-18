---
title: JavaScript中的浏览器学习(存储篇)
author: Zhenggl
date: 2022-02-17 08:23:03
categories:
    - [javascript, web, 浏览器]
tags:
    - javascript
    - web
    - 浏览器
    - localStorage
    - sessionStorage
    - cookie
cover_picture: 浏览器存储封面.jpeg
---

### 前言
> WEB应用允许使用浏览器客户端所提供的API，将网页应用所需的数据存储到浏览器客户端，按照不同的源进行各自维护，也就是不同源域名下的数据各自分离，各自管理，从而使得网页应用能够"记住"上一次
> 所做的一些操作，提升用户体验，完善业务闭环，目前较为常见的浏览器存储方式有：
1. WEB存储(localStorage + sessionStorage)
2. Cookie
3. 离线WEB应用(已废弃)
4. WEB数据库(indexdb)
5. 文件系统

### 一、storage存储(localStorage + sessionStorage)
> 在window对象中定义了两个只读属性：localStorage + sessionStorage，两者在使用上并无太大的区别，只是在于浏览器存储的时间有效期和作用于的区别
> 🤔区别：localStorage存储的数据，是永久性存储的，只要没有显示地修改/删除，就算关闭浏览器，所缓存的数据依旧存在，localStorage是限制在文档源(http协议 + 域名 + 端口号)，
> 所存储的内容，都是以字符串形式来存储的，因此如果需要做通用性的api的话，需要将其中的不同类型的value值进行string转换一下后再进行存储

| 属性 | 描述 | 有效期 | 限制 |
|---|---|---|---|
| localStorage | 浏览器客户端本地存储 | 长期有效，只要不修改/删除则一直存在 | 不同源域名下各自管理着一份数据，互不干扰 |
| sessionStorage | 会话级别浏览器客户端本地存储 | 仅在当前打开的浏览器tab选项卡有效 | 同上 |

👉 本地存储所提供的API
+ setItem：该方法接受一个键名和值作为参数，将会把键值对添加到存储中，如果键名存在，则更新其对应的值
+ getItem：该方法接受一个键名作为参数，返回键名对应的值
+ removeItem：该方法接受一个键名作为参数，并把该键名从存储中删除
+ clear：调用该方法会清空存储中的所有键名
+ key：该方法接受一个数值 n 作为参数，并返回存储中的第 n 个键名

针对sessionStorage的描述，对应的整一个例子如下：
![页面一负责将数据写入到sessionStorage](页面一负责将数据写入到sessionStorage.png)
针对该页面进行数据的获取
![页面二获取会话数据](页面二获取会话数据.png)


### 二、Cookie
> cookie是指WEB浏览器存储的最小量数据，同时与具体的站点相关的服务器与浏览器共同使用的，自动在两者之间传递的，也就是与服务器端共享着同一份数据，这也就说明了为什么像`nuxt.js`这种ssr框架，
> 可以直接使用客户端的cookie了，而一般在使用cookie之前，都需要进行检测当前浏览器是否支持使用cookie，利用`navigator.cookieEnabled`这个属性来进行判断

#### 2.1、cookie有效性
cookie有点类似于sessionStorage，但与sessionStorage又有一定的区别

| API对象 | 关闭浏览器 | 同一浏览器不同tab选项 | 延长有效性 | 读写 |
|---|---|---|---|---|
| sessionStorage | 失效 | 各tab独占，互不污染 | - | getItem/setItem |
| cookie | 失效 | 共一个浏览器共享 | 通过显示设置max-age(秒) | document.cookie，字符串类型，通过字符串拼接 |

✨ 一旦*cookie*设置了`max-age`，则会在浏览器中保存一文件，当时间过期的时候，将会自动删除该文件

#### 2.2、cookie读写操作
> 由于浏览器关闭时cookie失效，因此有时在特定业务场景下，需要设置cookie的有效性，确保cookie在下次规定时间内浏览器打开的时候，保存有上次的记录，，比如账户的登录状态，
> 而原本cookie的值是通过对`window.cookie`进行直接字符串赋值的

```javascript
  document.cookie = 'version' + encodeURIComponent('待编码的内容');
  // 以下是通过对该属性进行时效性的追加-->👇这行代码设置cookie的有效性是60秒
  document.cookie = 'version' + encodeURIComponent('待编码的内容') + '; ' + 'max-age=60';
```

✨ 由于cookie采用的字符串拼接的方式，因此，如果cookie的长度过长的话，就会被忽略，目前的限制是**总体不得超过4KB**

👉 既然cookie通过document.cookie进行写入了，那么读取的时候，也是通过该属性来获取，一般流程是：
1. 通过document.cookie属性获取到字符串，这里我们叫cookieLabel
2. 对cookieLabel进行分割: cookieArray = cookieLabel.split('; ');
3. 再对cookieArray中的每一项进行第二次分割：cookieItemArray = cookieItem.split('=');
4. 对每一项cookieItem[1]的值进行decodeURIComponent解码，获取到之前所存储的值
5. 组装成比较容易访问的对象来使用
