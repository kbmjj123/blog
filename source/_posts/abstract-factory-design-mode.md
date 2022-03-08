---
title: 每天一设计模式-抽象工厂模式
author: Zhenggl
date: 2022-03-05 08:13:22
categories:
    -[javascript, 设计模式]
tags:
    -javascript
    -设计模式
    -创建对象
cover_picture: 抽象工厂模式封面.jpeg
---

### 前言
通过对类的工厂抽象使其业务用于对产品类簇的创建，而不仅仅局限于创建某一类产品的实例子。
> 围绕一个超级工厂来创建其他的工厂，该超级工厂又成为其他工厂的工厂，负责创建一个相关对象的厂(该厂用于创建某一类产品)，每个生成的工行都按照工厂模式去创建各自的对象。

### ES5代码
⚠️ 由于JavaScript中并不支持抽象类的方式，没有像Java中的`abstract`关键词来修饰类以及方法，因此这边采取了一种投机取巧的方式，就是将需要被定义为`abstract`的方法直接抛出一个异常，代表不能直接调用其方法。
```javascript
  // VehicleFactory.js 抽象工厂方法
  // 这里subType假定是BMW，superType假定是Car
  var VehicleFactory = function(subType, superType) {
    function F() {}
    F.prototype = new superType();  // 这里采用构造调用，这里以👇的Car为例子，使得F的prototype拥有了实际的getPrice + getSpeed方法，但需要注意的是通过这种方式，如果在superType中定义了this上的属性/方法，将会被子类所继承到
    // 使得当调用var f = new F()的时候，创建出来的对象拥有自身的方法，也就是f.hasOwnProperty('getPrice') === true
    subType.constructor = subType;  //使子类的构造器指向子类，代表通过new所创建出来的对象，使用子类subType自身的构造方法来初始化对象
    subType.prototype = new F();  //使得创建出来的子类拥有统一一份抽象函数的自身拷贝
  }
```
```javascript
  // Car.js 模拟的汽车抽象类
  function Car() {
  }
  Car.prototype.getPrice = function() {
    return new Error('抽象方法不能被直接调用');
  };
  Car.prototype.getSpeed = function() {
    return new Error('抽象方法不能被直接调用');
  }
```
```javascript
  // Bus.js 公共汽车抽象类
  function Bus() {
	this.type = 'bus';
  }
  Bus.prototype = {
	getPrice: function() {
	  return new Error('抽象方法不能被直接调用');
	},
	getSpeed: function() {
	  return new Error('抽象方法不能被直接调用');
	}
  };
```
```javascript
  // BMW.js 宝马实例
  function BMW(price, speed) {
    this.price = price;
    this.speed = speed;
  }
  VehicleFactory(BMW, Car);
  BMW.prototype.getPrice = function() {
    return this.price;
  }
  BMW.prototype.getSpeed = function() {
    return this.speed;
  }
```
```javascript
  var bmw = new BMW('30w', 1000);
  console.info(bmw);
  console.info(bmw.getPrice());
  console.info(bmw.getSpeed());
```
输出的结果如下：
![ES5抽象工厂方法输出结果](ES5抽象工厂方法输出结果.png)
从输出结果我们可以看出bmw的原型拥有自己的getPrice以及getSpeed方法，因为在定义BMW的时候，直接"重载"了在原型上的getPrice以及getSpeed方法，当`new`出来的bmw调用getPrice方法的时候，第一时间找到自己原型上的getPrice方法。

### 优化后的ES6代码
```javascript
  // Car.js
  export default class Car{
	constructor(price, speed) {
		this.price = price;
		this.speed = speed;
	}
	getPrice() {
	  return new Error('抽象方法不能被直接调用');
	}
	getSpeed() {
	  return new Error('抽象方法不能被直接调用');
	}
  }
```
```javascript
  // BMW.js
  export default class extends Car{
	constructor(price, speed) {
	 super(price, speed);
	}
	getPrice() {
	  console.info('BMW子类自身实现的getPrice方法');	
	  return this.price;
	}
	getSpeed() {
	  console.info('BMW子类自身实现的getSpeed方法');	
	  return this.speed;
	}
  }
```
```javascript
  // Audi.js
  export default class extends Car{
	constructor(price, speed) {
	 super(price, speed);
	}
	getPrice() {
	  console.info('Audi子类自身实现的getPrice方法');	
	  return this.price;
	}
	getSpeed() {
	  console.info('Audi子类自身实现的getSpeed方法');	
	  return this.speed;
	}
  }
```
```javascript
  // AbstractFactory.js 抽象工厂
  export default function(subType, superType) {
	// 直接借助于ES6在Object中提供的语法，直接创建两个对象之间的一个关联关系
    subType.prototype = Object.create(superType.prototype);
  }
```
