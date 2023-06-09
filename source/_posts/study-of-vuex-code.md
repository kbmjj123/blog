---
title: Vuex的用法与源码学习
description: 学习如何使用Vuex，并从源码层面理解其中的模块化、相关API的工作过程，理解其远程响应式触发的原理
author: Zhenggl
date: 2023-06-07 05:24:36
categories:
  - [前端, 开发框架, vuex]
tags:
  - 开发框架
  - vuex
cover_picture: Vuex封面.png
---

### 前言
> 在使用`vue`全家桶来开发前端站点的时候，对于`vue组件间通信`，有那么一种方式(也是普遍使用的方式)，就是使用`vuex`来实现跨组件间的通讯，本文章旨在通过使用`vuex`解决实际项目的同时，从源码层面解析关于`vuex`是如何做到远程触发的相关原理的！
> *`Vuex` 是一个专为 `Vue.js` 应用程序开发的状态管理模式 + 库。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。*
![vuex的工作流](vuex的工作流.png)
:stars: 从上面可以看出这个`vuex`的工作流是单向的，主要包含有3个元素：
1. 状态(state): 驱动应用的数据源；
2. 视图(view): 以声明方式将状态映射到视图；
3. 操作(action): 响应在视图上的用户输入导致的状态变化

:stars: 而实际在使用过程中，`vuex`的设计理念是：*把组件的共享状态抽取出来，以一个全局单例模式管理，组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为*
![vuex与vue的工作流程](vuex与vue的工作流程.png)

### Vuex的一般用法
{% codepen slug_hash:'YzRzLGE' %}

:confused: 这里的一般流程如下：
![简化版的vuex工作流程](简化版的vuex工作流程.png)

### 源码分析
> :confused: 这个`Store对象`是如何被“植入到”`vue`实例中的呢？为什么可以在vue实例中就可以通过`this.$store`来访问到？然后这个数据state更新了之后，为什么界面就会自动被更新到了呢？他与vue自带的数据双向绑定有什么区别呢？
> :point_down: 将具体分析一波！

#### 相关成员
> 首先先来了解一下关于`Store`的成员

| 成员 | 类型 | 描述 |
|---|---|---|
| state | Object | 组件全局共享的data数据源 |
| getters | 由函数组成的Object | 对state中的数据以及根/子module中的数据的计算属性函数所组成的对象 |
| mutations | 由函数组成的Object | 成员函数主要负责接收来自对state中数据的更新操作 |
| actions | 由函数组成的Object | 成员函数主要负责接受异步操作，并在操作后触发mutations中的方法来更新state中的数据 |
| module | 由Store组成的Object | 根据业务场景拆分的不同模块 |

#### “远程”响应式触发是如何实现

##### 1. 创建一个`Vuex.Store`对象
```javascript
const store new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
```
:question: 那么创建出来的`Store`对象都有什么元素？它拥有什么功能？
![vuex源码级别的依赖关系](vuex源码级别的依赖关系.png)
:trollface: 从上面的关系图我们可以得出，Store体系主要由Store、ModuleCollection、Module三个部分来组成，下面来一个个分析一波：

###### Store
> 我们所编写的getters、mutations、actions对象所包含的函数对象，都存储在Store中，以命名空间来维护，存在这个Store对象中！
> :confused: 那么，这里我们所维护的`getters`、`mutations`、`actions`，它是如何存储在Store中的呢？
首先，在Store对象中都存储着 :point_down: 几个属性

| 属性 | 描述 | 存储格式 |
|---|:---|:---|
| _actions | 存储的所有的action的对象 | `{ '命名空间+key': [一个个的函数] }` |
| _mutations | 存储的所有的mutation对象 | `{ '命名空间+key': [一个个的mumation] }` |
| _wrappedGetters | 存储的所有的getter函数所组成的对象 | `{ '命名空间+key': [一个个的getter函数对象] }` |

那么，在 :point_up: 这内容是如何被存储的呢？
:star: 以`mutation`为例：
```javascript
function registerMutation(store, type, handler, local){
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(functoin wrappedMutationHandler(payload){
    handler.call(store, local.state, payload)
  })
}
```
:trollface: 从上面的代码，我们可以看出我们所维护的`mutation`将会被以一个数组成员的方式被维护到`_mutation`对象中，`action`(只不过action是异步的)以及`getter`也是如此！

###### ModuleCollection
> 模块收集管理类，主要负责对主模块以及各个子模块的管理，其中拥有一个属性(root，这是Module对象)，代表着当前整个模块对象！
> 可以在这个root模块中，通过增删查改，根据key参数，来操作对应的模块
```javascript
export default class ModuleCollection{
  constructor(rawRootModule){
    this.register([], rawRootModule, false)
  }
  register(path, rawModule, runtime = true){
    const newModule = new Module(rawModule, runtime)
    if(path.length === 0){
      this.root = newModule
    }else{
      parent.addChild(path[path.length - 1], newModule)
    }
    if(rawModule.modules){
      // 对于嵌套的模块，直接递归调用register
    }
  }
}
```

###### Module
> 在`vuex`领域中的抽象module对象，每个Module对象都维护着自己的`_children`子模块以及`state`!
```javascript
export default class Module{
  constructor(rawModule, runtime){
    this.runtime = runtime
    this._children = Object.create(null)
    this._rawModule = rawModule
    // 在vuex中的state可以是一个对象也可以是一个函数!
    const rawState = rawModule.state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }
}
```

###### 初始化整个state，设置监听的开始
> 同样的，从`Store.resetStoreVM()`方法开始
```javascript
function resetStoreVM(store, state, hot){
  const computed = {}
  // 对传递给store对象的每个getter进行遍历，转换为一个个计算属性
  forEachValue(wrappedGetters, (fn, key) => {
    computed[key] = partial(fn, store)  // 返回一函数，目的是执行fn函数，并以store作为参数，也就是这里的computed的key所对应的value值，是一个函数，该函数接收的store来作为它的参数
    Object.defineProperty(store.getters, key, {
      get: () => store.vm[key], // 这里取的是vue实例中的key的值
      enumerable: true
    })
  })
  // 以将要使用的state作为data中的属性，来创建一个vue实例对象，并将生成的computed对象来作为计算属性来使用
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
}
```
:trollface: 从 :point_up: 的代码我们可以看出每一个store都new了一个Vue实例对象与之关联，因为一旦new了一个Vue实例对象，按照之前的学习，则会进行`data函数中返回的对象的“响应化”包装`操作，也就是对这个state中的数据做了一个`getter` + `setter`的监听，**而当我们通过在界面元素中使用`state`中的数据时，则会被自动更新，因为state已经被远程修改了，然后又是引用的同一个数据源，通过dep+watcher的依赖收集与依赖触发，因此界面就能够做到对应的响应式更新了**
:point_right: **也就是说，store中的state数据，都转换成为vue实例中的data，store中的getter，都转换为vue实例中的computed计算属性**，然后一切又回到了原本的计算属性监听操作！

##### 2. 通过`Vue.use(store)`对象添加到vue实例中
```javascript
// 将store实例对象注册到vue实例中的$store属性中
Vue.use(store)
// 这里的store将会在后续的vue实例中可通过this.$store来访问到！
new Vue({
  store
})
```
:stars: 从原本Vue的源码我们可以看出关于`Vue.use()`动作的一个过程，其实就是调用的store中的`install`方法，如下代码所示：
```javascript
export function initUse(Vue: GlobalAPI){
  Vue.use = function(plugin: Function | Object){
    if(typeof plugin === 'function'){
      plugin.install.apply(plugin, args)
    }else if(typeof plugin === 'function'){
      plugin.apply(null, args)
    }
    return this
  }
}
```
:point_right: 而在`vuex.install`方法中，又是直接调用自身的`applyMixin(Vue)`，关于这个`applyMixin(Vue)`方法定义如下：
```javascript
export default function(Vue){
  Vue.mixin({
    beforeCreate: vuexInit
  })
}
function vuexInit(){
  // 由于这里最终是被Vue实例所调用，因此这个的options就是vue实例对象中的options
  const options = this.$options
  // 这也就是为什么我们可以通过this.$store来访问到store的原因！
  if(options.store){
    this.$store = typeof options.store === 'function' ? options.store() : options.store
  }else if(options.parent && options.parent.$store){
    this.$store = options.parent.$store
  }
}
```

##### 3. 远程响应式更新的实现过程


#### 未知较不常用的API
:confused: 在完成学习这个vuex的相关源码之后，发现在这个store对象中居然还有隐藏性的日常工作中为使用到的相关API以及属性：
1. subscribe: 对`mutation`触发动作的监听，一旦有关于mutation的触发的话，将会直接触发设置的监听动作；
2. subscribeAction: 对`action`触发动作的监听，一旦有关于action动作的触发的话，将会直接触发设置的监听动作；
   :warning: 要注意的是，在回调函数中不能直接修改 `state`，因为这样会破坏 `Vuex` 的响应式原理。如果要修改 `state`，需要通过 `action` 来触发 `mutation` 的变化
3. watcher: 对`getter`属性的触发动作的监听;
4. replaceState: 对整个`state`进行替换；
5. registerModule: 动态注册添加`module`，可实现在程序的运行过程中，针对这种情况，可以将待使用的`module`已异步导入的方式来导入！

### 我学到了什么
1. vue插件的定义
:stars: 从 :point_up: 的关于`Vue.use`方法内容来看，通过以插件的方式来传入，并直接调用其中的`install`方法，并传递Vue来作为install方法的参数，这里的需要理清楚关于args指的是什么！
2. 未完待续...