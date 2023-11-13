---
title: 节流与防抖
author: Zhenggl
date: 2021-03-26 15:52:13
categories:
    - [前端, javascript, 基础]
tags:
    - javascript
    - function
cover: debounce-cover.jpeg
---

### 问题引入

**问题1：** 如果要实现dom节点的拖拽功能，但是在绑定拖拽事件的时候发现每当元素稍微移动一点点就会触发大量的回调函数，导致浏览器直接卡死，这个时候，我们应咋整呢？

**问题2：** 如果给一个按钮绑定了表单提交的post事件，但用户有时候在网络比较差的情况下多次点击按钮造成表单重复提交，如果防止多次提交事件的发生？

> 为了应对上述场景，变出现了函数防抖和函数节流两个概念，总的来说，这两个方法是在时间轴上控制函数的执行次数。

### 函数防抖(debounce)
**概念：** `在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。`

**生活中的实例：** `如果有人进电梯(触发事件)，那电梯在10秒钟后触发(执行事件监听器)，这时如果又有人进电梯了(在10秒钟内再次触发该事件)，则我们又得等待10秒再出发(重新计时)`

举个🌰：
```javascript
  // 模拟一段ajax请求
  function ajax(content){
	console.log('ajax requst ' + content);
  }
  let inputA = document.getElementById('unDebounce');
  inputA.addEventListener('keyup', function(e){
      ajax(e.target.value);
  });
  
```
看一下这个运行结果：

![未使用防抖的](no-debounce-input.gif)

➡️ 从上述结果中我们可以看出，只要我们按下这个键盘，就会触发这个ajax请求，不仅从资源上来说这个是很浪费资源的行为，而且在实际应用中，用户也是输出完成的字符后，才会请求的。
下面我们优化一下：
```javascript
  // 模拟一段ajax请求
  function ajax(content){
	console.log('ajax requst ' + content);
  }
  function debounce(fun, delay){
	return function(args){
		var $this = this;
		var $args = args;
		clearTimeout(fun.id);
		fun.id = setTimeout(function(){
			fun.call($this, $args);
		}, delay)
	}
  }
  var inputB = document.getElementById('debounce');
  var debounceAjax = debounce(ajax, 500);
  inputB.addEventListener('keyup', function (ev) { 
  	debounceAjax(e.target.value);
   });
```
再看一下这个运行结果：

![使用了防抖的函数](debounce-input.gif)

可以看到，我们假如了防抖之后，当频繁输入的时候，并不会发送请求，只有当我们在指定的时间间隔内没有输入时，才会执行函数，如果停止输入但是在指定的事件间隔内又输入，会重新触发计时。

再看以下这个🌰：
```javascript
  var biu = function(){
	var date=new Date();
	console.info('biu biu biu', date.getHours() + ':' + date.getSeconds());
  };
  var boom = function (){
  	var date=new Date();
  	console.info('boom boom boom', date.getHours() + ':' + date.getSeconds());
  };
  setInterval(debounce(biu, 500), 1000);
  setInterval(debounce(boom, 2000), 1000);
```
再看看上述代码的运行结果

![使用了setInterval来配合debounce](setInterval-debounce.gif)

这个🌰就很好的解释了，如果在事件间隔内执行函数，就会重新触发计时，👆biu 会在第1.5s执行后，每隔1s执行一次，而boom一次也不会执行，因此它的防抖的时间间隔是2s，而执行时间是1s，所以计时器每次都会被重新开始激活

### 函数节流(throttle)
**概念：** `规定一个单位事件，在这个单位事件内，只能有一次触发事件得回调函数执行，如果同一个单位时间内某事件被触发多次，只有一次能生效`

看一个🌰：

```javascript
  function throttle(fun, delay){
	var last, deferTimer;
	return function(args){
		var $this = this;
		var $args = args;
		var now = +new Date();
		if(last && now < last + delay){
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function(){
				last = now;
				fun.call($this, $args);
			}, delay);
		}else{
			last = now;
			fun.call($this, $args);
		}
	}
  }
  var throttleAjax = throttle(ajax, 1000);
  var inputC = document.getElementById('throttle');
  inputC.addEventListener('keyup', function(e){
  	throttleAjax(e.target.value);
  })
```
看下这个运行结果：

![throttle运行结果](throttle.gif)

从👆可以看到，我们不断输入时，ajax会按照我们设定的时间，每1s执行一次，直接忽略我们疯狂输入的过程，直接1s到了，就拿当前输入框中的值

### 总结
+ 函数防抖和函数节流都是防止某一时间频繁触发，但是这两个动作之间的原理是不一样的；
+ 函数防抖是某一段时间内只执行一次，而函数节流是间隔时间执行。

#### 结合实际应用场景
+ debounce
  - search搜索联想，用户在不断输入值时，用防抖来节约请求资源；
  - window触发resize的时候，不断的调整浏览器窗口大小会不断触发这个事件，用防抖来让其只触发一次；
  - 给按钮加函数防抖防止表单多次提交
  - 判断`scroll`是否滑动到底部，`滚动时间` + `函数防抖`
+ throttle
  - 鼠标不断点击触发，mousedown(单位时间内只触发一次)
  - DOM元素拖拽
  - Canvas画笔功能
> 适合**大量事件**按时间做平均分配触发
