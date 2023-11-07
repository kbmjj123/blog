---
title: 编码规范
author: Zhenggl
date: 2021-03-08 15:05:10
categories:
  - [积累与沉淀, 编码与管理]
tags:
  - 编码规范
  - javascript
  - css
cover: code-rule.jpeg
---

### 一、css规范

#### 1.1 css命名规则
    1. class 必须单词全字母小写，单词间以 - 分隔。
    2. class 必须代表相应模块或部件的内容或功能，不得以样式信息进行命名。
####  1.2 属性顺序
1. 位置属性(position、top、right、z-index、display、float等)；
2. 大小(width, height, padding, margin等)；
2. 文字系列(font、line-height、letter-spacing、color、text-align等)；
2. 背景(background、border等)；
2. 其他(animation、transition等)
```css
	.declaration-order {
	  /* Positioning */
	  position: absolute;
	  top: 0;
	  right: 0;
	  bottom: 0;
	  left: 0;
	  z-index: 100;
	  
	  /* Box-model */
	  display: block;
	  float: right;
	  width: 100px;
	  height: 100px;
	
	  /* Typography */
	  font: normal 13px "Helvetica Neue", sans-serif;
	  line-height: 1.5;
	  color: #333;
	  text-align: center;
	
	  /* Visual */
	  background-color: #f5f5f5;
	  border: 1px solid #e5e5e5;
	  border-radius: 3px;
	
	  /* Misc */
	  opacity: 1;
	}
```
####  1.3 选择器如无必要
不得为 id、class 选择器添加类型选择器进行限定，在性能和维护性上，都有一定的影响。
```css
	/* 推荐*/
	#error,
	.danger-message {
	    font-color: #c00;
	}

	/* 不推荐*/
	dialog#error,
	p.danger-message {
	    font-color: #c00;
	}
```
#### 1.4 多个选择器公用相同属性时
```css
/* 推荐 */
	.post,
	.page,
	.comment {
	    line-height: 1.5;
	}
	
	/* 不推荐 */
	.post, .page, .comment {
	    line-height: 1.5;
	}
```
### 二、JS规范
#### 2.1 文件命名
文件夹和文件名的命名应该能代表代码功能，与后端一致为佳。
#### 2.2 语言规范
1. 变量
声明变量必须加上 let、const、var 关键字.
当你没有写 let、const、var, 变量就会暴露在全局上下文中, 这样很可能会和现有变量冲突. 另外, 如果没有加上, 很难明确该变量的作用域是什么,
变量也很可能像在局部作用域中, 很轻易地泄漏到 Document 或者 Window 中, 所以务必用 let、const 、var去声明变量.

2. 分号
总是使用分号
如果仅依靠语句间的隐式分隔, 有时会很麻烦. 你自己更能清楚哪里是语句的起止,而且有些情况下，漏掉分号会很危险。

3. for-in 循环
最好只用于 object/map/hash 的遍历
对 Array 用 for-in 循环有时会出错. 因为它并不是从 0 到 length - 1 进行遍历, 而是所有出现在对象及其原型链的键值.
例如：给原型添加属性之后，默认情况下枚举，最后输出1234513
```javascript
function getNewArrayTwo(){
		var array=[1,2,3,4,5 ];
		Array.prototype.age=13;
		var result=[];
		for(var i in array){
	      result.push(array[i]);
		}
		alert(result.join(''));
	  }
```

### 三、编码风格
3.1 明确作用域
任何时候都要明确作用域 – 提高可移植性和清晰度. 例如, 不要依赖于作用域链中的 window 对象.
可能在其他应用中, 你函数中的 window 不是指之前的那个窗口对象。

3.2 代码格式化
数组和对象的初始化,如果初始值不是很长, 就保持写在单行上:
```javascript
var arr = [1, 2, 3];  // No space after [ or before ].
var obj = {a: 1, b: 2, c: 3};  // No space after { or before }.
     初始值占用多行时, 缩进2个空格.
    // Object initializer.
	var inset = {
	  top: 10,
	  right: 20,
	  bottom: 15,
	  left: 12
	};
	
	// Array initializer.
	this.rows_ = [
	  '"Slartibartfast" <fjordmaster@magrathea.com>',
	  '"Zaphod Beeblebrox" <theprez@universe.gov>',
	  '"Ford Prefect" <ford@theguide.com>',
	  '"Arthur Dent" <has.no.tea@gmail.com>',
	  '"Marvin the Paranoid Android" <marv@googlemail.com>',
	  'the.mice@magrathea.com'
	];
```
3.3 引号的使用
单引号 (‘) 优于双引号 (“).
当你创建一个包含 HTML 代码的字符串时就知道它的好处了。

3.4 过长的单行予以换行
换行应选择在操作符和标点符号之后。
```javascript
     if (oUser.nAge < 30
	    && oUser.bIsChecked === true
	    || oUser.sName === 'admin') {
	    // code
	}
```
### 四、vue规范
#### 4.1 vue属性书写顺序
```javascript
export default {
   //不要忘记了 name 属性
    name: 'RangeSlider',
    //组合其它组件
    extends: {},
    //组件属性、变量
    props: {
            bar: {}, // 按字母顺序
            foo: {},
            fooBar: {},
        },
    // 变量
    data() {},
    computed: {},
    //使用其它组件
    components: {},
    // 方法
    watch: {},
    methods: {},
    // 生命周期函数
    beforeCreate() {},
    mounted() {},
}
```
#### 4.2组件
组件以驼峰命名  以及书写顺序
```html
    <template>
	  <my-components></my-components>
    </template>
	<script>
	  import myComponents from './myComponents.vue'
	
	  export default {
	  components: {
	      myComponents
	    }
	  }
	</script>
```
#### 4.3 组件引用
```javascript
  import myComponentsA from './myComponentsA.vue'  
  import myComponentsB from './myComponentsB.vue'
  import myComponentsC from './myComponentsC.vue'
  import myComponentsD from './myComponentsD.vue'
  export default {
    components: {
      myComponentsA,
      myComponentsB,
      myComponentsC,
      myComponentsD,
    }
  }
```
#### 4.4 事件
```html
    <!-- 不建议 -->
	<a v-on:click="pass()">pass</a>
	
	<!-- 推荐 -->
	<a @click="pass">pass</a>
```
#### 4.5 vue页面使用每个 vue 页面中的最外层template下面只能有一个标签
```html
	// error
	<template>
	    <div></div>
	    <div></div>
	</template>

	// right
	<template>
	    <div></div>
	</template>
```
## 4.6 vue返回上一页
```html
this.$router.go(-1) //就可以回到上一页。
history.go(-1) //是回到浏览器上一页，但是由于Vue应用是单页应用，浏览器的访问历史未必和Vue的浏览历史相同。
```
#### 4.7 通过路由跳转，传递查询内容
```javascript
this.$router.push({
    path: "/path",
    query:{query:queryThings}
})
```
#### 4.8 methods 自定义方法命名

1. 动宾短语（good：jumpPage、openCarInfoDialog）（bad：go、nextPage、show、open、login）
2. ajax 方法以 get、post 开头，以 data 结尾（good：getListData、postFormData）（bad：takeData、confirmData、getList、postForm）
3. 事件方法以 on 开头（onTypeChange、onUsernameInput）
4. init、refresh 单词除外
5. 尽量使用常用单词开头（set、get、open、close、jump）
6. 驼峰命名（good: getListData）（bad: get_list_data、getlistData）

#### 4.9 路由的命名
path和name使用相同的命名
```json
     示例：{
        path: '/merchandise', //路由路径
        icon: 'key', //icon图标
        name: 'merchandise', //路由名称
        title: '商品', //路由标题
        access: 0, //权限代码
        component: main,
        children: [
            { path: 'merchandise-pubish', title: '商品发布', name: 'merchandise-pubish', component: () => import('@/views/merchandise/pubish.vue') },
        ]
    }
```


### 五、注释规范
#### 5.1 页面注释规范
  页面中使用注释划分结构块，注意与css中的注释达成统一格式。
```html
    <!-- 头部 -->
	<div class="g-hd">
	    <!-- LOGO -->
	    <h1 class="m-logo"><a hred="#">LOGO</a></h1>
	    <!-- /LOGO -->
	    <!-- 导航 -->
	    <ul class="m-nav">
	        <li><a hred="#">NAV1</a></li>
	        <li><a hred="#">NAV2</a></li>
	    </ul>
	    <!-- /导航 -->
	</div>
	<!-- /头部 -->
```
#### 5.2 函数注释
```javascript
    /**
	 * 简述
	 *
	 * 功能详细描述
	 *
	 * @param <String> arg1 参数1
	 * @param <Number> arg2 参数2，默认为0
	 * @return <Boolean> 判断xxx是否成功
	 */
	 function fooFunction (arg1, arg2) {
	    // code
	 }
```
#### 5.3语句注释
```javascript
    #单独一行 //(双斜线)与注释文字之间保留一个空格；
    #在代码后面添加注释：//(双斜线)与代码之间保留一个空格，并且//(双斜线)与注释文字之间保留一个空格；
    #//(双斜线)与代码之间保留一个空格。
   
	// 调用了一个函数；1)单独在一行
	setTitle();
	var maxCount = 10; // 设置最大量；2)在代码后面注释
	// setName(); // 3)注释代码
```
