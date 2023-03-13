---
title: js日常coding小技巧二
author: Zhenggl
date: 2021-05-06 14:07:46
categories:
    - [前端, javascript]
tags:
    - javascript
    - coding
cover_picture: js-coding-pratise.jpg
---

### 编写JavaScript的5个小技巧
自从知道了这几个**JavaScript**技巧，下班都变早了！

#### 1、加号操作符+
这里说的不是数字的简单相加，而是将表达式转成数字的操作符。
```javascript
  console.log(+new Date()); //1620288834588
  console.log(+true); // 1
  console.log(+false); // 0
  const random = {
  	// 重载对象的valueOf方法
  	valueOf: () => Math.floor(Math.random() * 100)
  };
  console.log(+random); // 4
  console.log(+random); //23
  console.log(+random); //30
```
刚接触JavaScript的新手可能觉得这种写法有点即乖，数字类型转换会倾向于用`Number()`函数。结果是一样的，但是用`+`就简洁多了。如果某个对象重载了`valueOf`方法，`+`操作符会返回这个方法的结果

#### 2、debugger语句
在浏览器 DevTools 上打断点调试，基本上人人都会。但是你知道怎么在代码里标记断点吗？没错，就是用`debugger`语句。当你想快速断点到某个指定代码位置时，这个技巧就比较方便了。

#### 3、逗号操作符
这里说逗号是指的表达式里的逗号操作符，比如`const a = (1, 2);`，a的值就是2。逗号操作符让多个表达式按顺序执行，并返回最后一个表达式的值，这可以让代码更简洁
```javascript
  let money = 10;
  const hasStudied = false;
  const relax = () => console.log('relax');
  const study = () => console.log('study');
  hasStudied ? (money++, relax()) : ((money /= 2), study());
  // 批量定义多个变量
  for(let i = 1, j = 2; j + i < 10; i++, j++);
  // 不改变现有方法实现的情况下，增加逻辑
  <button @click="visible=false,onConfirm()"></button>
```
#### 4、集合对象Set
这是ES6引入的数据结构，集合类型`Set`，特性是不包含重复元素。
```javascript
  // 数组去重
  const arr = [1, 1, 7, 5, 6, 6, 6, 8, 7];
  // 传统方式
  let noDup = arr.filter((item, index) => arr.indexOf(item) === index);
  // 用Set方式
  noDup = [...new Set(arr)];
  console.log(noDup); // 1 7 5 6 8
 
```
#### 5、原生Date操作
一般情况下，很多开发童鞋，一提及到日期操作，必用到moments.js之类的库，这里并不是收不能用，是仅仅用它的几个api，有点大材小用了，这里其实理解了原生的原理和逻辑后，我们可以很快地写一个自己的：
```javascript
  function formatDate(date, format) {
    var calendar = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    format = format || 'Y-m-d';
    var dateObj = new Date(date);
    if(isNaN(+dateObj)){
    	return 'Invalid Date';
    }
    var year = dateObj.getFullYear(),
      month = dateObj.getMonth(),
      day = dateObj.getDate();
    return format.replace('Y', year).replace('m', month).replace('d', day).replace('M', calendar[month - 1]);
  }

  const day1 = new Date();
  day1.setDate(-1); // 直接查询前一天这个时间点
  
```
