---
title: Vue指令学习与实际应用场景
author: Zhenggl
date: 2022-03-03 08:44:56
categories:
tags:
cover: vue指令封面.jpeg
---

### 前言
> 在Vue2.0中，代码复用和抽象的主要形式是组件，然而，有时候需要对普通DOM元素进行底层操作，这个时候就可以使用自定义指令，来满足业务诉求。

### 指令钩子函数和参数说明
![Vue指令组成](Vue指令组成.png)

### 如何使用指令
> 自定义指令需要使用，则必须先注册，Vue自定义指令，可以有局部注册和全局注册两种方式，
+ 全局注册：Vue.directive(id, [definition])，然后在入口文件中调用Vue.use()
+ 局部注册：在对应的*.vue组件文件中的`directive`属性中编写

✨ 一般情况下，需要使用到指令说明是需要全局公用的，不然就没有太多的必要来定义这个指令了，而且一般这个指令可以有多个，这边可以是编写一个统一的入口文件，实现指令的一个批量注册，以便于后续直接使用,
比如有以下的一个入口文件：
```javascript
  import copy from './modules/copy';
  import longpress from './modules/longpress';
  const directives = {
  	copy, longpress
  };
  export default {
  	install(Vue){
  		Object.keys(directives).forEach(key => {
  			Vue.directive(key, directives[key]);
  		});
  	}
  }
```
然后在对应的入口文件(一般是main.js)处进行引入并调用
```javascript
  import Vue from 'vue'
  import Directives from '@/directives';
  Vue.use(Directives);
```

### share几个指令的例子
🤔 本来vue已经提供足够便捷的组件开发模式的方式来编写我们的代码了，那为毛还要多整一个指令呢？
比如🈶️以下一个场景：有一个业务系统，需要根据不同的人所分配的不同角色进行页面功能的访问，并且能够精确到按钮级别的控制，本来我们可以简单的通过v-if来控制按钮级别元素的展示以及隐藏，
但是这样子的话，假如项目中有100个以上的按钮需要进行对应的控制，那不是我们将
👇 分享几个比较实用的Vue自定义指令，减少重复的代码逻辑的处理，做到一键配置并使用

#### 1、赋值粘贴指令`v-copy`
需求：实现一键赋值文本内容，用于鼠标右键粘贴

思路：
1. 动态创建textarea标签，并设置readOnly属性以及将其移出可是区域；
2. 将要赋值的值赋给textarea标签的`value`属性，并将textarea插入到body；
3. 选中textarea的值并执行复制操作；
4. 将body中插入的textarea移除掉；
5. 第一次调用时绑定事件，在解绑时移除事件

代码实现：
```javascript
  // copy.js
  export default {
	bind(el, binding){
		let value = binding;
		el.$value = value;
		el.handler = () => {
			if(!el.$value){
				console.error('暂无复制内容');
				return;
			}
			const textarea = document.createElement('textarea');
			textarea.readOnly = 'readonly';
			textarea.style.position = 'absolute';
			textarea.style.left = '-99999px';
			// 对textarea进行赋值操作
			textarea.value = el.$value;
			// 将textarea插入到body中
			document.body.appendChild(textarea);
			// 选中待复制的内容
			textarea.select();
			const result = document.execCommand('Copy');
			if(result){
				console.info('复制成功');
			}
			document.body.removeChild(textarea);
		};
		// 捆绑元素的点击事件
		el.addEventListener('click', el.handler);
	},
	componentUpdated(el, binding){
		el.$value = binding.value;
	},
	unbind(el){
		el.removeEventListener('click', el.handler);
	}
  }
```

指令使用：
```vue
  <template>
    <button v-copy="待复制的内容">点我复制</button>
  </template>
```
🤔 思维升级：
将元素的属性挂在在el节点上，是为了方便其他方法中对这个进行共享访问到，如果这里需要针对不同业务场景下进行不同的提示操作，比如时toast或者是modal的方式来展示的话，应该可以怎样改造呢？
👉 这边能够想到的就是针对binding的value属性进行改造

```javascript
  // copy.js
  export default {
	bind(el, binding){
		let value = binding;
		if(typeof value === 'object'){
			// 对value进行升级改造，调整为支持对象的方式
			let { content, callback } = value;
			el.$value = content;
			el.$callback = callback;
		}else if(typeof value === 'string'){
			// 采用的默认展示方式
			el.$value = value;
		}
		el.handler = () => {
			if(!el.$value){
				console.error('暂无复制内容');
				el.$callback && el.$callback('暂无复制内容');
				return;
			}
			const textarea = document.createElement('textarea');
			textarea.readOnly = 'readonly';
			textarea.style.position = 'absolute';
			textarea.style.left = '-99999px';
			// 对textarea进行赋值操作
			textarea.value = el.$value;
			// 将textarea插入到body中
			document.body.appendChild(textarea);
			// 选中待复制的内容
			textarea.select();
			const result = document.execCommand('Copy');
			if(result){
				console.info('复制成功');
				el.$callback && $callback('复制成功');
			}
			document.body.removeChild(textarea);
		};
		// 捆绑元素的点击事件
		el.addEventListener('click', el.handler);
	}
  }
```

#### 2、长按指令`v-longpress`
需求：实现长按，用户需要按下并按住按钮几秒钟，触发对应的事件

思路：
1. 创建一个计时器，2秒后执行函数；
2. 当用户按下按钮时触发mousedown事件，启动计时器；用户松开按钮时调用mouseout事件；
3. 如果用户mouseup事件在2秒内被触发，就清除计时器，当作一个普通的点击事件；
4. 如果计时器没有在2秒内清除，则判定为一次长按，可以执行关联的函数；
5. 在移动端需要考虑touchstar，touchend事件

```javascript
  const longpress = {
	bind: function(el, binding) {
	  if('function' !== typeof binding.value){
	  	throw 'callback must be a function';
	  }
	  let pressTimer = null;
	  let start = e => {
	  	if('click' === e.type && e.button !== 0){
	  		return;
	  	}
	  	if(null === pressTimer){
	  		pressTimer = setTimeout(handler, 2000);
	  	}
	  };
	  const handler = e => {
	  	binding.value(e);
	  };
	  let cancel = e => {
	  	if(null !== pressTimer){
	  		clearTimeout(pressTimer);
	  		pressTimer = null;
	  	}
	  };
	  el.addEventListener('mousedown', start);
	  el.addEventListener('touchstart', start);
	  el.addEventListener('click', cancel);
	  el.addEventListener('mouseout', cancel);
	  el.addEventListener('touchend', cancel);
	  el.addEventListener('touchcancel', cancel);
	},
	componentUpdated(el, binding){
		el.$value=binding.value;
	},
	unbind(el){
		el.removeEventListener('click', el.handler);
	}
  };
```
```vue
   <template>
      <button v-longpress="longpress">长按</button>
    </template>
 
<script> export default {
  methods: {
    longpress () {
      alert('长按指令生效')
    }
  }
} </script>
```


#### 3、输入框防抖指令`v-debounce`
背景：在实际业务开发过程中，有些提交保存按钮有时候需要在短时间内被点击多次，这样就会多次重复请求后端接口，造成数据的混乱；

需求： 防止按钮在短时间被多次点击，使用防抖函数限制规定时间内只能点击一次；

思路：
1. 定义一个延迟执行的方法，如果在延迟时间内再调用该方法，则重新计算执行时间；
2. 将时间绑定在click事件上

```javascript
  const debouse = {
	inserted: function(el, binding) {
	  if('function' !== typeof binding.value){
	  	throw 'callback must be function!';
	  }	
	  let timer;
	  el.addEventListener('keyup', () => {
	  	if(timer){
	  		clearTimeout(timer);
	  		timer = null;
	  	}
	  	timer = setTimeout(() => {
	  		binding.value && binding.value();
	  	}, 1000);
	  });
	}
  };
```
```vue
  <template>
      <button v-debounce="debounceClick">防抖</button>
    </template>
 
<script> 
export default {
  methods: {
    debounceClick () {
      console.log('只触发一次')
    }
  }
} 
</script>
```
#### 4、图片懒加载`v-lazyload`
背景：在平时加载较多图片资源的时候，需要控制图片延迟加载，需要控制img节点在展示的时候，才进行对应的显示；

需求：实现一个图片懒加载指令，只加载浏览器可见区域的图片；

思路：
1. 图片懒加载的原理主要是判断当前图片img节点是否到了可视区域这一个核心逻辑实现的；
2. 拿到所有图片的dom，遍历每个图片判断当前图片是否到了可视区域范围内；
3. 如果到了可视范围内，就设置图片的src属性，否则显示默认图片；
4. 图片懒加载有两种方式可以实现，一是绑定`scroll`事件进行监听，二是使用IntersectionObserver判断图片是否到了可视区域，但有浏览器兼容问题
5. 由于需要配置默认的参数，因此，需要从全局的地方将参数值给传递进来，也就是通过在注册指令的时候，顺便将值一起传递进来

```javascript
  const LazyLoad = {
	// 由于需要单独进行属性的传递，因此需要与其他的指令区分开来，这样子就可以在
	install(Vue, options){
		const defaultSrc = options.default;
		Vue.directive('lazy', {
			bind(el, binding){
				LazyLoad.init(el, binding.value, defaultSrc);
			},
			inserted(el){
				if(IntersectionObserver){
					LazyLoad.observe(el);
				}else{
					LazyLoad.observe(el);
				}
			}
		});
	},
	init(el, val, def){
        el.setAttribute('data-src', val);
        el.setAttribute('src', def);
    },
    observe(el){
		var io = new IntersectionObserver(entries => {
			const realSrc = el.dataset.src;
			if(realSrc){
                if(entries[0].isIntersecting){
                    el.src = realSrc;
                    el.removeAttribute('data-src');
                }
			}
		});
		io.observe(el);
    },
    scroll(el){
		// const handler = LazyLoad
    },
    throttle(fn, delay){
		let timer, prevTime;
		return function(...args) {
		  const currTime = Date.now();
		  const context = this;
		  if(!prevTime){
		  	prevTime = currTime;
		  }
		  clearTimeout(timer);
		}
    }
  };
  
```

#### 5、权限校验指令`v-permission`
背景： 在一些后台管理系统中，我们可能需要根据当前登录用户角色进行一些操作权限的判断，很多时候，我们都是简单粗暴的给一个元素添加`v-if/v-show`指令来进行显示/隐藏，但是如果判断条件繁琐或者有多个地方都需要进行判断的化，后期代码的维护
量会相当的大，而且也不好做统一的管理，针对这种情况，我们可以定义一全局自定义指令，来满足业务需求；

需求：自定义一个权限指令，对需要进行权限判断的DOM进行显示/隐藏。

思路：
1. 自定义一个权限数组，模拟后台的角色数据源;
2. 判断用户的权限是否在这个数组中，如果是则显示，否则则移除DOM

```javascript
  function checkArray(key) {
    let array = ['1', '2', '3', '4'];
    return array.indexOf(key) > -1;
  }
  const permission = {
	inserted: function(e, binding) {
	  if(binding.value){
	  	if(!checkArray(binding.value)){
	  		// 没有权限
	  		el.parentNode && el.parentNode.removeChild(el);
	  	}
	  }
	}
  };
```
使用：给`v-permission`赋值判断即可
```javascript
  <div class="btns">
    <!-- 显示 -->
    <button v-permission="'1'">权限按钮1</button>
    <!-- 不显示 -->
    <button v-permission="'10'">权限按钮2</button>
  </div>
```

