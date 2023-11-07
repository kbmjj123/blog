---
title: 如何使用eslint
description: 如何使用eslint, 格式化js代码, 代码规范
author: Zhenggl
date: 2023-03-08 15:51:57
categories:
  - [前端, lint]
tags:
  - lint
  - ESlint
cover: ESlint封面.jpg
---

### 前言
{% link "ESLint官方文档" "https://zh-hans.eslint.org/docs/latest/use/core-concepts" true ESLint官方文档 %}
> 根据配置方案，来**发现并报告** js中的问题以及提供建议的工具，目的是使代码风格更加一致，同时避免不必要的错误！
> :point_right: 由于要发现代码中的错误，因此*ESLint*必不可少地需要解析代码文件(采用`Espree`，从`Acorn`基础上演变而来)，对解析生成的AST树进行方案评估。另外，在配置文件中的每一个规则都是一个个的插件！！

:confused: 这里提及到*配置方案*，也就是我们所使用的配置文件，它是都包含有哪些成员呢？它是如何被使用的呢？ :point_down: 将一一解释一下！！

### ESLint集成
> 一般的，在现有项目中集成`ESLint`，无非 :u6709: :two: 种方式：

#### 1. 一键初始化
> 通过在项目中直接执行 :point_down: 的命令，将自动在当前项目中安装对应的`ESLint`检测工具环境：
```bash
  npm install @eslint/config
```

#### 2. 手动安装 + CommonJS + CLI
> 通过在项目中安装这个`ESLint`依赖，并创建对应的`.eslintrc`文件，如下所示：
```bash
  npm install --save-dev eslint
```
安装依赖完成后，采用`CommonJS`的方式来编写这个`.eslintrc`文件，对外暴露一对象
```javascript
  module.exports = {/** 这里是相关的ESLint配置 */};
```
然后通过`ESLint`所提供的`CLI`来执行对应的命令，并携带相关的参数
```bash
  npx exlint workspace/ *.js
```

### 关于配置文件的格式
> 关于`ESLint`所支持的配置文件格式有：
> 1. *.js
> 2. *.yaml
> 3. *.cjs
> 4. *.json
> 5. .eslintrc
> 6. package.json中的`eslintConfig`对象属性

:trollface: 在`ESLint`程序看来，其读取的优先级为：`单独文件 > package.json中的属性`

### 配置的构成
![ESLint配置](ESLint配置.png)
:stars: 一个`配置方案`一般包括有：环境、全局变量、规则、插件等等，如下规则代码所示：
```json
  {
    "root": true,
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": { "project": ["./tsconfig.json"] },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/strict-boolean-expressions": [
            2,
            {
                "allowString" : false,
                "allowNumber" : false
            }
        ]
    },
    "ignorePatterns": ["src/**/*.test.ts", "src/frontend/generated/*"]
}
```
:stars: 一个配置文件方案可以有以下的属性：

| 属性 | 描述 | 可选值 |
| ---| --- | --- |
| root | 配置方案文件所在目录 | String |
| env | 配置脚本的预设环境 | `String|Object` |
| extends | 指定继承的另一个配置名称或者数组名称，将继承其所有的特征(包括规则、插件、语言) | `String|Array` |
| parser | 指定的解析器，默认是`ECMAScript5` | `String|Array` |
| parserOptions | 指定解析起选项 | Object |
| plugins | 可以为`ESLint`添加各种扩展功能的npm包 | `String|Array` |
| rules | 可用来定义、扩展、覆盖继承而来的规则，一般是键值对对象 | Object |
| ignorePatters | 设置忽略文件(夹)的正则校验规则字符串 | String |
| processor | 指定处理器，代表将从某些文件格式中提取js代码来校验 | String |
| overrides | 额外指定配置的针对匹配到的文件进行规则覆盖 | Object |


#### env
:alien: 关于`ESLint`的环境，我们可以通过配置`env`来告知`ESLint`将采用什么环境来解析项目中的js文件，关于`ESLint`所支持的环境配置清单，可见 {% link "支持环境清单" "https://zh-hans.eslint.org/docs/latest/use/configure/language-options" true 支持环境清单 %} 所描述的环境清单！
```json
  {
      "env": {
          "browser": true,
          "node": true
    }
  }
```
:point_up: 上述代码配置js所需环境为browser以及node！！

#### extends与rules
:alien: 关于配置文件使用扩展`extends`后，就可以继承另一个配置文件的所有特征（包括规则、插件和语言选项）并修改所有选项。它有三种配置，定义如下
1. 基础配置：被扩展的配置；
2. 派生配置：扩展基础配置的配置；
3. 结果的实际配置：将派生配置合并到基础配置的结果；

:stars: 而这个`extends`属性所支持的值 :u6709: ：
1. 一个指定配置的字符串: 比如airbnb，将代表从`esling-config-airbnb`公共三方配置中继承；
2. 一个指定配置文件路径或者共享名称的字符串：比如`eslint:recommended`或者`eslint:recommended`;
3. 一个字符串数组，越往后定义的将覆盖前面的使用的配置

:warning: 可以省略配置名称中的 `eslint-config-` 前缀。如 `airbnb` 会被解析为 `eslint-config-airbnb`

:alien: 而这个`rules`则与一般与这个`extends`来配合，用来做定义、覆盖、追加规则属性的目的！
具体用法见：{% link "扩展配置文件" "https://zh-hans.eslint.org/docs/latest/use/configure/configuration-files#%E6%89%A9%E5%B1%95%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6" true 扩展配置文件 %}

:stars: **rules规则，`ESLint`的核心模块：**

关于规则的设置有 :point_down: 的使用配置：
1. 关闭规则：`off`或者`0`表示；
2. 启用并仅作警告提示：`warn`或者`1`表示；
3. 启用并作错误提示：`error`或者`2`表示

:confused: :point_right: **这里感觉上使用字符串要比数字要更直观一点，不用去理解不大清晰的数字枚举！**

:stars: 一般的规则都有哪些呢？
{% link "rules规则" "https://zh-hans.eslint.org/docs/latest/rules/" true rules规则 %}
:point_right: 关于规则一般都有以下几种类型：
+ 可能出现的错误；
+ 建议；
+ 布局与代码格式化。

:confused: 这里 :u6709: 一个使用上的思考：既然这个`eslint`也可以区分开发环境与生产环境(比如在生产环境禁止使用debugger)，那么可以将原本统一的一个配置文件，调整为依赖(extends)于本地的开发环境以及生产环境的配置，然后根据当前程序运行的环境，来对应使用不同的规则！！！

#### parser与parserOptinos
{% link "指定解析器" "https://zh-hans.eslint.org/docs/latest/use/configure/plugins#%E6%8C%87%E5%AE%9A%E8%A7%A3%E6%9E%90%E5%99%A8" true 指定解析器 %}

#### plugins与processor
:alien: `ESLint`给我们提供了一种插件的机制，允许我们通过`npm安装插件依赖`的方式，来配置使用对应的插件模块，也就是在使用之前必须要先安装对应的npm依赖

{% link "配置插件" "https://zh-hans.eslint.org/docs/latest/use/configure/plugins#%E9%85%8D%E7%BD%AE%E6%8F%92%E4%BB%B6" true 配置插件 %}

:alien: 而对这个`plugins`相对应的，可以使用`processor`来定义将从插件中指定对某些特性文件的处理
{% link "指定处理器" "https://zh-hans.eslint.org/docs/latest/use/configure/plugins#%E6%8C%87%E5%AE%9A%E5%A4%84%E7%90%86%E5%99%A8" true 指定处理器 %}

#### 忽略文件(夹)
:alien: `ESLint`允许我们配置`ignorePatters`属性或者创建对应的`.eslintignore`来配置忽略文件(夹)，而且额外文件的优先级要高于在文件中定义的`ignorePatters`的！！

:star: 关于`.eslintignore`这个文件的定义 :point_down: 如下:
1. 它是一个纯文本文件，每一行都是一个匹配规则；
2. 其中的注释以#开头
3. 除了在该文件中定义的规则，其他的`ESLint`自定的默认忽略规则依然适用；
4. 具体规则可参见`.gitignore`所采用的规则，两者使用上一致

### 共享配置的创建
