---
title: 理解JavaScript中的封装与继承
author: Zhenggl
date: 2022-03-01 07:56:43
categories:
    - [javascript]
tags:
    - javascript
    - prototype
cover: JavaScript封装与继承.jpeg
---

### 前言
面向对象编程是一种程序设计范型，它将对象作为程序的基本单元，将方法和数据封装其中，以提高程序的重用性、灵活性和扩展性。
想要通过学习JavaScript设计模式，让自己的代码在满足正常业务迭代的前提下，让自己的代码更加富有灵活性，享受编写代码的乐趣，而不是枯燥无味地来完成工作任务，从而来提升自身的一个编码水平。

### JavaScript中的函数是一等对象
> var foo = function(){}
> typeof foo; // object

从上述可知，函数也是一对象，它与普通的object对象的区别在于它是可执行的，我们知道，对象可定义属性，属性可以是数据，也可以是方法，通过函数将属性与方法实现隐藏其中，对外暴露api的方式，即可
达到面向对象编程的基本思维。

✨ 函数一般只能被调用，但是如果我们的函数返回的是一个对象，而该对象又封装了一些函数以及属性的话，那么我们可以利用该对象来赋予对应的操作，对应的示例代码如下：
```javascript
  function Foo(){
	return {
		x: 123, 
		y: 456,
		fun: function(content){
			console.info(content);
		}
	};
  }
  var foo = new Foo();
  foo.fun('自定义输出内容');
```
通过上述的代码，我们可以很简单的创建一对象来满足业务，但是如果在所有需要Foo函数的时候，都去创建foo对象的话，资源会造成一定的浪费，那么，是否有一种机制，能够通过编码中的一种内省的机制，在需要的时候调用它，
且一直保持在内存中呢？
通过借助于IIFE，我们既可以做到以下：
```javascript
  var obj;
  var foo = (function() {
    if(!obj){
    	obj = {
    		x: 123, 
            y: 456,
            fun: function(content){
                console.info(content);
            }
    	};
    }
  })();
```

### 有了`new`操作符，函数更加面向对象了
我们知道，`new`操作符主要用于修饰函数，普通函数有了`new`的加持，由原本的普通执行编程了构造调用，一般`new`一个对象的过程有以下对应的4个步骤(下面以代码讲解为例)：
```javascript
  function Foo(id, name) {
    this.id = id;
    this.name = name;
  }
  var foo = new Foo(123, 'koby');
```
1⃣️、创建一个对象：var x = Object.create(null);
2⃣️、将x的原型指向Foo的原型：x.prototype = Foo.prototype;
3⃣️、执行Foo函数，并传入x作为上下文：Foo(x, 123, 'koby');
4⃣️、由于Foo并🈚️返回值，因此直接返回x。

⚠️ 须知JavaScript中只有对象，而没有*类、继承*这以说法，而是通过对象与对象之间建立一关联关系，来模拟的基于"类似于类"的操作关系。

### prototype深入理解
比如，有以下一函数对象：
```javascript
  function Foo(id, name){
	this.id = id;
	this.name = name;
  }
  Foo.prototype.kkk = 'ppp';
  Foo.prototype.sayHello = function(content){
	console.info(`hello ${this.name} and ${content}`);
  }
  var foo = new Foo(123, 'koby');
  foo.sayHello('你好');
  foo.hasOwnProperty('id');
  foo.hasOwnProperty('name');
  var foo1 = new Foo(456, 'jordan');
  foo1.sayHello('你好');
  console.info(foo1);
  foo1.kkk = 'ppp1';
  
  console.info(foo);
  console.info(foo1);
```
在上述代码中，创建了一个对象foo，foo的prototype指向的是Foo.prototype，而id、name都是属于每个对象foo自己的，而不是继承而来的，而对于Foo.prototype.kkk属性以及sayHello方法则是公共的，可直接继承而来，
且一旦原型中的kkk改变则会引起对应的改变，但是，如果直接在自身的kkk属性去赋值，则是在当前对象中添加了属性kkk，而不是改写到prototype中的kkk属性。

### 类式继承与普通的原型继承对比
```javascript
  //定义一超类函数对象
  function SuperObj(){
	this.name = '678';
  }
  SuperObj.prototype.sayHello = function(content) {
    console.info('hello ' + this.name + ' ' + content);
  }
  function ChildObj() {
    this.subName = '456';
  }
  ChildObj.prototype = new SuperObj('999');
  var child = new ChildObj();
  console.info(child)

  function ChildObj1(){
  this.subName = '777';
  }
  ChildObj1.prototype = SuperObj.prototype;
  var child1 = new ChildObj1();
  console.info(child1);
  
  function ChildObj2(){
  	SuperObj.call(this);
  }
  ChildObj2.prototype = SuperObj.prototype;
  var childobj2 = new ChildObj2();
  console.info(childobj2);
```
上述代码中ChildObj实现的是构造继承，将SuperObj的实例作为ChildObj的prototype，而ChildObj1则是普通原型继承，将SuperObj的prototype作为ChildObj1的prototype，中间多加入了一层
![构造调用与普通原型调用](构造调用与普通原型调用.png)

而对于ChildObj2对象，调用时直接用了SuperObj.call，也就是直接调用SuperObj函数，并将自身作为函数中的this，因此childobj2对象，直接是完全继承了SuperObj的属性，而对于prototype则依旧通过原型链来追踪。

