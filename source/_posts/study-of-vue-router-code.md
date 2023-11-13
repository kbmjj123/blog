---
title: vue-router的用法与源码学习
description: 学习如何使用vue-router，并从源码层面理解其中的加载原理，深入剖析关于异步加载是如何实现的？以及理解这个component最终使如何被“嵌入到”RouterView中的？组件之间的关联关系是如何建立起来的？以及滚动条的位置记录是如何实现的？
author: Zhenggl
date: 2023-06-09 18:49:51
categories:
  - [前端, 开发框架, vuex]
tags:
  - 开发框架
  - vue-router
cover: vue-router封面.png
---

### 前言
> 在之前vue全家桶项目中，对于`vue-router`的使用，爽得不要不要的，:confused: 那么，我们是否有思考过，这个`vue-router`的工作过程是怎样的？它是如何设计的？为什么我们简单通过配置一张“路由表”，就可以实现整个web应用的路由控制功能？在路由表中它与`component`组件的关联是如何被建立起来的？懒加载机制是如何实现的？为什么在任意组件中通过`watcher $route`就可以自动检测到路由发生了变化，并触发监听函数的？这个`RouterView`究竟是何方神圣，凭什么它能够“装载”component，并让component按照自身的钩子函数去执行？
> :point_down: 将通过分析`vue-router`的源码执行过程，顺带resolve这些问题！

*`Vue Router` 是 `Vue.js` (opens new window)官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：*
1. 嵌套的路由/视图表
2. 模块化的、基于组件的路由配置
3. 路由参数、查询、通配符
4. 基于 Vue.js 过渡系统的视图过渡效果
5. 细粒度的导航控制
6. 带有自动激活的 CSS class 的链接
7. HTML5 历史模式或 hash 模式，在 IE9 中自动降级
8. 自定义的滚动条行为

### vue-router的使用
{% codepen slug_hash:'MWzajVx' %}
:trollface: 从上面我们可以晓得关于`vue-router`使用的一般流程如下：
1. 导入`VueRouter`，并使用`Vue.use(VueRouter)`声明将要使用插件；
2. 使用`VueRouter`来创建一个router路由器对象，维护好`path`与`component`的关系；
3. 根据实际需求，对创建出来的`router`进行相关的钩子函数的追加，一般有：`beforeEach`、`beforeResolve`、`afterEach`、`onError`这些钩子函数的监听；
4. 创建Vue实例对象，并将`router`作为其中的一个opionts的属性来传递

### vue-router的注册
:confused: 为什么我们平时在使用这个`vue-router`的时候，可以直接通过`this.$router`的方式，来访问到上面所创建出来的`VueRouter`对象的呢？
:point_right: 一切从`Vue.use(VueRouter)`开始，我们知道当执行这个`use()`方法的时候，会从插件中找寻`install`属性，并执行该方法，:point_down: 是对应的 函数体内容：
```javascript
export function install(Vue){
  Vue.mixin({
    // 通过Vue.mixin混入这个beforeCreate，将Vue实例中的router属性存储到Vue实例中的_router属性中，并触发router的init方法，并将Vue实例作为参数进行传递
    beforeCreate(){
      // 由于这里是混入，最终将由Vue实例调用，因此这里的this是Vue实例！
      this._routerRoot = this
      this._router = this.$options.router
      // 这里触发的路由VueRouter对象的初始化方法
      this._router.init(this)
      Vue.util.defineReactive(this, '_route', this._router.history.current)// 往Vue实例中追加_route当前路由属性，而且该属性定义为响应式的！
    }
  })
  // 在原型上定义的$router路由器对象，可直接在其实例对象中通过$router/$route访问到！
  Object.defineProperty(Vue.prototype, '$router', {
    get() { return this._routerRoot._router }
  })
  Object.defineProperty(Vue.prototype, '$route', {
    get() { return this._routerRoot._route }
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)
}
```

:confused: 那么这个Router做了什么事情呢？ :point_down: 将从组成路由的各个元素以及它们的一个执行过程来详细分析一波！

### vue-router的组成
> `vue-router`机制主要由`Router`为入口，然后在该入口下进行一系列的相关的操作！

#### Router
![Router的成员](Router的成员.png)
:stars: 从上面我们可以看出，平时我们经常使用的相关属性与API，都是在这个Router中定义的！下面来简单针对其中的一些元素进行一个分析：

| 属性 | 类型 | 描述 |
|---|---|:---|
| app | any(Vue) | 缓存的vue实例 |
| readyCbs | `Array<Function>` | 路由准备好的回调函数集合 |
| mode | string | 当前路由模式，将影响链接的表象形式以及后续的跳转方式 |
| history | `History` | 自定义类型，用户处理真实各种跳转方式的对象 |
| matcher | Matcher | 自定义类型，主要用于处理从路由配置清单列表匹配出对应的路由记录 |
| beforeHooks | `Array<NavigationGuard>` | 由守卫函数组成的一数组对象，存储的全局路由守卫函数，用于处理在开始进入组件前的操作 |
| resolveHooks | `Array<NavigationGuard>` | 同`beforeHooks`，用于处理组件被resolve时的操作 |
| afterHooks | `Array<NavigationGuard>` | 同`beforeHooks`，用于处理进入组件后的操作 |

:alien: 那么当我们`new VueRouter()`的时候，发生了什么事情呢？
```javascript
export default Router{
  constructor(options){
    // 创建了一个Matcher对象
    this.matcher = createMatcher(options.routes || [], this)
    // 根据当前的mode分配对应的history对象
    switch(mode){
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
    }
  }
}
```
#### Matcher
:point_up: 在`new VueRouter()`的时候创建了一个`Matcher`对象，那么这个对象有什么用？可用来做什么的？

:point_right: *`Matcher`是一个匹配器对象，用于实现路由的匹配和解析*，`Matcher`对象内部维护了一个路由映射表，记录了路径(`path`)到路由记录(`RouteRecord`)的映射关系，以便于后续在路由匹配时进行查找和匹配。
![路由清单matcher化的过程](路由清单matcher化的过程.png)
:point_up: 从上面可以看出，在创建`Matcher`对象的过程中，顺便将这些路由规则转换为多个路由记录(`RouteRecord`)，并将这些路由记录保存在路由映射表中。

:alien: 在进行路由匹配的时候，`Matcher`对象会从路由映射表中查找符合当前路径的路由记录，并将这个路由记录存储在一个`match`数组对象中，然后递归渲染匹配到的所有路由记录所对应的组件，**也就是说match中保存的是任何匹配到path的所有路由记录**，当我们进行路由跳转修改了当前的路径时，`Matcher`对象会重新匹配路由记录并更新组件，从而实现路由的切换和动态更新！

:confused: **那么，我们所定义的组件component，它是如何被加载到以及被渲染的界面上的呢？**
从上面[vue-router的注册](#vue-router的注册)我们可以知道初始化完成之后，将直接进入`Router.init()方法`，在该方法中调用的`history.transitionTo()`方法，这就是路由开始发生的地方了！！！

#### History
> `vue-router`中的`History`主要用于操作路由，当我们通过`this.$router.push`其实本质上是调用的`history.push`动作
> 那么，当我们执行的`this.$router.push`的时候，发生了什么事情呢？

##### transitionTo()方法
> 当我们调用的`this.$router.push`的时候，调用了`history.transitionTo()`方法，该方法的大致内容如下：
```javascript
// location是待跳转的目标地址
  transitionTo(location, onComplete, onAbsort){
    // 根据目标路由，从原本路由清单中匹配到路由对象Route
    let route = this.router.match(location, this.current)
    this.confirmTransition(route, () => {
      // 执行的成功回调函数
      this.updateRoute(route) // 更新当前路由，这个对于后续的更新机制很重要！！！
    },() => {
      // 执行的错误回调函数
    })
  }
```
:stars: 从上面我们可以看到，这里的实现，还是由这个`confirmTransition`方法来实现的，关于该方法的内容如下：
```javascript
  confirmTransition(route, onComplete, onAbort){
    // ...这里隐藏匹配同个路由的逻辑
    //***   这里一整段的代码块，主要是提取每一个即将要激活/失活的组件，组装它们的一个守卫函数，形成一个待执行的数组队列
    const { updated, deactivated, activated } = resolveQueue(
      this.current.matched,
      route.matched
    )
    // 这里的queue也就是由各个组件的守卫(独享以及全局)组合而成的数组
    const queue: Array<?NavigationGuard> = [].concat(
      extractLeaveGuards(deactivated),
      this.router.beforeHooks,
      extractUpdateHooks(updated),
      activated.map(m => m.beforeEnter),
      resolveAsyncComponents(activated)
    )
    const iterator = (hook, next) => {
      // 这里的hook其实就是queue中的每一个守卫函数(from, to, next=>{})
      hook(route, current, to => {
        //...这里隐藏一系列关于next()方法的参数判断逻辑
        if (typeof to === 'object' && to.replace) {
          this.replace(to)
        } else {
          this.push(to)
        }
      })
    }
    // 这里就是遍历执行queue中的每一个守卫函数！
    runQueue(queue, iterator, () => {})
  }
```
:trollface: 从上面我们可以得出以下一个结论：
**一个完整的路由守卫钩子函数的执行过程：deactived->beforeEach->update->组件独享的beforeEnter->进入组件**

:star: 关于`runQueue`方法的定义如下：
```javascript
  // fn是上面的iterator迭代器函数，cb是执行成功后的回调
  export function runQueue(queue, fn, cb){
    const step = index => {
      if(index >= queue.length){
        cb()
      }else{
        if(queue[index]){
          fn(queue[index], () => {
            step(index + 1)
          })
        }else{
          step(index + 1)
        }
      }
    }
    step(0)
  }
```
:star: 从这里可以看出`runQueue`无非是**按照顺序来执行queue中的每一个守卫函数**

##### 组件渲染的过程-resolveAsyncComponents
:confused: 但是，还是未能解决这个`component是如何被渲染出来的？`这个疑惑！
:point_right: 可以从 :point_up: 的`resolveAsyncComponents`方法中看出：
:stars: 首先，这个函数的返回值也必须是一个守卫函数的格式：
```javascript
export function resolveAsyncComponents(matched){
  return (to, from ,next) => {
    // flatMapComponents用于将异步加载的路由组件转换为对应的 VNode 组件，并通过递归调用自身来处理嵌套组件的情况
    flatMapComponents(matched, (def, _, match, key) => {
      const resolve = resolvedDef => {
        if (isESModule(resolvedDef)) {
          // 如果是同步组件，则直接返回其component
          resolvedDef = resolvedDef.default
        }
        def.resolved = typeof resolvedDef === 'function'
          ? resolvedDef
          : _Vue.extend(resolvedDef)  // 这里如果是访问时才异步加载的组件，则采用Vue.extend来创建一个子组件来使用
        // resolve到组件之后，将组件存储到components属性后，待后续使用！！！
        match.components[key] = resolvedDef
      }
      let res = def(resolve, reject)
      if(typeof res.then === 'function'){
        res.then(resolve, reject)
      }else{
        const comp = res.component
        if (comp && typeof comp.then === 'function') {
          comp.then(resolve, reject)
        }
      }
    })
  }
}
```
:confused: 找到组件之后，界面它是如何渲染出来的呢？？？
:point_right: 这里之前阅读代码的时候，我们 :u6709: 做了一个标记，就是有 :point_down: 两个地方可解决这个渲染契机问题：
```javascript
  // 在VueRouter的install方法中，将_route设置为响应式，也就是当它被赋值的时候，将对应触发已设置的Watcher对象
  Vue.util.defineReactive(this, '_route', this._router.history.current)
  // 在base.js中的comfirmTransition方法的回调方法中调用的
  this.updateRoute(route)
  // 而updateRoute方法的内容如下
  updateRoute (route: Route){
    this.current = route
    this.cb && this.cb(route)
  }
```
:trollface: 也就是说，当这个`route`被更新的时候，将触发对应的`Watcher`对象，进入其`update()`方法，然后进入到界面的`render()`方法中！而在`RouterView`组件(该组件是一个函数式组件)中，将直接通过`createComponent()`方法，从上面异步加载的过程所加载到的component组件(已经自带Ctor构造函数)，在之前的文章学习可以得知，最终是通过Ctor构造函数(也就是VueComponent方法)，来`new Ctor()`创建对应的一个组件，并走原本的组件的生命周期钩子方法，最终将组件给渲染出来！！！！

:point_down: 是关于这个猜想的一个验证：
![被监听的路由route实现的Watcher](被监听的路由route实现的Watcher.png)
![自定义的route的setter监听](自定义的route的setter监听.png)

#### History
:point_down: 是关于`History`的成员组织结构图：
![history的组织结构](history的组织结构.png)
:stars: :point_down: 将对比两种常见的`History`，以便于在实际的项目应用中选择适合的方式来使用：

<table>
  <thead>
    <tr>
      <th colspan="2">History</th>
    </tr>
    <tr>
      <th>HTML5History</th>
      <th>HashHistory</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: left;">
        <div style="padding-left: 8px;">描述：</div>
        <p style="padding: 8px;">
          HTML5History是vue-router中使用的HTML5 History API来实现前端路由的方案。
          在HTML5History下，我们所有的路由路径都会被转换为类似于 http://localhost:8080/path/to/route 的URL，当用户点击浏览器的前进或者后退按钮导致URL发生变化时，HTML5History会通过监听popstate事件来捕捉这些变化，并派发一个路由变化事件，通知router对象进行响应的路由操作。
        </p>
      </td>
      <td style="text-align: left;">
        <div style="padding-left: 8px;">描述：</div>
        <p style="padding: 8px;">
          HashHistory是vue-router中使用bash(即URL中的#符号)来实现前端路由的方案。
          在HashHistory下，我们所有的路由路径都会被转换为类似于 http://localhost:8080/#/path/to/route 的URL，当用户点击浏览器的前进或后退按钮导致URL发生变化时，HashHistory会通过监听hashchange事件来捕捉这些变换，并派发一个路由变化事件，通知router对象进行相应的路由操作。
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align: left;">
        <div style="padding-left: 8px;">优点：</div>
        <ul>
          <li>URL更加美观，利于SEO优化；</li>
          <li>可以监听URL中任意部分的变化，更加精细地控制路由；</li>
          <li>不会造成URL带有特殊字符的问题。</li>
        </ul>
      </td>
      <td style="text-align: left;">
        <div style="padding-left: 8px;">优点：</div>
        <ul>
          <li>兼容性好：支持所有现代浏览器；</li>
          <li>部署简单：可以将网站部署在任务服务端上；</li>
          <li>不需要使用HTML5 History API，可以充分利用浏览器的默认行为。</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="text-align: left;">
        <div style="padding-left: 8px;">缺点：</div>
        <ul>
          <li>兼容性较差：只支持HTML5标准中定义的浏览器；</li>
          <li>部署较为麻烦：需要服务器进行配置，避免与服务器端的路由发生冲突；</li>
          <li>不支持IE8及其以下浏览器。</li>
        </ul>
      </td>
      <td style="text-align: left;">
        <div style="padding-left: 8px;">缺点：</div>
        <ul>
          <li>URL不够美观，不利于SEO优化；</li>
          <li>只能监听hash值的变化，无法监听URL中其他部分的变换；</li>
          <li>如果URL中包含敏感信息，可能会造成安全问题</li>
        </ul>
      </td>
    </tr>
  </tbody>
  <tfooter>
    <th colspan="2" style="padding: 8px;">
      两者都是vue-router中内置的历史模式，当我们的应用需要考虑SEO以及URL友好性问题时，可以考虑使用HTML5History，反之则可采用HashHistory，那么我们可以简单得出一个结论：
      <p style="color: #ff3328;">
        一般情况下，后台类管理系统优先考虑采用HashHistory，而需要SEO自然浏览的应用，则采用HTML5History模式
      </p>
    </th>
  </tfooter>
</table>

#### Route
:confused: 那么，我们所定义的路由配置都有哪些成员呢？
![RouteConfig的属性](RouteConfig的属性.png)
这里具体可以参考官方的关于{% link routes参数描述 https://v3.router.vuejs.org/zh/api/#routes true routes参数描述 %}

#### RouteRecord
> [上面](#matcher) 提及到路由记录，那么路由记录中的成员都有哪些？它们都代表的什么意思呢？
1. path: 路径字符串；
2. regex: 用于匹配路径的正则表达式；
3. components: 一键值对对象，记录了该路由记录所对应的组件，一般只有一个default组件，如果在定义路由时使用了命名路由的话，则将拥有其他的组件，关于命名路由，具体可以了解一下官网关于{% link 命名路由 https://v3.router.vuejs.org/zh/guide/essentials/named-routes.html true 命名路由 %}；
4. instances: 一个记录当前路由记录对应组件实例的对象；
5. name: 用于命名路由；
6. parent: 用于指定父级路由记录；
7. beforeEnter: 当前组件独享的进入组件前的路由守卫

#### RouterView
> 用户承载每一个匹配到的component，是一个函数式组件
> `RouterView`是`vue-router`提供的一个组件，用于渲染当前路由对应的组件，当我们在路由配置中制定了某个路由路径和该路径所对应的组件时，`RouterView`就会动态地将该组件渲染到模版中。

:confused: 为什么要将这个`RouterView`设计为函数式组件呢？
:point_right: 首先，需要明白什么是函数式组件？函数式组件是指没有状态(没有响应式数据)且没有实例(没有`this`上下文)的组件，其渲染结果只依赖于传递进来的`props`属性以及所在上下文环境，因此函数式组件的渲染性能通常比普通组件的要好。
其次，虽然`RouterView`组件被设计为函数式组件，但是在渲染的过程中，它还是需要依赖于`router`实例和当前的路由状态，因此在使用`RouterView`时，仍然需要将其包裹在一个普通组件内，将`router`实例和当前的路由状态传递给`RouterView`

#### RouterLink
> `RouterLink`是`vue-router`提供的一个组件，用于在模版`template`中创建链接，使我们可以在单页应用中进行页面跳转。
> 可以最大限度地减少手动编写路由链接所带来的代码荣誉问题，同时也保证路由链接的正确性与一致性。
```vue
<template>
  <div>
    <h1>My App</h1>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>
```
:stars: 上面的示例代码中，使用了`RouterLink`组件来创建3个链接，其中的`to`属性表示该链接的目标路径，当用户点击这些链接时，`RouterLink`会通过调用`router.push()`或`router.replace()`方法，根据当前的路由历史模式处理URL地址，并让`router`对象进行相应的路由操作！

#### scroll的形成与自定义配置


### 延伸思考
1. 我能够模仿`vue.component`或者`vue实例中的components`来注册一个个路由，并通过统一的控制来处理这个组件的loading效果，也就是实现组件的统一loading效果？