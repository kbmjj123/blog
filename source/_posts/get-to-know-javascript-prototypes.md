---
title: 从新开始认识JavaScript原型
author: Zhenggl
date: 2022-03-09 08:45:20
description: 从新开始认识JavaScript原型
categories:
    - [javascript, prototype]
tags:
    - javascript
    - prototype
    - constructor
cover: 原型封面.jpeg
---

### 前言
一切，从以下的两行代码开始说起
```javascript
  function Foo() {}
  var foo = new Foo();
```

![原型封面](原型封面.jpeg)

✨ 面向对象编程是一种程序设计范式，它将对象作为程序的基本单元，将程序和数据封装📦其中，以提高程序的重用性、灵活性和扩展性。

上面定义了一函数对象Foo，并利用该构造函数，创建了一个foo实例，该实例对象指向的是Foo

### Object对象
`Object`是JavaScript中的一种*数据类型*，用来存储各种键值对集合和更加复杂的实体，Object可以通过`Object()`构造函数或者直接使用`对象字面量`的方式来创建。
在JavaScript中，几乎所有的对象都是`Object`类型的实例，它们都会从**Object.prototype**中继承属性和方法，虽然一部分属性/方法会被重写。

🤔 这里有一个疑问，为什么自定义创建出来的对象，默认就拥有了Object实例中的方法？
👉 首先所有的对象都是`Object`类的实例对象，它们会从**Object.prototype**中继承属性和方法，而且，每一个实例对象中都拥有一个属性**__proto__**，该属性代表在实例化一个对象的时候，
将会使用__proto__所指向的对象来作为实例化出来的对象的原型，而Object.__proto__默认指向Object.prototype，因此实例化出来的对象则拥有Object中实例方法(即Object.prototype中的方法)。
而这里的__proto__一般在浏览器的输出是不可见的，在代码层面的话，有
> Foo.prototype === foo.__proto__
> console.info({});

![Object中的__proto__属性](Object中的__proto__属性.png)

Object.prototype中含有一个constructor属性代表的是用这个constructor来创建的对象实例，这也就说明了new出来的一个对象是什么类型的，只要对应的constructor指向明确即可

![prototype与对象的关系](prototype与对象的关系.png)

在平时的源码阅读过程中，可以简单的将构造函数对象与其原型对象分离开来，最好是像上面一样，画出所涉及到的各个原型以及对象，并对应整理出他们之间的一个关联关系图，来对其关系进行一个分析。
将对应的属性/方法包含在各个对象中，归类归属到每个对象中，需要记住一下的一句话：
> ✨ 定义在`prototype`上的属性/方法，其实例对象instance均通过引用的方式来访问到对应的属性/方法

![再次分析原型继承](再次分析原型继承.png)

✨ 后续由于JavScript中提供了`Object.create()`静态方法，用于从一个现有对象来创建新对象的prototype，因此，我们不需要从头去编写一行行的代码来实现对象之间的一个关联关系

```javascript
  const person = {
      isHuman: false,
      printIntroduction: function() {
        console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
      }
    };
    person.prototype = {
      callMe: function(){
        console.info('callMe');
      }
    };
    
    const me = Object.create(person);
    me.isHuman = true;
    
    console.info(person)
    
    console.debug(me)
```

![Object.create输出结果](Object.create输出结果.png)

通过`Object.create`方法，根据person对象以及它的原型，来创建一个新的对象me，新创建出来的me对象，将person对象以及它的prototype作为自己的prototype，而且每个me都是一份拷贝，修改每个me都不会影响到person以及person.prototype

### 函数是一等对象与prototype
函数也于对象Object类似，是一等对象，只不过是可以被执行的对象罢了，Foo构造函数new出来的实例与Object相比，构造函数创建出来的对象中包含了一属性constructor，该属性指向的创建对象的方法，
其实也就可以理解为告诉了编译器，要用哪个构造函数来创建对象

✨ 有了`new`操作符，函数更加面向对象了
👉 我们知道，`new`操作符主要用于修饰函数，函数有了`new`关键词的加持，由原本的普通执行函数，摇身一遍就成了构造调用，一般的，`new`出一个对象的过程如下4个步骤：
1. 创建一个全新的对象，比如呀：var x = Object.create(null);,这里的对象我们暂且定义为x；
2. 将foo的原型指向Foo的原型：x.prototype = Foo.prototype;
3. 执行[[Prototype]]对象中的Foo函数，并传递对应的参数：Foo.call(x)，这样子每个对象就拥有了一个自身实例的操作;
4. 看上面的`Foo.call(x)`，该函数执行成功后的返回值，就是该对象

🤔 比如有三种方式来映射对应父子类之间的关系：

| 调用方式  | 用途 | 区别 |
|---|---|---|
| Child.prototype = new Super();  | 创建原型继承管理  | 通过实例构造调用父类，将使得每个子类实例都能够保持唯一数据源  |
| Object.create(target);  |  创建原型继承管理 | `最合适 的基于ES5来创建一个关联关系的方式`  |
| Child.prototype = Super.prototype;  |-创建原型继承管理  | 将孩子的原型指向父亲原型，则任何一个子类通过new方式的话，所有的子类都享有公共的数据源 |

![prototype所有家族](prototype所有家族.png)

#### 什么是原型？
JS中的对象都拥有的一种特殊的内置属性[[Prototype]]，引用着其他对象，若该[[PrototypeType]]非Object类型的，则会再拥有一个[[Prototype]]，继续引用其他的对象，直至引用的对象是一Object。
![原型的引入](原型的引入.png)

从上面代码这里我们可以看出xx是一个的内置属性[[Prototype]]指向Object，而yy的是先指向xx的[[Prototype]]，然后再有xx的[[Prototype]]指向Object。
⚠️对于操作符in的话，它也是会从目标对象一直查询到原始的对象的，只要对象中的属性的枚举值是true即可！

✨ 属性的设置与屏蔽
首先让我们来完整地讲解一下：obj.foo = 'bar'  这个过程：
![obj属性的寻找](obj属性的寻找.png)

从👆我们可以看出：赋值操作的优先级是：**[[Setter]] > Object.defineProperty(...) > .属性**
👉同时，这也告知我们，尽量避免使用屏蔽赋值操作，也就是尽量少使用同名属性在对象中，而采用不同名称的属性。

✨ 一般情况下，我们在创建一个对象之前，最好是能够保证对象的原型能够完成定义，并投入使用，而不是在使用过程中，改变原型对象，然后再直接访问，这样子会导致变更后的属性没有办法被实例访问到，
比如有一下一个构造函数：
```javascript
  function Foo(){
	this.x = 1;
	this.y = 2;
  }
  Foo.prototype = {
	sayHello: function() {
	  console.info('hello');
	}
  }
  var foo = new Foo();
  console.info(foo.sayHello());
  // 以下是补充的操作
  Foo.prototype.sayXX = function() {
    console.info('say XX');
  }
  foo.sayXX();  // error
```
针对此种情况，需要针对关于原型对象的使用，提供以下两个例子：
🌰1⃣️：
```javascript
  function Super(){
  this.xx = function(){
    console.debug('这是来自于Super对象中的方法');
  };
};
Super.prototype = {
  say: function(){
    console.info(123);
  }
}

var M = function(){}
var m = new M();
console.info(m);
console.info(m.__proto__);
setTimeout(function(){
  M.prototype = Super.prototype;
  m = new M();
  console.info(m);
    console.info(m.__proto__);
  m.say();  // 因为该访问是直接定义在prototype中的方法属性
  
  setTimeout(function(){
    Super.call(m);
    console.info('又过了3秒');
    console.info(m);
    console.info(m.__proto__);
    m.xx();//xx这里的方法可以被直接调用到，是因为上面的Super.call(m)方法，这里执行的Super()方法中，this指向的m，在m对象上添加了xx属性方法，因此可以直接调用到xx方法
    M.prototype.yy = function(){
      console.info('来自yy方法');
    }
    m = new M();
    console.info(m);
    m.yy();
  }, 3000);
  // m.say(); 直接报错，因为m对象中并没有该属性函数的定义
},3000);

```
🌰2⃣️：
```javascript
  function Super(){
  this.xx = function(){
    console.debug('这是来自于Super对象中的方法');
  };
};
Super.prototype = {
  say: function(){
    console.info(123);
  }
}

var F = function(){}
var f = new F();
setTimeout(function(){
  	f.prototype = new Super();
	console.info(f);
	//console.debug(f.say());
}, 3000);

var K = function(){}
var k = new K();
setTimeout(function(){
  	k.prototype = new Super();
	console.info(k);
	//console.debug(k.say());
    setTimeout(function(){
      K.prototype.yy = function(){
        console.info('来自于新增的yy方法');
      }
      var mmm = new K();
      console.info(mmm);
      //这里的mmm实例对象中增加了yy属性方法，因为我们在prototype属性中添加了yy方法，则意味着其所在的__proto__对象中也天添加了yy方法
	}, 6000);
}, 3000);
```

✨ 从上面知识点的阐述，我们也可以这样子的一个结论：
1、原型（[[Prototype]]机制）就是存在于对象之间的一个内部链接，它可以随意引用任何一个对象，且可以任意调整；
2、原型链中属性的查找规则有点类似于作用域的查找规则，就是首先在当前对象中查找该属性是否存在，如果不存在，JS引擎就会在当前对象的Prototype关联的对象上去查找，如果还没有就一直往上找，直到找到Object.Prototype，如果都没有，接着就根据时取值类型则报错，如果是赋值类型则在当前对象中添加一个属性，这个查找的过程就是一个原型链。
