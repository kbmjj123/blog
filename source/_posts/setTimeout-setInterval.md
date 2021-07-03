---
title: setTimeout与setInterval
author: Zhenggl
date: 2021-03-10 16:20:55
categories:
  - [前端, javascript]
tags:
  - javascript
  - 基础概念
---
###  一、setTimeout和setInterval的基本用法
1. setTimeout指定延迟XX秒后执行函数；
2. setInterval指定周期来执行函数；
3. 当我们设置定时器(setTimeout/setInterval)，都会有一个返回值，这个返回值是一个数字，代表当前是在浏览器中设置的第几个定时器(返回的是定时器序号)

 ```javascript
  let timer1 = setTimeout(() => {}, 1000);
  console.info(timer1);   // 1
  
  let timer2 = setInterval(() => {}, 1000);
  console.info(timer2);
 ```
4. 根据👆两段代码可以知道
    * setTimeout和setInterval虽然是处理不同功能的定时器，但都是浏览器的定时器，所以返回的序号是依次排列的；
    * setInterval设置完成定时器会有一个返回值，不管执行多少次，这个代表序号的返回值不变。
5. 定时器的清除
   * clearTimeout(timer)
   *  clearInterval(timer)

`这里定时器即使清除了，其返回值也不会清除，之后设定的定时器返回值也会在之前的返回的基础上继续向后排`

6. 定时器this指向

`**由于定时器的执行，均是有定时器线程发起的，且到了真正该执行回调的时候，是将回调函数塞到事件队列中，待JS主线程空闲的时候，从事件队列中依次获取事件回调，塞到主线程中执行的，因此它的this指向都是window**`
具体可以看以下代码：
```javascript
  let obj = {
	fn(){
		console.info(this)  // obj
		// 示例1
		let timer = setTimeout(function(){
			console.info('我是timer1的this指向：', this); // Window
		}, 1000);
		// 示例2(让定时器函数中的this是obj：使用变量保存的方式)
		let _this = this;
		let timer2 = setTimeout(function(){
			console.info('我是timer2的this指向：', _this);  // obj
		}, 1000);
		// 示例3(让定时器函数中的this是obj：使用bind方法改变this指针)
		let timer3 = setTimeout(
			function(){
				console.info('我是timer3的this指向：', this); // obj
			}.bind(this)
		, 1000);
		// 示例4(让定时器函数中的this是obj：使用箭头函数，箭头函数中的this继承宿主环境(上级作用域中的this))
		let timer4 = setTimeout(() => {
			console.info('我是timer4的this指向：', this); //obj
		});
		
		let timer5 = setTimeout(
			(function($this){
				console.info('我是timer5的this指向：', $this);
			})(this)  // obj
		, 1000);
	}
  };
  obj.fn();
```
对应的执行结果如下：

![setTimeout中this的指向](https://img.91temaichang.com/blog/setTimeout-this.png)

从上述代码执行结果我们可以看出，由于timer5是立即执行代码，并且在执行的时候将this作为参数传递给setTimeout的回调，因此它是最先被执行的；
而且，就算setTimeout设置为0秒执行，它也是按照EventLoop的机制，塞到事件队列中，再从事件队列中获取，比如上图中的timer4；

### 二、定时器疑难杂症

 有以下一个场景情况：
 ```javascript
 function func(i){
	for(let i = 0; i < 5; i ++){
		console.info(`xxx=${i}`);
	}
}
 setInterval(function (){
	func(10);
}, 100);
 ```
上面这个代码块，每隔100毫秒执行func函数，如果func函数的执行时间少于100毫秒的话，则下一个100毫秒都能够执行到func，执行的示意图如下：

![正常的setInterval](https://img.91temaichang.com/blog/interval1.png)

但是，如果func函数的执行时间大雨100毫秒的话，本来应该春发下一个func函数之前的还没有执行完毕，这时应该怎么办？
答案如下图所示，那么第二个func会在队列(EventLoop)中等待，直到第一个函数执行完

![被挂起的setInterval](https://img.91temaichang.com/blog/interval3.png)

如果第一个函数的执行时间超级长，在执行的过程中本来应该触发了许多的func函数的话，这些应该触发的函数都会进入到队列中吗？
`*不，只要发现队列中有一个被执行的函数存在，那么其他的统统忽略*`，如下图所示，在第300毫秒和第400毫秒处的func都被抛弃掉，
一旦第一个函数执行完后，接着执行队列中的第二个，即使这个函数已经"过时"很久了。

![执行过时很久的setInterval回调](https://img.91temaichang.com/blog/interval3.png)

还有一点，虽然在setInterval里面制定的周期是100毫秒，但它不能保证两个函数之间调用的间隔一定是100毫秒。在上面的情况中，
如果队列中的第二个函数是在第450毫秒处结束的话，在第500毫秒时，它会执行第二个func，也就是说这之间的间隔只有50毫秒，并非100毫秒

那如果我想保证每秒执行的间隔应该怎么办？用setTimeout，比如下面的代码：

```javascript
  var i = 1;
  var timer = setTimeout(function(){
  	alert(i ++ );
  	timer = setTimeout(arguments.callee, 2000);
  }, 2000);
```
👆的函数每2秒就递归调用自己一次，你可以在某一次alert的时候等待任意长的时间(不点击alert的确定按钮)，接下来无论什么时候点击"确定"，下一次执行
一定离这次确定相差2秒的，意味着会每隔2秒弹出一个alert。

### 三、setTimeout除了做定时器还能做什么？

假如有一个非常耗时的操作(比如下面的操作，在table中插入2000行)，我想计算这个操作所消耗的事件应该怎么办？
```javascript
var t1 = new Date();
  var tbody = document.getElementsByTagName('tbody')[0];
  for(var i = 0; i < 20000; i ++){
  	var tr = document.createElement('tr');
  	for(var t = 0 ; t < 6; t ++ ){
  		var td = document.createElement('td');
  		td.appendChild(document.createTextNode(i + ',' + t));
  		tr.appendChild(td);
  	}
  	tbody.appendChild(tr);
  }
var t2 = new Date();
console.info(t2 - t1);
```
上述代码发现，一运行就直接打印出来了，在20000行还没有被渲染出来的情况下，可能就1秒左右，这是为毛呢？
因为JS是单线程的，GUI渲染与JS主线程是互斥的，上述代码直接算出了js主线程的执行时间，还没有等tbody渲染20000行的时间，
执行完console.info(t2 - t1)之后，才开始GUI渲染，因此要真正计算出这个操作所消耗的时间，应该如下：
```javascript
var t1 = new Date();
  var tbody = document.getElementsByTagName('tbody')[0];
  for(var i = 0; i < 20000; i ++){
  	var tr = document.createElement('tr');
  	for(var t = 0 ; t < 6; t ++ ){
  		var td = document.createElement('td');
  		td.appendChild(document.createTextNode(i + ',' + t));
  		tr.appendChild(td);
  	}
  	tbody.appendChild(tr);
  }
setTimeout(function(){
	var t2 = new Date();
  console.info(t2 - t1);
}, 0);
```
通过setTimeout将计算耗时的动作塞到事件队列中，根据JS EventLoop的机制，轮一次宏任务的同时刷一轮微任务，然后是GUI渲染，
setTimeout的回调将会到第二次宏任务执行的时候，从事件队列中拿出来放到JS主线程中执行了，这个时候GUI已经刚刚渲染完毕，因此
才能够正确计算出tbody渲染出来所消耗的时间。

👇这个例子也是同样的道理，怎样改进才能看到颜色的变化呢？
```javascript
function run() {
  var div = document.getElementById('xxx');
  for(var i=0xBBBB00;i <= 0xBBBBBB;i++) {
    div.style.backgroundColor = '#'+i.toString(16)
  }
}
```
直接运行上述代码，会发现，浏览器一下子变成#BBBBBB颜色，并没有渐变的效果，这是因为GUI线程与JS主线程互斥，👆代码执行的时候，
直接先轮了一遍从0xBBB000到0xBBBBBB的循环，i的值变成了0xBBBBBB，然后再执行GUI渲染线程，所以效果就是直接变0xBBBBBB，
那么我们如果想要看它的一个颜色变化的过程，应该如何调整呢？
```javascript
function run() {
  var div = document.getElementById('xxx');
  for(var i=0xBBB000;i <= 0xBBBBBB;i++) {
  	(function (color){
  		setTimeout(function(){
  			div.style.backgroundColor = '#'+color.toString(16);
  		}, 0);
  	})(i);
  }
}
```
首先用立即执行的函数来包裹，防止在JS主线程直接将i直接过渡到0xBBBBBB后再执行里面的函数，并且缓存i临时变量传递给color，
然后用setTimeout将变色任务甩出去，进入到事件队列中，每次轮一次宏任务的同时，刷一遍微任务，并执行GUI渲染。
