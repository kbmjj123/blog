---
title: this的指向
author: Zhenggl
date: 2021-04-20 00:05:56
categories:
    - []
tags:
    - [javascript]
cover_picture:
---

### 前言
在ES5中，关于this的指向，始终坚持一个原理：`** this永远指向最后调用他的那个对象， **`

➡️ 为毛要使用this，这里引入一段话：
```
    从前有座山，
    山里有座庙叫做神庙，
    神庙里面有好多和尚，
    和尚们都很喜欢神庙，
    于是和尚们都经常跳水到神庙。
```
读上面的一段话，现实中显然比较拗口，我们一般会使用"这"或者其他替代词，调整后如下：
```
    从前有座山，
    山里有座庙叫做神庙，
    这里面有好多和尚，
    和尚们都很喜欢这，
    于是和尚们都经常跳水到这。
```

首先我们来看一个最简单的例子：
#### 例1：
```javascript
  var name = 'windowsName';
  function fun(){
	console.log(this.name);   // --> windowsName
    console.log('inner: ' + this);  // inner: Window
  }
  a();
  console.log('outer:' + this);   // --> outer: Window
```
👆大家应该都知道为什么log的都是windowsName，因为格局刚刚的那句话`this永远指向最后调用它的那个对象`，我们看最后调用`fun`的地方`fun()`，前面
没有调用的对象，那么就是全局对象window，这就相当于是window.fun()，*注意，这里我们没有使用严格模式，如果使用严格模式的话，那么全局对象就是undefined，那么就会报错`Uncaungh TypeError: Cannot read property 'name' of undefined.`*

再看看👇这个🌰
#### 例2：
```javascript
  var name = 'windowsName';
  var obj = {
  	name: 'Boky',
    fun: function (){
  		console.log(this.name);
    }
  };
  obj.fun();
```
在👆这个🌰中，fun函数是被obj调用的，因此打印出来的name的值就是Boky.

再看看一个比较坑的🌰
#### 例3：
```javascript
  var name = 'windowsName';
  var obj = {
  	name: null,
    fun: function (){
  		console.log(this.name);
    }
  };
  var f = obj.fun;
  f();
```
从上面我们可以看到将obj的fun作为一个方法直接给f指向了，然后再由window对象来调用，因此上面的this指向是window

再来看一个例子：
#### 例4：
```javascript
  var name = 'windowsName';
  function fn(){
  	var name = 'Koby';
  	innerFun();
  	function innerFun(){
  		console.log(this.name); // windowsName
    }
  };
  fn();
```
### this的指向
#### 1、默认绑定
这个是windows的默认绑定方式
#### 2、隐式绑定
声明一个function，默认是window来调用的，然后用一对象的某个属性来指向这个function，然后调用该对象的function，则指向的是对象。
#### 3、硬绑定
通过函数call、apply、bind来改变this的指向，定义一方法，默认是window调用的，通过call/apply/bind，将函数绑定到某个对象上来执行，因此指向的是对象。
#### 4、通过构造函数的绑定：new
> 通过`new`修饰符，则是调用了构造函数，
> 这看起来就像是创建了新的函数，但实际上JavaScript函数是重新创建的对象；
```javascript
  function myFunction(arg1, arg2){
    this.arg1 = arg1;
    this.arg2 = arg2;
  }
  var obj = new myFunction('Koby', 'Bryant');
  obj.arg1; // --> Koby
```
这里需要补充一个知识点：`new`的过程：
```shell
  var obj = new myFunction('Koby', 'Bryant');
  new myFunction{
    var obj = {};
    obj.__proto__ = myFunction.prototype;
    var result = myFunction.call(obj, 'Koby', 'Bryant');
    return typeof result === 'obj'?result:obj;
  }
```
从上面的伪代码，我们可以整理对应的以下流程：
1. 创建一个🈳️的对象obj;
2. 将新创建的空对象的隐式原型指向myFunction的显式原型；
3. 使用call改变this的指向，这里调用完成后，obj就拥有了2个属性了；
4. 如果无返回值或者返回一个非对象值，则将obj返回作为新对象。