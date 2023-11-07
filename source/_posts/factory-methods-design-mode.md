---
title: 每天一设计模式-工厂方法模式
author: Zhenggl
date: 2022-03-03 20:06:56
categories:
    - [javascript, 设计模式]
tags:
    - javascript
    - 设计模式
    - 创建对象
cover: 工厂方法模式.jpeg
---

### 前言
工厂方法模式是通过对产品类的抽象使其创建业务主要负责用于创建多类产品的实例，按照之前的介绍，如果随着业务的开展，需求不断的增加，假如使用`简单工厂模式`，那么我们需要添加对应的类，以及在工厂函数中新增对应的case分支代码，
来创建对应的实例。
将原本的工厂方法，当作一个类对象，需要新增的需求，都只需要通过在该类中的不同属性来对应创建不同的实例对象即可，且不同的实例对象它们之间共享着由工厂方法提供的共同属性。
⚠️ 由于是工厂方法，有可能在使用过程中，不小心当作普通的方法来调用了，因此可以采取将方法保护起来的方式

### 安全的方法工厂类
```javascript
  var Factory = function(type, content) {
    if(this instanceof Factory){
    	// 正常使用了new关键词来调用Factory方法对象
    	return this[type](content);
    }else{
    	// 若不是正常
    	return new Factory(type, content);
    }
  }
```

### ES5代码
```javascript
// 用于创建在一个页面中不同功能的按钮
  var Factory = function(type, content, action) {
    if(this instanceof Factory){
    	// 正常使用了new关键词来调用Factory方法对象
    	return this[type](content, action);
    }else{
    	// 若不是正常
    	return new Factory(type, content, action);
    }
  };
  Factory.prototype = {
  	LoginBtn: function (name, action){
  		this.name = name;
  		this.action = action;
  		(function(name, action) {
  		  var div = document.createElement('div');
  		  div.innerHTML = name;
  		  div.style.border = '1px solid red';
  		  div.style.margin = '12px';
  		  if(typeof action === 'function'){
  		    div.addEventListener('click', function(){
  		    	action(name);
  		    });
  		  }
  		  document.getElementById('container').appendChild(div);
  		})(name, action);
  	},
  	ForgetPwdBtn: function (name, action){
  		this.name = name;
  		this.action = action;
  		(function(name, action) {
  		  var div = document.createElement('div');
  		  div.innerHTML = name;
  		  div.style.border = '1px solid blue';
  		  div.style.margin = '12px';
  		  if(typeof action === 'function'){
  		    div.addEventListener('click', function(){
  		    	action(name);
  		    });
  		  }
  		  document.getElementById('container').appendChild(div);
  		})(name, action);
  	}
  };
  var buttonArray = [
  	{
  		type: 'LoginBtn', name: '登录', action: function(name) {
  			console.info('点击了' + name);
  		}
  	},
  	{
  		type: 'ForgetPwdBtn', name: '忘记密码', action: function(name) {
  			console.info('点击了' + name);
  		}
  	},
    {
  		type: 'LoginBtn', name: '登录', action: function(name) {
  			console.info('点击了' + name);
  		}
  	},
  	{
  		type: 'ForgetPwdBtn', name: '忘记密码', action: function(name) {
  			console.info('点击了' + name);
  		}
  	}
  ];
  buttonArray.forEach(function (value) { 
    new Factory(value.type, value.name, value.action);	
  });
```
上述程序的一个输出结果如下：
![工厂方法模式输出结果](工厂方法模式输出结果.png)
通过上述的方式，将一个数组按钮配置，对应渲染为页面的一个个按钮div节点，并对其进行赋值，这里工厂方法的原型对象中的每一个属性代表一个对象，原本表面执行的`new Factory`创建一个工厂对象，实际上是通过传递参数，
告知工厂，拿传递过来的信息去创建对应的对象，从而来创建不同的一类对象实例。

🤔 这里👆的代码中对于每个实例对象来说，还是带用重复性的代码，如果将这个代码给抽离起来的话，那么应该可以做到代码更加简洁

### 优化后的ES6代码
```javascript
  // SuperBtn.js
  export default class SuperBtn {
	constructor(props) {
	  let { name, color, action } = props;
	  this.name = name;
	  this.action = action;
	  this.color = color;
	}
	render(){
		var div = document.createElement('div');
		div.innerHTML = this.name;
		div.style.border = '1px solid ' + this.color;
		div.style.margin = '12px';
		if(typeof this.action === 'function'){
		    div.addEventListener('click', () => {
  		   	  this.action(this.name);
  		   });
  		}
  		document.getElementById('container').appendChild(div);
	}
  }
```

```javascript
  // Factory.js
  import SuperBtn from './SuperBtn.js';

export default class Factory{
	constructor() {
	}
	loginBtn(action){
		return new SuperBtn({
			name: '登录',
			color: 'red',
			action: action
		}).render();
	}
	forgetPwdBtn(action){
		return new SuperBtn({
			name: '忘记密码',
			color: 'green',
			action: action
		}).render();
	}
  }
```

```vue
<script>
  import Factory from './factory/Factory.js';
    export default {
        name: 'App2',
    
        mounted(){
            var factory = new Factory();
            factory.loginBtn((content) => {
                console.info(content);
            });
            factory.forgetPwdBtn((content) => {
                console.info(content);
            });
        }
    }
</script>
```
对应的输出结果是：
![ES6.0的工厂方法结果](ES6.0的工厂方法结果.png)
这里我们采用ES6.0的方式，将原本`Factory`工厂类中的方法，编程一个个的返回一个公共的组件：SuperBtn，通过在这个公共组件中封装了对应的属性以及方法，提供统一的一个render函数，来将自己给渲染出来
