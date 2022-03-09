---
title: 每天一设计模式-建造者模式
author: Zhenggl
date: 2022-03-09 08:08:42
categories:
    -[javascript, 设计模式]
tags:
    -javascript
    -设计模式
    -创建对象
cover_picture: 原型设计模式封面.jpeg
---

### 前言
> 原型模式用于创建*重复*的对象，使用于创建新的对象的类共享资源对象的属性以及方法。
> 在JavaScript中，则是基于原型链实现对象之间的继承，这种继承是基于一种对方法/属性的共享，而不是对方法/属性的复制。除非是new来设置子类的原型指向
> 将可复用的、可共享的、耗时久的动作从基类中提取出来，然后放到对应的原型中，然后子类通过组合继承或者寄生组合继承的方式将方法继承下来，对于子类中那些需要重写的方法则进行直接的重写，
> 这样子子类则共享了父类中的原型方法

### ES5代码
```javascript
  function LoopImages(imgArr, container){
	this.imageArray = imgArr;
	this.container = container;
  }
  LoopImages.prototype = {
	createImage: function() {
	  console.info('LoopImages createImages function' + this.imageArray);
	},
	changeImage: function() {
	  console.info('LoopImages changeImage function' + this.container);
	}
  }
  function SlideLoopImg(imgArr, container) {
    LoopImages.call(this, imgArr, container);
  }
  SlideLoopImg.prototype = new LoopImages();  // 代表子类直接使用了父类实例对象来作为自己的原型，子类实例直接拥有父类的prototype方法
  var slide = new SlideLoopImg(['1', '2', '3'], '#container');
  console.info(slide);
  slide.createImage();
  SlideLoopImg.prototype.changeImage = function (){
  	console.info('SlideLoopImg changeImage function' + this.container);
  }
  //这里由于slide已经被实例化出来了，在修改了对象的prototype中的某个方法的时候，需要重新实例化一下，否则，修改后的代码，将不能去影响实例对象
  slide = new SlideLoopImg(['1', '2', '3'], '#container');  
  console.info(slide);
  slide.changeImage();
```

### 优化后的ES6代码
```javascript
  // LoopImages.js
  export default class {
	constructor(imgArr, container) {
	  this.imageArray = imgArr;
	  this.container = container;
	}
	createImage() {
	  console.info('LoopImages createImages function' + this.imageArray);
	}
	changeImage() {
	  console.info('LoopImages changeImage function' + this.container);
	}
  }
```
```javascript
  // SlideLoopImg.js
  export default class extends LoopImages{
	constructor(imgArr, container) {
	  super(imgArr, container);
	}
	changeImage(){
		console.info('SlideLoopImg changeImage function' + this.container);
	}
  }
```
对应的输出结果如下：
![原型设计模式输出结果](原型设计模式输出结果.png)
