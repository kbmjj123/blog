---
title: 如何使用stylelint
description: 如何使用stylelint, 格式化css代码, 代码规范
author: Zhenggl
date: 2023-03-11 05:29:25
categories:
  - [前端, lint]
tags:
  - lint
  - stylelint
cover_picture: stylelint封面.jpg
---

### 前言
{% link "Stylelint官方文档" "https://stylelint.io/" true Stylelint官方文档 %}
> 与之前学习的 {% post_link how-to-usage-eslint ESLint %} 相类似，`Stylelint`作为一个css linter，可帮助我们避免编写错误的css样式代码，并强制执行预先协商好的“约定”配置，配置可从标准的配置继承而来，也可重写！ 

### Stylelint的相关特性
1. 提供的现成的业界css语法和功能的自定义规则；
2. 支持**插件**的方式，可创建自定义规则；
3. 提供自我修复的能力，自动修复配置告知的预警规则；
4. 可根据自己的习惯进行自定义；
5. 可从`html`、`markdown`、`css-in-js`等文件中提取css进行校验；
6. 可扩展至`scss`、`sass`、`less`、`sugarSS`

:point_right: `Stylelint`可有效帮助我们避免一些不必要的错误，比如有：
+ 拼写错误的css属性；
+ 重复的选择器；
+ 畸形的grid布局区域

:point_right: `Stylelint`还可按照配置约定来执行，比如有：
+ 设置适用单位；
+ 强制命名模式，比如自定义属性；
+ 设置限制，比如设置id选择器的数量；
+ 指定符号，比如现代颜色函数；

### 如何使用？
> 关于`Stylelint`的使用，一般 :u6709: :point_down: :three: 个步骤：

#### 安装相关的环境以及配置
> 通过命令来安装对应的检查程序以及对应约定配置方案
```bash
  npm install --save-dev stylelint stylelint-config-standar
```

#### 同时创建对应的配置文件方案
> 在根目录中创建对应的配置文件`.stylelintrc.json`(这里允许不同的文件格式后缀，包括有：.stylelintrc.{cjs,js,json,yaml,yml}文件、stylelint.config.{cjs,js}导出 JS 对象的文件、定义在package.json中的stylelint属性)

:stars: 这里一般是推荐采用与对应文件格式后缀相对应的语法来编写，比如如果定义为`.stylelintrc.js`，则采用`module.exports = {}`，如果定义为`.stylelintrc.yaml`文件，则采用yaml文件格式的方式来编写！！！

```json
{
  "extends": "stylelint-config-standard"
}
```
### 执行检测程序
```bash
  npx stylelint "**/**.css"
```

### 相关成员
![StyleLint](StyleLint.png)
> 关于`Stylelint`一般 :u6709: :point_down: 几个常见的核心属性：

#### extends
> 通过对该属性的配置，可实现从官方/三方/自定义的配置中继承配置，免去自己重头重复造轮子，遵循业界规范，在继承的同时还支持`重写`、`扩展`、`自定义语法`等操作！
> 可支持设置**字符串也可以是数组**，采用数组的话则越往后定义的将覆盖前面已定义的其他配置！
```json
{
  "extends": "stylelint-config-standard",
  // "extends": ["stylelint-config-standard", "./myExtendableConfig"],
  "rules": {
    "alpha-value-notation": "number",
    "selector-class-pattern": null
  }
}
```
:point_up: 这里的`extends`其实是`require()`函数执行的过程，通过对该字符串的定义，可以做到对字符串的精准匹配，而且遵循原本nodejs查找依赖的顺序！

#### plugins
> 插件是自定义规则或自定义规则集，用于支持方法论、工具集、非标准CSS 功能或非常具体的用例
```json
{
  "plugins": ["../special-rule.js"],
  "rules": {
    "special-rule/first-rule": "everything"
  }
}
```
:stars: 插件可以提供单个规则或一组规则。如果您使用的插件提供了一个集合，在"plugins"配置值中调用该模块，并使用它在"rules"中重载插件中的对应规则！

#### overrides
> 使用该overrides属性，我们可以指定要将配置应用到的文件子集！
```json
{
  "rules": {
    "alpha-value-notation": "number"
  },
  "overrides": [
    {
      "files": ["*.scss", "**/*.scss"],
      "customSyntax": "postcss-scss"
    },
    {
      "files": ["components/**/*.css", "pages/**/*.css"],
      "rules": {
        "alpha-value-notation": "percentage"
      }
    }
  ]
}
```

### 做点什么
> 通过对`Stylelint`的学习，我们可以使用该库以及配置，来为所跟进项目进行统一的css规范化管理，通过配置方案，使得相关的css样式做到自我检测并自我修复，团队成员采用统一的一个配置，遵循统一的css编码规范，这里我觉得还可以再加上 之前的另外一片文章：{% post_link BEM-in-css css中的BEM命名规范 %}，结合起来，整理形成公司内部公共的配置，并同时形成公司内部的npm配置，通过安装内部的依赖，结合项目规范文档，可实现多个项目自动遵循并自动集成统一的编码规范！！