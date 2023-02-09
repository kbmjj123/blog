---
title: webpack中的AsyncQueue
description: webpack中的AsyncQueue
author: Zhenggl
date: 2023-01-28 15:39:23
categories:
  - [webpack, AsyncQueue]
tags:
  - webpack
  - AsyncQueue
cover_picture: AsyncQueue封面.jpg
---

### 前言
> 在阅读到`Compilation`的代码执行过程时，发现有一个隐藏的异步队列执行者，:confused: 这里为啥要单独整一篇文章来阐述这个异步队列执行者呢？我觉得应该是在于它的一个比较独特的设计理念打动了我，下面就来具体分析一下并尝试来使用这个异步队列的执行者！
> **添加完成一个元素后，自动执行一个对应的回调动作，并能够实现与父AsyncQueue对象共享的“线程队列”资源**

### 如何使用？
```javascript
const AsyncQueue = require("../../lib/util/AsyncQueue");
let child = new AsyncQueue({
	name: "test",
	parallelism: 2,
	processor: () => {
		console.info("我是来自于processor的执行动作");
	}
});
child.add({}, err => {
	console.info("我是来自于添加失败后的回调！");
});
child.add({}, err => {
	console.info("我是来自于添加失败后的回调！");
});
child.add({}, err => {
	console.info("我是来自于添加失败后的回调！");
});
```
![AsyncQueue的简单使用](AsyncQueue的简单使用.png)

:point_up: 这里当调用了`AsyncQueue`对象的一个`add`方法的时候，将自动执行它的`processor`方法，而且该`processor`还与创建该`AsyncQueue`对象时所传递的`parallelism`限制相关，也就是说这个异步队列对象是可以被数量器所限制的！

:point_down: 再来看另外的一个进阶使用例子

```javascript
const AsyncQueue = require("../../lib/util/AsyncQueue");
let parent = new AsyncQueue({
	name: "parent",
	parallelism: 1,
	processor: () => {
		console.info("我是来自于父亲👨processor的执行动作～～");
	}
});
let child = new AsyncQueue({
	name: "child",
	parallelism: 2,
	parent: parent,
	processor: () => {
		console.info("我是来自于processor的执行动作");
	}
});
parent.add({}, err => {
	console.info("我是来自于添加失败后的回调！");
});
parent.add({}, err => {
	console.info("我是来自于添加失败后的回调！");
});
child.add({}, err => {
	console.info("我是来自于添加失败后的回调！");
});
child.add({}, err => {
	console.info("我是来自于添加失败后的回调！");
});
child.add({}, err => {
	console.info("我是来自于添加失败后的回调！");
});
```
![共享限制线程队列资源的AsyncQueue](共享限制线程队列资源的AsyncQueue.png)
:stars: 这里我们又可以发现当将`child`的`parent`设置为另外一个`AsyncQueue`对象时，执行`child.add()`方法时，将使用`parent`的限制性的`parallelism`限制属性，因此只输出了一个父亲`AsyncQueue`的`processor`回调，而直接放弃剩余的其他`processor`回调！

### AsyncQueue是如何实现的呢？
> 要理解这个`AsyncQueue`是如何被执行的，需要先了解关于`AsyncQueue`的组成部分

#### AsyncQueue的组成
![AsyncQueue的组成](AsyncQueue的组成.png)
:alien: 通过其组成成员的结构图定义，我们可以大致地了解到关于这个`AsyncQueue`的一个简单定义如下：
*AsyncQueue是一个自带任务执行队列的对象，且执行的任务可通过其API获取，而且在任务的执行过程中，由其传递给构造函数的限制属性来进行资源的限制*，对应有以下几个属性特征：
1. 可存储对象，并将其作为任务来执行；
2. 任务的执行具有状态，且状态均可被访问到；
3. 自动执行的机制，无须手动显示触发调用；
4. 并非无限制触发，而是可通过传参方式来控制触发数量；
5. 可配置关联触发，形成任务执行链条，链条的数量可执行次数可控；
6. 执行过程均可被监听到。

![监听AsyncQueue的执行过程](监听AsyncQueue的执行过程.png)

#### AsyncQueue的工作过程
> 一切从`add()`方法开始！
> 当开始add的时候，就往队列中塞任务，并在下一次“大循环”时，自动执行该动作！
![AsyncQueue的执行过程](AsyncQueue的执行过程.jpg)

### 什么情况下会考虑使用AsyncQueue？
> 一般情况下，js程序都是线性执行的方式，通过`AsyncQueue`，并结合`tapable`，可实现类似于`java中的线程池队列`机制，并允许通过共享的资源的方式来实现节省资源下的执行任务，通过`AsyncQueue`，我们可以很方便地将一个动作的触发，设置为自动关联的任务执行队列，且队列间的资源由“父队列”来管控，当父队列中的资源使用完了的时候，将直接忽略子队列中的任务，而当父队列中有充裕的资源时，继续执行子队列中的任务。
> 可适用于 :u6709: 关联关系的任务执行队列，且在有限资源限制下的任务！，使得调用方无需关心什么时候被执行！