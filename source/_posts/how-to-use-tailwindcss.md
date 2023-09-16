---
title: 如何使用tailwindcss来管理项目的样式
description: 如何使用tailwindcss来管理项目的样式
author: Zhenggl
date: 2023-09-14 22:25:32
categories:
  - [css, tailwindcss]
tags:
  - css
  - tailwindcss
keywords: css框架, 样式管理工具, 快速构建样式, 响应式设计, 自定义样式, 类型优先css, css实用工具, 样式组件化, 构建可扩展样式库, 打包和优化样式代码, 模块化开发, 提高开发效率, 样式性能优化, 前端工程化, 可维护性和可扩展性
cover_picture: tailwindcss封面.jpg
---

### 前言
![项目css样式现状](项目css样式现状.png)
:confused: 大家可以看到之前我们项目(比如使用vue全家桶+某个UI库)中打包出来的结果css内容，可以发现，我们在项目中经常使用的那就那么些样式，但是打包出来的最终效果确是像 :point_up: 的一样，将有关的和无关的样式都给怼进来了，搞得整个css样式表非常的大。 更 :dog: 的是如果我们要做响应式的交互效果，我们基本上都得一个个媒体查询都得用起来，并维护一套套的不同的样式表，来确保在对应的屏幕上能够按照既定的目标来展示对应的效果。 还有更 :dog2: 的是作为开发者，还必须想好每个样式的名字，如果按照 {% post_link BEM-in-css css中的BEM命名规范 %} 的话，还得去想好每个样式的名称。当然在实际的coding过程中还有其他比较繁琐的事情，让我们从css样式代码管理工作中释放出来！

:trollface: :point_right: 因此，**tailwindcss** {% link "官网" "https://tailwindcss.com/" true 官网 %} 应运而生，就是为了解决上述提及到的相关问题，以及根据更多的使用业务应用场景来管理项目中的样式！！

### 什么是tailwindcss?
> `tailwind css`的工作原理就是扫描所有的HTML文件、JavaScript组件以及任何其他模版来获取其中出现的类型，生成对应的样式，然后将它们写入到静态的css文件中，也就是说通过`tailwind css`所产生的css文件，将不会冗余一行代码，也不会遗漏一行css代码，按需分类对应的样式来展示! 另外，为了确保生成的类中的样式属性不重复定义，`tailwind css`制定了一整套关于样式的组装的最颗粒度的css单位元素，通过库内部提供的组装样式的逻辑，展现出各个不同的样式组装结果，从而让`tailwind css`生态内提供**样式重复率最低**的css结果文件，提供页面的渲染速度！下面就要对这个库进行一个具体的使用与分析！！

### 如何使用tailwindcss?
> :point_down: 将简单介绍关于如何使用这个`tailwind csss`
#### 1、安装Tailwind Css
```bash
npm install -D tailwindcss
npx tailwindcss init
```
:stars: 创建对应的`tailwind.config.js`，作为`tailwind css`的统一的配置文件入口

#### 2、配置模版路径以及其他配置
```javascript
  module.exports = {
    // 配置来源样式名称的文件路径
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {}
    },
    plugins: []
  }
```
:stars: 上面这个`tailwind.config.js`是最基本的样式配置文件，代表将完全使用{% link "官方配置" "https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js" true 官方配置 %}
![tailwind.config.js组成](tailwind.config.js组成.png)

#### 3、将Tailwind指令添加到自己的css中
> 将`tailwind css`每个层的`@tailwind`指令添加到自己的主css文件中
```css
  @tailwind base;
  @tailwind component;
  @tailwind utilities;
```
:trollface: 在引入了`tailwind css`的相关指令将各个模块给引入了之后，再来怼上自己所自定义的样式， :point_right: 这里将会自动注入`tailwind css`中根据配置文件(tailwind.config.js)所配置的相关样式代码，**这样子才能够做到将所有的样式根据需要都定义到统一的一个css文件中**！！！

#### 4、启动tailwind CLI进行构建
> 手动挡的方式，可以将相关的样式给组装整理到统一一个文件中
```bash
  npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

#### 5、在对应的HTML中使用tailwind
> 将 :point_up: 第 :four: 所产生的结果css文件，link到我们的html文件中，就可以展示我们所需要展示的效果！！！

### tailwindcss能帮助我们解决什么问题?
> 在开始回答这个问题之前，先来看这边针对`tailwind css`的一个使用过程整理的对应的一张图：
![tailwindcss的基本组成](tailwindcss的基本组成.png)

:trollface: 从上面我们可以简单地分析出关于`tailwind css`主要是通过基础的配置(包括有内容、主题、屏幕、颜色、间距、插件、预设)等作为基本单元，然后通过组合两个或者两个以上的基本单元，形成一个新的单元，将这个单元用来作为实际的className，实现根据需要动态生成对应的样式表数据，这里的组装规则见：{% link "官方配置" "https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js" true 官方配置 %}，:point_down: 是对应的一个组装的过程：
![tailwindcss属性组装过程](tailwindcss属性组装过程.png)

:confounded: 因此，这边也整理了关于`tailwind css`使用过程需要注意的几个点：
1. 当我们需要在`tailwindcss`的基础上追加我们的自定义样式时，必须在`theme.extends`节点对象下新增对应的属性，而不是直接在`theme`下直接写我们所想要追加的属性，当然，如果我们执意想要在这个`theme`节点下追加我们的属性的话，则必须要调用`tailwindcss`的API(通过插件语法函数的方式)来获取原属性，并实现自定义追加的目的，如下所示：
   ```typescript
  const plugin = require('tailwindcss/plugin');
  module.exports = {
    theme: {
      extends: {
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
      }
    },
    plugins: plugin({addBase, theme}){
      addBase({
        'h1': theme('fontSize.2xl')
      })
    }
  }
   ```
   :stars: 这里我们通过extends节点来往这个`spacing`中追加两个间距属性，然后在对应的html节点中即可使用
   ```html
    <div class="p-128"></div>
   ```
   :point_right: 将对应生成以下的样式
   ```css
    .p-128{ padding: 32rem; }
   ```
   :stars: 通过插件函数`plugin`中的参数，可实现往对应的模块中追加我们所想要自定义的属性！！
2. 在编写相关的样式的时候，不大可能去记住所有的className，有两种方式，一种是直接在官网进行搜索，但这种效率比较慢，第二种是借助于ide插件，实现类似与ts的相关coding语法提示，如下图所示：
   ![编写代码时的自动提示机制](编写代码时的自动提示机制.png)
   ![编写完成后的内容查看](编写完成后的内容查看.png)
3. 最佳编程实战经验，这个可能需要等到我在实际项目中运用之后，才能够更好的来说明这个问题，未完待续...

### tailwindcss开源组件库介绍
> :confounded: 如果我们将对原本的css属性以及属性值的使用，变成对`tailwindcss`的类名的使用，就会出现一个html节点上可能会有一堆的类名，代码的可读性比较低，因此，`tailwindcss`也有一些开源社区提供了快速开发的UI框架：
1. [https://daisyui.com/?lang=zh_hant](https://daisyui.com/?lang=zh_hant)
2. [https://tailwind-elements.com/](https://tailwind-elements.com/)
3. [https://tailwindcomponents.com/](https://tailwindcomponents.com/)
4. [https://www.material-tailwind.com/](https://www.material-tailwind.com/)