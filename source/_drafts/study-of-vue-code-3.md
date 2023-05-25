---
title: vue源码学习与分析(三)：业界关于vue使用过程中提升性能的编码习惯
description: 本文整理了业界关于一些提升vue编程的编码习惯，从源码的角度来分析为什么要这样子提出，为什么要这样子使用的一个原因，从底层角度来理解这样子优化的一个目的！
author: Zhenggl
date: 2023-05-15 22:53:43
categories:
  - [前端, 开发框架, vue]
tags:
  - 开发框架
  - vue
cover_picture:
---

### 前言
> 业界网络上关于提升vue编程 :u6709: 不少的编程技巧，而且之前自己更多的是拿来就直接用了，也不清楚为什么需要这样子写？
> 在学习了关于`vue`的源码之后，觉得很有必要来针对这些优化技巧提供适当、合理的一个解释！

:point_down: 是关于网络上所提及的关于提升`vue`编程性能的一些小技巧：
1. [在使用`v-for`指令进行循环的时候，需要针对每一个item提供对应唯一的key作为属性，这样子可以提供渲染的性能](#1-在使用v-for指令进行循环的时候需要针对每一个item提供对应唯一的key作为属性这样子可以提供渲染的性能)；
2. 合理使用 `v-if` 和 `v-show`：`v-if` 在条件为 `false` 时会完全销毁元素及其事件监听器和子组件，而`v-show` 只是简单地隐藏元素。因此，在频繁切换一个元素的显示状态时，应该使用 `v-show`;
3. 避免在模板中使用复杂表达式：复杂的表达式会增加渲染的时间，可以把计算逻辑放到 `computed` 或者 `methods` 中;
4. 合理使用计算属性和 `watch`：计算属性具有缓存机制，只有在依赖的变量发生变化的时候才会重新计算，而 `watch` 监听变量的变化，当变量发生变化时就会触发函数执行;
5. 采用异步组件和路由懒加载：将一个大型应用拆分成小块，并根据需要动态加载可以提高应用的性能;
6. 合理使用 `v-cloak` 指令：在渲染大量静态内容时，使用 `v-cloak` 可以避免页面出现闪烁的问题;
7. 减少渲染的次数：频繁地修改数据会导致 Vue 不停地重新渲染，可以使用 `debounce` 或者 `throttle` 等方式控制渲染的频率;
8. 及时销毁不再使用的组件：在组件不再使用时，调用 `$destroy()` 方法销毁组件及其相关资源;
9. [调用实例的`$mount()`方法，如果没有传递参数的时候，为什么是创建一个游离的真实DOM的过程呢？](#9-调用实例的mount方法如果没有传递参数的时候为什么是创建一个游离的真实dom的过程呢)
10. vue中的style标签中的scope设置了之后，为什么就能够解决全局冲突的问题

### 1. 在使用`v-for`指令进行循环的时候，需要针对每一个item提供对应唯一的key作为属性，这样子可以提供渲染的性能
:confused: 而且在以前较低版本的vue中，如果没有为每一个item提供对应唯一的key的话，还会导致渲染异常问题，也就是有可能数据变化了，但是界面没有更新，或者是更新错乱了！
但是在新的版本中，这个已经不存在了，比如 :u6709: 下面的一个例子：
{% codepen slug_hash:'zYmbLEW' %}
从上面的例子我们可以看出这里我们并没有使用到这个`key`属性，但是它也能够正常的使用，变换数组的顺序，对应的列表也能够正常地展示出来！

:confused: 那么，是否意味着我们可以不需要为每一个item添加这个`key`属性了呢？ :point_right: 答案肯定不是的，来看下方的一个代码片段：
```javascript
// patch中提供的一方法，用于检测孩子节点是否使用了一样的key
  function checkDuplicateKeys (children) {
    const seenKeys = {}
    for (let i = 0; i < children.length; i++) {
      const vnode = children[i]
      const key = vnode.key
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            `Duplicate keys detected: '${key}'. This may cause an update error.`,
            vnode.context
          )
        } else {
          seenKeys[key] = true
        }
      }
    }
  }
  // 而在对应的updateChildren方法中，有以下一段代码
  function updateChildren(){
    // ...此处隐藏一系列代码
    // 如果新的开始节点定义了key，则在旧的key集合中找到对应的旧节点下标，否则直接从旧的孩子节点集合中匹配并放回对应下标
    idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]// 这里oldKeyToIdx是孩子数组所形成的一个key构成的map对象
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
  }
  // 而这里的findIdxInOld方法内容如下
  function findIdxInOld (node, oldCh, start, end) {
    for (let i = start; i < end; i++) {
      const c = oldCh[i]
      if (isDef(c) && sameVnode(node, c)) return i
    }
  }
```
:stars: 从 :point_up: 的代码分析我们可以得出 :point_down: 的一个结论：

**如果没有定义key属性在孩子节点中的话，在寻找更新的节点时，将依次从旧的孩子节点集合中遍历寻找，直到找到完全一样(sameVnode)的节点，才返回其node的当前索引下标，而且每次的更新都是通过数组的遍历匹配寻找到对应的下标，才进行后续的更新操作！**

:trollface: 如果孩子节点过多的话，性能也就大大地降低了，因此， :point_right: 在使用`v-for`指令的时候，需要将代表唯一的`key`属性补充上！！！

### 9. 调用实例的`$mount()`方法，如果没有传递参数的时候，为什么是创建一个游离的真实DOM的过程呢？
:confused: 首先先来开一下官方的一个说法：{% link "`vm.$mount(elementOrSelector)`" "https://v2.cn.vuejs.org/v2/api/#vm-mount" true `vm.$mount(elementOrSelector)` %}
1. *如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素*
2. *如果没有提供 elementOrSelector 参数，模板将被渲染为文档之外的的元素，并且你必须使用原生 DOM API 把它插入文档中*
3. *这个方法返回实例自身，因而可以链式调用其它实例方法*

:point_up: 这里的描述是官方的一个说法，实际上这里的`$mount()`方法，到了最终的`patch()`方法的时候，如下图所示：
![mount未提供参数的描述](mount未提供参数的描述.png)
:stars: 从这里我们可以看出，当我们没有传递对应的`el属性`给`$mount()`方法时，将直接调用`createElm()`进行一个真实的DOM节点元素的创建， :warning: 而且，由于没有传递对应的目标父节点，因此，这里仅仅是创建出来一个游离的真实DOM的过程！！