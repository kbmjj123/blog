---
title: ES6的特性(二)
author: Zhenggl
date: 2021-12-21 11:05:52
categories:
- [javascript]
tags:
- javascript
- es6
cover_picture: characteristic-cover.png
---
### 前言
采用通用模块来组织和复用代码，能够显著提高代码的可读性与可礼节性。  
ES6较ES5还是增加了不少的方便开发者组织代码结构的知识点的，具体描述如下：
![ES6代码结构组织](ES6代码结构组织.png)

### 一、生成器

### 二、迭代器
> 什么是迭代器？为什么要使用迭代器？如何使用迭代器？

#### 1、迭代器额概念
迭代器是一种结构化的模式，用于从源头一次一个的方式来取得数据，有序的、连续的、基于拉取的用于消耗数据的组织方式。
*ES6实现的是为迭代器引入一个隐士的标准化协议，使得我们可以自己来实现这样一个接口，达到进行该模式下的数据组装以及数据提取模式*

#### 2、迭代器的组成
##### 2.1、迭代器协议
```javascript
  Iterator[required]{
	next(){}[required]  //:取得下一个IteratorResult
	return(){}[optional]  // 停止迭代器并返回IteratorResult
	throw(){}[optional] // 报错并返回IteratorResult
  }
  IteratorResult{
	value;  //当前迭代值或者最终返回值
	done;   //布尔值代表当前迭代器完成状态
  }
```
`IteratorResult`指定了从任何迭代器操作返回的值必须是`{value:..., done: true/false}`这种格式的对象
1. next(...)迭代：可迭代对象通过@@iterator()方法来产生一个迭代器(实现了iterator协议的对象)，可用该迭代器来消耗对自身的数据的访问，并且next(...)必须在调用到返回的属性done=false的时候，才会停止调用
2. return(...)向it发送一个信号，表示自己已执行完毕，不会再从中提取任何值，一般用于告知生成器执行可能需要的清理工作，return(...)一般返回类似于next这种结果；
3. throw(...)用于想生成器抛出一个可能的异常，被生成器拦截并处理，然后可以继续往下执行，主要用于与生成器之间的异常通讯操作。

##### 2.2、可迭代协议
> 用来表述必须能够提供生成器的对象
```javascript
  Iterable{
	@@iterator(){method}  //产生一个Iterator
  }
```
@@iterator是一个特殊的内置符号，可用[Symbol.iterator]来代替，该属性的值是一方法，表示可以为该对象产生一个迭代器对象的方法。

🤔 Iterator(实现了迭代器协议的对象)与Iterable(实现了可迭代协议的对象)傻傻分不清？
![可迭代对象与迭代器](可迭代对象与迭代器.png)
从上图我们可以看出两者之间的一个关联关系，两者密不可分，缺一不可。
✨ 可迭代协议(Iterable)允许JavaScript对象定义或者定制自身的迭代行为，在for...of这种消耗迭代的时候，指定哪些值可以被遍历到，实现了该协议的对象，称之为"可迭代对象"，
可迭代对象必须有`@@iterable()`方法，一般可以通过[Symbol.iterator]属性来访问到，一个无参数的函数，其返回值是一个实现了迭代器协议的对象。

当一个对象需要被迭代(比如for...of)的时候，首先会调用该对象的@@iterator方法，返回一个迭代器对象，然后通过该对象的next(...)方法，获取到它的value值以及当前状态done
for...of一个对象obj ---> 调用该对象的@@iterator方法  --->  该方法返回一个迭代器it   --->  通过it.next()来获取当前对象的值
![Array中的iterator](Array中的iterator.png)
通过for...of来迭代一个对象，免去了我们自行去通过@@iterator获取到对象的迭代器，来一步一步迭代消耗对象的便利性。

#### 3、迭代器循环
> 正常使用的一个next方法来迭代这个迭代器对象，但是如果一个迭代器同时也是一个可迭代的对象(即实现了iterable协议的对象)，那么我们可以使用for...of来消耗这个迭代器
以下是for...of的一个实现原理：
```javascript
  for(var v, res; (res = it.next()) && !res.done){
	v = res.value;
	console.info(v);
  }
```
✨ 从之前的迭代器的使用，我们可以知道，next(...)就算是到了最后一项依旧返回的是done=false，必须是在执行多一次next(...)才能够返回的done=true。
同时配合上述的for...of的执行过程的一个模拟，我们可以清楚来的了解到若到了最后一项则会因为done=true，而导致的直接忽略最后一项，因此才有这个done=true才结束执行。

#### 4、自定义迭代器，改写默认的next方法

```javascript
  var Fib = {
	[Symbol.iterator](){
		var n1 = 1, n2 = 1;
		return {
			// 是迭代器成为可迭代对象
			[Symbol.iterator](){
				return this;
			},
			next(){
				var current = n2;
				n2 = n1;
				n1 = n1 + current;
				return {
					value: current,
					done: false
				};
			},
			return(v){
				console.info('Fibonacci sequence abandoned');
				return {
					value: v,
					done: true
				}
			}
		}
	}
  };
for(let v of Fib){
	console.log(v);
}
```

### 三、模块
传统的模块化编程，采用的是函数来作为模块，在函数中隐藏私有成员的访问，并对外暴露公共的API方法/属性。
```javascript
  function XXX(){
	let xx = 1;
	return {
		xx,
		printXX(){
			console.info(xx);
		}
	};
  }
  let xxObj = XXX();
  xxObj.printXX();
```
上述这种方式，如果在不同的js文件中将会生成多个实例对象XX，那么如果我们想要用单例模式来实现仅对一个对象进行访问的话，应当如何实现呢？
```javascript
  // YY.js
  let yyObj = (function YY() {
    let yy = 2;
    return {
    	yy,
    	printYY(){
    		console.info(yy);
    	}
    }
  })();
  yyObj.printYY();
```

✨ ES6提供了一种导入/导出对象、方法、属性的动作：`import/export`
```javascript
  export default {xxx: 123}
  import xxx from '...';
```
这里导出来的，是对变量的绑定，这里有点类似于指针，一般是以单例的形式来访问的，加入其中在被导出来的时候，被改变了其中的属性的话，那么后续其他所有的访问都是改变之后的值的。

🤔 由于`import/export`目前是类似于指针的，是属于单例模式下的编程模式，那么是否可以将这个要存储的信息给进行存储，通过对外暴露的API方法，进行数据的专有入口保存与读取，达到对数据的统一初始化？
答案是肯定可以的，因为这里都是指向的统一的一个对象！！！

🤔 vue编程要求我们在自定义组件的时候，其中的data属性必须为一个函数，由该函数返回一个对象，这里为什么这样子做就能够实现对组件在导入的时候都是不一样的？？
答案：假如这里我们仅仅直接为一个对象，那么通过`export/import`的方式，使得所有不同地方引入的组件中的data是同一个对象，这里将导致初始化赋值的异常问题，而这里采用function来返回对应的对象，是由于function执行结果的一致性，确保每一个被添加进来的组件的初始状态是一致的！

### 四、类
我们知道JavaScript中的"类"与Java等面向对象语言中的"类"两者从本质上有着明显的差别，JavaScript是完全的面向对象开发，在其领域中没有类，没有实例，有的都是对象，其中的"类"只不过是利用
对象的原型链来实现的针对不同对象之间的类似于"类"的继承、多态等操作。

但是在JavaScript中也还是提供了方便快捷构建系统框架的 `class`、`extends`、`super`、`static`关键词，利用这几个关键词的协同配合，可以达到与ES5等的从编码习惯、编码语法上的完全不同的阅读理解，提高编码可读性。
#### 1、class关键词
*概念*：代表一个代码块，其内容定义了一个函数原型的成员，如下：
![class结构一览](class结构一览.png)
上述两者的实现，均可以使用一下的代码来输出：
```javascript
  var foo = new Foo(1, 2);
  console.info(foo.x);  // 1
  console.info(foo.y);  // 2
  console.info(foo.generateXY());
```
⚠️ 尽管*class*实现出来的Foo与ES6之前实现出来的Foo之间的调用方式一样，但是两者还是有比较明显的区别：
1. function Foo可以通过call(...)、apply(...)等方式来正常工作，且可以在使用这些方法的同时，改变this的绑定，从而达到动态改变this，而class Foo必须通过`new`关键词来创建一个对象；
2. function Foo是可以被提升的，一旦定义，就会在其所在的作用域中都可以访问到，而class Foo在使用`new`来实例化之前必须声明；
3. class Foo创建了所在作用域中的一个词法标识Foo，只是占据了一个坑而已，并没有实际的对象的概念，而function Foo则是在所在作用域中创建了一个函数对象，作为该作用域下的一个属性。

🤔 既然class Foo在声明的时候，并没有创建对应的对象，那么`new Foo`的过程是怎样子的呢？它与普通函数的`new`构造调用两者之间有什么区别呢？
```javascript
  var foo = new Foo(1, 2);
```
按照之前的对`new`关键词的学习我们可以得知，`new`构造调用函数的时候，总共有4个步骤：
1. *new*构造调用了函数Foo，创建了一个新的对象x；
2. 将对象x捆绑到函数中的this，并将该对象返回；
3. 用foo指向第二步返回出来的对象；
4. 由于constructor函数指向的是函数本身，因此new Foo实际上是调用的constructor。

✨ class并不是一个真正存在的实体，而是一个包裹着其他像函数和属性这样子的代码块，并把它们组合到一起的一个元概念，并不占据任何的空间，仅仅是一个标识而已，因此在使用之前必须要用*new*关键词来实例化一个对象。

#### 2、extends与super
extends提供了一语法糖，用来在两个函数原型对象之间建立原型链，而不是实际的像Java中的类的继承关系，通过这种方式，免去了ES6之前的通过Object.create(...)或者是Object.setPrototypeOf(...)方式来创建对象之前的关联关系。
在声明函数对象的时候，直接创建其委托关联关系，并在对象属性/方法定义时，可直接通过super来访问到"父类"的属性/方法，大大提高的编码的效率，而且也提高了代码的可阅读行。
![extends的过程](extends的过程.png)

🤔这里是extends使用的一般套路，那么，假如在Foo中创建一个属性m，那么我们是否可以在Bar中的构造方法中访问得到该属性m呢？

答案是否定，在之前我们已经了解到使用class声明出来的只是一个将方法/属性组装到一起的一个代码块，并无分配任何的对象空间，只有在用`new`关键词创建该对象的时候，才真正是创建了一个对象，因此通过`extends`关键词来创建对象之间的关联关系的时候，
`并不能简单的通过在Bar的构造函数中用super.属性的方式来访问到属性，只能是通过super(...)来直接调用`
![super属性的直接访问](super属性的直接访问.png)
那么如果我们还是想直接在Foo中将属性给定义出来，并在子类中使用的话，我们可以是直接以下面的这种方式来定义:
```javascript
  class Foo{
	x = 123;
	//省略以下其他代码...
  }
```

上述代码中`super`关键词由于其在不同的位置代表着不同的意思以及其重要的意义：
1⃣️、在构造函数中的super指向"父类"对象，在方法中指向"父类"原型对象，因此要针对所处的位置进行相应的编码操作；
2⃣️、构造器/函数在声明class时候在内部建立了super引用，因此此时的super是静态绑定到这个特定的类上面的， 并不能通过类似于函数的call/apply/bind来改变this的指向，也就是class+super是静态捆绑关联关系的，而非动态的。
3⃣️、对于子类构造器，若不提供构造函数，其默认的构造函数也是会调用"父类"的构造函数，并自动传递参数，并且只有在调用了"父类"构造函数之后，才能够使用`this`关键词，这里应该是由于拥有了委托关联关系，需要用"父类"来实例化"子类"，从而来创建"子类"之前完成一系列相关的初始化工作；
4⃣️、对内置类的扩展，比如是Array/Error，我们在可以享受到Array提供的便利api的同时，可以通过extends的方式，追加仅在自己项目中有效的自定义数组，而不是改写Array.prototype对象影响到全局这种全局污染的方式。
```javascript
  class MyArray extends Array{
	constructor(props) {
	  super(props);
	}
	push(...item){
		console.info('我要开始来push内容:' + item);
		super.push(item);
	}
  }
```
![自定义Array](自定义Array.png)

👉 实战推荐：在后ES6语言开发过程中，可以尝试多采用class + extends + super的方式，避免this动态绑定操作。

#### 3、static
在通过extends来创建两个对象之间的关联关系的时候，Bar extends Foo，代表着Bar.prototype --> Foo.prototype，与此同时，Bar --> Foo，那么可以在Foo中提供static方法/属性，然后在Bar中也能够在其static方法中访问到该属性/方法，
通过super关键词来访问到
![static关键词的使用](static关键词的使用.png)

⚠️ 这里的static的使用，由于它是作用域Foo/Bar对象上的，因此只能是用Bar.getKK(...)的方式来使用的

🤔 这里我们也️可以是想java那样子，将相关的方法/属性进行static化，然后直接在其他的js文件中直接调用。

