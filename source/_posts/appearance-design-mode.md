---
title: 每天一设计模式-外观模式
description: 每天一设计模式-外观模式
author: Zhenggl
date: 2022-03-14 06:15:58
categories:
    - [javascript, 设计模式]
tags:
    - javascript
    - 设计模式
    - 结构性模式
cover: 外观模式封面.jpeg
---

### 前言
> 隐藏系统的复杂性，并向客户端提供一个客户端可以访问系统的接口，通过这个接口使得对子系统接口的访问更加容易，提供对客户端系统的简化方法和现有系统类方法的委托调用。
> 其实也是属于面向对象编程中的一种编程思维模式：针对接口编程，在面对不同的复杂对象，仅需要将复杂对象对外提供统一的简单明确调用的业务方法，然后自身隐藏复杂逻辑其中，调用者无须关心内部具体实现业务逻辑

意图：为子系统中的一组接口提供一个一致的界面，外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。

主要解决：降低访问复杂系统的内部子系统时的复杂度，简化客户端之间的接口。

何时使用： 1、客户端不需要知道系统内部的复杂联系，整个系统只需提供一个"接待员"即可。 2、定义系统的入口。

如何解决：客户端不与系统耦合，外观类与系统耦合。

关键代码：在客户端和复杂系统之间再加一层，这一层将调用顺序、依赖关系等处理好。

### ES5代码实现
```javascript
  var A = {
	g: function(id) {
	  return document.getElementById(id);
	},
	css: function(id, key, value) {
	  document.getElementById(id).style[key] = value;
	},
	attr: function(id, key, value) {
	  document.getElementById(id)[key] = value;
	},
	html: function(id, html) {
	  document.getElementById(id).innerHTML = html;
	},
	on: function (id, type, fn){
		document.getElementById(id)['on' + type] = fn;
	}
  };
```
这里将所有的对元素的操作api，都集成在A对象中，所有需要针对dom元素进行操作的调用，仅需要通过`A.css('box', 'background', 'red');`即可

🤔 这里发现有可优化的空间，比如模仿`jQuery`的一个链式调用，部分方法无须重新编写
```javascript
  var A = {
	g: function(id) {
	  return document.getElementById(id);
	},
	css: function(id, key, value) {
	  this.g(id).style[key] = value;
	  return this;
	},
	attr: function(id, key, value) {
	  g(id)[key] = value;
	  return this;
	},
	html: function(id, html) {
	  g(id).innerHTML = html;
	  return this;
	},
	on: function (id, type, fn){
		g(id)['on' + type] = fn;
		return this;
	}
  };
```
针对⬆️的调整，我们可以是直接通过以下的方式来直接调用：
> A.css('box', 'background', 'red').attr('box', 'alt', 'test content');

### 优化后的ES6代码
```javascript
// A.js
  export default class {
	static _instance = null;
	constructor(props) {
	  super(props);
	}
	static getInstance(){
		if(!_instance){
			_instance = new A();
		}
		return _instance;
	}
	css(id, key, value) {
	  this.g(id).style[key] = value;
	  return this;
	}
	attr(id, key, value) {
	  g(id)[key] = value;
	  return this;
	}
	html(id, html) {
	  g(id).innerHTML = html;
	  return this;
	}
	on (id, type, fn){
		g(id)['on' + type] = fn;
		return this;
	}
  }
```
这里结合之前所习得的单例模式，对外仅暴露统一的一个API对象来对当前复杂系统进行调用
