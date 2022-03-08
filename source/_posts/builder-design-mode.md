---
title: 每天一设计模式-建造者模式
author: Zhenggl
date: 2022-03-05 08:12:37
categories:
    -[javascript, 设计模式]
tags:
    -javascript
    -设计模式
    -创建对象
cover_picture: 建造者模式封面.jpeg
---

### 前言
> 将一个复杂对象的构建层与表示层互相分离，同样的构建过程可采用不同的表示。
> 虽然建造者模式也是为了创建一个对象，但该模式更专注与对象的一个创建过程，而之前所习🉐️的工厂类模式则专注于结果，更关注是创建对象的细节
> 通过将对象的不同组成部分，交由每个不同的对象来实现，也可以说这种模式所创建出来的对象是一个`复合对象`
> ⚠️ 这种方式在无形中会增加对象的复杂性，因此如果对象的颗粒度很小的话，或者模块之间的复用率很低并且变动不大的话，优先采用创建一整个对象。

**意图:** 将一个复杂的构建与其表示分离，使得同样的构建过程可以创建不同的表示
**主要解决:** 主要解决在软件系统中，有时候面临一个"复杂对象"的创建工作，其通常由各个部分的子对象用一定的算法构成；由于需求的变化，这个复杂对象的各个部分经常面临剧烈变化，但将他们组合在一起的算法却相对稳定
**何时使用:** 一些基本不见不会变，而其组合经常变化的时候
**应用实例:** 去M记，汉堡、可乐、薯条、炸鸡等基本不变，而其组合是经常变化的，从而生成出所谓的"套餐"

### ES5代码
```javascript
  // Picture.js 抽象图片信息类，包含卡片信息、组合方式信息
  function Picture(cardInfo, assembleInfo) {
    this.cardInfo = cardInfo;
    this.assembleInfo = assembleInfo;
  }
  Picture.prototype.getCardInfo = function (){
	return this.cardInfo;
  };
  Picture.prototype.getAssembleInfo = function() {
    return this.assembleInfo;
  }
```
```javascript
  function CardInfo(type) {
    var shapeArray = {triangle: '三角形', square: '正方形', diamond: '菱形', trapezoid: '梯形'};
    this.shapeName = type ? shapeArray[type] ? shapeArray[type]: '不规则形状': '不规则形状';
  }
```
```javascript
  function AssembleInfo(position) {
    var positionArray = {center:'中间', leftTop: '左上', leftBottom: '左下', rightTop: '右上', rightBottom: '右下'};
    this.position = position ? positionArray[position] ? positionArray[position] : '任意位置' : '任意位置';
  }
```
```javascript
  // 组装对象属性方法
  function NamePicture(cardInfo, assembleInfo) {
    var picture = new Picture(cardInfo, assembleInfo);
    picture.cardInfo = new CardInfo(cardInfo);
    picture.assembleInfo = new AssembleInfo(assembleInfo);
    return picture;
  }
```
```javascript
  var flowers = new NamePicture('triangle', 'center');
  console.info(flowers);
```
![建造者模式结果](建造者模式结果.png)

✨ 这里建造者模式关心的是如何组装*Picture*中的cardInfo以及assembleInfo属性，当然这里假如CardInfo比较复杂，那么可以根据之前的习得的工厂模式，将cardInfo属性交由工厂的实际例子去实现，因此会有
以下的一个工厂方法来生成不同的形状的CardInfo

```javascript
  function NamePicture(cardInfo, assembleInfo) {
    var picture = new Picture(cardInfo, assembleInfo);
    picture.cardInfo = CardInfoFactory(cardInfo);
    picture.assembleInfo = AssembleInfoFactory(assembleInfo);
    return picture;
  }
  
```

### 优化后的ES6代码
暂无
