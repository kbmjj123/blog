---
title: vue源码学习与分析(五)：业界关于vue使用过程中提升性能的编码习惯
description: 本文整理了业界关于一些提升vue编程的编码习惯，从源码的角度来分析为什么要这样子提出，为什么要这样子使用的一个原因，从底层角度来理解这样子优化的一个目的！
author: Zhenggl
date: 2023-05-15 22:53:43
categories:
  - [前端, 开发框架, vue]
tags:
  - 开发框架
  - vue
cover: vue常用技巧封面.jpg
---

### 前言
> 业界网络上关于提升vue编程 :u6709: 不少的编程技巧，而且之前自己更多的是拿来就直接用了，也不清楚为什么需要这样子写？
> 在学习了关于`vue`的源码之后，觉得很有必要来针对这些优化技巧提供适当、合理的一个解释！

:point_down: 是关于网络上所提及的关于提升`vue`编程性能的一些小技巧：
1. [在使用`v-for`指令进行循环的时候，需要针对每一个item提供对应唯一的key作为属性，这样子可以提供渲染的性能](#1-在`v-for`中使用`key`属性)；
2. [合理使用 `v-if` 和 `v-show`：`v-if` 在条件为 `false` 时会完全销毁元素及其事件监听器和子组件，而`v-show` 只是简单地隐藏元素。因此，在频繁切换一个元素的显示状态时，应该使用 `v-show`](#2-合理使用-v-if-和-v-show);
3. [避免在模板中使用复杂表达式：复杂的表达式会增加渲染的时间，可以把计算逻辑放到 `computed` 或者 `methods` 中](#3-避免在模板中使用复杂表达式);
4. [合理使用计算属性和 `watch`：计算属性具有缓存机制，只有在依赖的变量发生变化的时候才会重新计算，而 `watch` 监听变量的变化，当变量发生变化时就会触发函数执行](#4-合理使用计算属性和-watch);
5. [采用异步组件和路由懒加载：将一个大型应用拆分成小块，并根据需要动态加载可以提高应用的性能](#5-采用异步组件和路由懒加载);
6. [合理使用 `v-cloak` 指令：在渲染大量静态内容时，使用 `v-cloak` 可以避免页面出现闪烁的问题](#6-合理使用-v-cloak-指令);
7. [减少渲染的次数：频繁地修改数据会导致 Vue 不停地重新渲染，可以使用 `debounce` 或者 `throttle` 等方式控制渲染的频率](#7-减少渲染的次数);
8. [及时销毁不再使用的组件：在组件不再使用时，调用 `$destroy()` 方法销毁组件及其相关资源](#8-及时销毁不再使用的组件);
9. [调用实例的`$mount()`方法，如果没有传递参数的时候，为什么是创建一个游离的真实DOM的过程呢？](#9-$mount()的过程)
10. vue中的style标签中的scope设置了之后，为什么就能够解决全局冲突的问题
11. [vue在使用的过程中往this追加新的变量，并在对应的template中监听该变量，为什么界面没有对应的更新？](#11-data响应化的过程)
12. [避免在`v-for`指令中使用`v-if`](#12-v-for与v-if不同时作用于一个节点上)

### 1. 在`v-for`中使用`key`属性
> 在使用`v-for`指令进行循环的时候，需要针对每一个item提供对应唯一的key作为属性，这样子可以提供渲染的性能

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

### 2. 合理使用 `v-if` 和 `v-show`
> `v-if` 在条件为 `false` 时会完全销毁元素及其事件监听器和子组件，而`v-show` 只是简单地隐藏元素。
> 因此，在频繁切换一个元素的显示状态时，应该使用 `v-show`来对组件进行控制。而`v-if`一般用于盘点组件是否显示！

### 3. 避免在模板中使用复杂表达式
> 复杂的表达式会增加渲染的时间，可以把计算逻辑放到 `computed` 或者 `methods` 中

### 4. 合理使用计算属性和watch
> 计算属性(computed)和观察者(watch)是`vue`框架中国呢两个非常重要的概念，能够帮助我们更方便地管理组件数据，虽然这两个特性可以互换使用，但是两者的实际场景还有有所区别的！

{% codepen slug_hash:'yLQOdbN' %}

:trollface: 总的来说，计算属性`computed`适合用于计算复杂的、依赖其他数据的值；而观察者`watch`适合用于监听数据的变化并执行一些自定义操作。如果想根据特定的数据变化或事件来执行某些操作，那么应该选择观察者；如果需要计算某个值，并在多个地方使用它，那么应该选择计算属性。

### 5. 采用异步组件和路由懒加载
> 将一个大型应用拆分成小块，并根据需要动态加载可以提高应用的性能，因为如果将所有的组件都放到一饿文件中的话，生成的js将会非常的巨大，特别是随着业务的发展，如果将所有的组件以及对应的js都放到一个文件中来维护的话，将造成巨大的编码维护成本，而且也导致加载缓慢，出现白屏。 
> :point-right: 因此，需要一个复杂的业务组件，拆分为足够细的小组件，而且，如果小组件还是比较大的话，可以考虑将该小组件采用异步加载的方式，也就是说，异步加载的方式，可以是路由异步加载，也可以是组件内的异步加载！
> 从而减少白屏的时间，采用分片段加载的方式来加载页面组件！

### 6. 合理使用 `v-cloak` 指令
> 在渲染大量静态内容时，使用 `v-cloak` 可以避免页面出现闪烁的问题

### 7. 减少渲染的次数
> 频繁地修改数据会导致 Vue 不停地重新渲染，可以使用 `debounce` 或者 `throttle` 等方式控制渲染的频率

### 8. 及时销毁不再使用的组件
> 在组件不再使用时，调用 `$destroy()` 方法销毁组件及其相关资源

### 9. $mount()的过程
:confused: 首先先来开一下官方的一个说法：{% link "`vm.$mount(elementOrSelector)`" "https://v2.cn.vuejs.org/v2/api/#vm-mount" true `vm.$mount(elementOrSelector)` %}
1. *如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素*
2. *如果没有提供 elementOrSelector 参数，模板将被渲染为文档之外的的元素，并且你必须使用原生 DOM API 把它插入文档中*
3. *这个方法返回实例自身，因而可以链式调用其它实例方法*

:point_up: 这里的描述是官方的一个说法，实际上这里的`$mount()`方法，到了最终的`patch()`方法的时候，如下图所示：
![mount未提供参数的描述](mount未提供参数的描述.png)
:stars: 从这里我们可以看出，当我们没有传递对应的`el属性`给`$mount()`方法时，将直接调用`createElm()`进行一个真实的DOM节点元素的创建， :warning: 而且，由于没有传递对应的目标父节点，因此，这里仅仅是创建出来一个游离的真实DOM的过程！！

### scope的过程

### 11. data响应化的过程
> 从之前的关于vue双向绑定的过程分析可以得知，当我们在`data()`函数中返回一对象的时候，是将这个对象中的基本数据类型的属性进行一个响应式监听的操作，也就是`new Observer()`的过程，才可以在数据变动的时候，对应触发相关的回调操作

{% codepen slug_hash:'OJaNKQN' %}

:stars: 从上述的例子我们可以看出，当我们通过追加属性的方式，往obj对象中追加b属性的时候，对应模版中的b属性的值并不能正常地被展示出来，而当我们通过`vm.$set()`的方式来往`obj`对象中追加属性的时候，就可以实现界面的对应更新， :warning: 这里有另外一个需要注意的是，我们在`$set`之后，又调用了`vm.$forceUpdate()`方法，才使得界面上的b能够正常展示对应的值出来， :confused: 这里是为什么呢？ :point_right: 因为我们通过`this.$set()`方法的时候，我们仅仅是往这个obj对象中追加了一个b属性，并设置了对应响应式`getter/setter`操作而已，此时并没有触发这个回调，它只在下次回调中将更新，但是这里的值已经不是原来的值了，因此，需要通过调用`this.$forceUpdate()`flush掉vue中的等待更新池子中的动作，也就是主动触发这个`setter`方法，让界面自动重新`render()`

:confused: 那么这个`this.$set()`的过程是怎样的呢？为什么调用了它就能够触发页面的更新？ :point_right: 猜测应该也是直接/间接用的watcher来更新的！
```javascript
export function stateMixin(Vue){
  Vue.prototype.$set = set
}
export function set(target: Array|Object, key: any, val: any){
  // 待处理的对象是一个数组对象
  if(Array.isArray(target) && isValidArrayIndex(key)){
    target.length = Math.max(target.length, key)
    // 这里将触发splice包装后的拦截方法，将会触发对应的Watcher对象更新
    target.splice(key, 1, val)
    return val
  }
  // 如果这个属性已经在对象中了
  if(key in target && !(key in Object.prototype)){
    target[key] = val
    return val
  }
  // 获取之前是否有监听过的标志(即Observer对象)
  const ob = target.__ob__
  if(!ob){
    // 如果这个对象还没有被监听(即无需监听)，则将直接保留忽略监听
    target[key] = val
    return val
  }
  // 以下是对象属性的设置监听
  defineReactive(ob.val, key, val)
  ob.dep.notify() // 触发更新机制 
  return val
}
```

### 12. v-for与v-if不同时作用于一个节点上
> :confused: 在实际的编码过程中，我们有可能会在一个节点标签上既使用`v-for`又使用`v-if`指令，但是，在实际的编码过程中，尽量是减少这样子的编写，
> 为什么要减少这样子编写的一个习惯呢？
> :point_down: 已一个实际的例子来对比分析两者的一个区别：
```html
  <div id="app">
    <button @click="showP">显示文本</button>
    <p v-if="showMe">我是被隐藏的文本</p>
    <ul>
      <li v-for="(item, index) in msgList">{{ item + '-' + index }}</li>
    </ul>
	</div>
	<script src="../dist/vue.js"></script>
	<script>
		var vm = new Vue({
			el: '#app',
			data() {
				return {
          showMe: false,
					msgList: [
            '我是文本标题',
            '我是文本标题',
            '我是文本标题'
          ]
				}
			},
      methods: {
        showP(){
          this.showMe = true;
        }
      }
		})
	</script>
```
:trollface: 我在源码处将这个过程的代码字符串进行了一个输出，结果如下：
```javascript
  with (this) {
    return _c("div", { attrs: { id: "app" } }, [
      _c("button", { on: { click: showP } }, [_v("显示文本")]),
      _v(" "),
      showMe ? _c("p", [_v("我是被隐藏的文本")]) : _e(),
      _v(" "),
      _c(
        "ul",
        _l(msgList, function (item, index) {
          return _c("li", [_v(_s(item + "-" + index))]);
        }),
        0
      ),
    ]);
  }
```
:stars: 从上面我们可以发现这个`v-if`指令，他是在编译阶段的时候，采用**三目运算**的方式来进行可选择性地渲染: `showMe ? _c("p", [_v("我是被隐藏的文本")]) : _e()`，而`v-for`指令，则是实现类似于js中的array的map方法一样的逻辑，遍历`msgList`变量，转换为一个个的创建虚拟dom的方式：
```javascript
  _c(
        "ul",
        _l(msgList, function (item, index) {
          return _c("li", [_v(_s(item + "-" + index))]);
        }),
        0
      )
```

:confused: 这里，如果我们将`v-if`加到`v-for`指令中的话，生成的代码字符串又会是怎样的呢？ :point_down:
```javascript
  _c(
        "ul",
        _l(msgList, function (item, index) {
          return index % 2 === 0
            ? _c("li", [_v(_s(item + "-" + index))])
            : _e();
        }),
        0
      ),
```
:alien: 当我们添加的`v-if`指令到`v-for`指令中之后，将会到时在`类似list.map()`方法中遍历的时候，都进行了`if`判断，增加了运算的复杂度(假如if判断比较复杂的话)，即使在实际渲染时大多数循环都不满足条件。这会导致生成的 DOM 树更加庞大，影响页面渲染速度！！！