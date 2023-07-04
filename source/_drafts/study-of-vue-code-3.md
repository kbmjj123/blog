---
title: vue源码学习与分析(三)：业界关于vue使用过程中提升性能的编码习惯
description: 本文关于vue指令是什么？如何使用指令？如何自定义自己的执行？并从源码的角度来分析使用了指令的过程，使得对vue指令有一个深刻的认识！
author: Zhenggl
date: 2023-06-19 23:37:00
categories:
  - [前端, 开发框架, vue]
tags:
  - 开发框架
  - vue
---

### 前言
> 在编写`vue`项目的过程中，指令应该是相当的熟悉的了
> *Vue 指令是一种特殊的 `HTML` 属性，具有 `v-` 前缀，用于在模板中声明性地绑定数据并对 `DOM` 进行操作。指令可以被绑定到 `HTML` 元素、组件和相应的模板语法中。*
> 在 `Vue` 中，指令本质上就是实现了一个自定义操作的 `JS` 函数，该函数接受两个参数：绑定元素 (el) 和指令对象 (binding)。
> 指令对象包含了一些指令相关的信息，例如指令名称、表达式、修饰符等。

### 官方的v指令都有哪些
> 官方指令一览

| 指令 | 描述 |
|---|:---|
| 条件指令 | 用于做条件渲染，包括整个if家庭(`v-if`、`v-else`、`v-else-if`) |
| v-text | 用于对整个节点赋值文本内容 |
| v-html | 用于更新元素的innerHTML |
| v-show | 用于切换一个元素的显示与隐藏 |
| v-for | 类似于`array.map()`，用于将一个列表数据转换为元素列表 |
| v-on | 缩写：`@`，用于捆绑事件监听 |
| v-bind | 缩写：`:`，用于将变量与属性进行捆绑，使得属性参数化 |
| v-model | 在表单控件或者组件上创建双向绑定 |
| v-slot | 缩写：`#`，提供具名插槽或需要接收 prop 的插槽 |
| v-pre | 跳过这个元素和它的子元素的编译过程 |
| v-cloak | 保持在元素上直到关联实例结束编译，然后才展示 |
| v-once | 只渲染组件以及子组件一次，可用于提升渲染性能 |

### 指令的构成
![v指令解析](v指令解析.png)
*一个指令对象一般包含有 :point_down: 几个钩子函数:*
+ bind: 只调用一次，指令第一次绑定到元素时调用，一般可以在该方法中进行初始化设置动作；
+ inserted: 被绑定元素插入到父节点时调用；
+ update: 所在组件的VNode更新时调用，**但可能发生在其子VNode更新之前**，指令的值可能发生了改变，也可能没有；
+ componentUpdated: 指令所在组件的VNode及其子VNode全部更新后调用；
+ unbind: 指令与元素解绑时调用。

![指令钩子函数参数说明](指令钩子函数参数说明.png)

### 如何使用指令
```html
<template>
  <div>
    <p v-my-directive="value"></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 'Hello, World!'
    }
  },
  directives: {
    'my-directive'(el, binding) {
      // 操作 DOM 元素或执行其他逻辑
      el.innerText = binding.value
    }
  }
}
</script>
```
:trollface: 我们自定义了一个名为 `my-directive` 的指令，并将其绑定到一个 p 标签上。
当组件渲染时，Vue 会自动调用 `my-directive` 函数，并传入该标签的元素对象和指令对象。
在该函数内部，我们可以对元素进行操作，例如将元素的 `innerText` 设置为指令表达式的值。

### 指令的解析与执行过程
> :confused: 那么这个指令的执行过程是怎么来的呢？
> 我们做一个大胆的猜想，既然他是直接操作的DOM来处理的，那么在vue的渲染阶段，应该是可以看到关于指令的影子的，最后，我们在patch.js中找到关于关于指令的执行流程

#### 钩子函数的顺序确定
```javascript
// vue/src/platforms/web/runtime/patch.js
import baseModules from 'core/vdom/modules/index'
export const patch: Function = createPatchFunction({nodeOps, modules})
```
```javascript
// vue/src/core/vdom/patch.js
export function createPatchFunction(backend){
  const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
  let i, j
  const cbs = {}
  const { modules, nodeOps } = backend
  for(i = 0; i < hooks.length; ++ i){
    cbs[hooks[i]] = []
    for(j = 0; j < modules.length; ++j){
      if(isDef(modules[j][hooks[i]])){
        //将匹配到的钩子方法进行存储，也就是指令钩子函数
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }
}
```
:trollface: 然后，我们发现这里所缓存下来的`cbs`都在各个与指令的钩子函数相关的地方有调用到：
```javascript
// createElm创建组件时时，触发对应的invokeCreateHooks
function invokeCreateHooks(vnode, insertedVnodeQueue){
  for(let i = 0;i < cbs.create.length; ++i){
    cbs.create[i](emptyNode, vnode)
  }
}
// removeVnodes销毁组件时触发钩子invokeDestroyHook
function invokeDestroyHook(vnode){
  let i, j
  for(i = 0;i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
}
// 更新组件时，对应触发指令的update钩子方法
function patchVnode(...){
  for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
}
```
:point_right: 因此，指令的钩子函数对应的触发契机也就确定下来了！！

#### 钩子函数的被执行过程
> 那么这个钩子函数的执行过程是怎样的呢？请看下述的相关代码：
```javascript
export default {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode: VNodeWithData) {
    updateDirectives(vnode, emptyNode)
  }
}
// 统一的指令更新入口
function updateDirectives (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode)
  }
}
```
:stars: 可以看出，最终都调用的`_update(oldVnode, vnode)`方法
```javascript
function _update(oldVnode, vnode){
  const isCreate = oldVnode === emptyNode //如果旧节点是空节点，则表示该节点即将被创建
  const isDestroy = vnode === emptyNode //如果新节点是空节点，则表示该节点即将被销毁
  // 从新旧虚拟node中获取各自的指令
  const oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context)
  const newDirs = normalizeDirectives(vnode.data.directives, vnode.context)
  const dirsWithInsert = [] // 缓存的待插入的指令函数
  const dirsWithPostpatch = []  // 缓存的待更新的指令函数
  let key, oldDir, dir
  for(key in newDirs){
    // 开始遍历新的指令集合
    oldDir = oldDirs[key]
    dir = newDirs[key]
    if(!oldDir){
      // 如果旧的指令不存在，则说明是新增的动作，将执行bind动作
      callHook(dir, 'bind', vnode, oldVnode)
    }else{
      // 如果旧的指令存在，则说明是更新操作，将执行update动作
      dir.oldValue = oldDir.value
      dir.oldArg = oldDir.arg
      callHook(dir, 'update', vnode, oldVnode)
    }
  }
}
```
:trollface: 这也就是`bind`与`update`钩子方法执行的契机，通过对比新旧虚拟node中的统一名字的指令，来判断是新增还是更新操作！
:confused: 那么另外的`insert`以及`componentUpdated`钩子方法，是在什么时候被调用的呢？
```javascript
// 这里续上面的方法
for(key in newDirs){
  if(!oldDir){
    // 如果旧的指令不存在，则说明是新增的动作，将执行bind动作
      if(dir.def && dir.def.inserted){
        // 如果指令定义了inserted方法
        dirsWithInsert.push(dir)
      }else{
        //如果旧的指令存在，则说明是更新操作，将执行update动作
        if(dir.def && dir.def.componentUpdated){
          dirsWithPostPatch.push(dir)
        }
      }
  }
}
if(dirsWithInsert.length){
  const callInsert = () => {
    for(let i = 0;i < dirsWithInsert.length; i++){
      // 触发指令的inserted钩子方法
      callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode)
    }
  }
  if(isCreate){
    // 如果是新增的节点，则合并执行insert动作
    mergeVNodeHook(vnode, 'insert', callInsert)
  }else{
    // 非新增节点，则触发指令的insert动作
    callInsert()
  }
}
if (dirsWithPostpatch.length) {
  mergeVNodeHook(vnode, 'postpatch', () => {
    for (let i = 0; i < dirsWithPostpatch.length; i++) {
      callHook(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode)
    }
  })
}
if (!isCreate) {
    // 节点被销毁，则相应执行其unbind操作
    for (key in oldDirs) {
      if (!newDirs[key]) {
        callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy)
      }
    }
  }
```
:stars: 从上面的关于指令的执行过程的分析可以得知，指令其实就是一个个的具有特定意义的函数钩子所组成的函数对象集合体，它在节点的渲染期间对待操作的节点进行DOM级别的操作，从而更新的界面上！！

### 个别指令分析
> 本文从常用的指令中挑出几个来进行详细的说明，从而更加深入地理解指令设计的合理！

#### v-if
> `v-if`是一个特殊的指令，他并非在执行`render()`渲染函数的时候去对应生成指令的，而是在解析html的时候就已经完成条件渲染的准备工作，如下所示：
```javascript
(function anonymous() {
    with (this) {
        return _c('div', {
            attrs: {
                "id": "app"
            }
        }, [(showMe) ? _c('p', [_v("我是被隐藏的文本")]) : _e()])
    }
}
)
```
:trollface: 也就是说`v-if`是生成的三目运算符方式来执行的js代码！！！ 

#### v-show
> 频繁的切换一个节点元素可见或者隐藏！
> 假如是我们自己来实现的话，应该是控制这个节点元素的`display`css属性，通过控制`none`以及原始属性，来达到控制一个元素显隐的效果
```javascript
export default{
  bind(el, {value}, vnode){
    const originalDislay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display
    if(value){
      vnode.data.show = true
      enter(vnode, () => {
        el.style.display = originalDisplay
      })
    }else{
      el.style.display = value ? originalDisplay : 'none'
    }
  }
}
```
:trollface: 从上面我们可以看出就是单纯的`display`状态切换的过程！！

:confused: 当我们在模版中使用了指令的时候，vue将其解析成为如下的代码字符串：
![vue带指令的解析v-show](vue带指令的解析v-show.png)
:point_right: 然后再转换为vnode来进行渲染操作，我们所传递给指令的`参数`、`指令修饰符`、`指令参数`，都一一成为对应的指令对象的属性！

#### v-model


### 如何自定义自己的指令
1、声明指令，重载其`bind`等相关钩子方法，在各个钩子方法中各自去实现对应的效果；
2、注册该指令，通过`Vue.directive()`或者在组件内部声明该`directives`属性；
3、在模版html中使用指令