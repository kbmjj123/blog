---
title: vue中8个有用的自定义指令
author: Zhenggl
date: 2021-05-06 20:06:17
categories:
    - [开发框架, vue]
tags:
    - vue
    - 指令
cover_picture: https://img.91temaichang.com/blog/vue-custom-directive.jpeg
---

### 前言
> Vue除了核心功能默认内置的指令(`v-model`和`v-show`)之外，Vue也允许注册自定义指令。
>
> ⚠️在Vue2.0中，代码复用和抽象的主要形式是组件，然而，有的情况下，我们仍然需要对普通的DOM元素进行底层操作，这个时候就会用到自定义指令

举个官方的🌰，我们需要在input输入框一创建的时候，然后在任何我们需要的情况下，只要设置了该指令，就在一加载页面的时候，获取到焦点，这种比如是需要连接扫码枪的业务，比较适合。
```vue
  // 注册一个全局自定义指令'v-focus'
  Vue.directive('focus', {
    inserted: function(el){
      el.focus();
    }
  });
  // 当然我们也可以注册局部指令，组件中接收一个`directive`的选项：
  directives: {
    focus: {
      inserted: function(el){
        el.focus();
      }
    }
  }
```
### 钩子函数
---
一个指令定义对象可以提供如下几个钩子函数(均为可选)：
+ `bind`：只调用一次，指令第一次绑定到元素时调用，在这里可以进行一次性的初始化设置；
+ `inserted`：被绑定元素插入到父节点时调用(仅保证父节点存在，但不一定已插入到文档中)
+ `update`：所在组件的VNode更新时调用，**但是可能发生在其子VNode更新之前**。指令值可能发生了改变，也可能没有，但是可以通过比较更新前后的值来忽略不必要的模版更新。
+ `componentUpdated`：指令所在组件的VNode及其子VNode全部更新后调用。
+ `unbind`：只调用一次，指令与元素解绑时调用。
具体的使用，见链接[https://cn.vuejs.org/v2/guide/custom-directive.html](https://cn.vuejs.org/v2/guide/custom-directive.html)，这里就不在继续重复描述

### 批量注册指令
一般地，我们在src目录中新建目录+文件`directives/index.js`，然后在index.js中对外暴露api
```javascript
  import Vue from 'vue';
  import copy from './modules/copy';
  import longpress from './modules/longpress';
  const directives = {
  	copy,
  	longpress
  };
  export default{
  	install(Vue){
  		Object.keys(directives).forEach(key => Vue.directive(key, directives[key]))
  	}
  }
```
然后在`main.js`中引入并调用
```javascript
  import Vue from 'vue';
  import Directives from '@/directives';
  Vue.use(Directives);
```

### share几个实用的Vue自定义指令
#### 复制粘贴指令：`v-copy`
---
**需求**：实现一键复制文本内容，用于鼠标右键粘贴。
**思路**:
1. 动态创建`textarea`标签，并设置`readOnly`属性以及移出可视区域
2. 将要复制的值赋给`textarea`标签的`value`属性，并插入到body中
3. 选中值`textarea`并复制
4. 将`body`中插入`textarea`移除
5. 在第一次调用时绑定事件，在解绑时移除事件
```javascript
  // src/directive/modules/copy.js
  export default {
	bind(el, { value }){
		el.$value = value;
		el.handler = () => {
			if(!el.$value){
				// 值为空的时候，给出提示
				console.log('无复制内容');
				return;
			}
			const textarea = document.createElement('textarea');
			// 将该textarea设为readonly，防止iOS下自动唤起软键盘
			textarea.readOnly = 'readonly';
			textarea.style.position='absolute';
			textarea.style.left='-9999px';
			// 将要copy的值赋给textarea标签的value属性
			textarea.value=el.$value;
			// 将textarea插入到body中
			document.body.appendChild(textarea);
			// 选中值并复制
			textarea.select();
			const result = document.execCommand('Copy');
			if(result){
				console.log('复制成功');
			}
			// 赋值成功后，将textarea移除掉
			document.body.removeChild(textarea);
		};
		// 绑定点击事件
		el.addEventListener('click', el.handler);
	},
	componentUpdated(el, { value }){
		el.$value = value;
	},
	// 指令与元素解绑的时候，移除事件绑定
	unbind(el){
		el.removeEventListener('click', el.handler);
	}
  }
```
用法见👇
```vue
  <template>
    <button v-copy="copyText">复制</button>
  </template>
  <script>
    export default {
      data(){
        return {
          copyText: '等待被复制的内容'
        }
      }
    }
  </script>
```
#### 长按指令：`v-longpress`
---
**需求**：实现长按，用户需要按下并屏住按钮几秒钟，触发对应的事件
**思路**：
1. 创建一个计时器，3秒后执行函数
2. 当用户按下按钮时，触发`mousedown`事件，启动计时器；用户松开按钮时调用`mouseout`事件
3. 如果`mouseup`事件3秒内被触发，就清楚计时器，当作一个普通的点击事件
4. 如果计时器没有在3秒内清楚，则判断为一次长按，并执行捆绑的函数
5. 在移动端则需要考虑`touchstart`，`touchend`事件
```javascript
  // src/directive/modules/longpress.js
  export default {
	bind(el, {value}){
		if('function' !== typeof value){
			throw 'callback must be a function';
		}
		let pressTimer = null;
		let start = e => {
			if('click' === e.type && 0 !== e.button){
				return;
			}
			if(null === pressTimer){
				pressTimer = setTimeout(() => {
					// 执行函数
					value(e);
				}, 3000);
			}
		};
		let cancel= e => {
			if(null !== pressTimer){
				clearTimeout(pressTimer);
				pressTimer = null;
			}
		};
		// 添加事件监听器
		el.addEventListener('mousedown', start);
		el.addEventListener('mouseout', cancel);
		el.addEventListener('click', cancel);
		el.addEventListener('touchstart', start);
		el.addEventListener('touchend', cancel);
		el.addEventListener('touchcancel', cancel);
	}
  }
```
用法见👇
```vue
  <template>
    <button v-longpress="longpress">长按我</button>
  </template>
  <script>
    export default {
      methods: {
        longpress(){
          alert('触发了长按动作');
        }
      }
    }
  </script>
```
#### 输入框防抖指令：`v-debounce`
---
**背景**：在开发中，有些提交保存按钮有时候会在短时间内被点击多次，这样就会多次重复请求后端接口，造成数据的混乱，比如新增表单的提交按钮，多次点击就会新增多条重复的数据。
**需求**：防止按钮在短时间内被多次点击，使用防抖函数限制规定时间内只能点击一次。
**思路**：
1. 定义一个延迟执行的方法，如果在延迟时间内再调用该方法，则重新开始延迟时间
2. 在延迟的时间到了之后，执行到click方法
```javascript
  // src/directives/modules/debounce.js
  export default {
	inserted(el, { value}){
		if('function' !== typeof value){
			throw 'directive value must be function';
		}
		let timer;
		el.addEventListener('keyup', () => {
		  timer && clearTimeout(timer);
		  timer = setTimeout(() => {
		  	value&&value();
		  }, 1000);
		});
	}
  }
```
用法见👇
```vue
  <template>
    <button v-debounce="debounceAction">防抖</button>
  </template>
  <script>
    export default{
      methods: {
        debounceAction(){
          console.info('触发了一次');
        }
      }
    }
  </script>
```
#### 禁止表情以及特殊字符：`v-emoji`
---
**背景**：开发中遇到的表单输入，往往会对输入内容的限制，比如不能输入表情和特殊字符，只能输入数字或字母等，我们常规方式是在每一个表单的`on-change`事件上做处理
```vue
  <template>
    <input type="text" v-model="txt" @change="validateEmoji">
  </template>
  <script>
    export default {
      data(){
        return {
          txt: ''
        }
      },
      methods: {
        validateEmoji(){
          let reg = /[^\u4E00-\u9FA5|\d|\a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g;
          this.txt = this.txt.replace(reg, ''); 
        }
      }
    }
  </script>
```
这样的代码量比较大且不好维护，因此我们需要自定义一个指令来解决这个问题
**需求**：根据正则表达式，设计自定义处理表单输入规则的指令，下面以禁止输入表情和特殊字符为例
```javascript
  // src/directives/modules/emoji.js
  const findEle = (parent, type) => parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type);
  const trigger = (el, type) => {
  	const e = document.createEvent('HTMLEvents');
  	e.initEvent(type, true, true);
  	el.dispatchEvent(e);
  };
  export default {
    bind(el){
      let reg = /[^\u4E00-\u9FA5|\d|\a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g;
      let $inp = findEle(el, 'input');
      el.$inp = $inp;
      $inp.handle = () => {
      	let val = $inp.value;
      	$inp.value=val.replace(reg, '');
      	trigger($inp, 'input');
      };
    },
    unbind(el){
    	el.$inp.removeEventListener('keyup', el.$inp.handle);
    }
  }
```
使用：将需要校验的输入框加上`v-emoji`即可
```vue
  <template>
    <input type="text" v-model="txt" v-emoji>
  </template>
```
#### 图片懒加载： `v-lazyload`
---
**背景**：在电商类型的项目中，往往存在大量的图片，如banner广告图、菜单导航图。一大波图片以及图片提及过大往往会影响页面加载速度，造成不良的用户体验，因此进行图片懒加载优化很有必要。
**需求**：实现一个图片懒加载指令，只加载浏览器可见区域的图片
**思路**：
1. 图片懒加载的原理主要是判断当前图片是否到了可视区域这一核心逻辑来实现的；
2. 拿到当前图片dom，判断是否到了可视化范围内
3. 如果到了，就设置图片的`src`属性，否则展示默认图片
> 图片懒加载有两种方式可以实现，一种是绑定`scroll`事件进行监听，二是使用`Intersection Observer`判断图片是否到了可视区域，但是有浏览器兼容问题。
>
> 下面封装一个懒加载指令兼容两种方案，判断浏览器是否支持`IntersectionObserver`API，如果支持就使用该方案实现懒加载，否则使用`scroll`事件监听+节流的方式实现。
```javascript
  // src/directives/modules/lazyload.js
  const defaultSrc = '';//默认图片地址
  export default {
	bind(el, binding){
		this.init(el, binding.value, defaultSrc);
	},
	inserted(el){
		if(IntersectionObserver){
			this.observe(el);
		}else{
			this.listenerScroll(el);
		}
	},
	// 初始化动作，设置默认图片，并且在data-set中设置目标图片+-
	init(el, val, defaultSrc){
		el.setAttribute('data-src', val);
		el.setAttribute('src', defaultSrc);
	},
	// 使用IntersectionObserver监听el
	observe(el){
		let io = new IntersectionObserver(entries => {
			const realSrc = el.dataset.src;
			if(entries[0].isIntersecting){
				if(realSrc){
					el.src = realSrc;
					el.removeAttribute('data-src');
				}
			}
		});
		io.observe(el);
	},
	// 监听scroll事件
	listenerScroll(el){
		const handler = this.throttle(this.load, 300);
		this.load(el);
		window.addEventListener('scroll', () => {
			handler(el);
		})
	},
	// 加载真实图片
	load(el){
		const windowHeight = document.documentElement.clientHeight;
		const elTop = el.getBoundingClientRect().top;
		const elBottom = el.getBoundingClientRect().bottom;
		const realSrc = el.dataset.src;
		if(elTop - windowHeight < 0 && elBottom > 0){
			if(realSrc){
				el.src = realSrc;
				el.removeAttribute('data-src');
			}
		}
	},
	// 节流函数，配合滚动事件
	throttle(fn, delay){
		let timer;
		let prevTime;
		return function (...args){
			const currTime = Date.now();
			const context = this;
			if(!prevTime) prevTime = currTime;
			clearTimeout(timer);
			if(currTime - prevTime > delay){
				prevTime = currTime;
				fn.apply(context, args);
				clearTimeout(timer);
				return;
			}
			timer = setTimeout(() => {
				prevTime = Date.now();
				timer = null;
				fn.apply(context, args);
			}, delay);
		}
	}
  }
```
➡️ 这里我们需要将这个指令定义为插件，给到全局所有的图片资源使用
```javascript
  import lazy from '@/diretives/modules/lazy.js';
  export default {
  	install(Vue, options){
      Vue.directive('lazy', lazy);		
  	}
  }
```
使用方式如下：
```vue
  <img v-lazy="xxx.jpg"/>
```
#### 权限校验指令：`v-permission`
---
**背景**：在一些后台管理系统中，我们可能需要根据用户角色进行一些操作权限的判断，很多时候，我们都是简单粗暴地给一个元素添加`v-if/v-show`来进行显示隐藏，但如果判断条件繁琐且多个地方需要判断，这种方式的代码不仅
不优雅而且冗余，针对这种情况，我们可以通过全局定义指令来处理。
**需求**：自定义一个权限指令，对需要权限判断的Dom进行显示/隐藏
**思路**：
1. 自定义个一个权限组
2. 判断用户的权限是否在这个数组内，如果是则显示，否则移除Dom
```javascript
  //简单判断是否在权限集中 
  function checkPermission(key){
	return ['1', '2', '3', '4'].indexOf(key);
  }
  export default {
	inserted(el, { value }){
		if(value){
			let hasPermission = checkPermission(value);
			if(!hasPermission){
				// 没有权限，则移除Dom元素
				el.parentNode && el.parentNode.removeChild(el);
			}
		}
	}
  };
```
👇是对应的使用方式
```vue
  <template>
    <!-- 显示 -->
    <button v-permission="1">权限1</button>
    <!-- 隐藏 -->
    <button v-permission="10">隐藏</button>
  </template>
```
#### 实现页面水印：`v-waterMarker`
---
**需求**：给整个页面添加背景水印
**思路**：
1. 使用`canvas`特性生成`base64`格式的图片文件，设置其字体大小，颜色等。
2. 将生成的图片文件设置为背景图片，从而实现页面或组件水印效果
```javascript
  // 
  export default {
	// value有固定的格式
	bind(el, { value }){
		let canvas = document.createElement('canvas');
		el.appendChild(canvas);
		canvas.width=200;
		canvas.height=150;
		canvas.style.display = 'none';
		let pen = canvas.getContext('2d');
		pen.rotate((-20 * Math.PI) / 180);
		pen.font = value.font || '16px Microsoft JhengHei';
		pen.fillStyle = value.textColor || 'rgba(180, 180, 180, 255)';
		pen.textAlign='left';
		pen.textBaseline='Middle';
		pen.fillText(value.text, canvas.width/10, canvas.height/2);
		el.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
	}
  }
```
👇是对应的使用方式
```vue
  <template>
    <div v-waterMaker="waterMaker"></div>
  </template>
  <script>
    export default{
      data(){
        return {
          waterMaker: {
            text: 'zgl版权所有',
            textColor: 'rgba(180, 180, 180, 0.4)'
          }
        }
      }
    }
  </script>
```
#### 拖拽指令：`v-draggable`
---
**需求**：实现一个拖拽指令，可在页面可视区域任意拖拽元素。
**思路**：
1. 设置需要拖拽的元素为绝对定位，其父元素为相对定位
2. 鼠标按下`(onmousedown)`时记录目标元素当前的`left`和`top`值
3. 鼠标移动`(onmousemove)`时计算每次移动的横向以及纵向距离的变化值，并改变元素的`left`和`top`值
4. 鼠标松开`(onmouseup)`时完成一个拖拽
```javascript
  //src/directives/modules/draggable.js
  export default{
	inserted(el){
		el.style.cursor = 'move';
		el.onmousedown = e => {
			let disx = e.pageX - el.offsetLeft;
			let disy = e.pageY - el.offsetTop;
			document.onmousemove = e => {
				let x = e.pageX - disx;
				let y = e.pageY - disy;
				let maxX = document.body.clientWidth - parseInt(window.getComputedStyle(el).width);
				let maxY = document.body.clientHeight - parseInt(window.getComputedStyle(el).height);
				x < 0 ? x = 0: x > maxX ? x = maxX : '';
				y < 0 ? y = 0: y > maxY ? y = maxY : '';
				el.style.left = `${x}px`;
				el.style.top = `${y}px`;
			};
			document.onmouseup = () => {
				document.onmousemove = document.onmouseup = null;
			};
		};
	}
  }
```
👇是对应的使用方式
```vue
  <template>
    <div class="xxx" v-draggable></div>
  </template>
```
