---
title: 深入浅出Vue.extend
author: Zhenggl
date: 2021-05-11 15:59:00
categories:
    - [开发框架, vue]
tags:
    - vue
cover: vue-extend-study.jpeg
---

### 前言
---
Vue.extend作为一全局api，作为我们去实现编程式组件的重要途径，所以我们通过源码学习的方式，来加深对Vue.extend函数的理解，通过以下几个问题的解读，来对Vue.extend深入学习
+ Vue.extend在Vue中的用途？
+ 讲解下Vue.extend的内部实现？
+ 实现一个编程式组件，具体的思路应该式怎样？

### Vue.extend的深入
#### 基本用法
**参数**：[Object] options

**用法**：使用基础Vue构造器，创建一个"子类"，参数式一个包含组件选项的对象，data选项是特例，需要注意⚠️下【Vue.extend()中data必须是函数。】
```javascript
  // 创建构造器
    var Profile = Vue.extend({
      template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
      data: function () {
        return {
          firstName: 'Walter',
          lastName: 'White',
          alias: 'Heisenberg'
        }
      }
    })
    // 创建 Profile 实例，并挂载到一个元素上。
    new Profile().$mount('#mount-point')
```
结果如下：
```html
  <p>Walter White aka Heisenberg</p>
```
#### 源码分析
以下是Vue.extend的源码
```javascript
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name)
    }

    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
```
#### 源码导读
1、
```javascript
  extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
```
首先，extendOptions使用我们传递进入的模版，这里面的`this`就是调用extend的对象，也就是`Vue`，然后将其保存到Super变量中，SuperId变量保存着Vue中的唯一标识(`每个实例都有自己唯一的cid`)。
2、
```javascript
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }
```
这一段是作为缓存策略用的，后面提及到。
3、
```javascript
  const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name)
    }
```
看传递进来的模版中是否有包含name属性，如果没有则用父组件的name，然后对name通过validateComponent函数进行校验，主要判断就是name不能是html元素或者非法命名。

![validateComponent](vue-validate-component.png)

4、
```javascript
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
```
👆创建一个子类Sub，通过继承的方式，使得Sub拥有了Vue的能力，并且添加了唯一id(每个组件的唯一标识符)
5、
```javascript
  Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
  Sub['super'] = Super
```
👆调用了mergeOptions函数，实现了父类选项与子类选项的合并，并且子类的super指向了父类
6、
```javascript
  if (Sub.options.props) {
      initProps(Sub)
  }
  if (Sub.options.computed) {
  	initComputed(Sub)
  }
```
👆初始化props和computed
7、
```javascript
  // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)
```
👆将父类的方法复制到子类，包括有`extend, mixin, use, component, directive, filter`，还有新增属性`superOptions, extendOptions`
8、
```javascript
  // cache constructor
    cachedCtors[SuperId] = Sub
```
👆与之前的代码结合，将父类的id保存在子类的属性上，属性值为子类，在之前会进行判断如果构造过子类，就直接将父类保存过的id值返回了，避免重复初始化Sub

* 整体来说，就是创建了一个Sub函数并继承了父Vue或其孩子组件 *
#### 手动实现一个编程式组件
一般我们在使用组件的时候，都会现注册组件，再在模版中使用，如果我们想要想`element-ui`中的$message那样子直接通过命令来调用，那该有多方便吖
```javascript
  this.$message.success('成功');
```
##### 创建一个组件，用于编程式调用的
```vue
  // toast.vue
  <template>
    <div v-show="isShow">{{ message }}</div>
  </template>
  <script>
    export default{
      data(){
        return {
          message: '',
          isShow: false
        }
      },
      methods: {
        show(message, duration = 3000){
          this.message = message;
          this.isShow = true;
          setTimeout(() => {
            this.isShow = falsel
            this.message = '';
          }, duration);
        }
      }
    }
  </script>
```
👆组件比较简单，就是实现一个简单的吐司功能
##### 实现编程式
```javascript
  // plugins/toast.js
  import Toast from './toast';
  export default {
  	install(Vue){
  		// 创建Sub构造器
  		const ToastConstrutor = Vue.extend(Toast);
  		// 以new的方式，根据Sub构造器，创建一个游离的组件实例
  		const toast = new ToastConstrutor();
  		// 获取到组件的html内容
  		const toastTpl = toast.$mount().$el;
  		// 将html内容插入到document中
  		document.body.appendChild(toastTpl);
  		Vue.prototype.$toast = toast;
  	}
  }
```
上述定义了一个插件，然后我们在main.js应用程序入口处，将插件进行使用
##### 在main.js中注册
```javascript
  import Vue from 'vue';
  import toast from '/plugins/toast.js';
  Vue.use(toast);
```
##### 在实际的组件中使用
```javascript
  this.$toast.show('你真帅吖！！！');
```
这样子我们就可以在项目的各个位置上调用了
#### 总结
Vue.extend总体来说其实就是创建一个类(函数)来继承于父类，顶级一定是Vue，这个类就表示一个组件，我们可以通过`new`的方式来创建。
