---
title: prettier的学习与使用
description: prettier的学习与使用, 格式化代码, prettier与Linter的配合, 三目运算代码的格式化
author: Zhenggl
date: 2023-03-13 10:29:01
categories:
  - [前端, lint]
tags:
  - lint
  - prettier
cover: prettier封面.png
---

### 前言
{% link "官方文档" "https://prettier.io/docs/en/index.html" true 官方文档 %}
> 既然已经有`ESLint`以及`stylelint`了，为啥还要有这个`prettier`呢？
> :alien: 我们都知道，项目团队在研发过程中，必须严格遵循统一的一个代码规范，即便是拥有了`ESLint`与`stylelint`的加持，在实际的编码过程中，也还是难免需要借助于插件、三方库来协助规范整个团队的项目开发，因此，我们需要在项目中通过统一提供的编码规则配置方案，由项目自身的开发依赖以及配置方案，完成项目自身的代码规范化自动控制，保证项目在不同的ide、环境，不同的人员手中都是采用的统一的一个配置的！！！

### 什么是prettier
> `prettier`是一种**自用**的代码格式化程序，支持有：`js`、`JSX`、`Vue`、`Flow`等等语言，它删除了原始样式，并确保所有的输出都**符合一致**的格式！
> :confused: 比如 :u6709: :point_down: :one: 个函数：
```javascript
  function foo(arg0, arg1, arg2, arg3){
    // ... 此处隐藏代码的实现
  }
  
```
:point_up: 针对上述的函数，假如调用foo函数所传递的参数是较为简单的常量或者是变量的话，则一般一行是能够正常展示完整的，但是，如果传递的参数是一个函数的执行结果，而且这个函数原本的实现也比较复杂的话，那么阅读起来就会比较的麻烦了！！如下代码所示：
```javascript
  const result = foo(fun1(12, 23), fun2(546, 123), fun3(567, 82), (params0, params1) => {});
```
:point_up: 这里对于函数参数的复杂调用，在阅读上则会相对比较麻烦，因此， :u6709: 了`prettier`的加持了之后，就相应的有 :point_down: 的阅读效果：
```javascript
  const result = foo(
    fun1(12, 23),
    fun2(546, 123),
    fun3(567, 82),
    (params0, params1) => {
      // ... 此处隐藏回调函数的实现体
    }
  );
```
:point_right: **prettier**强制使用执行一致的代码样式(也就是不影响原本的`AST`树结构)！！！

### 与ESLint的关系
:point_right: **相辅相成**

1. [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
2. [stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier)

:alien: 同样地，与原本使用`ESLint`以及`stylelint`的类似，通过安装 :point_up: 的插件，实现对lint的相关配置工作，使用方式与之前单独的一个个的使用方式一致！！！

### 如何使用Prettier

#### 1. 在项目中安装prettier服务
```bash
  npm install --save-dev --save-extra prettier
```

#### 2. 创建一个空的配置文件`.prettierrc.json`，让编辑器工具知道项目正在使用prettier
```bash
  echo {} > .prettierrc.json
```

#### 3. 创建对应的忽略文件`.prettierignore`，让编辑器工具知道项目不需要格式化哪些文件
```bash
  echo '' > .prettierignore
```
关于这个文件的内容与一般的`.gitignore`的内容相类似
```bash
  # 以下是忽略的文件的相关注释
  build
  coverage
```
:warning: 如果项目中之前拥有这个`.gitignore`以及`.eslintignore`的话，那么新增的这个`.prettierignore`将基于这两个文件来添加忽略的！

#### 4. 使用`prettier`格式化非忽略的文件
```bash
  npx prettier --write .
```

##### 5. 与ide配合工作(vscode)
> 在实际的项目开发过程中，我们一般是使用ide来配合项目的编码工作的，这里我们以`vscode`为例
> {% link "prettier-code formatter官方文档" "https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode" true "prettier-code formatter官方文档" %}

:point_right: 首先，先安装对应的`vscode`插件，输入关键词：`prettier code format`
![vscode安装插件](vscode安装插件.png)

:point_right: 其次，配置全局生效还是部分工作台生效，也就是`User Setting`与`Workspace Setting`的区别：
![设置vscode生效的范围](设置vscode生效的范围.png)

:point_right: 然后，一般情况下，由于不同的项目，采用的格式化配置可能不一样，因此，实际项目过程中，不采用全局生效的方式，而是采用与项目相关的配置，也就是在对应的`workspace setting`中进行相关的配置：
![针对项目的vscode的prettier配置](针对项目的vscode的prettier配置.png)

:point_right: 接着，对当前项目需要采用的配置，进行自定义格式化配置，借助于 {% link "官方prettier参数配置" "https://prettier.io/docs/en/options.html" true 官方prettier参数配置 %} 进行针对当前项目的自定义格式化配置，一般可以采用在当前项目根目录中创建对应的文件格式，如下图所示：
![可支持的prettier文件格式](可支持的prettier文件格式.png)
:point_down: 而对应的`prettier配置文件`的内容如下所示(根据不同的文件格式，对应 :u6709: 不同的文件规范内容)：
![prettier配置文件内容](prettier配置文件内容.png)
