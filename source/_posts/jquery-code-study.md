---
title: jquery源码解读
author: Zhenggl
date: 2021-07-03 10:36:49
categories:
    - [前端, 开发框架, jquery]
tags:
    - [jquery]
cover_picture: https://img.91temaichang.com/blog/jquery-cover.png
---

### 前言
现在的童鞋估计一上手项目，就不是以前直接用jquery来撸项目，而是使用的`vue`，`react`等快速开发框架，虽然jquery已经渐渐地淡出现阶段的项目，但它霸屏了长达好几年的浏览器，
很值得我们具体来学习其中的缘由。

### 框架预览
首先我们先看下jquery的总体架构，如下图：

![jquery总体架构](https://img.91temaichang.com/blog/jquery-total-structure.png)

首先它通过类工厂模式，创建了一个jquery对象，通过立即执行函数，提供requirejs的方式引入jquery，可以在nodejs中包含`document`对象属性的环境中运行

其次，为兼容amd环境使用jquery，同样地在框架中支持amd方式调用jquery

![amd方式使用jquery](https://img.91temaichang.com/blog/jquery-amd-use.png)

#### 框架源码问题一一解读

这里有一个点，就是为毛我们能够在引入了jquery库的环境中，可以使用window.$呢？原因就是它在全局环境中用$来指向了new出来的jquery对象，具体如下

![jquery中关于$的定义](https://img.91temaichang.com/blog/jquery-%24-defined.png)

从👆 我们可以看出这里将定义出来的jquery对象由window中的$来指向，因此，我们使用$()方法其实就是使用的jquery()方法

##### jquery可以通过new方式来创建出来吗？
答案是可以的，具体可以看以下的源码

```javascript
  var version = '3.4.1',
  // Define a local copy of jQuery
      jQuery = function(selector, context) {
  // The jQuery object is actually just the init constructor 'enhanced'
  // Need init if jQuery is called (just allow error to be thrown if not included)
       return new jQuery.fn.init(selector, context);
  },
  // Support: Android <=4.0 only
   // Make sure we trim BOM and NBSP
   rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  jQuery.fn = jQuery.prototype = {
  	// The current version of jQuery being used
    jquery: version,
    constructor: jQuery,
    // The default length of a jQuery object is 0
    length: 0
    // 以下省略其他属性的定义
  };
  var init = jQuery.fn.init = function(selector, context, root) {
  	
  };
  // Give the init function the jQuery prototype for later instantiation
  init.prototype = jQuery.fn;
```
从这里，我们可以看出，首先jQuery是一函数，该函数返回其函数内部属性fn对象的init的构造调用，我们知道`new`是函数的一个构造调用，返回的是一新的对象

而jQuery.fn指向jQuery.prototype原型并统一指向一字面量对象，该字面量对象中有一constructor属性又指向会jquery
