---
title: 从新开始认识JavaScript原型
author: Zhenggl
date: 2022-03-09 08:45:20
categories:
    -[javascript, prototype]
tags:
    -javascript
    -prototype
    -constructor
cover_picture: 原型封面.jpeg
---

### 前言
一切，从以下的两行代码开始说起
```javascript
  function Foo() {}
  var foo = new Foo();
```

![原型封面](原型封面.jpeg)

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

### 函数是一等对象
函数也于对象Object类似，是一等对象，只不过是可以被执行的对象罢了
