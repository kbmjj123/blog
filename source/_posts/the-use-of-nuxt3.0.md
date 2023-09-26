---
title: Nuxt3.0的学习与使用
description: Nuxt3.0的学习与使用
author: Zhenggl
date: 2023-09-25 06:16:35
categories:
  - [开发框架, ssr]
tags:
  - nuxt
  - vue
  - ssr
keywords: Nuxt.js, 基于Vue.js的框架, 服务器端渲染(SSR), 静态站点生成(SSG), Vue3支持, 插件系统改进, SEO优化
cover_picture: Nuxt封面.png
---

### 前言
> 之前已经学习过关于`Nuxt2.0`{% post_link the-use-of-nuxt Nuxt2.0知识文档 %}的相关知识点，也在实际的该框架下进行过对应的项目开发，现在迁移至`Nuxt3.0`的学习(本文简称Nuxt)，并在此框架上进行对应的项目实战，在实战之前，很有必要进行关于`Nuxt`的使用文档简单的说明!!
> 之前已经针对2.0版本进行一个详细的分析过了，因此本文仅针对3.0的使用特性进行一些补充说明。
> 在开始进行该框架的介绍时，这边想先抛出几个关键词：**自动导入(auto-imported)**、**模块集成**、**插件集成**！！

### 目录与文件介绍
> :point_down: 将进行额外的目录与文件介绍，阐述关于`Nuxt`在使用上 :u6709: 什么不同之处

### .nuxt
> `.nuxt`目录将是`Nuxt`运行时的产物，一旦我们run这个命令的时候，将自动生成对应的资源文件。生成的文件内容如下：
![自动生成的Nuxt运行时资源文件](自动生成的Nuxt运行时资源文件.png)
:trollface: 从上面的截图我们可以解答这个问题：*为什么在`Nuxt`环境中，可以免导入来直接使用全局组件以及全局API*， :point_right: 因为自动导入的原因！！

#### components
> 该目录是放置所有的SFC组件的地方，所有的组件将会被自动注册到全局中，在实际的项目业务开发过程中，可以无需导入来直接使用！
> 默认情况下，该目录的配置在`nuxt.config.ts`文件中进行配置的！
```typescript
export default defineNuxtConfig({
  components: [
    '~/components'
  ]
})
```
:stars: 而这里的`components`如果发生了嵌套的话，那么嵌套的目录将作为组件的名称，比如有：`~/components/base/Btn.vue => <BaseBtn />`
:trollface: 关于`动态加载组件`、`延迟加载组件`、`斋客户/服务端使用的组件`、`开发环境可用的组件`等类型的组件具体可见{% link Nuxt组件 "https://nuxt.com/docs/guide/directory-structure/components" true Nuxt组件 %}

##### Nuxt官方提供的components
![全局可用的组件](全局可用的组件.png)
:point_up:  列举出了不同场景下使用的组件，:point_down: 针对其中的几个进行简要的使用说明：
1. `<ClientOnly></ClientOnly>`: 仅在客户端下可用的组件，一般提供插槽的方式来使用的！；
2. `<NuxtPage></NuxtPage>`: 用于代表 */pages* 目录下的组件，它是`RouterView`的包装器组件，一般可接收`name`以及`route`属性，代表当前路由地址所访问的对应组件，在`Nuxt`中可用该组件来替代`RouterView`的使用；
3. `<NuxtLayout></NuxtLayout>`: 可用于代表`app.vue`、`error.vue`的当前展示视图，该视图将对应从`layouts`目录中寻找对应的组件来渲染，比如我们可以使用`name=default`或者不设置name属性，那么将从`layouts/default.vue`来加载对应的sfc来渲染，如果我们设置的`name=error`，那么将加载`layout/error.vue`来渲染，这里的name可以是响应式的；
4. `<NuxtLink></NuxtLink>`: 作为`RouterLink`的替代品，能够根据是站内还是站外来决定是否预加载资源；
5. `<NuxtLoadingIndicator></NuxtLoadingindicator>`: 加载进度条视图；
6. `<NuxtErrorBoundary></NuxtErrorBoundary>`: 处理Vue.onErrorCaptured动作触发时，展示的错误效果；

#### composables
> `Nuxt`在`Vue3`的基础上新增了额外的组合式API，通过这些组合式API，可以快速访问到整个Nuxt对象、上下文、应用实例、网络请求等告性能、高效率动作，:point_down: 将简单介绍以下几个常见组合式API，具体各个useAPI见 {% link "Nuxt官方composables" "https://nuxt.com/docs/api/composables/use-state" true Nuxt官方composables %}
> :earth: `Nuxt`官方提供了一系列的useAPI，我们平时在使用的时候，无需显式地导入来使用对应的API！！ :point_right: 对应的composables方法，将对应生成在`.nuxt/imports.d.ts`文件中，因此我们才可以无需导入直接使用！
> :point_down: 所阐述的相关API，基本上都可以在**pages、components、plugins**中直接使用到！
1. useAsyncData: 通过该组合式API，可实现服务端向客户端传递payload数据的机制，避免客户端重新加载的结果；
2. useFetch: `Nuxt`提供的用于接口调用的最直接API，具有一定的响应式状态机制，比如可以通过请求链接/参数设置为响应式的，使其自动load对应的数据，一般可以通过对这个API进行二次包装实现自定义统一的fetch处理动作；
3. useLazyAsyncData: 使用包装后的`useAsyncData`，避免阻塞；
4. useLazyFetch: 使用包装后的`useFetch`，通过内置传递的`lazy=true`，来加载接口调用，使得原本阻塞的`useFetch`成为异步操作，让组件/页面正常跳转；
5. useNuxtApp: 获取运行时应用程序的访问，可以帮助我们访问到运行时的上下文、Vue实例、运行时配置以及变量等属性；
6. useNuxtData: 可以通过提供的key关键词来访问通过`useFetch`、`useAsyncData`、`useLazyFetch`、`useLazyAsyncData`所缓存的数据(通过请求时传递在options中的key关键词来映射)；
7. useRuntimeConfig: 通过该API可以来访问配置在`nuxt.config.ts`中的`runtimeConfig`对象所使用的属性；
8. useSeoMeta: 通过该API可以向页面/站点添加seo相关的tag标签以及配置；
9. useState: `Nuxt`中用于提供跨组件响应式状态的API，在服务端渲染时保留，并在各个客户端中共享，该API只能在`setup`或者组件声明周期方法中使用；
10. useCookie: 用于读取与写入到cookie中的工具方法；
11. useAppConfig: 可直接访问到项目中的`app.config.ts`文件中的配置，进而对`app.config.ts`中的配置进行组合式操作，具体的`app.config.ts`的描述见 {% link "app.config.ts" "https://nuxt.com/docs/guide/directory-structure/app-config" true app.config.ts描述 %}

**如何自定义composables**
:stars: 一般地，我们直接在`composables`目录中创建对应的ts文件， :u6709: :two: 种不同的方式来创建自己的组合式API
```typescript
// composables/useFoo.ts 或者是 composables/use-foo.ts
// 方式一
export const useFoo = () => {
  return useState('foo', () => 'bar')
}
// 方式二
export default function(){
  return useState('foo', () => 'bar')
}
```
:trollface: 然后，就可以在对应的目标页面/组件中使用
```vue
<script setup lang="ts">
  const foo = useFoo()
</script>
<template>
  <div>
    {{ foo }}
  </div>
</template>
```

#### content


#### middleware

#### modules

#### plugins

#### layer

#### server

#### utils

#### app.config.ts
> `Nuxt`提供了该配置文件，用于提供用户将自定义APP的变量都存储在这个配置文件中，这可以当作是一个安卓应用程序中存储在`Application`应用程序全局对象中的变量
```typescript
export default defineAppConfig({
  theme: {
    primaryColor: '#ababab'
  }
})
```
:trollface: 这里我们定义了一个`theme.primaryColor`对象以及对象中的primariColor属性，那么我们就可以在应用程序的各个位置(components、pages、plugins)中访问到这个属性：
```typescript
const appConfig = useAppConfig()
console.info(appConfig.theme.primaryColor)
```
:stars: 既然已经进入到`ts-coding`的领域，我们自定义的变量，最好能够在coding阶段的时候就能够被识别到，因此，我们需要将其添加到自己的自定义type文件中：
```typescript
declare module 'nuxt/schema'{
  interface AppConfigInput{
    theme?: {
      primaryColor?: string
    }
  }
}
```
#### app.vue

#### nuxt.config.ts

### state管理
> `Nuxt`提供的*useState*组合式API，可以方面地来创建跨服务端与客户端共享的state，一般是服务端创建一state，然后由所有的客户端来共享， :warning: 该API只能够在`setup`以及组件的生命周期钩子方法中调用！！
> `useState`作为`ref`在服务端的替换，可保证服务端只有一个这样子的状态，然后客户端可直接共享这样子的一个状态！！！


### transitions动画支持

### fetching网络请求
> `Nuxt`提供了`*useFetch*`、`*useAsyncData*`、`*$fetch*`三种方式的API来进行网络通讯，`useFetch`是组件内处理数据的最直接方法，**具有响应式的状态**，而`*$fetch*`则用于处理用户交互过程中的数据处理，主要来自于{% link ofetch https://github.com/unjs/ofetch true ofetch %}三方库的支持，`useAsyncData`则是`useFetch`与`$fetch`两者的结合体：`useFetch(url) ===> useAsyncData(url, () => $fetch(url))`，一般情况下，可使用这个`useAsyncData`来包装请求，并缓存请求响应体，减少重复的无效请求！
> 

### 错误处理

### seo与meta处理

### 关于Nuxt3.0的使用思考