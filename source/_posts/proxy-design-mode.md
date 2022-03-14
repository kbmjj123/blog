---
title: 每天一设计模式-代理模式
description: 每天一设计模式-代理模式
author: Zhenggl
date: 2022-03-14 08:27:07
categories:
    -[javascript, 设计模式]
tags:
    -javascript
    -设计模式
    -结构性模式
cover_picture: 代理模式封面.jpeg
---

### 前言
> 由于一个对象不能直接引用另外一个对象，所以需要通过代理对象在这两个对象之间起到一个中介的作用。
> 在代理模式中，我们通过创建具有`现有对象`的对象，以便于向外界提供功能功能接口。

意图：为其他对象提供一种代理以控制对这个对象的访问。

主要解决：在直接访问对象时带来的问题，比如说：要访问的对象在远程的机器上。在面向对象系统中，有些对象由于某些原因（比如对象创建开销很大，或者某些操作需要安全控制，或者需要进程外的访问），直接访问会给使用者或者系统结构带来很多麻烦，我们可以在访问此对象时加上一个对此对象的访问层。

何时使用：想在访问一个类时做一些控制。

如何解决：增加中间层。

关键代码：实现与被代理类组合。


### ES5代码实现
```html
  <div id="imgContainer">
    <img id="realImg" style="width: 80px; height: 80px;">
  </div>
```
```javascript
  var tempImg = new Image();
  tempImg.src = 'https://www.91temaichang.com/2022/03/09/get-to-know-javascript-prototypes/%E5%8E%9F%E5%9E%8B%E5%B0%81%E9%9D%A2.jpeg';
  tempImg.onload = function(res){
    document.getElementById('imgContainer').replaceChildren(tempImg);
  }
```
这里利用tempImg来作为代理类，然后将一个readImg节点来做为展示，模拟在加载到真是远程图片之前，让展示的图片默认展示一个缩略图，当加载完成图片时，将源图片进行替换操作
