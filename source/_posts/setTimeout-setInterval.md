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
    1. 指定延迟XX秒后执行函数；
    2. 指定周期来执行函数；
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

