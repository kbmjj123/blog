---
title: vue源码学习与分析(四)：关于vue的常见核心API分析
description: 本文关于vue的常见核心API的阐述说明，从源码的层面来理解关于其中的一个设计原理，从而更深刻的理解vue
author: Zhenggl
date: 2023-06-19 23:37:00
categories:
  - [前端, 开发框架, vue]
tags:
  - 开发框架
  - vue
---

### 前言

### 核心API一览

#### this.$forceUpdate
> 我们知道，当我们更新数据的时候，`vue`的双向绑定将会引起对应的界面去更新DOM，而在之前的学习可以得知，关于DOM的更新，都是由组件所在的data所创建的`watcher`对象去触发的更新操作的，那么这个api: `this.$forceUpdate`应该是让这个`watcher`去更新界面的！
```javascript
Vue.prototype.$forceUpdate = function () {
  const vm = this
  if(vm._watcher){
    vm._watcher.update()
  }
}
```
:trollface: 因此这里是直接使用的组件级别的`watcher`对象来更新的界面，由于是组件级别，因此，它将只会作用到**当前组件以及组件的插槽**，而子组件则不会被更新到，子组件将由子组件自身的watcher去更新！！！

#### this.$nextTick或者Vue.nextTick
> :confused: 思考这样子一个问题，我们的`watcher`对象是基于`data()`函数来实现的针对颗粒度为每一个基本数据类型的字段，而当我们同时变更多个字段的值的时候(比如需要更新两个字段)，按照一个字段对应更新一个`watcher`的机制的话，那么我们将需要出发两次`watcher.update()`操作，但实际情况是只触发了一次更新操作，这个是因为`watcher`对于触发界面的更新，将采用的异步更新的机制，而当我们使用这个`this.$nextTick()`，也是告知`vue`在下一次更新中触发这个回调方法
```javascript
const callbacks = []  // 待执行的微任务队列
let pending = false // 是否正在执行的标志
export let isUsingMicroTask = false

// 复制当前整个微任务队列，并执行完成整个任务队列
function flushCallbacks(){
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for(let i = 0; i < copies.length; i++){
    copies[i]()
  }
}
let timerFunc
// 由于在不同的浏览器中，有不同的异步操作的支持度，比如有的浏览器不支持promise，有的不支持setImmediate等等，因此有下属的一系列判断
if(typeof Promise !== 'undefined' && isNative(Promise)){
  // 支持promise的浏览器
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if(isIOS){
      setTimeout(noop)
    }
  }
  isUsingMicroTask = true
}else if(!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)){
  // 支持MutationObserver的浏览器
}else if(typeof setImmediate !== 'undefined' && isNative(setImmediate)){
  // 支持setImmediate的浏览器
}else{
  // 所有的都不支持，最终采用setTimeout宏任务模式来执行任务队列
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick(cb, ctx){
  let _resolve
  // 将一个回调压入到待执行的队列中
  callbacks.push(() => {
    if(cb){
      try{
        cb.call(ctx)
      }catch(e){
        handleError(e, ctx, 'nextTick)
      }
    }else if(_resolve){
      // 如果没有
      _resolve(ctx)
    }
  })
  if(!pending){
    pending = true
    timerFunc()
  }
  // 如果传递的cb回调为空，且当前浏览器支持promise，则将这个resolve返回
  if(!cb && typeof Promise !== 'undefined'){
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
:trollface: 当我们通过`this.$nextTick()`设置在下一次更新的时候(这里正常考虑支持promise的浏览器)，会将该异步塞入待执行的异步队列，如果该队列没有正在pending的时候，则静静等待下一次更新操作！

:stars: 一般的，像`setTimeout`、`setImmediate`、`setInterval`都是宏任务，也就是说，如果我们在更新组件中的数据的时候，假如组件尚未被渲染出来(微任务)，这个时候，我们使用宏任务(比如setTimeout)来设置数据，然后将组件给显示出来，才能够看到我们所想要的效果，而如果我们通过`$nextTick()`来赋值，然后通过`setTimeout()`来展示组件的话，那么是不可能展示到赋值后的效果的！！
{% codepen slug_hash:'KKraVJz' %}
![优先执行的微任务](优先执行的微任务.png)