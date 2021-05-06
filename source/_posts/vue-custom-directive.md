---
title: vue中8个有用的自定义指令
author: Zhenggl
date: 2021-05-06 20:06:17
categories:
    - [ 开发框架, vue ]
tags:
    - vue
    - 指令
cover_picture:https://img.91temaichang.com/blog/vue-custom-directive.jpeg
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
需求：实现长按，用户需要按下并屏住按钮几秒钟，触发对应的事件
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

#### 禁止表情以及特殊字符：`v-emoji`
#### 图片懒加载： `v-lazyload`
#### 权限校验指令：`v-permission`
#### 实现页面水印：`v-waterMarker`
#### 拖拽指令：`v-draggable`
