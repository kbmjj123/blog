---
title: vue源码学习与分析
description: 了解vue的源码执行过程，都有哪些元素参与，最终的html是如和呈现出来的
author: Zhenggl
date: 2023-05-15 12:09:16
categories:
  - [前端, 开发框架, vue]
tags:
  - 开发框架
  - vue
cover: vue源码解析封面.png
---

### 前言
> 终于来开始对`vue源码`进行一个完整的剖析学习了！
> 根据整体的源码分析，整理了以下 :point_down: 一个关于`vue源码`的学习计划：
> ![Vue源码学习计划](Vue源码学习计划.png)
> :stars: 这里分为几个阶段来对`vue源码`进行解读与学习！

1. vue源码学习;
2. vue-cli脚手架学习;
3. vue全家桶`vuex`、`vue-router`学习;
4. vue-loader学习

:alien: 这边将从本文章以及后续的其他文章中记录关于`vue源码`的一个学习过程，从源码的角度来理解这样子设计的一个目的！

### 源码整体剖析
> 从比较大的角度来理解源码，并分析源码的一个运行执行过程，提炼其中的关键参与成员！

#### 一切从`new Vue({})`开始
>  :confused: :point_down: 一个最简单的程序的运行
```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Title</title>
  </head>
  <body>
    <div id="app">
      <p>{{ message }}</p>
      <button @click="clickMe">点击我</button>
    </div>
    <script src="../dist/vue.js"></script>
    <div>123</div>
    <script>
      var vm = new Vue({
        el: '#app',
        data() {
          return {
            message: 'Hi!',
            $xx: 123
          }
        },
        methods: {
          clickMe(){
            this.message += 1;
          }
        }
      })
    </script>
  </body>
  </html>
```
:stars: 上面这里展示了一个最简单的`vue`实例的使用！本文以及后续的博文中的调试，都基于之前的{% post_link build-debugger-env-for-vue vue源码调试 %}文章来进行的源码调试！

:point_right: 从宏观角度来分析，可以得出这个`Vue函数对象`主要经过以下一系列动作的“加持”，使得其达到现在的效果：
![vue属性加持过程](vue属性加持过程.png)

#### 添加实例属性
> 通过对于`vue`实例的属性加持，使得原本一个普通的Vue函数对象，成为一个具有生命周期，而且对相关的数据进行监听watch的函数对象！对应 :point_down: 以下的相关代码：
```javascript
  // src/core/instance/index.js
  function Vue (options) {
    this._init(options);
  }
  initMixin(Vue)
  stateMixin(Vue)
  eventsMixin(Vue)
  lifecycleMixin(Vue)
  renderMixin(Vue)
  export default Vue
```
:stars: 从这里可以看出依次执行的`*Mixin`方法，来对`Vue实例`进行混入相关的属性

##### initMixin(vm)
```javascript
  export function initMixin(Vue){
    Vue.prototype._init = function(options){
      // 此处隐藏一系列代码...
    }
  }
```
:stars: 由此可见当new一个Vue实例的时候，将自动调用`_init`方法，并传递相关的`options`对象属性！

:point_right: **生命周期以及其建立过程**
> 先来看一下官方的组件的生命周期图：
![https://v2.cn.vuejs.org/images/lifecycle](https://v2.cn.vuejs.org/images/lifecycle.png)

:stars: 对应有以下的执行结果：
![组件生命周期触发结果](组件生命周期触发结果.png)

:stars: 而对应的实现过程也比较简单：**按照既定的顺序依次调用对应的勾子函数**，如下代码所示：
```javascript
// initMixin(Vue)中的部分代码
  initLifecycle(vm)   // 添加一系列属性到实例中：$parent、$root、$refs、_watcher、_inactive等等
  initEvents(vm)    // 创建_events事件对象{}，用来存储on/off/emit触发的事件
  initRender(vm)   // 添加渲染所需属性：_vnode、_staticTrees、$slots、$scopedSlots、_c(即createElement方法)、$createElement，并设置$attrs以及$listeners响应式属性
  callHook(vm, 'beforeCreate')  // 触发vm实例的beforeCreate勾子方法
  initInjections(vm) // 注入对应的属性
  initState(vm) // 初始化vm实例的props、methods、data、computed、watch属性
  initProvide(vm) // 初始化对应的provider
  callHook(vm, 'created') // 完成实例vue的创建
  
  if (vm.$options.el) {
    // 完成这个实例的挂载操作，展示在界面上
    vm.$mount(vm.$options.el)
  }
```

:confused: 这里有一个 :question: 疑问：如何将一个Vue实例“变成”普通的html，并展示在界面上？？？

:alien: 关于这个问题的解答，将在后续单独的文章：{} 具体解析一波！

##### stateMixin(vm)
> 主要是监听的系列API属性添加！
```javascript
export function stateMixin(Vue){
  const dataDef = {}
  dataDef.get = function () { return this._data }
  const propsDef = {}
  propsDef.get = function () { return this._props }
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)
  Vue.prototype.$set = set //set来自于src/core/observer/index中的set方法
  Vue.prototype.$delete = del // del来自于src/core/observer/index中的del方法
  Vue.prototype.$watch = function(){} // 定义对应的监听方法
}
```

##### eventsMixin(vm)
> 这里主要是与事件(监听、取消监听、触发)相关的API设置
```javascript
export function eventsMixin(vm){
  Vue.prototype.$on = function(){}
  Vue.prototype.$once = function(){}
  Vue.prototype.$off = function(){}
  Vue.prototype.$emit = function(){}
}
```

##### lifecycleMixin(vm)
> 这里主要是与组件生命周期相关的API设置
```javascript
export function lifecycleMixin(vm){
  Vue.prototype._update = function(){}
  Vue.prototype.$forceUpdate = function(){}
  Vue.prototype.$destroy = function(){}
}
```

##### renderMixin(vm)
> 这里主要是与界面渲染相关的API设置
```javascript
export function renderMixin(vm){
  installRenderHelpers(Vue.prototype)
  Vue.prototype.$nextTick = function(){}
  Vue.prototype._render = function(){}
}
```
:point_down: 是对应的`installRenderHelper方法`的内容！
![渲染帮助类](渲染帮助类.png)

#### 原型(静态)属性以及方法的加持
:trollface: 关于实例与Vue对象上的属性加持的过程，从一个普通的Vue函数，逐渐成为一个具有生命周期、带数据双向绑定的函数对象，如下图所示：
![属性加持的过程](属性加持的过程.gif)

#### 运行环境的加持
> :point_up: :u6709: 一个方法的调用：
```javascript
  if (vm.$options.el) {
    // 完成这个实例的挂载操作，展示在界面上
    vm.$mount(vm.$options.el)
  }
```
:confused: 这里的`$mount`方法是在什么时候定义的呢？跟踪了一下代码，:confounded: 还是没能发现其中被定义的地方，然后进行的源码的全局搜索，才能找到其初始定义是在`src/platforms/web/runtime/index.js`中所定义到，但是程序根本没有运行到这个位置，:stars: 再次从`package.json`中的`script`入手，发现 :u6709: :point_down: 一个程序执行语句
```json
  {
    "script": {
      "dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev",
    }
  }
```
:point_up: 这里通过加载`config.js`，并传递对应的参数`TARGET=web-full-dev`，以此关键词，在对应的`config.js`中查找到build节点中寻找到：
```javascript
  // Runtime+compiler development build (Browser)
  const build = {
    'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  }
  };
```
:alien: 结合之前习得的`webpack`打包的相关知识，可以得出：**vue.js结果文件的打包，是以某个入口文件作为应用程序的入口(这里是`web/entry-runtime-with-compiler.js`)，来进行的结果文件的打包过程的**！！！

:point_down: 是对应整理的关于`Vue`的依赖定义使用顺序图：
![真实Vue的导入使用顺序](真实Vue的导入使用顺序.png)

:point_down: 而关于`$mount`如何将一个`Vue实例`给渲染成为对应的html，并展示到界面上，将在后续的博文：{% post_link study-of-vue-code-1 vm实例如何渲染 %} 具体详细介绍

### 小结
> 通过初步地对`vue源码`进行初步的解读，了解了其中`Vue`的基本组成元素，了解了其基本的工作过程，同时也学习到了关于`vue`架构设计上的技巧，使得后续自己在设计自己的框架的时候，可以有了一定的参考价值：
1. 采用一传统的Vue函数对象，作为整个框架的入口；
2. 通过对Vue函数对象以及Vue函数的原型进行属性的追加，分别采用统一入口，针对接口编程，实现自己整体架构的功能的完善；
3. 抽离公共的功能到Vue函数对象中，然后借助于打包工具，以不同的环境对应采用不同的文件作为应用程序的入口，实现打包出不同功能的target结果包。