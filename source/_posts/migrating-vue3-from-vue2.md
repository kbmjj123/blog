---
title: 从vue2迁移到vue3的编码实战思考
description: 本文整理了关于从vue2迁移到vue3的实际项目的相关过程记录，并记录迁移过程中的思考与猜测，整理vue2与vue3项目编码上的不同点，加深对vue3项目的理解
author: Zhenggl
date: 2023-09-11 22:12:28
categories:
  - [开发框架, vue3]
tags:
  - vue
  - vue3
  - typescript
  - vite
keywords: vue 2 to vue 3 migration, composition API, optinos API, 数据绑定, 响应式系统, vuex迁移, 单文件组件迁移, 自定义指令迁移, 代码重构, 工具和插件支持, 兼容性考虑
cover: vue2往vue3的迁移之路.jpg
---

### 前言
> 习惯了`vue2全家桶`项目的开发，突然转向`vue3`，如果单纯的使用*选项式*的模式来编写vue3的项目的话，与`vue2`并没有太大的差别，无非是将data从原本的`data(){}`函数中转移到了`setup()`函数中而已，但在`vue3`中提供了另外一种*组合式*编程的模式，让我们能够以**函数调用**的方式来编写对应的项目，下面将通过实际的项目编码方式上的对比，来进行整理两者之间的一个区别，加深对`vue3`项目的理解！

### 项目实战
> :point_down: 基于 :one: 开源的项目进行学习与分析:
![实战项目目录](实战项目目录.png)
:point_up: 是对应的项目的源码目录，主要 :u6709: api、assets、components、hooks、icons、locates、plugins、router、store、styles、utils、views，下面将一一分析每个文件夹中都代表着什么意义，以及以下都有哪些文件资源，都有各自对应的什么内容！

#### 1、api
> 一般是前端项目中与业务相关的接口定义，可根据实际业务场景情况进行定义，一般是通过调用公共的`axios`工具类，来对外暴露业务本地化调用的接口，但是在以前我们所编写的方法中，我们一般是通过接收`url+params`的方式，来发起的接口调用，而且在调用的过程中，根本不知道应该传递的什么参数，即将响应的响应体是怎样的，通过`typescript`，可以在编写代码的时候，就晓得应该传递的什么参数，即将返回的结果又是怎样的？如下图所示：
![api业务调用](api业务调用.png)
:stars: 这里我们通过`typescript`所提供的函数参数类型定义，采用对象字面量的方式，来进行参数化提示的代码编写方式！

#### 2、assets
> 资源目录文件夹，主要包括有`*.json`、`相关的图片`等静态资源，用户本地代码直接访问用途；

#### 3、components
> 项目中所使用到的组件，可根据实际情况将其拆分为`全局共享型`与`业务共享型`，对于频繁使用的组件，虽然`vue3`可以不用显示地在每个组件中去注册，但总需要`import`进来使用，可使用全局注册组件的方式: `app.component('组件名称', 导入的组件)`
> :trollface: 而且关于组件的定义，有 :two: 种方式来定义：
* SFC(Single File Component): 单文件组件(*.vue)，一般是通过`template` + `script` + `style`来组成组件；
* defineComponent: 调用一函数来注册一组件，通过传递的`options对象`来实现一函数的创建；

#### 4、hooks
> 提供的公共的全局组合式函数，关于组合式函数的描述与使用场景，可见{% link "vue官网" "https://cn.vuejs.org/guide/reusability/composables.html" true vue官网 %} 具体的描述，通过利用这个*组合式函数*，将公共的逻辑部分进行一个抽离，并可以结合vue3所提供的`h`函数，来创建具有全局逻辑的响应式数据以及全局逻辑封装其中的组件，可作为替代`vue2中的mixin`机制，同时也可作为函数式组件来直接使用：
![组合式函数组件](组合式函数组件.png)

#### 5、icons
> SVG图片来源定义目录，一般定义的一SVG图片组件

#### 6、locates
> 多语言包的相关目录，借助于`vue-i18n`三方库的实现
:point_right: 关于该三方库的描述，见 {% link "i18n官网" "https://vue-i18n.intlify.dev/" true i18n官网 %} 的描述

:alien: 关于这个`vue-i18n`的简单使用如下：

:one: 首先创建一`i18n`实例，并对外提供相关的API：
```typescript
// 可以将这个实例的创建，放到单独的ts文件中来进行统一维护
import { createI18n } from 'vue-i18n'
const i18n = createI18n({
  locale: 'zh-CN',  // 一般是将这个参数给store化以及本地化，实现缓存控制
  fallbackLocale: 'en-US',
  allowComposition: true,
  // messages则代表项目中每个字段所对应的关键词，用于后续在js代码中或者template模版中使用
  messages: {
    'en-US': enUS,
    'ko-KR': koKR,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'ru-RU': ruRU,
  },
})
export const t = i18n.global.t  // 对外暴露对应的在js中调用的api
// 对外提供将在app上使用的全局实例
export function setupI18n(app: App) {
  app.use(i18n)
}
```
:two: 关于 :point_up: 中使用的每个语言包的格式定义如下：
```typescript
  export default{
    // 这里根据实际业务场景进行一个个字符串的声明
    common: {
      add: '添加',
      addSuccess: '添加成功',
      edit: '编辑'
    }
  }
```
:three: 在template模版中或者在js代码中使用：
```vue
<template>
  <!-- i18n提供了隐式全局模版可访问的api，因此可以直接在对应的模块中直接调用对应的api -->
  <NTabPane name="local" :tab="$t('store.local')"></NTabPane>
</template>
<script setup lang='ts'>
  import { t } from '@/locales'
  message.error(t('store.addRepeatTitleTips'))
</script>
```
:confused: 如果我们需要占位符的字符串展示的话，我们可以借助于在配置中定义占位符的方式来使用国际化的字符串：
```typescript
  export default {
    common: {
      editRepeatContentTips: '内容冲突{msg} ，请重新修改'
    }
  }
  // 然后在对应的t方法调用中传递对应的参数
  t('common.editRepeatContentTips', {msg: '我是对应的占位字符串'})
```
:trollface: 这里有一个疑问 :confounded: ，就是如果展示的文案内容是来自于后台的响应的话，那么这里应当如何做到全局统一配置比较好呢？ :point_right: 个人的猜想可以是将这个字符串key与后台协商好，返回的在语言包中定义的一关键词key(比如是：common.addMsg)，然后在对应的语言包中预先声明好即可，也就是后台返回的预先定义在语言包中的相关key属性！！！

#### 7、plugins
> 插件目录，一般用于对*HTML*进行额外的追加动作，一般是对html的原生层面的“加持”，比如是追加的样式，追加的meta等等，由于是动作，所以一般可定义为一函数，在`main.ts`应用程序入口来使用，在`main.ts`中来直接调用！！！

#### 8、router
> 与`vue2`中所使用的`vue-router`无异，用于路由器的定义，只不过替换为一方法的调用来创建一路由器对象！！！

#### 9、store
> 与`vue-vuex`使用类似，只不过升级为`pina`，去除了`mutations`，同样也是以`state + getters + actions`来组成，无需显示地合并到统一的一store出口，可凭借最终的`/store/index.ts`来对`modules`中各个业务模块中的store进行统一的对外暴露！！

#### 10、styles
> 项目所需的样式，一般包括全局样式+局部的样式+三方库的样式！！

#### 11、typings
> 项目的编译器类型定义目录，主要讲当前项目/库中所涉及的对象类型进行一全局的定义，使得编译器以及ide能够识别并补货编写异常的代码，主要包括 :u6709: :point_down: 几种类型的声明：
* 业务方面的声明(*.d.ts)；
* 环境变量的声明(env.d.ts)；
* 全局变量的声明(global.d.ts)：可通过`interface window{}`来对window全局变量进行扩展
  ```typescript
    interface Window {
      $loadingBar?: import('naive-ui').LoadingBarProviderInst;
      $dialog?: import('naive-ui').DialogProviderInst;
      $message?: import('naive-ui').MessageProviderInst;
      $notification?: import('naive-ui').NotificationProviderInst;
    }
  ```

#### 12、utils
> 项目中所需的工具文件目录

#### 13、views
> 实际的页面组件！

### 迁移后的思考
:trollface: 由于采用了**组合式**编程的方式来编写代码，这边简单整理了 :point_down: 几个编写要点，以便于后续更好的来编写`vue3`的相关代码：
1. 项目中可以说是没有了`this`关键词的使用，并且采用的`commonjs`来对外暴露的api，尽量采用局部暴露的方式来暴露，:point_right: 可以在使用的时候按需使用，而且无需整个js文件直接导入来使用；
2. 使用`use*`开头的组合式函数，替代了`mixin`以及函数式组件，封装的逻辑更加简洁以及组件更加干练；
3. 组合式函数，个人角度认为就是使用`vue3`所提供的api，来产出“响应式的数据”或者“函数式组件”的目的；
4. 尽量使用`async` + `await`，保持代码的简洁性；
5. `vue2`中用得比较爽的一个场景，就是通过`this.$XXX()`方法，可直接通过实例的$XXX()方法，来调用我们的某个组件，而免去导入组件，注册组件，并通过标识来控制组件的显隐，到了`vue3`，已经没有了`this`关键词的使用，也就没有了实例的直接调用，但我们可以通过一个间接的方式：
   ```typescript
    function registerNaiveTools() {
      window.$loadingBar = useLoadingBar()
      window.$dialog = useDialog()
      window.$message = useMessage()
      window.$notification = useNotification()
    }
    const NaiveProviderContent = defineComponent({
      name: 'NaiveProviderContent',
      setup() {
        registerNaiveTools()
      },
      render() {
        return h('div')
      },
    })
   ```
   :stars: 这里通过`defineComponent()`API来创建一临时组件，并在该组件中的`setup()`方法中注册相关的全局API到window对象中， :confused: 这样子之后，就可以通过`window.$dialog()`的方式，在任何一处代码位置来发起全局调用的动作！！！
