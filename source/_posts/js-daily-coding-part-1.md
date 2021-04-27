---
title: js日常coding小技巧一
author: Zhenggl
date: 2021-04-27 09:17:02
categories:
    - [前端, javascript]
tags:
    - javascript
    - coding
cover_picture:https://img.91temaichang.com/blog/js-coding-pratise.jpg
---

### 编写JavaScript的10个小技巧
> 简介的代码不但方便阅读，还能减少复杂逻辑和出错的可能性。
> 本文就介绍一些常用的`JavaScript`简化技巧，日常开发都用得上。

#### 1、简化条件表达式
经常碰到这种情况，要判断某个变脸是否为指定的某些值，用常规的逻辑表达式会很长，我们可以将它们都放到数组中来进行判断
```javascript
  // 太长的逻辑表达式
  if('abc' === xxx || 'def' === xxx || 'sdf' === xxx || 'oop' === xxx){
  	//执行其他逻辑
  }
  //➡️  简写后的版本
  if(['abc', 'def', 'sdf', 'oop'].includes(xxx)){
  	// 执行其他逻辑
  }
```
#### 2、简化if...else...
`if...else...`太常用了，以至于很多人都忘记了其实还有更好的方式来进行的条件判断，比如一些简单的赋值操作，就没有必要进行冗长的语句，一行表达式就可以搞定了：
```javascript
  // 冗长的写法
  let test = true;
  if(x > 100){
  	test = true;
  }else{
  	test = false;
  }
  //➡️ 简写后的版本一
  let test = (x > 100) ? true : false;
  // ➡️ 简写后的版本二
  let test = x > 100;
```
三元运算符可以做复杂的条件分支判断，不过牺牲了一些可读性：
```javascript
  let x = 300;
  let test = (x > 100)? 'greater 300': (x < 50)? 'less 50': 'between 50 and 300';
```
#### 3、判空并赋值默认值
Code Review的时候，我们经常会看到这样子的代码，判断变量不是`null`，`undefined`，`''`的时候赋值给第二个变量，否则给个默认值：
```javascript
  if(first !== null || first !== undefined || first !== ''){
	let second = first;
  }
  // ➡️ 简写后的版本
  let second = first || '';
```
#### 4、简写循环遍历
`for`循环是最基本的，但有些繁琐，可以用`for...in`，`for...of`或者`forEach`替代：
```javascript
  // 正常for的写法
  for(let i = 0; i < 10; i ++);
  // ➡️ 简写后的版本
  for(let i in testData);
  for(let i of testData);
  [11, 23, 33].forEach(function(item, index){
  	console.log(`test[${index}] = item`);
  });
```
#### 5、简化switch
这个技巧也很常用，把`switch`转成对象的`key-value`形式，代码简洁多了：
```javascript
  // 冗长的写法
  switch(data){
	case 1:
		test1();
		break;
	case 2:
		test2();
		break;
	case 3:
		test3();
		break;
  }
  // ➡️ 简写后的写法
  var obj = {
	1: test1,
	2: test2,
	3: test3
  };
  obj[data] && obj[data]();
```
#### 6、简化多行字符串拼接
如果一个字符串表达式过长，我们可能会拆成多行拼接的方式，不过随着ES6的普及，更好的方式是用模版字符串：
```javascript
  // 之前冗长的写法
  let data = 'ab ab aba ab ab \n\t' + 'test, test, test';
  // ➡️ 简写后的写法
  let data = `ab ab aba ab ab 
            test, test, test`;
```
#### 7、善用箭头函数简化return
ES6的箭头函数真是个好东西，当函数简单到只需要返回一个表达式时，用箭头函数最合适不过了。`return`都不用写：
```javascript
  // 箭头函数出现之前的写法
  function getArea(dia){
	return Math.PI * dia;
  }
  // ➡️ 简写后的写法
  const getArea = dia => Math.PI * dia;
```
#### 8、重复字符串N次
有时候出于某种目的需要将字符串重复N次，最笨的方法就是使用`for`循环拼接，其实有更简单的方法就是`repeat`：
```javascript
  // for循环写法
  let test = '';
  for(let i = 0; i < 5; i ++){
  	test += 'test';
  }
  // ➡️ 简写后的方式
  let test = 'test'.repeat(5);
```
#### 9、指数运算
能省则省，低碳环保
```javascript
  // 正常写法
  Math.pwo(2, 3); // 8
  // 节省后的写法
  2**3; // 8
```
#### 10、数字分隔符
这个是比较新的语法，ES2021提出来的，数字字面昂可以用下划线分割，提高大数字的可读性：
```javascript
  // 旧语法
  let number = 981223145;
  // 新语法
  let number = 981_223_145;
```
