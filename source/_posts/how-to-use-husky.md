---
title: husky是如何实现自动化代码管理的
description: husky是如何实现自动化代码管理的, 将代码规范结合程序进行自动化管控
author: Zhenggl
date: 2023-04-17 15:38:56
categories:
  - [前端, 编码规范, 自动化]
tags:
  - 前端
  - 编码规范
  - 自动化
  - husky
cover: husky封面.png
---

### 前言
> 在日常的代码管理中，没有严格按照代码规范来编写代码，提交的`git message`不规范，很难从提交日志中看出调整了什么内容，其他同事使用的ide与我的不一致，其他同事与我的编码有空格冲突，又不能一口气直接替换，花费大量的时间来进行代码的合并，解决空格冲突等等，我们的编码工作，不应该是在这个重复的低效的工作上的！！
> :point_right: 因此，**husky(哈士奇)**就闪亮 :stars: 登场了！
> :confused: 第一次听到这个中文翻译时，有些许疑惑，按照 {% link "官方文档" "https://typicode.github.io/husky/" true 官方文档 %} 所描述的！
> *当您提交或推送时，您可以使用它来整理您的提交消息、运行测试、lint 代码等*

### 什么是husky?
> *当您提交或推送时，您可以使用它来整理您的`提交消息`、`运行测试`、`lint` 代码等*
> 这个是官方的介绍，`husky`支持所有的[git勾子](https://git-scm.com/docs/githooks)，实际在使用的过程中，除了这个勾子动作之外，应该还可以支持到`npm`的[相关勾子动作](https://www.npmjs.cn/)
> 

### 如何使用husky(npm方式)
`husky-init`是用`husky`快速初始化项目的一次性命令！
```bash
  npx nusky-init && npm install
```
:point_up: 上述这里的命令，将设置`husky`，同时修改`package.json`，在其`script`中创建一个`pre-commit`脚本动作，这里我们可以修改默认的脚本动作！
![用husky推荐方式来初始化项目](用husky推荐方式来初始化项目.png)
:stars: 执行完成该命令后，将对应的在当前项目的`.husky`目录中创建相关资源目录以及文件：
![初始化后的目录](初始化后的目录.png)
:point_down: 对应地在`package.json`中创建的命令：
![初始化后的husky自动创建的脚本](初始化后的husky自动创建的脚本.png)
:stars: 从这个默认的命令中，我们可以看出它执行的是`npm test`动作！

:confused: 如果我们需要新增自定义的勾子呢？
```bash
  npx husky add .husky/commit-msg 'npx --no --commitlint --edit "$1"'
```
:point_up: 这里我们将在`package.json`中的`script`添加一个动作：*commit-msg*，然后这个勾子对应执行的内容是：'npx --no --commitlint --edit "$1"'

:trollface: 当然，我们也可以直接在对应的`package.json`中添加勾子以及勾子对应的程序动作！无须去专门记住这个`husky`的相关脚本！

### husky的工作原理
> `husky`的代码也比较简单，无非就是 :four: 个命令: install、uninstall、add、set
![husky的相关代码](husky的相关代码.png)

:trollface: 其中的`add`与`set`命令，主要是在对应的`.husky`目录下创建对应的参数对对应的文件，并在文件中可以直接执行到对应的程序命令， :star: 从`husky`的`add/set`命令可以看出，创建的文件是对应的`git勾子函数`名称来命名的，是一个普通的**bash脚本**， :art: 我们可以在这个脚本中加入自己的一个动作，比如`npm run scripts中的自定义命令`，这样子，还可以在勾子被触发的时候，顺便触发我们的自定义node程序！

### 与husky的延伸扩展

#### 1. 与git-commit的结合(commitlint)
> 在实际的项目过程中，我们需要从其他同事的代码提交记录中查找相关的资料，而且这个也是业界所认同的方式！
> 因此需要项目成员遵循统一的团队内部规范，确保大家提交的代码尽量是保持统一的一个风格！
> **假设已安装好对应的`husky`环境**
1. 添加`commit-msg`勾子，执行信息的校验
```bash
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```
2. 安装commitlint校验工具(commitlint)以及校验规则(@commitlint/config-conventional)
```bash
npm install commitlint @commitlint/config-conventional --save-dev
```
:stars: 这里的`@commitlint/config-conventional`是一个提交的msg规范，默认采用的Angular的提交规范！
3. 创建commitlint.config.js配置文件
```js
module.exports = {
  extends: [
    "@commitlint/config-conventional"
  ]
}
```
4. 执行命令，校验配置的内容(输入不合规的msg)
![执行commit-msg动作](执行commit-msg动作.png)

5. 输入合规的msg
![输入合法commit-msg内容](输入合法commit-msg内容.png)

:warning: 在进行整体配置的过程中，还是比较坎坷的，主要有 :point_down: 几个点，记录一下，以免后续踩坑：
+ commitlint.config.js文件名称写错或者是编码格式有问题，导致在`git commit`的时候，一直提示解析异常；
+ node的版本问题，之前采用的v12系列的版本，致使程序不能够被正常的运行，后面升级到了v14系列的node版本，并采用nvm进行默认版本的配置，使得husky程序能够被正常地执行！
+ 与ide工具的配合，由于采用的是业界使用率较高的`git-commit-plugin`插件，其中 :u6709: 配置的emoji表情相关的，因此需要采用另外的一个三方库`commitlint-config-git-commit-emoji`，并将其配置到对应的`commitlint.config.js`文件中
```javascript
module.exports = {
  extends: ["git-commit-emoji"] 
};
```
![vscode的git插件](vscode的git插件.png)
+ `set-script`命令在新或者较旧的npm中已经被删除，所以自己手动配置对应的脚本程序即可

#### 2. 与changelog(conventional-changelog)的配合
> 在实际的代码管理过程中，可以针对相关的阶段勾子，提供一公共的脚本`changelog`，来创建阶段性的changelog，代表某一个阶段的里程碑！
1. 添加对应的`conventional-changelog`
```bash
npm install conventional-changelog conventional-changelog-cli --save-dev
```
2. 添加对应的脚本到`package.json`的scripts中
```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
  }
}
```
3. 初次执行命令，全量生成changelog信息
```bash
npm run changelog
```
![初次生成CHANGELOG文件内容](初次生成CHANGELOG文件内容.png)

:stars: 官方推荐的关于`changelog`的最佳实践：
![changelog的最佳实践](changelog的最佳实践.png)

:point_down: 是`conventional-changelog`的相关参数一览：
![conventional_changelog命令的相关参数](conventional_changelog命令的相关参数.png)
