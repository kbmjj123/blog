---
title: vue源码学习与分析(二)：vue中的监听机制
description: vue是如何实现数据的双向绑定的？它是如何监听数据的？它是如何使用Object.defineProperty来实现数据的劫持监听更新的？本文将一一解答。
author: Zhenggl
date: 2023-05-15 22:53:27
categories:
  - [前端, 开发框架, vue]
tags:
  - 开发框架
  - vue
cover_picture: vue中的监听机制.jpg
---
### 前言
> `网络上充斥着一堆的看法，说这个`vue`是一个MVVM的前端框架，将双向数据绑定做了很好的实现。`
> :confused: 那么，什么是双向数据绑定？我们有必要学习这个双向数据绑定吗？`vue`是如何实现双向数据绑定的？为什么`vue`中的数据一更新，界面就会对应发生变化？
> :point_down: 我们带着着几个问题，来理解`vue`的双向数据绑定的过程，从更加深层次的角度来理解关于`vue`的一个执行过程，以便于自己后续在实际的项目coding过程中弄清一系列场景，编写更好的代码！

### 两种监听数据的方式
> 在学习了关于`vue`的相关源码(v2.7.x)之后，发现其中原来存在着两种完全不一样的数据监听方式：
> 1. 通过 `data` 对象来实现数据响应式;
> 2. 使用 `Watcher` 对象来监听数据变化
:confused: 那么这两种数据监听方式有什么区别呢？

| 数据监听方式 | 模式 | 触发机制 |
|---|---|---|
| 通过 `data` 对象来实现 | 自动配置，框架集成 | 通过`Object.defineProperty()`方法的回调来触发 |
| 使用 `Watcher` 对象来监听 | 手动配置，灵活运用 | 通过`proxy`机制 |

### 重要元素
> 在开始进行数据监听流程分析之前，需要先了解一下相关的角色元素，方便在实际的分析过程中快速分析，避免回过头来理解相关的概念！
1. [Watcher](#Watcher): 数据更新器；
2. [Dep](#Dep): 更新订阅管理器；
3. [Observer](#Observer): 数据响应包装器；
4. [Object.defineProperty](#Object的defineProperty): 对象数据定义；
5. [Proxy](#Proxy): js中的代理

#### Watcher
> `Watcher` 是一个观察者对象，用来监听数据的变化，并执行相应的回调函数。
> 每个 `Watcher` 对象都绑定了一个需要观察的**数据对象**和一个**回调函数**，当被观察的数据对象发生变化时，`Watcher` 对象会立即调用绑定的回调函数进行处理。
> 在 `vue` 中，`Watcher` 对象**通常用于实现数据依赖的自动更新**。
> 当一个组件中使用到了某个响应式数据对象(比如data或者props)时，`vue` 会自动创建对应的 `Watcher` 对象(在v2.7版本中，它是在数据的getter函数中创建的)，并将其添加到一个全局的 `Dep` 对象中。
> 当该数据对象发生变化时，`Dep` 对象会通知所有依赖于该数据对象的 `Watcher` 对象，让它们重新计算数据并更新视图。

**Watcher的组成**
![Watcher的组成](Watcher的组成.png)

**使用方式**
```javascript
const watcher = new Watcher(vm, function () {
  // 数据对象发生变化时执行的回调函数
  console.log('数据已更新')
})
```
:stars: 这里我们创建了一个 `Watcher` 对象，并将一个回调函数传入该对象的构造函数。当被观察的数据对象发生变化时，该回调函数会被调用，并在控制台中输出一条日志信息！

**参数说明**
`Watcher`构造函数有几个参数：
1. vm: 即将接收监听的数据所在的vm对象，便于往这个vm实例追加`_watcher`、push自身到`_watchers`数组中；
2. expOrFn: 可以是字符串也可以是函数类型，可用来做监听更新的普通触发函数(直接函数参数)，也可以从vm对象中的数据取出类似于`a.b.c`属性所对应的值的一个函数；
3. cb: 数据更新的回调方法；
4. options: 监听器参数；
5. isRenderWatcher: 是否为渲染函数的观察者(比如`new Vue({})`所创建的`Watcher`对象)

:warning: 在使用 `Watcher` 对象时，需要保证其回调函数具有幂等性，即多次调用该函数所产生的效果相同。这是因为在 `vue` 中，一个数据对象可能被多个 `Watcher` 对象同时观察，如果回调函数不满足幂等性，就会导致程序出现难以预料的错误！

#### Dep
> `Dep` 是一个依赖收集器，用来管理所有的 `Watcher` 对象。
> 每个 `Dep` 对象都维护了一个观察者列表，当被观察的数据对象发生变化时，`Dep` 对象会遍历其中的观察者列表，通知所有的 `Watcher` 对象更新数据！
> :trollface: `Dep`个人感觉就像是一个订阅管理器，负责管理着一系列订阅者(Watcher)，通过`push/remove`等操作，维护着`Watcher`对象列表，当数据更新时，通过`notify`的方式来通知所有的订阅者去触发自身的更新。而且还维护这个一个全局唯一的target对象(Watcher)，关于这个`target`的作用，我们在后续的流程分析中具体说明一下！

#### Observer
> `Observer` 是一个用于监听数据变化的核心类。
> `Observer` 的核心功能就是将一个普通的 `JavaScript` 对象转换成响应式对象(下面我称之为“响应化”)，并自动管理响应式数据的依赖关系！
![Observer构造函数](Observer构造函数.png)
:confused: 也就是说，当我们在`vue`中使用这个data属性返回一个对象的时候，这个对象就被“响应化”了，那么这个“响应化”的过程是怎样的呢(如下图所示)？
![数据响应化的过程](数据响应化的过程.png)

:point_right: 经过这个`Observer`对象包装后的对象，拥有了`__ob__`属性(核心属性：dep)，而且这个对象的每一个可枚举属性的`getter/setter`方法都进行了重载，使得对这个`getter/setter`方法的访问时，都自动地调用了自身额外追加的方法

#### Object的defineProperty
> `Object.defineProperty()` 是`js`中的一个内置方法，用于给一个对象**定义新的属性或者修改已有的属性**，并**指定该属性的属性描述符**，而关于对象的属性描述符包括有 :point_down: 几个属性：

| 属性 | 描述 | 默认值 |
|---|---|---|
| configurable | 表示该属性是否可被修改或者删除 | false |
| writable | 表示该属性是否可被修改 | true |
| enumerable | 表示该属性是否可枚举 | false |
| value | 表示该属性的值 | undefined |
| get | 表示该属性的getter函数，当访问该属性时会调用该函数 | - |
| set | 表示该属性的setter函数，当设置该属性时会调用该函数 | - |

:stars: 比如 :u6709: 以下的一个例子

{% codepen slug_hash:'abRgoRv' %}

:trollface: 在上面这个例子中，我们创建了一个 :u7a7a: 的obj对象，然后采用`Object.defineProperty()`方法给这个对象添加了一个`name`属性，可对其进行值的修改，如果我们将`writable`设置为false的话，那么将无法修改到这个`name`属性的值！
#### Proxy
> `Proxy` 是 JavaScript 的一个内置类，在 `ES6` 中被引入。
> 它可以拦截对一个对象的访问，从而允许我们修改对象的行为，并提供了一些附加的操作接口。
> 通过使用 `Proxy`，我们可以对 JavaScript 对象的访问进行自定义处理，以实现更强大、灵活的代码功能！
> `Proxy` 类提供了一系列的拦截器函数，包括 `get`、`set`、`has`、`deleteProperty`、`apply`、`construct` 等，每个拦截器函数都对应一个对象的行为。通过使用这些拦截器函数，我们可以灵活、自由地控制对象的行为，从而实现更高级的代码功能和逻辑
> 比如有下面 :point_down: 的一个例子：
```javascript
const obj = {
  firstName: 'Jack',
  lastName: 'Smith',
  age: 30
}

const proxyObj = new Proxy(obj, {
  get: function (target, key) {
    console.log(`Getting ${key} property`)
    return target[key]
  },

  set: function (target, key, value) {
    console.log(`Setting ${key} property to ${value}`)
    target[key] = value
  }
})
console.log(proxyObj.firstName) // "Getting firstName property"，"Jack"
proxyObj.age = 35 // "Setting age property to 35"
console.log(proxyObj.age) // "Getting age property"，35
```
:trollface: 在以上示例代码中，我们创建了一个普通的 js 对象 obj，然后创建了一个 `Proxy` 对象 proxyObj，并将 obj 对象作为其第一个参数。在第二个参数中，我们定义了两个拦截器函数：get 和 set。当我们访问 proxyObj 对象的属性时，会触发 get 拦截器函数，它会输出一段提示信息，并返回实际的属性值。当我们设置 proxyObj 对象的属性时，会触发 set 拦截器函数，它会输出一段提示信息，并将新的属性值保存到底层的 obj 对象中

### 不同方式的数据监听机制分析
> 接下来针对这两种方式具体分析对应的设计流程以及实际程序的运行过程分析，以及两者又是如何配合工作来完成整个vm实例的手动监听与自我监听的!！

#### Watcher手动监听模式
> :stars: 一切继续以`new Vue({})`开始！
> 按照之前文章的分析，这个`new Vue()`实例的创建，将会执行[mountComponent方法](/2023/05/15/study-of-vue-code-1/#mount方法的定义)，从这个`mountComponent`方法中，我们可以知道，创建一个组件，其实最终是：**创建了一个`Watcher`对象，并设置了这个Watcher对象的getter函数为一更新回调函数`updateComponent`，这个更新回调函数的目的是当需要更新界面时，自动重新计算vnode，然后渲染自身**！！

关于这个`Watcher`的工作过程如下图所示：
![Watcher的工作过程](Watcher的工作过程.jpg)

:interrobang: 上述过程中的`Watcher是如何被触发通知的呢`？需要结合 :point_down: 的`Object.defineProperty自动监听模式`来进行配合工作！！

#### Object.defineProperty自动监听模式
> 在 `vue` 中，当一个组件中使用到了某个响应式数据对象时，*`vue` 会自动创建对应的 `Watcher` 对象*，并将其添加到一个全局的 `Dep` 对象中。
> 当该数据对象发生变化时，`Dep` 对象会通知所有依赖于该数据对象的 `Watcher` 对象，让它们重新计算数据并更新视图!
:confused: 那么当我们定义了一个data对象的时候，这个时候在vue的领域内发生了什么事情呢？ :point_down: 是相关的代码块(隐藏其他相关的代码！)
![watcher与dep的代码层的合作监听](watcher与dep的代码层的合作监听.png)

#### 两者配合工作
> 在学习`vue`的监听分析过程中，只有将上述两者给结合起来，才是完整的`vue的数据双向绑定的原理过程`，其完成的工作流程如下图所示：
![数据监听泳道图](数据监听泳道图.png)

:trollface: 说白了可以简单地概括为 :point_down: 的一个简单的流程：
![数据双向绑定的简单过程](数据双向绑定的简单过程.png)

:question: 这里有一个疑问 :confused: 就是这个根节点组件的还好查看它的一个执行过程，但是，这个根节点组件上的子组件，它又是如何将这两者进行配合的吖？看着代码上好像没有这玩意的相关代码吖！
:point_right: 其实关于子组件的双向绑定，它也是遵循这样子的流程，只不过它的初始化创建比较的隐蔽而且不容易看出！
1. 首先，先思考一个问题，当我们通过`Vue.component()`方法来注册一个组件的时候，发生了什么事情?
```javascript
  // vue/src/core/global-api/assets.js
  export function initAssetRegister(Vue: GlobalAPI){
    // 这里简单调整了一下代码逻辑，仅展示有关的代码逻辑
    Vue['component'] = function(id: string, definition: Function | Object): Function | Object | void{
      definition.name = definition.name || id
      // 当我们通过`Vue.component()`时，其实调用的是Vue类的extend方法
      definition = this.options._base.extend(definition)
      this.options['components'][id] = definition
      return definition
    }
  }
  // vue/src/core/global-api/extend.js
  Vue.extend = function(extendOptions: Object): Function{
    const Sub = function VueComponent(options){
      this._init(options)
    }
    // 此处隐藏从Vue对象继承而来的相关代码逻辑，简而言之，就是从Vue父类(或者Vue的后代子类)中继承其属性以及方法，并且以父类的原型来创建一个新的原型，作为子类的原型，因此子类也就拥有了父类的所有属性以及API
    return Sub
  }
```
:trollface: 这里其实是创建了一个Vue子类对象函数，并将其存储在Vue实例的`components`属性中，以`key+value`的方式来存储

2. 然后，当根组件开始update更新操作的时候，遇到这个自定义组件的标签名称，会去从这个Vue实例中捞对应的`components`属性对象中捞，并将其作为自身的Ctor属性，也就是手这个Ctor就是 :point_up: 的`VueComponent`对象
```javascript
  // vue/src/core/vdom/create-element.js
  export function _createElement(){
    let Ctor = resolveAsset(context.$options, 'components', tag)
    vnode = createComponent(Ctor, data, context, children, tag)
  }
  // vue/src/core/util/options.js
  export function resolveAsset(){
    // 这里从vue实例对象中取components属性
    const assets = options[type];
    // 从assets中捞对应的属性值，也就是之前所存储下来的VueComponent(){}对象
    const res = assets[id]
    return res
  }
```
:trollface: 这里也就是将子组件找到，并存储到Vue实例中的components属性中，以便于后续更新时直接访问

3. 接着，安装hook，触发`VueComponent`组件的`_init()`方法，走与之前的`new Vue()`一样的流程
```javascript
  // vue/src/core/vdom/create-element.js
  export function _createElement(){
    // 第133行
    if(isUndef(Ctor.cid)){
      asyncFactory = Ctor
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
    }
    installComponentHooks(data)
  }
  // vue/src/core/vdom/create-component.js
  const componentVNodeHooks = {
    init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
      // 从组件实例对象中创建对应的孩子组件
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      // 调用每个孩子组件自身的$mount()方法
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  }
  function installComponentHooks (data: VNodeData) {
    // 将上述的componentVNodeHooks进行合并操作
  }
  // 也就是会先根据组件实例创建对应的组件对象，然后再触发该组件对象自身的$mount()方法
  export function createComponentInstanceForVnode (){
    // 这里的Ctor也就是之前最开始所创建的`VueComponent()`
    return new vnode.componentOptions.Ctor(options)
  }
```
:trollface: 这里也就是获取之前所存储的子组件Sub对象，然后通过`new VueComponent(options)`的方式，来创建一个新的孩子组件对象，而且在该构造调用的过程中，这个孩子组件会调用自身的`_init`，我们从之前的学习可以得知，这个`Vue()._init()`的过程，也就是将这个Sub组件中的`data()`函数所返回的对象的一个“响应化”包装，使得它其中的数据拥有了响应式的回调监听操作！然后再去触发该Sub组件自身的`$mount()`方法，那么这页将会是针对每一个组件都去new 出来一个`Watcher`对象，用来负责对自身进行一个监听与响应更新界面的`updateComponent`操作！

#### 对于数组的监听
> 我们知道数组中并无像`Object.defineProperty()`的方式来实现双向绑定，那么在`vue`的领域中，它是如何更新的呢？？当我们通过更新数组的时候，数组为什么能够做到对应更新界面的效果的呢？
> :confused: `vue`中将与数组相关的的操作数组API进行一层包装，然后在调用对应的包装方法的时候，去触发对应更新操作即可！
```javascript
// 获取原数组原型对象
const arrayProto = Array.prototype
// 从数组原型对象中创建新的对象，等待被包裹拦截
export const arrayMethods = Object.create(arrayProto)
// 整理待拦截处理的方法列表
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
methodsToPatch.forEach(function(method){
  // 获取原来的js数组方法地址
  const original = arrayProto[method]
  def(arrayProto, method, function mutator(...args){
    // 执行原始的js数组API方法
    const result = original.apply(this, args)
    const ob = this.__ob__  // 是一个Observer对象，提供对数组数据进行监听以及可通过引用的dep来触发通知机制
    let inserted
    switch(method){
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slige(2)
        break
    }
    if(inserted) ob.observeArray(inserted)
    // 这里就是真正的触发更新的地方！
    ob.dep.notify()
    return result
  })
})
```
:trollface: 也就是当我们调用的数组的API(比如push)，其实是调用的包装好的push方法，然后再自动调用`ob.dep.notify()`方法来触发更新操作的！

#### 总结
**针对上述的一个分析过程，我们可以对应得出以下的一个总结：**
1. 根节点组件与孩子组件一样，都通过`new vue/component`的方式来创建的，只不过创建的时机不同，component是在更新时才去创建的；
2. `Vue.components`或者`{components: {...}}`情况类型，只不过一个是全局的，一个是局部的，当然也可以在局部组件中通过`.component()`的方式来动态注册一个组件到当前组件下；
3. data数据被“响应化包装”的时候，所有的可枚举key对应的getter以及setter都被做了监听，当触发时getter负责收集依赖(Watcher)，而setter则负责触发getter收集到的依赖，由依赖自身去更新，触发对应的回调监听，实现界面的更新

### 我学到了什么
1. 什么是双向数据绑定？
:point_right: 当视图中的数据（如input字段）发生改变时，这些数据会自动同步到Vue实例中的数据属性上，同时，当Vue实例中数据属性改变时，视图也会自动更新以反映这些变化。这样，视图和数据属性之间的变化是相互关联的，称为双向数据绑定。

2. 我们有必要学习双向数据绑定吗？
:point_right: 学习了数据双向绑定的原理，可以更加深刻的理解关于vue组件数据监听与数据响应的底层工作原理，从而可以从提升编码性能方面来编写/优化相关的代码。

3. 是否可以模仿java中的extends继承，来实现component的父子继承关系？
:point_right: 答案是可以的！不过对于“基类”的定义以及实际具体子类的定义与使用，需要结合`vue`的生态来设计！
![vue中关于extend的灵活运用](vue中关于extend的灵活运用.png)
:trollface: 这里通过使用`extend`关键词，可实现类似于java中的继承关系，而且，还可以将继承的范畴提升至视图层，实现公共视图component的父子继承关系，比如有这样子的一个场景：项目有很多的场合需要定义不同的modal，但是将modal拆分出来之后，发现许多地方都需要自定义`v-model`的相关代码，代码重复冗余，因此可以定义这样子的一个组件，将相关的视图以及API定义其中，然后通过slot的方式来加载目标视图，而且还可以通过重载的方式，覆盖父类的相关属性/方法，实现具体的业务场景！！

:confused: 这里有一个情况，就是要继承(extend)的组件，他是一个组件，但是我们不想每一个页面都去做一个Page组件的注册动作，因此，我们可以将这个Page父类组件，定义为全局的组件，直接可在所有的组件中直接访问，省去重复编写的注册代码的目的！！！

:stars: 有的人可能会认为没有必要用`Vue.extend`，可以直接使用`mixin`来替代， :confused: 是的，没有错，可以直接使用`mixin`来替代这个`Vue.extend`，将公共部分进行混入，但是不建议全局混入，除非是确定不会与其他的场景冲突的，否则应该考虑局部混入：比如我有这样子的一个场景，我需要针对page页面以及modal窗口视图进行公共的混入，那么可以是抽离公共的部分，然后定义两个`mixin`对象，按需混入！！

4. 异步导入组件时，当被导入的组件过大，可能会出现空白的状态，是否可以提供对应的loading效果？
:point_right: 在学习这个源码的过程中，无意中看到 :u6709: :point_down: 的一段代码：
```javascript
export function resolveAsyncComponent (){
  // 这里在resolve component的时候，是可以根据组件是否有loading状态，对应返回这个组件的loadingComp组件效果的
  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }
}
```
:stars: 也就是说，我们可以通过在异步导入组件的时候，追加一个loading字段，代表加载中的组件效果使用方式如下：
```javascript
import Loading from './Loading.vue'
export default{
components: {
    Com: () => {
      return {
        loading: Loading,
        component: import('./Com.vue')
      }
    }
  }
}
```