---
title: JavaScript中的浏览器学习(Event篇)
author: Zhenggl
date: 2022-01-29 08:37:08
categories:
    - [javascript, web, 浏览器]
tags:
    - javascript
    - web
    - 浏览器
    - event
cover: the-event-in-web-browse.jpeg
---

### 前言
> 浏览器提供了异步事件驱动编程模型，通过对特定元素、特定事件(比如`document.onload`、`XMLHttpRequest.onreadychange`)等进行监听，来达到对该元素/事件的一个响应动作，这个动作即为一*事件*，
> 我们称之为*event*，该*event*并不是javascript内的对象，而是抽象封装了一个基础类

![浏览器事件对象Event组成](浏览器事件Event对象.png)

通过上图可以得知，浏览器中的事件Event对象由以下几个元素组成：

### 一、事件类型
一般的浏览器事件类型包括有：
+ 传统事件类型
  - 表单事件：form表单的sumbit、reset事件
  - window事件：window.onload事件
  - 鼠标事件：mouseover事件
  - 键盘事件
+ DOM事件
+ HTML5事件
+ 移动设备事件
### 二、事件目标
`EventTarget`是一个DOM接口，由可以接收事件、并且可以创建监听器的对象实现，而我们所熟知的`Element`、`Document`和`window`都是最常见的EventTarget，继承于该接口，像其他的对象，也是可以做为EventTarget，
比如`XMLHttpRequest`、`AudioNode`、`AudioContext`等等，这也就印证了前言所提及到的对`特定的元素、特定的事件比如document.onload、XMLHttpRequest.onreadychange`这一说法，也就是说，只要继承了`EventTarget`接口的
对象，均可以实现对应的监听动作。

该接口提供了以下几个方法：
+ addEventListener：添加监听事件，将实现了EventListener的函数或者对象添加到EventTarget上的指定事件类型的事件监听列表中
  - type：事件类型名称
  - listener：实现了EventListener的函数或对象
  - options/useCapture：
    - options：一个指定有关listener属性的可选参数对象，可用的选项如下：
      - capture：boolean值，表示listener会在该类型的事件捕获阶段传播到该EventTarget时触发
      - once：boolean值，表示仅执行一次
      - passive：boolean值，true表示永远不会调用preventDefault
    - useCapture：boolean值，设置该事件为捕获事件
+ removeEventListener：移除监听事件
+ dispatchEvent：分发事件

🤔 那么我们是否可以设计自己的一个对象，来实现自定义监听动作呢？？？

```javascript
  class MyEventTarget extends EventTarget{
	constructor(mySecret) {
	  super();
	  this._secret = mySecret;
	}
	get secret(){
		return this._secret;
	}
  }
  let myEventTarget = new MyEventTarget(19);
  let MyValue = myEventTarget.secret;
  myEventTarget.addEventListener('myListener', e => {
  	this._secret = e.detail;
  });
  // CustomEvent事件是由程序创建的，可以有任意自定义功能的事件，包含detail只读属性，代表任何初始化时传入的数据
  let event = new CustomEvent('myListener', { detail: 10});
  myEventTarget.dispatchEvent(event);
  console.info(myEventTarget.secret);
```
上述定义了一自定义的额事件目标对象，通过对该目标设置`myListener`监听动作，利用该目标的dispatchEvent来分发一个自定义携带参数的事件，来响应事件的回调


### 三、事件对象
Event.target，触发事件的对象(比如某个DOM)的引用
### 四、事件传播
一般一个事件的发生包括有三个阶段：1⃣️捕获 --> 2⃣️触发 --> 3⃣️冒泡

![浏览器事件流](浏览器事件流.png)

✨ 当一个EventListener在EventTarget正在处理事件的时候被注册到EventTarget上的时候，它不会被立即触发，但可能在事件流后面的事件触发阶段被触发，比如在捕获阶段添加，然后在冒泡阶段被触发。
![默认事件流](默认事件流.png)

而这个时候，如果我们将中间的`div`上设置的监听器给设置为addEventListener('click', callback, true)的时候，也就是将该事件设置为捕获事件，那么在捕获阶段时，优先捕获到div，也就是div被优先响应到了，如下图：
![事件捕获设置](事件捕获设置.png)

如果我们在div中的event调用了*stopPropagation()*方法时，将或阻止事件继续往上冒泡，如下图：
![阻止事件冒泡](阻止事件冒泡.png)

从上述的事件流我们可以看出，
### 五、事件使用，注册事件处理程序
1. on + 事件名，比如onload，事件迷你过程必须为小写的名称，但只能写一个事件监听器，重写则会覆盖调之前的
> elt.onclick = function(e){}
2. addEventListener，追加事件处理程序
> elt.addEventListener('click', function(e){})

针对上述两种注册处理程序，其回调函数中的`this`关键词指向的是元素本身，与e中的eventTarget属性指向的是同一个元素，该函数的返回值true/false，代表告知浏览器是否要执行这个事件的相关默认操作，
比如a默认是链接跳转，input输入框默认赋值界面展示。
🤔 既然有两种设置注册监听的程序方式，那么我们应当采取哪种比较好呢？
👉 一般使用`addEventListener`优于`on+事件名`，主要有以下几个好处：
+ addEventListener允许给一个事件注册多个监听器，特别是在AJAX库，JavaScript模块；
+ addEventListener提供了一种更精细的手段来控制*listener*的触发阶段，也就是可以通过捕获或者冒泡；
+ 对任何的DOM元素都是有效的，也对其他像XMLHttpRequest有效的
