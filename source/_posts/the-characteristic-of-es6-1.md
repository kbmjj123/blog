---
title: ES6的特性(一)
author: Zhenggl
date: 2021-12-14 08:06:58
categories:
- [javascript]
tags:
- javascript
- es6
cover: characteristic-cover.png
---

### 前言
> 从本章节开始，这边将会将ES6的新增的语法以及规范加入到学习的行列中，提高团队编码能力，提高代码可读性，提高代码运行效率，优化项目架构等！！！

### ES6整体一览
![ES6整体一览表](the-structure-of-es6.png)

根据以上ES6整体一览表，这边从各个节点进行每个章节的学习，从第一章`语法`开始

### ES6新增语法
首先先来看一下一整张图关于ES6新增的语法架构图
![ES6语法架构图](ES6新增语法.png)

#### 1、块级作用域
在ES6之前，我们表示一个块级作用域的方式有：`function`，利用*IIFE*将变量给保护起来，达到局部块级作用域的目的
在ES6之后，出现了`let` + `const`，并以`for`、`if`、`function`等角色结合，实现了一个个的块级的作用域，我们可以知道`let`关键词主要是夹持上下文，达到访问局部作用域的目的。具体如何使用，这个就不在详细描述了。
```javascript
  let a = 123;
  if(a > 0){
  	// a作用域
  	let b = 234;
  	if(b > 0){
  		// b作用域
  		let c = 345;
  		console.info(a, b, c);  // 这里在形成块级作用域的同时，也满足块级作用域的访问规则
  	}
  	console.info(c);  // 这里将会报错，因为c只在上面的作用域b中定义，仅在b作用域内有效
  }
```
✨`【编码习惯】`一般的我们是在块级作用域的最顶端用let/const定义变量，这个是良好编码的一个习惯，同时也能够让团队成员能够更加清晰代码逻辑。

`const`用于定义*常量*，这里一般定义一个变量不可变，这里的不可变指的是内容/指向地址不可变，若是一对象，则对象中的属性还是可变的，除非是对该对象进行其他的处理，比如冻结该对象：Object.frozen(obj)。

#### 2、展开/收集运算符(...)
ES6引入了一个新的运算符：...，通常成为spread或rest(展开或收集)运算符，这名字的命名取决于它在哪里/如何使用。
![展开与收集的辨别](展开与收集.png)
#### 3、解构
将数组或者对象属性中带索引的值手动赋值看作结构化赋值，ES6新增了一种专门用于数组解构和对象解构，减少了临时变量的创建，增强可读性，而不用通过一步步的`.操作符`或者是`计算属性[...]`对对象一个一个的展开。
```javascript
  var bar = {
	a: 1, b:2, c:3
  };
  var {a, b, c} = bar;
  console.info(a, b, c);  // 1, 2, 3
  var foo = [1, 2, 3];
  var [e, f, g] = foo;
  console.info(e, f, g);  // 1, 2, 3
```
⚠️假如上述的`{a, b, c}`这里忽略了var/let/const的变量定义符，那么必须要将其用括号括起来，避免与原本的块代码混淆了：({a, b, c} = bar;)
✨计算属性的应用，计算属性可用来作用对象解构的动态属性，对于动态值的获取很有帮助，这也就是为什么我们在vue/微信小程序等js语法中，在改变data对象中的数组的某个下标的某个属性值的时候，利用动态计算属性，可以做到单独修改
某个埋藏的比较深的变量。
```javascript
  var data = {
	list: [
		{
			id: 1,
			name: '名称'
		},
		{
			id: 2,
			name: 'another name'
		}
	]
  };
  // 微信小程序写法
  this.setData({
    [`list${index}.name`]: 'new name'
  });
  // vue写法
  this.list = this.list.map((item, index) => {
  	return {...item, currentIndex === index ? 'new name': name};
  });
```
👉这里提供关于对象与数组的互转的两套方案，可以加深对于对象/数组的解构的理解与使用
```javascript
  // 将对象转换为数组
  var o1 = {a: 1, b:2, c:3};
  var array1 = [];
  ({ a: array1[0], b: array1[1], c:array1[2] }  = o1);
  // 将数组转换为对象
  var array2 = [1, 2, 3];
  var o2 = {};
  ([o2.a, o2.b, o2.c] = array2);
  // 另外附带一个经典的例子-->交换两个变量的值
  var x = 10, y = 20;
  ([x, y] = [y, x]);
```
🤔如果要对一个对象中的某个属性进行赋值，然后不小心写多了对同个属性名的值的解构的话，那么这个时候，会发什么事情呢？？？
```javascript
  var {a: x, a: y} = {a: 1};
  console.info(x, y); // 1, 1
```
上述的代码，将会出现x = y = 1的这种情况，因此如果出现对象中同一个属性进行解构的话，那么其中会有一个赋值副作用的产生。
以下介绍关于解构的高级用法：
1. 与spread/rest的配合：如果`...展开/收集符`出现在数字解构的位置，就会对应的执行收集动作，将相关的值给收藏起来进行存储。
```javascript
  var [b, ...c] = [1, 2, 3, 4]; 
  console.info(b, c); // 1, [2, 3, 4]
```

2. 与函数默认表达式的配合：提供一个可以用来给变量赋上默认值的操作，避免使用a||''的方式；

👉在解构赋值的时候，我们可以提供类似于函数默认参数值的方式，给即将赋值的变量一个默认的值，减少x||''的情况，
```javascript
  var { a = 1, b = 2, e = 5 } = {a: 1, b: 2, c: 3};
  console.info(a, b, e);  // 1, 2, 5
```

3. 嵌套解构：采用与对象/数组同个编写格式/编写方式的模式，实现将对象中的属性值一一按需获取的方式；
4. 解构参数：对函数中的参数进行赋值解构，可以让我们得到在任何位置上的可选参数功能，大大提高了函数定义与调用的灵活性，
```javascript
  function foo({x, y}){ console.info(x, y) }  // 直接输出对象中的x + y的值
```

👉解构嵌套，平时经常遇到比较复杂的对象，那么我们也是可以利用嵌套解构的方式，来取的我们所想要的值的
```javascript
  var app = {model: {user: function(){}}};
  var {model:{user: myfun}} = app;
  myfun();
```
通过上面这种方式，我们可以根据app对象的结构，编写出对应的需要从其中获取的变量赋值。

#### 4、默认参数值
通过在函数中传递参数的时候，同时给参数赋值默认的值，可以帮助我们在*未传递参数*或者是*传递的undefined参数*的情况下，使参数自动有一个默认值，这可以大大减少我们日常函数设计中的一个非空判断等操作，提供默认的动作。
```javascript
  function foo(x = 123){
	// ...
  }
  foo();  // x = 123
  foo(undefined); // x = 123
  foo({});  // x = 123
  foo(1); // x = 1
```
上述函数foo在未参数或者是`undefined`的情况下，默认取到123的值。
✨函数默认参数值不单单可以是一个简单值，还可以是是任意合法的表达式，甚至是函数调用，比如有以下的例子：
```javascript
  function bar(val){
	console.info('bar call!');
	return y + val;
  }
  function foo(x = y + 3, z = bar(x)){
	console.info(x, z);
  }
  var y = 7;
  foo();  // bar call!
          // 10, 17
  foo(20);  // bar call!
            // 20, 27
  y = 10;
  foo(undefined, 10); // bar call!
                      // 13, 10
```
根据上面程序，这里有两个点需要注意下的：
1、默认值表达式是惰性求值的，这意味着他们只在需要的时候运行，也就是在参数未undefined/🈚️的情况下生效；
2、函数声明中形式参数是在他们自己的作用域中的，而不是在函数整体作用域中，这意味着在函数体中优先匹配，匹配不到变量的定义，才会到外部作用域中寻找，这个符合作用域气泡寻找规则。

#### 5、对象字面量扩展
1. 简洁属性：{a, b}
2. 简洁方法：{a(){}, b(){}}
关于简洁属性平时在编程的时候就已经耳熟能详了，这里就不在重复了。
⚠️ 关于简洁方法，有一个细节需要注意的是，有某些场景下，不应该使用简洁语法的方式来使用，就是只在不需要这些方法执行递归或者时间绑定/解绑的时候使用，转而采取普通的函数定义方式，比如有一下的场景：
```javascript
  var bar = {
	x: 123,
	a(){
		console.info(this.x);
	},
	b(){
		this.a();
	},
	c(){
		this.b.bind(this, a)();
	},
	d(m, n){
		if(m > n){
			return this.d(n, m);
		}
		return n - m;
	}
  };
```
针对上述的方法d中，这里采用了递归调用的方式，但是我们在实际运行过程中将会发现这里的d方法中的this根本不是我们所想要的当前方法，而是指向了一个未知的方法，因此会报错！
需要针对该方法进行相应的调整：
```javascript
  var bar = {
	d: function d(m, n){
		if(m > n){
			return d(n, m);
		}
		return n - m;
	}
  }
```
✨这里的第二个d方法指向了函数本身，为我们提供了一个完美的用于递归、事件绑定/解绑定等引用————不会和this纠缠也不需要并不可靠的对象引用。

3. super对象
```javascript
  var o1 = {
	foo(){
		console.info('o1: foo');
	}
  };
  var o2 = {
  	foo(){
  		super.foo();
  		console.info('o2: foo');
  	}
  }
  Object.setPrototypeOf(o2, o1);
  o2.foo(); //o2: foo
            //o1: foo
```
`super`只允许在简洁方法中出现，而不允许在普通函数表达式属性中出现，同时也只允许super.XXX访问原型链中的父类属性/方法的方式来使用，不能直接是super()的方式来使用

4. 计算属性名：
用表达式加[...]的方式，可以达到对对象中属性的动态定义。
比如有：
```javascript
  const _target = 'MyProperty_';
  var bar = {
	[`${_target}bar`]: function (){}
  };
```
通过上述这种方式的定义，可以达到统一的定义对象的动态属性。
#### 6、模版字符串
```javascript
  var yyy = 123;
  var xxx =  `hello world ${yyy}`;
  var kkk = `hello world ${2 + 3}`;
  var zzz = `hello world ${(function (){return 123}())}`
```
从上面我们可以看出模版字符串可以是接收变量、表达式、函数调用
省去了我们平时编程过程中疯狂的拼接，而且可读性也比较高，容易接受！
#### 7、箭头函数
```javascript
  // 普通函数
   function saySomeThing(x, y) {
     return `hello world ${x + y}`;
   }
   // 箭头函数
   (x, y) => `hello world ${x + y}`;
```
✨ 箭头函数的定义：包含一个参数列表(可以是0个或者是多个)，然后是=>，接着是函数体，如果函数体的表达式有多行，需要用{...}包裹起来，
而且，如果只有一个表达式的话，那么无需使用{...}，并且可以直接隐藏`return`关键词，默认执行返回结果值。
⚠️箭头函数也支持普通函数的所有功能，包括有
1. 函数参数默认值
```javascript
  (x = 2, y = 1) => x + y;
```

2. 展开/收集参数
```javascript
  (...x) => x.join('#');
```

3. 解构
```javascript
  ({x, y}) => x + y;
```

4. 对arguments、super词法的绑定操作

✨ 箭头函数的目的：将原来的普通函数代码中，去掉`function`、`return`、以及`{...}`等编码输入，减少输入，提高了代码的间接性，以特定的方式改变
`this`的行为特性，保证箭头桉树中的this严格指向外层对象，而不是指向windows，从一定程度上解决了*var self = this;* 这种方式。

假如有以下这样子的一个代码：
```javascript
  var controller = {
	makeRequest: () => {
		this.help();
	},
	help: () => {
	}
  };
```
首先我们可以直接以controller.makeRequest()方式调用到该函数，但是在该函数中调用help会找不到
![this的执行上下文异常问题](this的执行上下文异常问题.png)
这里的makeRequest方法中的`this`指向的是全局的help方法,因此有以下的输出结果：
![this对象调用来自全局对象中的方法](this对象调用来自全局对象中的方法.png)

✨ 我们可以得出以下这样子的一个结论，箭头函数并不是什么时候都可以直接使用，它也有一定的限制性的条件，以下对应整理出箭头函数的使用契机：
1. 如果有一个简单的单句在线函数表达式，其中唯一的语句就是`return`某个计算出的值，且这个函数内部没有`this`引用，且自身没有引用(递归、事件绑定/解绑定)，且不会要求函数执行这些，那么可以安全的来使用箭头函数；
2. 如果有一个内层函数表达式，依赖于包含它的函数中调用`var self = this`或者是`.bind(this)`来确保适当的this绑定，那么这个内层函数表达式可以安全的转为使用箭头函数；
3. 如果内层函数表达式依赖于封装函数中某种像`var args = Array.prototype.slice.call(arguments)`来保证arguments的词法复制，那么这个内层函数可以转为箭头函数；
4. 【其他情况】函数声明、多语句的函数表达式、需要递归调用等的函数，都应当避免使用箭头函数。

#### 8、for...of循环
ES6新增了一个`for...of`的语法，用于循环一个`可迭代的对象`，这里可迭代的对象指的是该对象是`iterable`，或者是可以转换/封箱到一个iterable对象的值。
比如有以下的代码：
![for...of循环对比](for...of循环对比.png)
可以看出`for...in`用于在数组的索引上的循环，而`for...of`用于在a的值上的循环。
👉 ES6中默认的内建iterable对象有：
1. Arrays
2. Strings
3. Generators(生成器)
4. Collections/TypedArrays

#### 9、Symbol
ES6引入了一个新的属性类型: *Symbol* ，用来创建类似于字符串但独一无二的值。
```javascript
  var sym = Symbol('koby');
  typeof sym; // symbol
```
⚠️这里🈶️两个点需要注意的是：
1. 不能、也不应该向Symbol(...)使用*new* 关键词，因为它不是一构造函数，也不会创建一对象；
2. 传递给Symbol(...)的参数是可选的，其值仅用来作为区分不同的symbol的友好提示用的字符串而已；
3. typeof symbol输出的是一个新的symbol，这是识别symbol的首选方法；
适用场景：一般可适用于枚举的查找是适用，比如定义一个全局变量symbol，并使用该变量作为唯一关键key，这种仅能适用于但文件中的对于同一个symbol数据类型的变量的访问，symbol仅能被创建一次，因为就算简单是使用symbol来创建同一个标识符的symbol数据类型，他他们都是不相等的。
这里可以配合单利模式的编程思维：
```javascript
  // xxx.js
  const INSTANCE = Symbol('instance');
  function HappyFace() {
  	if(HappyFace[INSTANCE]){
  		return HappyFace[INSTANCE];
  	}
    function smile() {
    }
  	return HappyFace[INSTANCE];
  }
  var me = HappyFace(), you = HappyFace();
  me === you;
```
🤔既然symbol仅在被创建一次，Symbol('a') !=== Symbol('a')，在实际的编程情况中，一旦我们已经定义了这个数据类型的变量，那么我们想要在其他的编程逻辑中访问到该变量的话，应当如何实现才能够继续访问到这个变量呢？
这里可以使用`Symbol.for("a")`来解决这个问题。
✨如果我们将这个Symbol类型的变量来作为一个对象的一个属性，那么该属性就是不可枚举的，这也就是Arrays类型的数据可以使用for...of来消耗它的迭代的原因，因为其中定义了[Symbol.intertor]属性，该属性的值是一个函数
