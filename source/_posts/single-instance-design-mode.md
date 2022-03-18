---
title: 每天一设计模式-单例模式
description: 每天一设计模式-单例模式
author: Zhenggl
date: 2022-03-14 05:53:57
categories:
    - [javascript, 设计模式]
tags:
    -javascript
    -设计模式
    -创建对象
cover_picture: 单例模式封面.jpeg
---

### 前言
> 单例模式(Singleton Pattern)属于创建型模式，它提供了一种创建对象的最佳方式，涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个该类对象被创建，提供了一种访问其唯一的对象的
> 方式，可以直接访问，一般不需要实力话该类的对象

⚠️ 有以下几个点需要注意：
1. 单例类只能有一个实例；
2. 单例类必须自己创建自己的唯一实例；
3. 单例类必须给所有其他对象提供这一实例。

✨ 模式具体介绍：
意图：保证一个类仅有一个实例，并提供一个访问它的全局访问入口；
主要解决：一个全局使用的类频繁地创建于销毁；
何时使用：当我们需要控制实例的树木，节省系统资源的时候；
如何解决：判断系统是否已经有这个单例，如果有则返回，如果没有则创建；
关键代码：真正实例是私有的，无法直接方法的

### ES5代码实现
```javascript
  // LazySingle.js
  var LazySingle = (function() {
  	// 全局共享的实例
    var _instance = null;
    function Single(){
    	return {
    		xx: function() {
    		},
    		yy: 1
    	};
    }
    return function() {
      if(!_instance){
      	_instance = Single();
      }
      return _instance;
    }
  })();
```
```javascript
  // 实际调用的
  console.info(LazySingle().yy);
```

### 优化后的ES6代码
```javascript
  // LazySingle.js
  let _instance = null;
  function Single(){
    	return {
    		xx: function() {
    		},
    		yy: 1
    	};
  }
  export default class {
	constructor(props) {
	  super(props);
	  if(!_instance){
	  	_instance = new Single();
	  }
	}
  }
```
```javascript
  // 具体使用的地方
  console.info(LazySingle().yy);
```
其实目前的通过commonJS以及AMD的方式来模块化每一个对象的方式，就是一个单例模式，通过将方法以及属性对外暴露，对实现机制进行对内隐藏，就是达到一种单例模式编程的思维，  
只不过通过此种方式，可以更加好的来管理我们的对象。

#### 配合static关键词的代码
```javascript
  
  function Single(){
    	return {
    		xx: function() {
    		},
    		yy: 1
    	};
  }
  export default class{
	static _instance = null;
	constructor(props) {
	  super(props);
	}
	static getInstance(){
	  if(!_instance){
	  	_instance = new Single();
	  }
	}
  }
```

```javascript
  // 使用方式，这基本上与Java中的单例模式使用无异
  LazySingle.getInstance().xx();
```
