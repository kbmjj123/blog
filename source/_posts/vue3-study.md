---
title: vue3全家桶学习
description: 学习关于如何使用vue3全家桶来开发项目的一般流程，并向typescript过渡的过程文档记录，便于由(js+vue2+vue-cli)向(ts+vue3+vite)进行过渡，并提供了个人对vue3项目采用ts3进行编码思维的见解!
author: Zhenggl
date: 2023-08-30 08:02:22
categories:
  - [开发框架, vue3]
tags:
  - vue
  - vue3
  - typescript
  - vite
keywords: Vue.js 3, Vue 3全家桶, Vue Router 4, Pina, Composition API, 响应式编程, 组件化开发, Vue3性能优化, Vue3架构设计, Vue3常见问题接单, Vue3中的Typescript支持, Vue3生态系统, Vue3最佳实战
cover: vue3全家桶封面.jpeg
---

### 前言
> 在从以前`vue2`项目中转向`vue3`的领域，据网上说好像有很大的性能以及编码速度的提升空间，感觉已经迫不及待要来接触这个领域，看看`vue3`是如何“征服”`vue2`的开发者的，它与之前使用`vue2`所开发出来的项目 :u6709: 什么区别？ :u6709: 什么优势？？？

> 在通读了一遍vue3的官方文档 {% link "vue3官方文档" "https://cn.vuejs.org/guide/introduction.html" true vue3官方文档 %} 之后，感觉编码习惯 :u6709: 一定的区别，虽然`vue3`支持“选项式(与vue2编码方式类似)”与“组合式”的编码方式，但在经过简单的练手之后发现，组合式的编码方式能够在一定程度上减少代码量，而且更多地是以函数的思维来编写代码，而且与`vue3`的其他框架能够无缝衔接！！

> :confused: 但是，这边也 :u6709: 几个问题，结合以前所开发的项目来进行提问，并在后续的学习过程中将来分析解决这些问题：
1. vue3中通过`import`语法来引入vue3的相关API方法(比如ref)，然后直接调用，在以前vue2中是直接在`data`函数中返回的对象中声明，其他API方法也是如此，因为在编写`vue3`的**SFC**组件的时候，这些API应该都会被直接调用，那么是否可以将这个`import`给去掉，然后直接来调用呢？
2. vue3中通过vue的API创建的变量与函数越来越多了，后期感觉难以维护(虽然可以拆分为各个子组件，但同时需要维护数据的通讯)，创建出来的变量好像就是一个个游离的元素一般，后期应当如何来进行管理？
3. vue3没有了过滤器，应当如何来处理过滤器filters在项目中所带来的便利性问题？
4. vue3中仅保留了选项式可用的`extends`与`mixin`关键词，那么对于组合式的编程，应该采用什么方式来实现组件的复用与继承机制呢？
5. 既然vue3提供了两种编码方式，那么在实际项目过程中，应当采用哪种方式呢？


### 脚手架创建项目
> 这里使用`create-vue`命令来创建对应的`vue3+js`的项目，借助于脚手架，可快速创建vue3全家桶项目，以及`prettier`、`lint`、`test框架`、`typescript`语法支持，:confused: 个人感觉后续可以在这个脚手架的基础上进行一个二次研发，添加自己所维护的其他额外的项目基础框架服务

#### 最简单的vue3项目(js版本)
:point_down: 从项目的目录结构以及文件内容来简单分析一下`vue3`项目与`vue2`项目的不同

##### 目录结构分析
> js版本的vue3项目，其目录结果如下图所示：
![基本项目目录结构](基本项目目录结构.png)
:stars: 从这里我们可以看到，`vue3`与`vue2`的项目目录结构没有太大的区别，除了 :point_down: :two: 个点：
1. vue.config.js替换为了vite.config.js，配置文件发生了改变，因为`vue2`使用的是vue-cli服务来运行的，而`vue3`则采用了`vite`来运行的，两者 :u6709: 着本质上的区别，vue-cli基于webpack来进行打包的，而 {% link "vite" "https://cn.vitejs.dev/" true vite %} 则基于 {% link "rollup" "https://rollupjs.org/" true rollup %} 的基础上来进行打包；
2. index.html入口文件由原本的public目录迁移到了跟目录了；

##### 部分文件内容分析
> 下面将对部分页面内容进行简单的分析：
1. index.html
   ![index.html入口文件引用main.js.png](index.html入口文件引用main.js)
   :stars: 从`index.html`入口文件我们可以发现，它这里所采用的是原生ESM语法的script标签，关于ESM(ES6 Module)的兼容性见 {% link "ESM兼容性" "https://caniuse.com/es6-module" true ESM兼容性 %}，目前整体的兼容性还是比较高的，高达94.97%，因此，我们有理由可以认为这里是直接加载main.js来运行的js代码。
2. main.js
   ![main.js使用import语法来导入](main.js使用import语法来导入.png)
   :stars: main.js则直接使用`import`语法来进行的编程，通过导入对应的模块来直接调用，同样也可认为是普通的js调用代码，而这个`import`原生导入语法，其兼容性也可从 {% link "import语法" "https://caniuse.com/es6-module-dynamic-import" true import语法 %} 来查找其兼容性！
3. router/index.js
   ![router.js路由定义](router.js路由定义.png)
   路由的定义与之前的无太大的区别，将字符串控制的调整为`createWebHistory()`函数的执行结果来返回对应的结果字符串，在`createWebHistory(import.meta.env.BASE_URL)`中使用了`import.meta`，关于`import.meta`的描述，见{% link "import.meta" "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta" true import.meta %}  官方文档说明
4. stores/counter.js
   原本的`vuex`替换为`pinia`，使用更加简单更加方便，无需进行统一的一个树进行管理，在需要的组件中按需调用即可
   ![组合式API与选项式API的对映](组合式API与选项式API的对映.png)

##### SFC单文件组件编写
> :alien: 在SFC单组件文件中，:u6709: :point_down: 几种编码方式需要注意的：
1. 对于import使用的组件，无需在`components`中注册，将直接使用其文件名默认注册；
2. 组件定义时，无需导入对应的vue的相关API，可直接使用，可认为是vue环境中的宏定义：`defineProps`、`defineEmits`、`useSlots`、`useAttrs`等API；

#### 最简单的vue3全家桶项目(ts版本)
![vue3的ts全家桶项目目录结构](vue3的ts全家桶项目目录结构.png)
:stars: 从上面所创建出来的项目目录结构我们可以看出，其实ts的项目无非就是多了`env.d.ts`以及`tsconfig.*.json`两个配置文件。

##### 全局变量类型说明文件env.d.ts
> `env.d.ts`文件是一个TypeScript类型的声明文件，用于声明全局的环境变量类型，通常用于在TypeScript项目中定义全局变量，以便于在代码中使用这些变量时能够得到**类型检查和自动补全**的支持！
> 在实际的项目中，我们可能会引入一些全局的第三方库或者自定义的全局变量，在没有类型声明的情况下，TypeScript编译器无法正确识别这些变量的类型，从而无法提供准确的类型检查和代码提示，比如我们在项目中使用了一个名为`API_KEY`的全局环境变量，可以在对应的`env.t.ts`文件中进行如下的声明
```typescript
  declare namaspace NodeJS{
    interface ProcessEnv{
      API_KEY: string;
    }
  }
```
:stars: 在 :point_up: 的代码中，我们使用了TypeScript中的声明语法，通过`declare`关键词声明了一个全局的命名空间`NodeJS`，在该命名空间中添加了一个新的接口`ProcessEnv`，并在该接口中定义了环境变量`API_KEY`， :point_right: 这样子，在项目的其他地方，我们就可以直接使用`process.env.API_KEY`来访问该全局变量，并且TypeScript编译器将能够正确地推断出其类型，提供相应的类型检查和代码提示！！

##### typescript编译器配置文件tsconfig.*.json
> `tsconfig.json`、`tsconfig.app.json`、`tsconfig.node.json`都是TypeScript的配置文件，用于配置TypeScript编译器的选项和项目的设置。
> 这些配置文件主要提供一种集中管理编译选项和项目设置的方式，通过针对不同类型的项目来创建不同的配置文件，可以灵活地为每个项目定制化编译过程中的行为！
+ `tsconfig.json`: 主要的TypeScript配置文件，用于指定整个项目的编译设置，该文件应当位于项目的根目录中，并且配置选项会应用于整个项目范围内！！
+ `tsconfig.app.json`: vue项目中使用的TypeScript配置文件，其中包含一些额外的vue3相关的特性和优化选项；
+ `tsconfig.node.json`: 用于Node.js项目的TypeScript配置文件，包含一些适用于Node.js开发的特定配置

### 编码习惯
> :trollface: 在对比了上述两个基本的项目框架以及相关的代码之后，突然发现除了新增的配置文件`env.d.ts`以及`tsconfig.*.json`之外，其他的文件的内容好像基本一致(就*.vue文件的`script`标签增加了`lang=ts`配置)，那么是否可以认为其实ts文件中的相关代码，也可以直接用js来编写？？ 
> :alien: 假如真的这样子的话，那完全没有必要引入ts，肯定应该还有未探索到的领域！！！
:trollface: 下来看下面的一个属性定义例子对比：
![不带提示的属性编码](不带提示的属性编码.png)
![带提示的属性编码](带提示的属性编码.png)

:stars: 从上面我们可以看出带提示的编码，在编码过程中可以直接根据提示来进行编码，而可以选择无需去关注对应的属性。
:confused: 但是，如果某个属性是必填的话，应该怎么整呢？
![必填的加持](必填的加持.png)

:confused: 但是，如果要给属性赋予默认的值的话，应该怎么处理呢？ :point_right: 使用`withDefaults宏定义`来给属性赋默认值
![属性赋默认值自动提示](属性赋默认值自动提示.png)
![属性默认值加持](属性默认值加持.png)

:trollface: 再来看一个关于emit方法的定义：
![emit方法定义](emit方法定义.png)

---
**编码思维整理：**
> :space_invader: 从上述的编写方式，可以看出编写出来的代码更加容易读懂了，但是再联系之前所做的项目来进行思考的话，可能不能一昧地疯狂使用这个ts来编写我们的业务逻辑代码。
> 平时我们在编写组件代码的时候，想要声明一个组件的所有的`属性、方法、所定义的state数据(ref/reactive)、计算属性、provide、inject、ref节点引用、ref组件引用、model定义`等等，
> 在之前的js-coding的编码方式中，我们都是直接编写，然后在程序边运行边调试，然后才知道上述这些元素的类型以及函数签名，而且随着项目越来越复杂，单纯地通过这种“运行时编码思维”，代码阅读起来有些许吃力，而且需要集中注意力，维护成本较高，因为这些元素在使用的时候根本不知道都是些什么类型，是否必填，是否有默认值，函数签名长得怎样，如果没有正确按照定义的规范来写，或者期望是number实际传递了一个字符串，是否在编码阶段能够正确的提示出来？
> :point_right: 因此，使用ts提供的类型/函数签名的机制，提供编译期间就将上述提及的异常情况给收掉！！！
> :warning: 但是，也存在着一些问题，让我们无法所有的编码都"ts化"，比如，像一个表格的数据源，一般来自于接口层的数据，这个时候，如果我们直接按照接口文档上所定义的响应体来定义这个数据类型的话，一旦接口变化，我们所编写的类型也要跟着变化，维护成本有些许高，因此，个人简单整理了 :point_down: :two: 种编码思维习惯：
1. 如果是前端能够预见到的，纯前端自身逻辑即可满足的，则建议是将ts进行到底；
2. 如果是由后台逻辑控制的，则按照普通的js编码来写。