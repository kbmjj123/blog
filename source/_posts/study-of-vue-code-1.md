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
    // 如果新的vnode未定义而旧的vnode存在，那么则直接删掉并清空旧节点信息
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }
    let isInitialPatch = false
    const insertedVnodeQueue = []
    if (isUndef(oldVnode)) {
      // 如果没有定义旧节点，则属于是第一次创建的节点对象，直接创建一个对应的html节点
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

:trollface: 上述代码对应的一个流程图如下所示：
![new一个vue的patch流程](new一个vue的patch流程.jpg)

:point_right: 套上最开始的`new Vue({})`的一个过程结合分析一波：
![实际的newVue的patch过程](实际的newVue的patch过程.png)
:point_up: 就是这么的简单，旧的dom不存在，直接根据新的虚拟dom来创建对应的结果html，并替换添加到旧的html位置，然后将旧的html给移除掉！

:stars: `patch()`方法是重要的虚拟dom更新函数，主要用于将虚拟dom转换为真实的dom并应用到页面上！他主要作用是对比新旧节点，并更新视图。
一般来说，`patch()` :u6709: :two: 步骤：
1. 通过`createElm()`函数创建一个真实的HtmlDom元素；
2. 通过`patchVnode()`函数对比新旧节点并更新视图
3. 通过`updateChildren()`最终更新孩子节点视图的入口

:warning: 这里需要注意的是，`patch()`方法从头到尾并没有操作到数据(即组件的状态和数据)！！

###### 创建真实的Dom元素-createElm
> `createElm`函数是用于创建 `dom` 元素并添加到文档中的方法，主要将虚拟的dom转换为真实的dom！
> :stars: 一个vnode中的elm属性如果为非空的话，那么这个vnode则之前肯定有被使用过，因为在vue的领域中，`vnode.elm`属性只在此方法中创建过，直接去覆盖这个已使用过的elm
> 属性，可能会存在一些错误覆盖的问题，因此`createElm`一般采用克隆的方式！
**参数说明：**
1. vonde: 代表即将被渲染的虚拟dom；
2. insertedVnodeQueue: 一个数组，用于存储已经挂载的 vnode，确保它们的钩子函数正确地执行；
3. parentElm: 虚拟dom对应的父节点；
4. relElm: 参照物节点，用以标识vnode即将是在参照物节点之前还是之后插入；
5. nested: 一个布尔值，表示当前节点是否为嵌套节点；
6. ownerArray: 当前节点所属的数组，用来维护节点的位置信息；
7. index: 当前节点在其父级节点中的索引位置

**执行流程：**
![vue中createElm的过程](vue中createElm的过程.jpg)

:stars: 从上面我们可以看出`createElm`无非是根据tag标签类型，调用`document`的相关API动作来创建对应的真实Dom节点元素 :point_right: 这里有一个疑问 :confused: 就是如果待创建的节点是嵌套的孩子节点元素的话，那么它的创建顺序应该是怎样的呢？根据代码分析：*应该是从做往右一颗子树的创建完毕，才进入下一个节点的创建*

比如有 :point_down: 的一个代码：
```html
<div id="app">
  <div id="node2">
    <div id="node3">3</div>
    <div id="node4">4</div>
  </div>
  <div id="node5">5</div>
</div>
```
:point_down: 是对应的输出结果：
![创建的节点顺序结果](创建的节点顺序结果.png)
从这里的输出结果，我们可以得出 :point_down: 对应的一个节点创建的顺序：
![vue创建html的节点顺序](vue创建html的节点顺序.png)

###### 差分并更新新旧节点元素-patchVnode
> `patchVnode`函数是用于对比更新单个节点的，其差分的流程如下图所示：
![patchVnode的过程](patchVnode的过程.png)

:alien: 在vnode中存在着一个属性`isStatic`，该属性主要用来标识当前节点是否为**静态节点**，而所谓的静态节点，是指在编译阶段就已确定，不会发生变化的节点，通常包括纯文本节点、静态子节点等，这些节点在后续的更新过程中，不需要重新渲染和比对，就可以直接复用之前的渲染结果，从而提高渲染性能！！

:alien: 在vnode中存在着一个属性`isAsyncPlaceholder`，该属性用来标记当前节点是否为**异步组件的占位符**，而所谓的异步组件，就是指在Vue.js中，可以通过`Vue.component`方法来定义的组件，该函数的第二个参数是一个函数式组件，该组件会异步加载并渲染， :point_right: 当渲染异步组件时，会先渲染一个占位符，也就是`isAsyncPlaceholder`属性所在的节点，然后等待异步组件加载完成后，再将异步组件渲染到该节点位置上！！

:alien: 在vnode中存在着一个属性`isComment`，该属性用来标记当前节点是否为**注释节点**，就是`<!-- 这是注释 -->`，在虚拟DOM中，注释节点也可以被表示为一个虚拟节点对象，当渲染到注释节点时，会直接忽略该节点并继续往下渲染，而且需要注意 :warning: 的是**注释节点虽然不参与渲染，但是存在于DOM树中，因此可以通过DOM API 访问到注释节点，而且还可以在模版中使用注释节点来进行一些特殊处理，例如在模版中注释掉一些内容等**

:alien: 在vnode存在着一个属性`data.hook.prepatch`，该属性为一个函数回调，主要接收两个参数(旧的vnode，新的vnode)，用来在更新过程中标记是否需要执行一些预处理操作的标识属性，会在每次的`update`阶段被调用，并且会在执行真正的`patch`操作之前被调用，用来执行一些预处理操作！！
```javascript
new Vue({
  el: '#app',
  render: h => {
    data: {
      hook: {
        prepatch(oldNode, node){
          console.info('我是prepatch勾子方法！')
        },
        // 除了prepatch属性之外，还有update、postpatch
        update(oldNode, node){
          console.info('我是update勾子方法！')
        },
        postpatch(oldNode, node){
          console.info('我是postpatch方法！')
        }
      }
    }
  }
});
```
:stars: `hook`属性可用来注册一些生命周期函数，当一个节点需要被更新时，会依次执行`prepatch`、`update`、`postpatch`方法，分别代表节点更新前的预处理、节点更新时的处理以及节点更新后的处理动作！
:confused: 思考这样子的一个问题，如果想要在普通的template模版中使用这个hook的话，应该如何使用呢？
```vue
<template>
  <div
    :data="{hook: {postpatch: handlePostPatch}}"
  ></div>
</template>
export default{
  methods: {
    handlePostPatch(oldvNode, vNode){
      console.info('节点更新完成')
    }
  }
}
```

:alien: 在vnode中存在着一个属性`text`，该属性用来标识节点内包含的文本内容，如果该节点是一个纯文本节点，则`text`属性就是该节点的全部内容，如果该节点包含了其他的子节点，则`text`属性会被忽略，通常在更新的过程中判断节点是否需要重新渲染，如果一个节点的`text`属性没有发生变化，则表示该节点的内容没有被修改过，不需要重新渲染，否则渲染之！！


###### 更新真实的Dom元素-updateChildren
> `updateChildren`函数是用于对比新旧节点的孩子节点的关键函数。它是由 `patch` 函数内部调用的，用于处理同一层级下的多个子节点的更新！
> :point_down: 是对应的更新孩子节点的差分对比逻辑
![updateChildren的差分对比逻辑](updateChildren的差分对比逻辑.png)
