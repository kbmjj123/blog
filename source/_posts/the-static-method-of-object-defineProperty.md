---
title: Object.defineProperty重新捡起学习
description: Object.defineProperty重新捡起学习
author: Zhenggl
date: 2022-03-24 19:10:53
categories:
tags:
cover_picture: Object.defineProperty封面.jpg
---


### 前言
🤔 一般的，我们定义一个对象的属性的时候，可以简单的通过对象字面量来定义并声明对象的属性，如下：
> var obj = { a : 123 };

定义了一个obj对象，其属性a的值赋为123。既然JavaScript中已经提供了这种方式来声明定义对象以及其属性，为啥子还要多此一举来提供`Object.defineProperty`这个静态API来给对象定义属性呢？？

✨ 首先，对于`Object.defineProperty()`的定义是：直接在一个对象上定义一个新的属性，或者修改一个对象的现有属性，并返回此对象。
这里在定义属性的同时，不单单提供属性的值，还提供了属性的*数据操作*+*数据属性描述*，该方法允许**精确**地添加或修改对象的属性，一般通过简单的赋值操作，其属性描述符中的属性都是true的。
> var obj = {};
> Object.defineProperty(obj, 'a', {
>   value: 123,
>   writable: 'boolean，当且仅当该值为true的时候，普通的.属性操作符或者[]属性操作符才可以对a属性进行赋值',
>   enumerable: 'boolean, 当且仅当该值为true的时候，该属性才会出现在对象的枚举属性中，也就是Object.keys()或者for...of方式来访问到',
>   configurable: 'boolean, 当且仅当该值为true的时候，在定义了该属性之后，后续想要对这个属性进行一个重新配置操作才能够被允许，否则就是一次性的操作',
>   get: 'function, 属性的getter函数，如果没有定义，则为undefined，当访问该属性时，会调用此函数，执行时不传入任何参数，但是会传入this上下文',
>   set: 'function, 属性的setter函数，如果没有定义，则为undefined，当属性值被修改时，会调用此函数，该函数接收一个参数，作为对该属性进行赋值操作的值'
> });

通过对比上述两种方式对变量a的定义看似好像没有什么区别，实际上的区别巨大，因此其中隐藏了对对象属性的一个保护机制，并且额外隐藏了一系列复杂的逻辑在其中，我们也可以借助于`Object.defineProperty`静态方法来帮助自己完善复杂业务

```javascript
  var obj = { a: 123 };
  Object.defineProperty(obj, 'b', { value: 123 });
  console.info(obj);  //正常输出上并没有什么太大的区别
  //---------------通过以下的方式来输出，我们会发现两者的不同点
  console.info(Object.getOwnPropertyDescriptor(obj, 'a'));
  console.info(Object.getOwnPropertyDescriptor(obj, 'b'));
```
![对象的属性描述符区别](对象的属性描述符区别.png)

✨ 通过上述的输出结果，我们可以得知，普通对象字面量所定义的属性描述的其他属性都是true，而通过`Object.defineProperty`定义的属性描述符的属性都是false

### getter与setter
在学习Object.defineProperty方法之前，我们先来了解以下属性的getter以及setter，一般可以使用两者配合，来定义对象属性的一个**伪属性**，这里称之为**伪属性**，原因是因为我们有可能并不是真实使用这个属性，
而是借助于这个属性，来实现其他的逻辑操作。

#### getter
> `get`语法将对象属性绑定到查询该属性时将被调用的函数
```javascript
  const obj = {
	log: [1,2,3],
	get latest(){
		if(0 === this.log.length){
			return undefined;
		}
		return this.log[this.log.length - 1];
	}
  };
  console.info(obj.latest); // 3
```
##### getter语法说明
> get prop(){...}
> get [expression](){}

**参数：**
prop： 要绑定到对象中属性名，这里可以是一个字符串，也可以是一个[表达式]，通过[表达式]可以利用计算属性动态设置对象的属性名称

**描述：**
有时需要允许访问返回动态计算值的属性，或者我们可能需要反应内部变量的状态，而不需要使用显示方法调用，就可以使用*getter*来实现。

##### getter在class中的使用
首先，先看一下的代码：
```javascript
  class Example{
	get hello(){
		return 'hello';
	}
  }
  const obj = new Example();
  console.info(obj.hello);
  
  console.info(Object.getOwnPropertyDescriptor(obj, 'hello'));  // undefined
  
  console.info(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), 'hello'));
  // { configurable: true, enumerable: false, get: function get hello() { return 'world'; }, set: undefined }
  
```
这里有两个点需要注意一下的：
1. 首先在class Example中定义的getter属性hello，由于是一函数，可以理解为与普通函数一样，定义在class对象中的属性，将会定义在对象的原型上，因此，才会有上述的在obj的prototype中才有的hello属性；
2. 关注到prototype中的hello的属性描述符相关值，由于是在obj.prototype中定义的hello属性，因此对应的实例对象obj可以通过原型的方式访问到，而在实例中是根本不存在这个属性的，因此该属性是不可枚举的；

#### setter
> 当尝试设置属性时，set语法将对象属性绑定到要调用的函数
```javascript
  const language = {
  set current(name) {
    this.log.push(name);
  },
  log: []
};

language.current = 'EN';
language.current = 'FA';

console.log(language.log);
// expected output: Array ["EN", "FA"]

```
##### setter语法说明
> set prop(val){...}
> set [expression](val){...}
**参数：**
prop： 要绑定到对象中属性名，这里可以是一个字符串，也可以是一个[表达式]，通过[表达式]可以利用计算属性动态设置对象的属性名称

**描述：**
有时需要允许访问返回动态计算值的属性，或者我们可能需要反应内部变量的状态，而不需要使用显示方法调用，就可以使用*setter*来实现。

### Object.defineProperty
> 对象里目前存在的属性描述符有两种主要形式：*数据描述符*和*存取描述符*，*数据描述符*是一个具有值的属性，该值可以是可写的，也可以是不可写的。
> *存取描述符*是有getter函数和setter函数所描述的属性，一个描述符只能是这两者其中之一，不能同时拥有。

#### 方法解释
**语法：**
> Object.defineProperty(obj, prop, descriptor)

**参数：**
1. obj: 要定义/修改属性的对象
2. prop: 要定义/修改的属性名称或Symbol
3. descriptor: 要定义/修改的属性描述符

**返回值：**
被传递给方法中的obj

#### 方法使用

##### 创建属性
如果对象中不存在指定的属性，`Object.defineProperty()`会创建这个属性，当描述符中省略某些字段时，这些字段将使用它们的默认值
```javascript
  var o = {};
  Object.defineProperty(o, 'a', {
  	value: 2,
  	writable: true,
  	enumerable: true,
  	configurable: true
  });
  // 👆在对象o中添加一个属性与对应的属性描述符对象，等同于o.a = 2;
  var xx = 3;
  Object.defineProperty(o, 'b', {
  	get(){ return xx; },
  	set(newVal){ xx = newVal },
  	enumerable: true,
  	configurable: true
  });
  // 👆在对象中创建了一个b属性以及对应的描述符，并利用xx中间变量来进行属性的存/取
  Object.defineProperty(o, 'c', {
  	value: 123,
  	get(){ return 456; }
  })
  // 👆将会报错，因为不能同时提供对属性值的两种不同取值方式
```
##### 自定义getters和setters
```javascript
  function Archiver() {
    var temperature = null;
    var archive = [];
    // 这里this指向调用者，由于使用的new关键词来创建的对象，因此会指向对应实例对象
    Object.defineProperty(this, 'temperature', {
    	get(){
    		console.info('get!');
    		return temperature;
    	},
    	set(newVal){
    		temperature = newVal;
    		archive.push({
    		  val: temperature
    		});
    	}
    });
    this.getArchive = function() {
      return archive;
    }
  }
  var arc = new Archiver();
  arc.temperature;  // get!
  arc.temperature = 123;
  arc.temperature = 456;
  arc.getArchive(); // [{val: 123}, {val: 456}]
```
![自定义getter和setter结果](自定义getter和setter结果.png)

通过自定义getters和setters，利用temperature变量来提供对象自身属性的一个存/取操作，这里可以封装自身的很多逻辑在其中。

##### 属性继承
```javascript
  function MyClass() {
  }
  var value;
  Object.defineProperty(MyClass.prototype, "x", {
  	get(){ return value; },
  	set(newVal){ value=newVal; }
  });
  var o1 = new MyClass();
  var o2 = new MyClass();
  o1.x = 1;
  console.info(o2.x); // 1
```
👆这里的x是定义在MyClass的prototype对象上的，因而实例对象则共享了x的访问，所以o1改变了x也同时改变了o2中的x
🤔那么针对上面的这种情况，我们应该怎么调整，才能够让x由每个实例对象去拥有呢？
```javascript
  // ...
  Object.defineProperty(MyClass.prototype, "x", {
  	get(){ return this.x1; },
  	set(newVal){ this.x1 = newVal }
  });
```
通过在定义x属性的时候，将x挂到this上，而this则是指向着new出来的实例对象，因此每个实例对象都拥有对x的一份数据

### Object.defineProperty的使用场景
