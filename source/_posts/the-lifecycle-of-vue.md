---
title: vue组件声明周期
author: Zhenggl
date: 2021-05-11 17:35:48
categories:
    -[开发框架, vue]
tags:
    - 开发框架
    - vue
    - 查漏补缺
    - 生命周期
cover_picture: vue生命周期封面.png
---

### 前言
> 每个Vue应用都是通过`Vue`函数创建一个新的**Vue实例**开始的：
> var vm = new Vue({});
> 一个 Vue 应用由一个通过 new Vue 创建的根 Vue 实例，以及可选的嵌套的、可复用的组件树组成

![Todo根实例](Todo根实例.png)

像上述中的`Todo根实例`中，我们的子孙组件，都是以*.vue文件，包含*template*、*script*、*style*标签组成的，这里的所有的*.vue组件都是Vue实例子，并且接受相同的选项对象(除了一些特有的实例之外)

![new Vue()中的参数选项](new Vue()中的参数选项.png)

### 一、组件的生命周期
这边在原本组件的生命周期上，加入了各个属性以及值的赋值操作，进行了一个补充，如下图：

![组件生命周期](组件生命周期.png)

从👆图我们可以看出，在Vue组件中的这些关于界面、数据等属性操作，都是在什么情况下可以访问的，从而可以帮助我们更好的编写代码

#### 1.1、beforeUpdate与updated
Vue实例中定义的data函数所返回的对象中属性，只有在对应的html中使用时，这个property改变时，才会调用`beforeUpdate`以及`updated`函数，比如有以下的代码：

![beforeUpdate执行契机](beforeUpdate执行契机.png)

对应的执行结果如下：

![message未引起beforeUpdate](message未引起beforeUpdate.png)

而当我们将上述的*message*属性加入到html标签中使用的时候，message属性的变动，才会引起`beforeUpdate`以及`update`函数的执行

对应的执行结果如下：

![message加入了html](message加入了html.png)

⚠️ 如果这时，想要在beforeUpdate变更之前将message再次变更值的时候，是不会再次去回调`beforeUpdate`的

#### 1.2、template标签与render函数
从上面的生命周期我们可以发现定义了template标签的话，那么在程序使用的时候，会将template转换为对应的render函数，才可以使用。

🤔 那么render函数是什么？我们自己是否也能够通过直接写render函数来实现自己的Vue组件的呢？
```vue
  // ...
  Vue.component('xxx-component', {
    render: function(createElement){
      return createElement('h', '动态数据')
    }
  });
  // ...
```
> `createElement`到底会返回什么呢？其实不是一个*实际的DOM元素*，而是一个类似于`createNodeDescription`，因为它所包含的信息会告诉Vue页面上需要渲染什么样的节点，
> 包括及其子节点的描述信息，我们把这样的节点描述为"虚拟节点(virtual node)"，也常简称为"**VNode**"，"VNode"是我们对由Vue组件树建立起来的整个VNode树的称呼。

对于`render`函数中的参数这边就不再重复了，具体可以查看[官方文档](https://cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0)中的相关说明，只要是`template`中所使用的，都可以直接用render函数来实现

### 二、Vue函数中的参数选项
通过上述的一个图，我们可以很清晰的知道Vue函数中各个参数的作用以及目的，这边另外针对上述属性/方法进行一个补充说明：
+ watch属性，其中🈶️一个值可以是一个数组，该数组中可以是由多个函数/字符串，代表着当检测到这个属性发生变化的时候，需要按照所设置的监听器数组顺序，依次往下执行
+ mounted属性，这里挂载函数调用后，代表`el`被新创建的`vm.$el`所替换了，⚠️这里并不能保证所有的子组件都已经被挂载进来了，如果我们希望等到整个视图都被渲染之后再执行我们的操作，则需要借助与`vm.$nextTick`函数，在其中的回调中执行我们所希望的操作
+ errorCaptured属性，在捕获一个来自于子孙组件的错误时被调用，具体可以查看[官方介绍](https://cn.vuejs.org/v2/api/#errorCaptured)
+ parent属性，制定当前待创建组件的父组件，用于建立两者之间的一个关系，但一般少用，尽量使用props与events实现父子组件间的通信
+ extends属性，类型为Object｜Function类型，允许生命扩展另外一个组件，而无须使用`Vue.extend`，这主要是为了便于扩展单文件组件
+ 

#### 2.1、关于extends属性的具体使用
🤔 既然`extends`属性与`mixins`属性类型，那为什么会有`extends`属性一说呢？直接用`mixins`不香吗？而且`mixins`也支持以数组的方式来使用，看起来扩展性也比较好一点呢！
👉 在回到这个问题之前，可以先来思考一个场景：*比如有一个商品列表，列表的展示内容都一致，但由于在不同的位置所需要的点击跳转链接不一致，且部分视图的展示内容规则不一致，其他的都一样，那么我们应当怎么来设计会比较合理一点呢*？
这边就直接借助于`extends`属性来完成上述的一个场景：
```vue
<!-- 基类组件BaseComponent，提供基础的视图相关操作 -->
<template>
	<div>
		<span>{{ content }}</span>
      	<button @click="clickMe">点击我</button>
	</div>
</template>

<script>
	export default {
		name: 'BaseComponent',
		data(){
			return {
				content: '这个是基类的元素'
			}
		},
		methods: {
			clickMe(){
				console.info('点击了父类的按钮');
			}
		}
	}
</script>
```
```vue
  <!-- 孩子组件 -->

<script>
import BaseComponent from './BaseComponent.vue';
	export default {
		name: 'ChildComponent',
		extends: BaseComponent,
		data(){
			return {
				content: '这个是孩子的元素'
			};
		},
		methods: {
			clickMe(){
				console.info('这个是来自于孩子的点击动作');
			}
		}
	}
</script>
```
```vue
  <template>
	<div>
		<!-- 以下是对正常基类组件的使用 -->
		<BaseComponent/>
		<!-- 以下是对孩子组件的使用 -->
		<ChildComponent/>
	</div>
</template>

<script>
import BaseComponent from './components/BaseComponent.vue';
import ChildComponent from './components/ChildComponent.vue';
export default {
	name: 'App1',
	components: {
		BaseComponent,
		ChildComponent
	}
}
</script>
```
以上程序的一个运行结果如下：
![extends示例运行结果](extends示例运行结果.png)

从上述代码中，我们可以看出这以下几个点：
+ 基类所提供的视图+数据+方法都能够被子类所使用
+ 子类能够直接通过重载同样的数据+方法来实现子类所需要的操作；
+ 如果这个时候基类的视图原本就有提供这个插槽slot的话，那么我们则可以再将基类给定义为统一的一个`基础抽象类`，这有点类似于Java中的抽象类，模仿抽象类的机制，将视图的实现，交由孩子组件来补充并实现，而自身则提供基础的视图容器

✨ 而对于组件的生命周期方法，如果extends、mixins、mounted同时使用的话，会按照一定的顺序来调用的
```javascript
  // mixin1.js
  export default {
	mounted(){
		console.info('来自于mixin1的mounted');
	}
}
```
```javascript
  // mixin2.js
  export default {
	mounted(){
		console.info('来自于mixin2的mounted');
	}
}
```
```vue
  <!-- 孩子组件 -->

<script>
import BaseComponent from './BaseComponent.vue';
import mixin1 from '../mixins/mixin1.js';
import mixin2 from '../mixins/mixin2.js';
	export default {
		name: 'ChildComponent',
		extends: BaseComponent,
		mixins: [mixin1, mixin2],
		data(){
			return {
				content: '这个是孩子的元素'
			};
		},
		mounted(){
			console.info('这个是来自于孩子的mounted');
		},
		methods: {
			clickMe(){
				console.info('这个是来自于孩子的点击动作');
			}
		}
	}
</script>
```
对应的一个输出结果是：
![extends+mixins+childcomponent的生命周期方法优先顺序](extends+mixins+childcomponent的生命周期方法优先顺序.png)

由此可见对于重载的生命周期方法函数的一个执行顺序是：**extends > mixins > component**

#### 2.2、provide/inject的使用方式与场景

### 三、为什么会是这样子的生命周期
初始化事件和生命周期方法
![Vue初始化动作_init](https://img.91temaichang.com/blog/vue-init.png)
