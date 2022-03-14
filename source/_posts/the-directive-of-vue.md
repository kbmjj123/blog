---
title: Vue指令学习与实际应用场景
author: Zhenggl
date: 2022-03-03 08:44:56
categories:
tags:
cover_picture: vue指令封面.jpeg
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

#### 3、输入框防抖指令`v-debounce`

#### 4、图片懒加载`v-lazyload`

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


#### 6、实现页面水印`v-waterMaker`
