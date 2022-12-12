---
title: assemble的使用与源码分析
description: assemble的使用与源码分析
author: Zhenggl
date: 2022-12-02 09:07:51
categories:
  - [工具插件, grunt]
tags:
  - 工具插件
  - grunt
  - handlebars
  - assemble
cover_picture: assemble使用与源码分析封面.png
---

### 前言
> 在第一次接触`Assemble`的时候，觉得自己以前好像不是这么走过来的，自己以前是直接上`jquery`，或者原生的编码，对于项目的打包也是采用的最原始的方式来打包，没有去借助于一些便捷的打包工具，比如gulp、grunt等，等到后续慢慢接触久了，才有了这个想要“偷懒”的想法，在之前的关于`grunt`的学习中也了解到，`grunt`就是将一些经常做的事情，交由grunt框架来做，仅需要简单的传递对应任务以及其方法参数即可完成日常的测试、打包、部署动作！
> 而`Assemble`则是基于`grunt`上的一个插件，该插件主要做的是通过既定的规则来限定项目的代码组织结构，在享受`grunt`打包的便利的同时，也顺便统一了前端静态化打包的规范，通过其额外提供的`handlebar-helper`方法工具库，来实现快速搭建一静态网站站点的目的！！！

### assemble如何使用?
> 本章将采用'黄金圈'的规则来解读一下`Assemble`！！

#### assemble是什么?
> `Assemble`就是一个grunt插件，按照之前的插件的学习，插件对外暴露的都是在对应的`tasks`目录中，对外暴露的一方法，该方法接收的`grunt`作为参数来使用，具体见 :point_down: 的关于源码层面的分析，这里先分享一下关于`Assemble`的一个使用！
> **根据对官方文档的学习，对这个`assemble`整理为自己的一句话：使用`handlebars`引擎，通过额外的外部数据引入，通过一系列的配置信息，自动引入相关的partial，采用既定的页面模版(通过从partial引入)，借助于自定义helper，使用`grunt`打包生成对应的html文件**，整理为 :point_down: 对应的工作过程图：
> ![grunt的工作过程](grunt的工作过程.png)

#### 如何使用assemble
> 关于如何使用`assemble`，首先先看 :point_down: 的一个关于`assemble`的结构图:
![Assemble_CMS框架配置组织结构](Assemble_CMS框架配置组织结构.png)
:point_down: 将针对各个模块来分别具体分析一波:
1. 数据配置data；
2. 传递参数options；
3. 形成的模版templates.

##### 数据配置data(也称之为上下文)
1. 数据的使用
> 在使用`assemble`的过程中，我们通过传递上下文对象给这个`Handlebars.template()`方法，将上下文对象传递给模版方法，返回一个编译后的html字符串，然后将对应的html赋值给到对应的node节点，来实现html的展示！！这个在之前学习[HandleBars](usage-of-handlebars.html)可以具体看出其如何使用的，一般情况下，采用的引用额外的外部对象(json/yaml)文件，使得对应的hbs模版内容能够直接访问到！
> :stars: 在`assemble`中，上下文对象(这里我们可称之为`Context Object`)就是能够被所有的hbs文件所能够访问到的，这里是如何实现的呢？ :question: 问题将会在 :point_down: 的源码分析中具体讲解一波，这里只需要晓得有这么一个情况：**所有的`hbs`文件共享着同一个Context Object**，比如有以下的一个例子(一般这个文件命名为`data.json`)：
```json
  {
    title: '我是给所有的页面所共享的标题'
  }
```
那么对应的`hbs`文件中将可以通过这种方式来引用到：
```javascript
{{ title }}
```
:warning: 假如命名的文件名为：myData.json
那么对应的`hbs`文件中引用的方式只能是如下:
```javascript
{{ myData.title }}
```

2. 数据的格式
> 可以是`data`(比如名为`myData.json`)、`yaml`(比如是`myData.yaml`)、`YAML Front-Matter(简称YFM)`(直接嵌入在`pages/templates`的顶部，是有效 YAML 的可选部分，位于页面顶部，用于维护页面及其内容的元数据)
> :point_up: 已经提出了关于`json`的使用方式， :point_down: 将使用`yaml`的方式来使用：
```yaml
title: Assemble
author: zhenggl
```
于此对应的`hbs`文件也是如此使用！

:stars: 如果使用的是`YFM`格式的数据，则可以在所有的`pages/templates`中引用到，引用的方式有两种，一种是常量，一种是变量：
```md
// 变量引用方式：
---
title: <%= some.title.variable %>
author: <%= some.author.variable %>
---
// 常量引用方式：
---
title: Assemble
author: Brian Woodward
---
```
:point_right: 对应的输出结果如下所示：
```html
<h1>Assemble</h1>
<p>Brian Woodward</p>
```

:stars: 在`YFM`中预定义的变量 :u6709: :confused: 几种：
+ `layout`: 可选的参数，用于指明当前的`template/page`将采用哪个layout模版布局来布局页面；
+ `published`: 设置为`false`代表不发布该文章，默认为true；
+ `category/categories/tags`: 将类别和标签定义为 YAML 列表或以空格分隔的字符串。对于每个类别和标签，Assemble 将在 dest 目录中生成一个页面。

:stars: `YFM`可以理解为从上下文中获取到数据，还可以是定义相关的变量在页面的头部，来实现一个中间数据传递者的角色！

##### 传递参数options，形成模版template
> 在`grunt`的任务或者是目标中调用的`grunt.initConfig()`方法中所传递的配置信息，该参数是一个对象，可以是JSON格式，也可以是YAML格式，一般定义在额外的一个`json/yaml`文件中，为了方便理解，我们在`initConfig`定义的称之为配置选项，在页面中定义的称之为页面选项，对象中的属性主要如下定义：

| 属性名 | 描述 |
|---|:---|
| assets | 项目中的静态资源文件，包括js、css、font、image等资源，而且`assemble`将会在对应的dest目录中生成对应相对目录的资源，当使用的`{{assets}}`则代表该dest的具体相对目录 |
| collections | 标签、类别和页面的内置集合在上下文的根部可用 |
| data | 将要共享的全局上下文对象文件路径，一般可命名为data.json/data.yaml，这样子页面就无需使用其他变量了 |
| engine | 将要使用的引擎，默认是handlebars |
| ext | 生成的目标文件的文件后缀 |
| helpers | 自己所要注册的额外的helper工具类文件的路径 |
| **layout** | 可选的属性，如果没有配置则代表`assemble`将构建没有布局的页面，但指定时，则必须在对应的`layout文件`中包含`{{箭头 body}}`标示，因为此标记指示目标中每个文件的内容应插入的位置 |
| layoutdir | 属性同`layout`，只不过指明layout文件的目录路径，一般与layout配合使用 |
| partials | 即将被`pages`所引用到的代码块，类似于include动作 |
| files | 该属性一般为一对象，代表对应目录即将采用对应的哪个文件来生成html文件，以及捆绑好对应的映射关系 |

:point_down: 针对其中较为重要的几个属性来具体分析一下其如何使用的：

1. data
> 关于`data`属性的使用，这边再补充多一个在使用过程中的技巧：
```javascript
module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    assemble: {
      options: {
        pkg: '<%= pkg %>',
        data: 'other/data/*.json'
      }
    }
  });
};
```
有了 :point_up: 的一个配置信息，那么我们对应的`hbs`文件中将可以通过`{{package.version}}`等的方式来访问到`package.json`文件中的内容，同时也拥有了额外的json文件中的数据

2. layout与layoutdir
> 布局通常与客户端模板一起使用，作为一种使用常用页面“部分”（例如页眉、页脚或导航）“包装”多个页面的快速方法。
> 通常您的项目需要多个布局，因此可以在任务或目标级别使用 options.layout 变量定义布局，或者可以通过向 YFM 添加布局属性在页面级别指定，一般是将所有的`layout模版`存储在`layoutdir`目录中，然后通过统一的`layoutdir`里来相对访问到对应的layout文件即可

:point_down: 是关于页面中的配置

| 属性名 | 描述 |
|---|:---|
| `{{basename}}` | 从上下文的根返回当前页面的基本名称 |
| `{{dirname}}` | 文件所属路径 |
| `{{ext}}` | 文件后缀 |
| `{{extname}}` | 文件后缀名 |
| `{{filename}}` | 文件完整路径名称 |
| `{{pagename}}` | 同`{{basename}}` |

##### mk内容的使用(常用的HandleBars Helpers)
> 在`assemble`中，可以在任何的地方使用md文件/内容，其使用语法如下
> `{{md '完整的md文件路径，可以是相对路径'}}`

:stars: 从 :point_up: 中可以看出这里的`md`其实是已经在`assemble`中已注册好的`helper`，应该是做了一个读取对应路径的md文件，将其内容转变为对应的html字符串

### assemble源码分析
![Assemble架构](Assemble架构.png)
> 针对上述的使用过程的所产生的疑惑 :confused: ，结合`Assemble`的源码来一通分析一波：
> 1. `assemble`的配置过程是怎样的？
> 2. 如何实现`grunt.initConfig()`中所传递的options被所有的页面所共享；
> 3. `assemble`中的模版格式是如何形成的？
> 4. 为什么这个layout文件必须包含`{{箭头 body}}`标示？

#### 1. assemble的配置过程是怎样的？
![grunt的任务与目标以及参数的关系](grunt的任务与目标以及参数的关系.png)
![assemble的配置过程](assemble的配置过程.png)
:stars: 一切从`grunt`插件入手，在`tasks/`目录下的js文件，通过对外暴露的一公共API方法，该方法接收`grunt`作为其参数，实现`npmTask`任务的一个注册过程，使得`grunt`框架能够自动执行到该插件，而在该插件在执行的过程中，采用固定的配置流程，如下图所示：
![assemble配置的顺序流程](assemble配置的顺序流程.png)
从 :point_up: 的流程我们可以看出其最终是针对每一个页面(*.hbs文件)，生成对应的一个完整的上下文对象(这里我们称之为context)以及对应的完整模文件内容，然后借助于`Handlebars的templte()`方法，将内容给渲染出来的

#### 2. 如何实现`grunt.initConfig()`中所传递的options被所有的页面所共享；
> `grunt.initConfig()`方法中的成员，称之为grunt任务以及grunt目标，我们所传递给`assemble`任务的配置信息，都存储在对应task对象中，task对象负责对所有的数据进行管理以及分配，因此其中所有的options将被所有的页面所共享
> ![组织默认的分类/标签模型](组织默认的分类/标签模型.png)

#### 3. `assemble`中的模版格式是如何形成的？为什么这个layout文件必须包含`箭头 body`标示？
> 关键在于`assemble.js`中的`loadLayout()`方法中，该方法通过加载两种类型的`hbs`文件，来实现模版的方式，第一种类型是模版文件，该文件主要用于提供基础的视图框架，比如通过在模版文件中引用partial文件来实现左中右的布局格式，通过在模版layout文件中提供的`箭头 body`标识，代表这个位置将会被实际的每个页面的内容所替换；第二种类型是普通的`hbs`页面，主要完成页面内容的正常渲染，然后将两者进行一个结合，通过将layout模版文件中的`箭头 body`给替换为具体页面的内容，实现一个完整的页面的组装，最终借助于`Handlebar`的渲染引擎，直接将页面给渲染出来！！
![{{箭头body}}标示符配置的由来]({{箭头body}}标示符配置的由来.png)

#### 4. 关于官方文档中未提及到的
1. 我们可以额外传递`plugins`属性到对应的`assemble`配置中，实现自定义插件的过程；
   ![assemble自定义插件](assemble自定义插件.png)
   :point_up: 上面这里通过自定义的插件，实现在每个页面渲染之前输出一个日志！
2. 可以额外传递`pages`数组属性到对应的`assemble`的配置中，实现自定义多页面的过程；
   ![传递额外的pages属性](传递额外的pages属性.png)

### 从assemble的实现过程，我们可以学到什么？
1. 面向对象编程，将每个模块所负责的功能按照职责进行分配；
2. 既定流程编程范式，采用`step` + `buildStep`的方式，实现统一函数格式包装的方式，实现固定执行顺序的方案；
3. `async`三方库的使用学习，能够顺序异步执行的便捷库

### 搭建自己的html渲染基础项目(grunt + assemble + grunt + md)
> 在学习完成了关于`assemble`的基础框架之后，想要模仿less来存自己的一个在线man浏览系统，搭建一个基础的自带分类、自动导航功能的基于mk文档来编写的在线文档系统！详情查看[链接](../2022/12/13/build-man-website-with-assemble-handlebars/)

