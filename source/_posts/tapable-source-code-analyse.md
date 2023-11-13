---
title: tapable使用与源码分析
description: tapable使用与源码分析
author: Zhenggl
date: 2022-12-18 07:33:15
categories:
  - [webpack, tapable]
tags:
  - webpack
  - tapable
cover: tapable的使用与源码分析.jpg
---

### 前言
> 在刚接触`webpack`的时候，仅仅只是懂得了关于如何通过简单的配置，来告知`webpack`如何进行一个打包工作，但是，对于`webpack`中具体是如何工作的，却全然不晓得，因此，觉得很有必要来对其中的执行过程进行一个深入的学习，在学习的过程中，又遇到了一个看着一头雾水的代码`this.hooks.compiler.XXX`系列方法，通过相关的资料查阅才知道，原来`webpack`中的`compiler`的相关的勾子函数的实现，都是由这个`tabable`来实现，因此，编写此文章来记录一下学习的过程，加深对`tapable`的理解，也可以在自己后续的框架中来使用到这个框架！

### tapable是什么?
> 在经过相关的学习文档以及使用的方式得出的结果，其实`tapable`它是一个类似于`connect`中间件的一个框架，但是它又比`connect`框架又有更多的额外的特殊属性，正是由于这个特殊的属性，采用多次注册一次执行的方式，使得`wepback`能够实现复杂的多变的"类似生命周期"的相关函数方法:
1. 容器的思维，在hooks对象中所定义的每一个属性都是一个容器，每个容器都可以有无限多的钩子函数；
2. 容器中的钩子函数的执行顺序: 同步、异步、串行;

### tapable如何使用?
```javascript
//? 引入相关的待使用的钩子对象
const { SyncHook, AsyncParallelHook } = require('tapable');
class Car{
  constructor(){
    //! 初始化hooks容器，容器属性可以自定义名称
    this.hooks = {
      accelerate: new SyncHook(['one', 'two']), //创建一个钩子容器，这个的one以及two是计划传递给每个钩子函数的参数引用
    };
  }
  // 往hooks容器中注册事件，也可以理解为往hooks中添加回调函数
  tap(){
    //? 往hooks的accelerate属性添加one钩子函数以及two钩子函数
    this.hooks.accelerate.tap('one', param => {
      console.info(param);
    });
    this.hooks.accelerate.tap('two', (param1, param2) => {
      console.info(param1, param2);
    });
  }
  //? 启动钩子函数
  start(){
    this.hooks.accelerate.call('123');
  }
}
const car = new Car();
car.tap();
car.start();
```
:confused: 一般地，关于`tapable`的使用需要经过 :point_down: 几个步骤：
1. 引入相关的钩子依赖；
2. 在其`hooks`属性中注册相关的钩子容器；
3. 针对已注册的钩子容器添加对应的回调方法；
4. 调用`start`类方法来触发对应的钩子函数！

:confused: 那么这一个过程发生了什么事情呢？？为什么注册后的钩子可以被通过这种方式来调用呢？初步猜想应该是将所有的注册的动作，往对应的属性所在的值(应该是一个数组)塞入了一个callback回调函数，当调用的start方法时候，从数组函数中捞出来一个个地执行，并传递对应的参数！！

### tapable的源码分析
> 在开始进入tapable源码分析之前，先来看 :point_down: 的一个关系图：
> ![tapable简单对象关系图](tapable简单对象关系图.png)
> 先对整体的`tapable`框架有一个大致的轮廓，接下来将这个对象关系中的每个对象的执行流程图整理如下所示：
> ![tapable的call方法的形成过程](tapable的call方法的形成过程.jpg)
> :point_down: 针对上述的call方法形成过程，来具体分析关于`tapable`的一个执行过程(下面所提及的"系列方法"指的是方法集合)：

1. :stars: `new Hook()`系列方法的过程
   创建一系列的容器属性的过程，也是钩子函数所存储的位置的创建过程，通过该方法，创建一属性`taps[]`数组属性，且同时根据当前`Hook`对象(同步、异步、串行)类型，来对应创建一一对应的`call`系列方法，这里对应的系列方法采用的抽象工厂模式(见上述的对象关系图以及call方法的形成过程图)，在这个工厂中，通过`create`来创建对应的函数体内容，如下图所示：
   ![factory创建函数体对象](factory创建函数体对象.png)
   :stars: 通过所传递进来的参数(比如上述例子中的one和two)，在程序运行的过程中，生成一个临时的函数体，并作为hooks中的容器的call方法的内容，这里所生成的函数体的内容如下所示：
   ![实际在运行时内存中生成的函数体](实际在运行时内存中生成的函数体.png)
   从 :point_up: 我们可以发现，这里的函数体只是简单的从`taps`中取出对应的函数地址，来直接执行函数，并同时传递对应的参数(one+two)，实现函数的动态注册与动态调用！

2. `hooks.容器属性.tap()`系列方法的过程
   对容器属性添加钩子回调方法，每一个钩子方法中都拥有唯一的名字，然后在回调函数中所使用参数，即是在第一步所注册的hooks系列对象中所传递的参数， :warning: 这里我们可以针对一个容器属性添加多个不同名称的钩子函数，代表这个钩子容器执行时，按照注册的回调方法来依次调用，这里我们可以对比一下与单个钩子方法时，所对应的容器属性生成的call系列方法内容，如下图所示：
   ![多个连续调用的函数体](多个连续调用的函数体.png)

3. `hooks.容器属性.call()`系列方法的过程
   这个过程比较简单，就是简单的调用第二步所生成的call系列方法，实现对同一个属性容器顺序调用不同的钩子函数的目的！！

#### `其他的Hook`过程是怎样的？

#### SyncBailHook
![SyncBailHook的过程](SyncBailHook的过程.png)
:stars: 从上述的call函数的输出可以发现，`SyncBailBook`是针对钩子函数的callback进行返回值判断的，因此如果 :u6709: 的一个场景：
![SyncBailHook直接返回callback结果拦截](SyncBailHook直接返回callback结果拦截.png)
:point_right: 因此，这个`SyncBailHook`是一种可以被callback的返回值所直接拦截的操作！！

#### SyncLoopHook
![SyncLoopHook的过程](SyncLoopHook的过程.png)
:point_right: `SyncLoopHook`就是将容器中的钩子函数，如果返回值为true的话则继续执行该钩子函数，用于循环执行某个钩子函数的目的！！

#### SyncWaterfallHook
![SyncWaterfallHook的过程](SyncWaterfallHook的过程.png)
:point_right: `SyncWaterfallHook`就是提供给钩子函数自身去实现pipeline的一个执行流程的目的！

#### AsyncSeriesHook
> :point_up: 提及到的都是同步的钩子函数，`tapable`同时也提供了异步的钩子函数帮助类
![AsyncSeriesHook的过程](AsyncSeriesHook的过程.png)
:warning: 如果我们像 :point_up: 般直接通过`call`的方式调用的话，那么与同步的hook将没有什么区别，取代的，我们应该采用`callSync`或者`callPromise`的方式来调用，这里分别展示出两种调用方式：
![AsyncSeriesHook的过程-tapAsync方式](AsyncSeriesHook的过程-tapAsync方式.png)
![AsyncSeriesHook的过程-tapPromise方式](AsyncSeriesHook的过程-tapPromise方式.png)

:confused: 其他的`Async***`则是对应与同步的hook雷同，这里就不再重复说明了！

#### 在官方文档中所为提及到的是这个钩子函数的拦截器`interceptor`
![统一的拦截器](统一的拦截器.png)
![生成的拦截器参数](生成的拦截器参数.png)
:confused: **这里share一个idea，如果我在已经运用了`tapable`库的框架中，想要了解其中的相关的生命周期，就可以利用`interceptor`来将所有已经设置了对应的钩子函数的所有成员**

### tapable给自己的启示
1. 动态生成代码的机制，借助于`new Function()`语法规则，在程序的运行时阶段动态创建一个函数对象，也就是函数体的内容会随着传递的参数的变化而变化，这种可以适用于开发可扩展性强的程序，通过外部传入的配置来动态创建一个函数程序；
2. 抽象基类与子类的实现，采用在基类中定义的一个方法`compile()`，在该方法的实现体中直接抛出异常，代表该方法不能被正常调用，也就是不能用这个基类的实现类来创建对象，而是通过继承于该基类，实现该基类的`compile()`方法，来实现类似于`java中的抽象编程模式`；
3. 抽象工厂模式的使用，在生成一系列的`call`方法的时候，才用抽象工厂编程模式，由子实现工厂类来实现对应类型的实现函数，再由父类来通过统一的create方法来创建一个call方法函数对象返回；
