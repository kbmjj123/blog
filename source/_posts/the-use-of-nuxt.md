---
title: nuxt入门以及实战
author: Zhenggl
date: 2021-12-07 10:37:20
categories:
tags:
cover_picture: https://img.91temaichang.com/blogs/nuxt-cover.png
---

### 1⃣️、nuxt的概念
> Nuxt.js 是一个基于 Vue.js 的通用应用框架。
通过对客户端/服务端基础架构的抽象组织，Nuxt.js 主要关注的是应用的 UI 渲染。
我们的目标是创建一个灵活的应用框架，你可以基于它初始化新项目的基础结构代码，或者在已有 Node.js 项目中使用 Nuxt.js。
Nuxt.js 预设了利用 Vue.js 开发服务端渲染的应用所需要的各种配置。
除此之外，我们还提供了一种命令叫：`nuxt generate` ，为基于 Vue.js 的应用提供生成对应的静态站点的功能。
我们相信这个命令所提供的功能，是向开发集成各种微服务（Microservices）的 Web 应用迈开的新一步。
作为框架，Nuxt.js 为 `客户端/服务端` 这种典型的应用架构模式提供了许多有用的特性，例如异步数据加载、中间件支持、布局支持等。

[![nuxt的架构](https://www.nuxtjs.cn/avEUftE.png "nuxt的架构")](https://www.nuxtjs.cn/avEUftE.png "nuxt的架构")

- 基于 Vue.js
- 自动代码分层
- 服务端渲染
- 强大的路由功能，支持异步数据
- 静态文件服务
- ES2015+ 语法支持
- 打包和压缩 JS 和 CSS
- HTML 头部标签管理
- 本地开发支持热加载
- 集成 ESLint
- 支持各种样式预处理器： SASS、LESS、 Stylus 等等
- 支持 HTTP/2 推送

以下是完整的从链接发起到最终页面的渲染的一个流程图：

![nuxt流程图](https://www.nuxtjs.cn/nuxt-schema.svg)

### 2⃣️、nuxt能够做什么
#### 2.1、服务端渲染[SSR]
可以使用Nuxt.js作为框架来处理项目的所有 UI 呈现。
启动时nuxt，它将启动具有热更新加载的开发服务器，并且[Vue服务器渲染](https://ssr.vuejs.org/zh/ "Vue服务器渲染")配置为自动为服务器呈现应用程序。
#### 2.2、客户端渲染[SPA]
如果您不想使用服务器端渲染或需要应用程序提供静态托管，则可以使用 nuxt --spa 命令即可使用 SPA 模式。它为您提供了强大的 SPA 部署机制，无需使用 Node.js 来运行应用程序或任何特殊的服务器端处理。

可以查看 Nuxt.js 提供的各种 命令 来了解更多相关使用信息。

如果你的项目有自己的 Web 服务器（例如用 Express.js 启动的 Web 服务），你仍然可以将 Nuxt.js 当作是中间件来使用，负责 UI 渲染部分的功能。在开发通用的 Web 应用过程中，Nuxt.js 是可插拔的，没有太多的限制，可通过 [开发编码](https://www.nuxtjs.cn/api/nuxt "开发编码")中使用 Nuxt.js 了解更多的信息。
#### 2.3、静态化[generate]
支持 Vue.js 应用的静态化算是 Nuxt.js 的一个创新点，通过 `nuxt generate` 命令实现。

该命令依据应用的路由配置将每一个路由静态化成为对应的 HTML 文件。

**使用静态化`nuxt generate`来生成的静态页面html，如果不考虑这个seo优化问题，以及数据源首页的话，那么对于这种方式与spa的部署也就只有是预渲染html的机制方式类似，而且默认也渲染出来了这个默认的数据！！**

### 3⃣️、项目目录结构
[![项目目录结构](https://img2.zhidianlife.com/image/2021/12/06/583310ea-563d-4756-8fb0-eba30b6a55a2.png "项目目录结构")](https://img2.zhidianlife.com/image/2021/12/06/583310ea-563d-4756-8fb0-eba30b6a55a2.png "项目目录结构")

#### 3.1、assets
> 用于组织未编译的静态资源如 LESS、SASS 或 JavaScript

*默认情况下 Nuxt 使用 vue-loader、file-loader 以及 url-loader 这几个 Webpack 加载器来处理文件的加载和引用。对于不需要通过 Webpack 处理的静态资源文件，可以放置在 `static` 目录中。*

#### 3.2 components
> 组件目录 components 用于组织应用的 Vue.js 组件。Nuxt.js 不会扩展增强该目录下 Vue.js 组件，即这些组件不会像页面组件那样有 asyncData 方法的特性，在这里定义的组件，会注册到全局作用域中，在使用过程中可以免导入直接使用

#### 3.3 layouts
> 用于组织应用的布局组件

*若无额外配置，该目录不能被重命名。*
可通过添加 layouts/default.vue 文件来扩展应用的默认布局，但必须要在对应的default.vue中加入<nuxt/>组件，当让我们可以通过加入自己的样式或者其他的组件，比如有以下的一个默认样式blog.vue：
```xml
<template>
  <div>
    <div>我的博客导航栏在这里</div>
    <nuxt />
  </div>
</template>
```
则对应的我们需要在对应的页面中加入以下属性layout：
```js
	export default{
		layout: 'blog'
	}
```
来标注使用这个layout文件

注意： 这里可以使用一个layouts/errors.vue来展示出对应的前端访问异常的问题，比如404、403、500错误等，
```
<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">页面不存在</h1>
    <h1 v-else>应用发生错误异常</h1>
    <nuxt-link to="/">首 页</nuxt-link>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    layout: 'blog' // 你可以为错误页面指定自定义的布局
  }
</script>
```
#### 3.4、middleware中间件
>用于存放应用的中间件

*中间件允许您定义一个自定义函数运行在一个页面或一组页面渲染之前。*
每一个中间件应放置在 `middleware/` 目录。文件名的名称将成为中间件名称 (`middleware/auth.js`将成为 auth 中间件)。
以下是对应的中间件的执行流程：
[![中间件执行流程](https://img2.zhidianlife.com/image/2021/12/06/06d5ed3c-78d0-4d65-9104-1e28c1a459b3.png "中间件执行流程")](https://img2.zhidianlife.com/image/2021/12/06/06d5ed3c-78d0-4d65-9104-1e28c1a459b3.png "中间件执行流程")
从上面的流程图这边可以看出，优先是全局的nuxt.config.js中定义的全局拦截器，然后是到layout.vue中所引用的layout所描述的，接着是page/*.vue中的layout所定义的，也就是如果同时在多个流程中同时引用到这个layout的话，就会重复调用到，同时，如果是同一个中间件的话，则该中间件会被调用多次。 **这里我们可以定义一个中间件，然后根据不同的业务场景，来进行对应的业务中间件配置。**

一个中间件使用一个**context**作为第一个参数，这里的context也同时会在其他的：asyncData、plugins、middleware、nuxtServerInit中也会使用到。
[![物流上下文context的定义](https://img2.zhidianlife.com/image/2021/12/06/f26835ba-2345-4553-bc9a-5ea07041b480.png "物流上下文context的定义")](https://img2.zhidianlife.com/image/2021/12/06/f26835ba-2345-4553-bc9a-5ea07041b480.png "物流上下文context的定义")

#### 3.5、pages
> 页面目录用于组织应用的路由及视图。Nuxt.js 框架读取该目录下所有的 .vue 文件并自动生成对应的路由配置。
若无额外配置，该目录不能被重命名。

【这里参考官方的一个关于pages的使用】[pages的使用](https://www.nuxtjs.cn/guide/views "pages的使用")

#### 3.6、store
> store目录用于组织应用的 Vuex 状态树 文件。 Nuxt.js 框架集成了 Vuex 状态树 的相关功能配置，在 store 目录下创建一个 index.js 文件可激活这些配置。
若无额外配置，该目录不能被重命名。

【这里参考官方的关于store的使用】[store的使用](https://www.nuxtjs.cn/guide/vuex-store "store的使用")

#### 3.7、plugins
> plugins目录用于组织那些需要在 根vue.js应用 实例化之前需要运行的 Javascript 插件。

【这里参考官方的关于plugins的使用】[plugins的使用](https://www.nuxtjs.cn/guide/plugins "plugins的使用")

#### 3.8、nuxt.config.js配置
> 系统中整体的项目配置文件

【这里参考官方的关于项目配置文件的使用】[项目配置](https://www.nuxtjs.cn/guide/configuration "项目配置")

### 4⃣️、项目实战
#### 4.1、新增全局插件：
- **plugins/axios.js**: 借助于`@nuxt/axios`，做到全局控制到网络请求，添加自定义的请求头，追加自定义请求参数，根据process.server判断客户端请求还是服务端请求，根据目前内网防火墙的安全机制问题，控制有些接口请求内网有些接口请求外网，做到统一的网络请求控制操作；
- **plugins/vue-global.js**：全局自定义插件，比如网络请求入口、全局日志、全局插件、全局过滤器、全局本地存储控制器等，这样子我们可以直接在对应的页面中直接使用this.$*的方式来直接调用到，通过这个注入`inject`的方式来实现，这里将注入的参数传递给到网络请求工具类，作为统一一个网络请求框架，对项目中的网络请求动作进行了统一的管理；
#### 4.2、新增全局中间件：
- **middleware/auth.js**：作为项目中所有页面的中间件以及部分布局/页面的中间件，用于处理页面登录拦截控制机制，这里可以是提供白名单机制，如果在白名单中的话，则重定向到登录页面；
#### 4.2、目录新增：
- apis：接口请求动作，这边直接配合`@nuxt/axios`，使用全局的网络请求框架，作为项目中各自的业务请求动作，代码如下：
【api统一入口】
[![api统一入口](https://img2.zhidianlife.com/image/2021/12/06/1a40a926-272c-4388-800e-c4fcecc098cc.png "api统一入口")](https://img2.zhidianlife.com/image/2021/12/06/1a40a926-272c-4388-800e-c4fcecc098cc.png "api统一入口")
【实际业务调用方法】
[![实际业务方法](https://img2.zhidianlife.com/image/2021/12/06/e76f4fab-16ba-4e6d-9261-fe8a74217028.png "实际业务方法")](https://img2.zhidianlife.com/image/2021/12/06/e76f4fab-16ba-4e6d-9261-fe8a74217028.png "实际业务方法")

### 5⃣️、项目部署
