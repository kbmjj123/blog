---
title: 每天一设计模式-简单工厂模式
author: Zhenggl
date: 2022-03-02 18:20:34
categories:
    - [javascript, 设计模式]
tags:
    - javascript
    - 设计模式
    - 创建对象
cover: 简单工厂模式封面.jpeg
---

### 前言
简单工厂模式(Simple Factory)，又叫静态工厂方法，由一个工厂方法决定**创建某一种产品对象类的实例**，主要用来创建**同一类对象**。
使用者无须知道这些对象的一个依赖关系，而仅仅需要知道关于这个工厂方法即可。
一般🈶️两种方式：
+ 通过类实例化对象来创建
+ 通过创建一个新对象，然后包装增强其属性和功能来实现的

两种方式所造成的不同点在是否做到了将公共部分进行抽离的目的。

### ES5代码
以下主要提供两种简单工厂模式来创建不同的对象

#### 方式一
```javascript
  var Basketball = function() {
    this.intro = '我是篮球';
  }
  Basketball.prototype = {
	getNum: function (){
	  console.info('每只球队需要5人参赛');
	},
	getBallWeight: function() {
	  console.info('篮球很重');
	}
  };
  var Football = function() {
    this.intro = '我是足球';
  }
  Football.prototype = {
	getNum: function (){
	  console.info('每只球队需要11人参赛');
	},
	getBallWeight: function() {
	  console.info('足球很重');
	}
  };
  var SportsFactory = function (name){
  	switch (name) {
  	  case 'Basketball':
  	  	return new Basketball();
  	  case 'Football':
  	  	return new Football();
  	}
  };
  var football = SportsFactory('Football');
  console.info(football);
```

#### 方式二
```javascript
  var SportsFactory = function(name, number) {
    var obj = Object.create(null);
    obj.intro = '我是' + name;
    obj.getNum = function() {
      console.info('每只球队需要' + number + '人参赛');
    };
    obj.getBallWeight = function() {
      console.info(name + '很重');
    };
    return obj;
  }
  var football = SportsFactory('Football');
  console.info(football);
```
#### 针对方式一进一步公共代码的封装
```javascript
  function Ball(name, number) {
    this.name = name;
    this.number = number;
  }
  Ball.prototype.getNum = function() {
    console.info('每只球队需要' + this.number + '人参赛');
  }
  Ball.prototype.getBallWeight = function() {
    console.info(this.name + '很重');
  }
  function Basketball() {
    Ball.call(this, '篮球', 5);
  }
  Basketball.prototype = Ball.prototype;
  // 通过定义新的getNumber方法，将父类的getNum为自己所用，这里不是采用像Java中的父类方法重载的方式 
  Basketball.prototype.getNumber = function() {
    Ball.prototype.getNum.call(this);
    console.info(this.name + '有另外几名替补球员');
  }
  function Football() {
    Ball.call(this, '足球', 11);
  }
  Football.prototype = Ball.prototype;
  var SportsFactory = function(name){
  	switch (name) {
  	  case 'Basketball':
  	  	return new Basketball();
  	  case 'Football':
  	  	return new Football();
  	}
  };
  var ball = SportsFactory('Football', 11);
  ball.getNumber();
  ball.getBallWeight();
  console.info(ball);
```

### 优化后的ES6代码
> 借助于ES6.0的相关关键词来造就对应的语法糖，来更好的理解编写自己的代码，使得代码更加容易理解，这里直接借助于Vue项目中引用的babel插件来转换

```javascript
  // Ball.js
  export default class Ball{
	constructor(props){
		//super(props);
		this.name = props.name;
      	this.number = props.number;
	}
	getNum(){
    	console.info('每只球队需要' + this.number + '人参赛');
    }
    getBallWeight(){
    	console.info(this.name + '很重');
    }
}
```
```javascript
  // Football.js
  import Ball from './Ball.js';

export default class Football extends Ball{
	constructor(props){
		super(props);
	}
	getNumber(){
		super.getNum();
		console.info(this.name + '有另外几名替补球员');
	}
}
```
```javascript
  // Basketball.js
  import Ball from './Ball.js';

export default class Basketball extends Ball{
	constructor(props){
		super(props);
	}
}
```
```javascript
  // BallFactory.js
  import Football from './Football.js';
import Basketball from './Basketball.js';

export default function(name){
	switch(name){
		case 'Football':
			return new Football({name: '足球', number: 11});
		case 'Basketball':
			return new Basketball({name: '篮球', number: 5});
	}
}
```
```javascript
  // App.vue
  import BallFactory from './factory/BallFactory.js';
  let ball = BallFactory('Football');
		console.info(ball);
		ball.getNumber();
		ball.getBallWeight();

		let ball1 = BallFactory('Basketball');
		console.info(ball1);
		ball1.getNum();
		ball1.getBallWeight();
```
对应的输出结果如下：
![ES6.0后的简单工厂代码](ES6.0后的简单工厂代码.png)

✨ 通过ES6.0的语法糖，可以让我们像Java那种面向类/对象编程的思维模式来编写我们的代码，大大提升代码的可阅读性，而无须利用`prototype`去做底层的一系列关联关系

### 场景
个人比较推荐于ES6.0的针对方式一的简单工厂模式的方式来创建一类对象，通过将公共的部分进行抽离，不同的部分，来作为参数进行传递，并且在抽离的同时，还可以追加自身的一个动作，并直接使用原本父类的动作来完成自身
完成功能的形成。
