---
title: vue源码学习与分析(一)：vm实例如何渲染
description: 主要分析Vue框架中如何将一个Vue实例对象渲染成为一个html，并最终展示到界面上，同时梳理其中vnode以及patch的算法原理
author: Zhenggl
date: 2023-05-15 18:43:43
categories:
  - [前端, 开发框架, vue]
tags:
  - 开发框架
  - vue
cover_picture: vm实例如何渲染.png
---

### 前言
> 接着上一篇文章，关于`new Vue({})`脚本程序执行的时候发生了什么？为什么执行了这个方法之后，就可以对应在界面上展示相应的信息(如下图所示)

![简单的渲染结果](简单的渲染结果.png)

:star2: 猜想：一个html需要在界面上展示对应的渲染结果，那么需要对应的添加相应的`html标签`，才可能使对应的节点元素能够正常展示！

:point_right: 那么，问题就演变为*Vue是如何生成对应的html出来的？*

:trollface: 要想了解这个渲染的过程，需要先了解一下相关的概念，方便后续直接深入了解vue的渲染过程！！！

### 理解相关的元素
1. 虚拟节点: VNode
2. 创建虚拟节点： createElement

#### 虚拟节点: VNode
> *vnode是一个虚拟节点对象，用于描述组件树上的一个节点，包含了节点的名称(tag)、节点属性信息(data)、子节点(children)*，主要将原本在html中可视化的节点信息，抽象为虚拟的节点(带一定的数据结构在其中)，在`vue`环境中，我们仅需要操作这个`VNode`即可，而无需直接去操作dom！！
> :confused: **为什么要将普通的html的dom操作，转换为VNode的操作**？？

:point_right: 因为直接操作dom是一个耗性能的过程，对一个dom节点的操作，将有可能导致布局的调整，而致使浏览器产生回流以及重绘，这个回流以及重绘的详细介绍，可以看之前我这边写过的另外一篇文章：{% post_link backflow-and-repaint 回流与重绘 %}

:stars: 最终实现这样子的一个目的：将所有的操作dom变换，都调整为VNode的计算逻辑，最终只需要将执行结果(`html结果字符串`)，插入到目标位置上

![VNode](VNode.png)

#### 创建虚拟节点：createElement
> 对内部的`_createElement函数`进行了一个包装，主要用于兼容单个以及数组级别的Element的创建！
> :confused: 那么，这个`_createElement函数`又是怎么一回事呢？？

```javascript
// 主要根据传递进来的数据以及上下文信息，用来创建一个VNode虚拟节点
export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode>{
  // 此处省略一系列的判断逻辑代码
  //! 根据不同的场景来对应生成不同的VNode节点对象
}
```

:stars: 一般最终创建出来的`vnode`格式如下(当然远不止这么简单)：
```json
{
  tag: 'div',
  data: {
    attrs: {
      id: 'my-div'
    }
  },
  children: ['Hello Vue!']
}
```

:trollface: 附带上这个虚拟dom的一个完整过程流程图
![渲染出虚拟dom的过程](渲染出虚拟dom的过程.jpg)

### 渲染过程分析
> 回到原点，从以下 :point_down: 代码出发
```html
<div id="app">
    {{ message }}
</div>
```
```javascript
var vm = new Vue({
	el: '#app',
	data() {
		return {
			message: 'H!',
			$xx: 123
		}
	}
});
```
:stars: 按照之前文章的分析，最终执行到了`vm.$mount(vm.$options.el)`

#### $mount方法的定义
```javascript
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```
:stars: 这里是找寻到对应的el对应的id属性，然后转成为一个普通的htmlnode节点，并进入`mountComponent`方法

#### mountComponent方法的定义
```javascript
// src/core/instance/lifecycle.js 141行
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component{
  // 存储当下的HtmlNode节点到$el
  vm.$el = el;
  callHook(vm, 'beforeMount);
  new Watcher(vm, () => {vm._update(vm._render(), hudrating)}, noop, {
    before(){
      if(vm._isMounted && !vm.isDestroyed){
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true);
  if(vm.$vnode == null){
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm;
}
```
:trollface: 也就是说当我们执行的`$mount(el)`的时候，也就是创建了一个`Watcher`对象，并在对应的回调方法中进行了 :point_down: :two: 个动作：
1. _render: 根据HtmlNode节点以及vm实例，渲染出对应的虚拟dom的过程；
2. _update: 根据虚拟dom，生成对应的结果html，并进行html的替换动作！

:warning: 关于这里`Watcher`的工作原理，将在下一章中关于数据的双向绑定进行具体分析一波！

而这里的`_render`方法内容如下：
```javascript
  Vue.prototype._render = function(): VNode{
    const vm: Component = this
    const { render, _parentVnode } = vm.$options
    // 此处前后各省略一系列代码...
    vnode = render.call(vm._renderProxy, vm.$createElement)
  }
```
:confounded: 这里`_render`又反过来去调用这个`options.render`，那么这里的`options.render方法`，它是从何而来的呢？它是什么时候被定义的呢？？

:stars: 这里我们通过debugger，发现这个函数体的内容是运行时生成的，其结构如下所示：
![运行时生成的函数内容](运行时生成的函数内容.png)

:face_with_monocle: 那么这个函数体，它又是在什么时候，怎么被生成的呢？？

##### 动态生成的运行时函数
> 再次回过头来从入口文件进行分析，发现在对应的入口处， :u6709: 对应的关于该方法api的一个定义：
```javascript
// 主要是通过继承并重载对应的$mount，来追加自定义的逻辑，这里仅根据实际情况进行最简单的分析！
//src/platforms/web/entry-runtime-with-Compiler.js
  let template = getOuterHTML(el)
  const { render, staticRenderFns } = compileToFunctions(template, {
    outputSourceRange: process.env.NODE_ENV !== 'production',
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: options.delimiters,
    comments: options.comments
  }, this)
  options.render = render
  options.staticRenderFns = staticRenderFns
  return mount.call(this, el, hydrating)  // 调用源$mount()方法
```
:stars: 这里的render即是我们所想要找寻的方法内容，那么这里的`compileToFunctions()`方法的目的是什么呢？

:ghost: 关于这里的`compileToFunctions()`其中底层的逻辑较为复杂，这边简单概括一下：*compileToFunctions函数是vue.js的模版编译器，主要用于将模版字符串转换为可执行的Javascript代码，其返回结果是一个对象，包含有两个属性：编译后的render函数，以及staticRenderFns函数，这两者都可以用来渲染视图！*

:point_right: :u6709: 去大致地走了一遍其中的逻辑，无非就是根据模版，解析出对应的`ast`树，然后解析该树，最终生成对应的代码，然后再采用一个`Function`来将对应的字符串代码给包裹起来，使其能够成为一个可执行的代码！

:stars: 再回到之前的`vnode = render.call(vm._renderProxy, vm.$createElement)`，这一行代码，这里也就是将生成的可执行代码进行`call`动作执行，也就是执行生成的运行时函数，该函数的结果如下所示：
![运行时生成的函数内容](运行时生成的函数内容.png)

:confounded: 但是生成的运行时函数，其中的函数都是具有对应的代号，这里借助于`installRenderHelpers()函数`，可在执行时关联对照查询：
![对应的简写指代函数映射关系](对应的简写指代函数映射关系.png)

:stars: 也就是通过执行`_c()`函数，来创建对应的vnode虚拟节点对象！

##### 生成并替换/修改结果html
:confused: :point_down: 这里生成的虚拟dom对象之后，它又是如何生成目标html内容的呢？
:point_right: 一切从进入`_update()`方法开始！！
```javascript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const restoreActiveInstance = setActiveInstance(vm)
  vm._vnode = vnode
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  // 至此已完成$el的内容的生成！
}
```
:confounded: 那么这里的`__patch__()`方法的目的是什么呢？
:point_right: 通过代码跟踪执行，发现关于`patch()`方法的定义如下：
```javascript
//src/core/vdom/patch.js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
export function createPatchFunction (backend) {
  // 此处隐藏一系列代码...
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    // 生成目标html的地方
    if (isUndef(oldVnode)) {
      // 如果没有定义旧节点，则直接创建一目标HtmlNode元素
      createElm(vnode, insertedVnodeQueue)
    }else{
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // 如果旧节点非实际的HtmlDom元素并且与新旧节点是同一个，则进行新旧节点的对比，并完成旧节点的替换
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
        // 在该patchVnode方法内部调用了updateChildren，来更新节点了
      }else{
        // 备份要替换旧的节点
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)
        // 创建新节点并同时更新旧节点
        createElm(
          vnode,
          insertedVnodeQueue,
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )
        // 此处暂时省略循环patch动作
        // 销毁旧的HtmlDom节点
        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
}
```
:stars: `patch()`方法是重要的虚拟dom更新函数，主要用于将虚拟dom转换为真实的dom并应用到页面上！他主要作用是对比新旧节点，并更新视图。
一般来说，`patch()` :u6709: :two: 步骤：
1. 通过`createElm()`函数创建一个真实的HtmlDom元素；
2. 通过`updateChildren()`函数对比新旧节点并更新视图

:warning: 这里需要注意的是，`patch()`方法从头到尾并没有操作到数据(即组件的状态和数据)！！

###### 创建真实的Dom元素-createElm
> `createElm`函数是用于创建 dom 元素并添加到文档中的方法，主要将虚拟的dom转换为真实的dom！

###### 更新真实的Dom元素-updateChildren
> `updateChildren`函数是用于对比新旧节点并更新视图的关键函数。它是由 `patch` 函数内部调用的，用于处理同一层级下的多个子节点的更新！