---
title: eslint+stylelint+prettier+husky+commitlint+vscode实现vue编码规范自动化管理
description: eslint+stylelint+prettier+husky+commitlint+vscode实现vue编码规范自动化管理, 在vue项目中即成编码规范自动化管理, 将文档化的编码规范与实际编码结合起来
author: Zhenggl
date: 2023-04-24 09:16:20
categories:
  - [前端, eslint]
tags:
  - eslint
  - stylelint
  - prettier
  - husky
  - commitlint
cover: 编码自动化管理封面.png
---

### 前言
> 在日常的coding编码过程中，难免会遇到其他的同事的编码并没有严格按照入职时的编码规范来严格编码，导致项目中的代码混乱无序，没有按照一定的规则规范，使得最终的整个项目不是完整的一个项目，因此，很有必要将所有的童鞋的编码习惯以及编码风格给统一起来，但又不想直接通过阅读代码的方式以及强制要求的方式要限定统一的规格！
> `eslint` + `stylelint` + `prettier` + `husky` + `vscode` = `编码规范自动化`

### 相关的概念介绍
> 在开始介绍搭建完整的过程之前，先简单介绍一下相关的成员以及他们对应的使用场景！

#### eslint
> 主要负责代码规则校验，具体可以参考之前的一篇文章: {% post_link how-to-usage-eslint ESLint的用法 %}!

#### stylelint
> 主要负责监测样式规则，具体可以参考之前的一篇文章：{% post_link how-to-use-stylelint stylelint的用法 %}!

#### prettier
> `prettier` 是一种代码格式化工具，它可以自动帮助开发者规范化代码结构、缩进、换行等细节问题，使代码更加整洁、易读、易维护。`prettier` 支持多种编程语言，包括 JavaScript、TypeScript、CSS、HTML、JSON 等。通过使用 Prettier，开发者可以避免在代码风格上产生争议，提高团队协作效率，减少代码维护成本
> `prettier`主要是为了格式化代码，在没有`prettier`之前，我们是采用`eslint --fix`也来进行这个代码的格式化的，假如使用`eslint`来进行代码的格式化的话，需要针对不同的编辑器配置不一样的代码格式，而且配置会相对比较麻烦！
> *通过使用`prettier`，简化了`eslint`关于代码格式化的配置*，统一将代码格式化工作都交给`prettier`来负责

#### husky
> 负责在`git相关操作`触发时，自动触发对应的勾子函数，仅有在勾子函数成功执行时，继续往下执行对应的`git操作`
> 具体可以参考之前的一篇文章：{% post_link how-to-use-husky husky的用法 %}!

#### commitlint
> 主要用于保证团队成员提交的代码说明msg是否符合业界标准！

### 实现步骤(vue项目)
> :point_down: 以一个实际的vue项目来具体一步一步配置完整的编码规范项目！

#### 手动挡方式配置

##### 1. 安装eslint以及prettier相关配置
```bash
  npm install eslint eslint-plugin-standard vue-eslint-parser --save-dev
```
:stars: 这里的`vue-eslint-parser` :point_right: 主要是用于解析`vue`文件的，因此默认的`eslint`只能够处理普通的js文件！

:stars: 由于`eslint`与`prettier`都能够格式化代码以及部分规则存在冲突，为避免冲突，需要安装对应的`eslint-config-prettier`，这个库用于解决`eslint`与`prettier`之间的冲突，关掉额外的报错(比如`eslint`与`prettier`都存在单引号的错误)！

:stars: 而`eslint-plugin-prettier`则可以将`prettier`作为`eslint`规则来运行！
因此就有安装 :point_down: 两个库的存在：
```bash
  npm install eslint-config-prettier eslint-plugin-prettier --save-dev
```

:star2: 由于是`vue`项目，现代项目更多的是采用`ES5+`以后的语法规则，但这个`eslint`仍然只能解析`es5`的相关js代码，因此需要安装对应的`babel`系列“套餐”，包括有`babel-eslint`(用于在eslint中使用babel解析的插件或者工具，将babel集成到eslint中，使得eslint可以解析最新版本的ESMAScript语法)、`babel-core`以及`eslint-plugin-babel`，后两者是`babel-eslint`所依赖的库
```bash
  npm install babel-eslint babel-core eslint-plugin-babel --save-dev
```

![没有安装对应的vue文件解析的时候](没有安装对应的vue文件解析的时候.png)
:stars: 由于`eslint`仅能够识别`*.js`文件，因此，需要额外配置对应的vue解析器，vue官方也提供了对应的解析器：**vue-eslint-parser**，对应的官网为：{% link "vue解析器官网" "https://eslint.vuejs.org/" true vue解析器官网 %}
```bash
  npm install eslint-plugin-vue -save-dev
```
:warning: 这里这里的`eslint-plugin-vue`对于node的版本 :u6709: 对应的要求，可以根据安装过程的依赖版本提示进行对应的调整！安装完成后，在对应的`.eslintrc`文件中配置对应的parser
```js
  module.exports = {
    // 此处隐藏一系列代码
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": "@babel/eslint-parser",
        "sourceType": "module"
    }
  }
```

##### 2. 创建对应的配置文件(以`.eslintrc.js`为例)
```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/essential', 'prettier'],
  plugins: ['prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: false,
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'no-useless-escape': 'warn',
    'generator-star-spacing': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    //强制使用单引号
    quotes: ['error', 'single'],
    //强制不使用分号结尾
    semi: ['error', 'never'],
  },
}
```
##### 3. 安装stylelint以及对应的prettier配置
```bash
  npm install stylelint stylelint-config-prettier stylelint-config-standar --save
```
:shushing_face: 正常情况下安装完成后，可以直接通过`npx`相关命令直接运行已经在当前项目中安装的脚本程序，但是，实际情况却完全不一样：
![版本对应不上导致的stylelint异常](版本对应不上导致的stylelint异常.png)

:triumph: 去对应的官网的github上查找了一下相关的说明介绍：
![stylelint与prettier的版本冲突说明](stylelint与prettier的版本冲突说明.png)
![stylelint对于node的版本要求](stylelint对于node的版本要求.png)
:point_right: 因此只能根据安装依赖时的版本提示，进行对应的版本调整

:stars: 调整完成后，发现 :u6709: 以下的一个执行结果：
![由于stylelint只能识别css导致对于less的处理异常](由于stylelint只能识别css导致对于less的处理异常.png)
这个是由于标准的`stylelint`只能处理*.css文件，因此需要追加对应的`stylelint-less`、`stylelint-scss`、`stylelint-prettier`
```bash
  npm install stylelint-less stylelint-scss stylelint-prettier --save-dev
```
安装完成后，需要在对应的`.stylelintrc.js`相关的`stylelint`配置文件中进行对应的解析器配置！
```javascript
  module.exports = {
    "extends": ["stylelint-config-standard", "stylelint-prettier/recommended"],
    "customSyntax": "postcss-less",
    "plugins": ["stylelint-less", "stylelint-prettier"],
    "rules": {
      "prettier/prettier": true
    }
  };
```

:stars: 完成对应的配置后，再次执行对应的命令，即可看到 :point_down: 的输出结果：
![正常的stylelint结果](正常的stylelint结果.png)

##### 4. husky实现勾子自动检查
> 安装husky以及相关的勾子函数动作
```bash
  npx husky-init && npm install
  npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```
##### 5. 安装commitlint
> 安装commitlint校验工具(commitlint)以及校验规则(@commitlint/config-conventional)
```bash
  npm install commitlint @commitlint/config-conventional --save-dev
```
关于这个`commitlint`的配置与使用，具体可以参考之前已经编写过的一个文章：[husky是如何实现自动化代码管理的](/2023/04/17/how-to-use-husky/#1-与git-commit的结合-commitlint)

##### 6. 安装changelog
> :confused: 有观察过这个github开源的一些项目，他们所提交的代码都有对应的这个changelog，那么这个业界的changelog应该是怎样的呢？如何与网络上的大伙保持在同一个水平线上呢？关于这个changelog可以参考之前的另外一个主题：[husky是如何实现自动化代码管理的](/2023/04/17/how-to-use-husky/#2-与changelog-conventional-changelog-的配合)

##### 7. 安装lint-staged
> 假如每一次提交的代码，都需要进行`eslint`、`stylelint`、`prettier`、`commit-msg`一系列动作的话，随着代码量的逐渐增加，估计会加大每次提交代码的等待时长，因此，可以使用这个`lint-staged`，仅针对每次提交的代码进行这个检查动作!

```bash
  npm install lint-staged --save-dev
```
:stars: 新增对应的配置文件：
```javascript
  // lint-staged.config.js
  module.exports = {
    '*.js': ['eslint --cache --fix', 'git add'],
    '*.vue': ['eslint --cache --fix', 'git add'],
  }
```

:trollface: 这个`lint-staged`的执行过程就是根据已经匹配的文件，执行对应的脚本，将匹配到的文件与脚本做一个关联合并执行，这是什么意思呢？还是以上面 :point_up: 的配置做一个对应的说明：

:point_right: 这里假设匹配到的文件是main.js以及utils.js两个js文件，那么执行`lint-staged`的时候，将会是以下的过程：
1. 遍历脚本对象/数组，与匹配到的文件进行连接：`eslint --cache --fix main.js utils.js`、`git add main.js utils.js`;
2. 将上述形成的连接，形成两个顺序执行的命令，等待第一个执行完毕之后，继续执行下一个命令；
3. 对于不同的文件的配置，像这里的js以及vue，则将形成对应两个并列待执行的数组命令，也就是说对js文件的处理以及对vue文件的处理过程，两者是并行的

#### 自动化配置(追加配置)
> 借助于脚手架创建的项目进行的二次配置，且借助于其中的`@vue/cli-plugin-eslint`
### prettier与vue结合
> 用`vue脚手架`创建的项目中，默认自动即成了`eslint`了，正常情况下，应该是一旦用脚手架创建出来的项目，安装完成对应的插件以及配置的话，应该是可以直接通过命令`npm run lint`来完成最基本的`lint`操作的！
> :confounded: 但是，实际情况却是一旦运行的话，就出现下述的结果：
![vue脚手架创建的项目与prettier初次结合的结果](vue脚手架创建的项目与prettier初次结合的结果.png)

:alien: 一旦集成了`prettier`的话，就提示或这或那的问题，而且在执行相关的`install`安装对应的依赖的时候，在安装成功后，都会输出 :point_down: 类似的warning提示内容：
![eslint版本不用对应导致的问题](eslint版本不用对应导致的问题.png)

而当我们执行的`npm run lint`所依赖的库以及对应的版本信息如下：
![执行的命令对应所依赖的库](执行的命令对应所依赖的库.png)
:confused: 这里猜测是`eslint`的库与`prettier`所对应的版本不一致，导致在执行eslint的时候直接跪了，因此，根据对应的依赖安装提示，安装对应版本的依赖库，:point_right: 最终解决这个问题！！！

:trollface: 追加`prettier`的相关配置，最终完成vue项目的prettier集成！
![vue项目与prettier的结合](vue项目与prettier的结合.png)

#### 与ide编码工具的结合

### 统一的一键执行命令
> :point_up: 上述的一遍流程下来，估计要一天的时间以上的时间了
> :confused: 是否可以将上述的流程，集成到统一的一个命令中，来进行对应的配置呢？
> 我想，这个应该是接下来我需要实现的！！！