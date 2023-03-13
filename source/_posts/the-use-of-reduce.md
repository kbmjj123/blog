---
title: JavaScript数组reduce总是不会用？看看这5个例子就懂了
author: Zhenggl
date: 2021-04-27 18:15:02
categories:
    - [前端, javascript]
tags:
    - javascript
    - coding
cover_picture: the-use-of-reduce.png
---
### 前言
相信不少初学者都曾经被JavaScript数组的`reduce`方法困扰过，一直搞不明白到底应该怎么来用。
> `reduce`方法是按照顺序对数组每个元素执行某个函数，这个函数接收上一次执行结果作为参数，并将结果传递给下一次调用。
> `reduce`方法用的好的话可以简化复杂的逻辑，提高代码可读性。通过👇几个例子可以帮助快速理解`reduce`的用法。

#### 1、数字数组求和
这是`reduce`最常见的入门级例子。
```javascript
  // 传统的for循环写法如下
  function sum(arr){
	let sum = 0;
	for(const val of arr){
		sum += val;
	}
	return sum;
  }
  // ➡️ 使用了reduce的方式
  function sum(arr) {
    const reducer = (sum, val) => sum + val;
    const initialValue = 0;
    return arr.reduce(reducer, initialValue);
  }
  
  sum([1,3,5,7]); //16
```
`reduce()`函数的第一个参数是一个`reducer`函数，第二个是初始值。在每个数组元素上执行`reducer`函数，第一个参数是"累进值"。累进值的初始值是`initialValue`，并且在每一轮的`reducer`函数调用后更新为`reducer`函数的返回值。

为了帮助理解，可以用`for`循环实现一个简单的`reduce()`函数：
```javascript
  function reduce(arr, reducer, initialValue) {
    let accumulator = initialValue;
    for(const val of arr){
    	accumulator = reducer(accumulator, val);
    }
    return accumulator;
  }
```
#### 2、对象数据数字属性值求和
单看`reduce()`本身，大家更多的是感觉他的羞涩难懂，并没有多大的好处。如果仅仅是简单的数字数组求和，用`for`循环可能来的更加直观一些，但是如果我们跟数组的其他方法(比如`filter`和`map`)结合使用时，才能感受到它的强大和方便。

举个例子，假设有个对象数组，每个对象都有个`total`属性，对这些`total`进行求和：
```javascript
  const lineItems = [
  	{
  		desc: 'egg',
  		quantity: 1,
  		price: 3,
  		total: 3
  	},
  	{
  		desc: 'cheese',
  		quantity: 1,
  		price: 3,
  		total: 3
  	},
  	{
  		desc: 'butter',
  		quantity: 1,
  		price: 3,
  		total: 3
  	}
  ];
  // 用`reduce`可以这样子写
  lineItems.reduce((sum, li) => sum + li.total, 0);
```
这样子是能够得到最终的结果，但是代码的可能组合性没有那么好，可以进行以下的优化，将`total`属性提前提取出来：
```javascript
  const reducer = (sum, li) => sum + li;
  lineItems.map(item => item.total).reduce(reducer, 0);
  lineItems.map(item => item.quantity).reduce(reducer, 0);
  lineItems.map(item => item.price).reduce(reducer, 0);
```
将公共的累加动作抽离出来，与实际的数据无关。
#### 3、求最大值
`reduce()`通常用来求和，但它的功能远不止这个，累进值`accumulator`可以是任意值：数字、null、undefined、数组、对象等等。

举个例子，假设有个日期数组，要找出最近的一个日期：
```javascript
  const dates = [
  	'20200101',
  	'20180223',
  	'20190405',
  	'20180325'
  ].map(item => new Date(item));
```
一种方法是给数组进行排序，招最后一个值，看上去可行，但效率没有那么高，并且用数组默认的`sort`排序是有问题的，它会先转成字符串进行比较，最终结果可能不是我们想要的
```javascript
  const a = [4, 1, 13, 2];
  a.sort(); // [1, 13, 2, 4]
  // 这里用reduce就可以解决
  const maxDate = dates.reduce((max, date) => date>max?date:max , dates[0]);
```
#### 4、分组计数
假设有个对象数组，每个对象上有这个*age*属性：
```javascript
  const characters = [
  	{ name: 'Tom', age: 50 },
  	{ name: 'Jack', age: 29 },
  	{ name: 'Bruce', age: 29 }
  ];
```
要求返回一个对象，对象中包含对age属性的数量统计：{ 59: 1, 29: 2 }
```javascript
  characters.map(char => char.age).reduce((map, val) => {
  	map[val] = map[val] || 0;
  	++map[val];
  	return map;
  }, {});
```
#### 5、Promise动态链式调用
假设有一个异步函数数组，想要按照顺序执行：
```javascript
  const functions = [
  	async function(){ return 1; },
  	async function(){ return 2; },
  	async function(){ return 3; }
  ];
```
如果是静态的*Promise*代码，我们直接在代码中链式调用就可以了，但是如果是动态的*Promise*数组，我们可以用`reduce`串起来：
```javascript
  const res = functions.reduce((promise, fn) => promise.then(fn), Promise.resolve());
  res;  // 3
```
👆的res的结果就等价于`Promise.resolve().then(fn1).then(fn2).then(fn3);`
当然，`reduce`能做的事情还有很多，它本质上是对数组元素执行某个*累进*操作，最终返回单个值。
