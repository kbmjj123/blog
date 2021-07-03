---
title: 在你的项目代码层面中加入git提交代码的规范
author: Zhenggl
date: 2021-05-16 16:34:03
categories:
    -[编码规范, git]
tags:
    - 工具
    - git
cover_picture : https://img.91temaichang.com/blog/add-git-commit-template-rule-in-project.png
---
### 前言
大家在日常的coding生活中，不免需要提交代码，然后每次代码commit的message，是否有认真地描述过呢？

我想不少童鞋应该是直接随便编写点简单的描述内容就直接提交上去了，但是，要是遇到下图这个情况：

![随便提交的git commit message](https://img.91temaichang.com/blog/git-commit-without-correct-msg.png)

作为项目管理员，在做这个代码的code reviewing的时候，要看每次提交的代码具体都是做了什么事情的时候，估计心里会有一顿F开头的话语。

那么作为一个项目的负责人，有必要对开发人员每次提交的message进行维护，不同的开发人员对每次commit的描述都有不同的格式。

根据业界开发人员整理了关于这个commit的规范，且在相关的IDE开发工具中提供的相关的插件

![git提交规范](https://img.91temaichang.com/blog/git-commit-template.png)

供我们方便的使用。

防范于未然，我们总不能在每个项目的各个阶段来跟进到代码提交的规范，更应该让每个开发人员在提交代码的时候都有这个意识。

针对👆这个情况，对于web前端项目，我们可以提供一简单的工具，在每个开发人员在提交代码的时候，自动拦截不符合规范的git commit message。

### validate-commit-message 插件工具的使用

#### validate-commit-message的安装
```shell script
  npm install validate-commit-message --save-dev
```
安装好对应的依赖后，我们可以在`package.json`文件scripts中加入
```json
  {
    "scripts": {
        "init": "validate-commit-msg"
    }
  }
```
这样子之后，我们就可以直接执行脚本
```shell script
  npm run init
```
通过上面这个指令，我们可以来校验每次提交的message是否符合规范

#### 更加"懒"的方式来规范每个开发人员提交的message规范
我们想要在不影响每个开发人员的正常编码，正常提交代码工作的前提下，切入我们的git提交代码message规范。

在`package.json`文件中有一个`config`的属性，其中有一属性`ghooks`，通过在它的下面提供对应的这个`commit-msg`: `validate-commit-msg`
属性，就可以通过钩子(hook)的技术，拦截到这个每次开发人员提交的内容，并在不符合的时候，禁止提交代码。

根据`validate-commit-msg`插件的官方文档描述，我们可以在项目中的`package.json`中或者是在项目中新增一文件名为：`.vcmrc`的配置文件，
在配置文件中进行一下配置的编写。
```json
  {
  "types": ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"],
  "scope": {
    "required": true,
    "allowed": ["*"],
    "validate": true,
    "multiple": true
  },
  "warnOnFail": false,
  "maxSubjectLength": 100,
  "subjectPattern": ".+",
  "subjectPatternErrorMsg": "subject does not match subject pattern!",
  "helpMessage": "",
  "autoFix": false
}
```
对于上述配置的文档说明，可见官方文档上的[描述](https://github.com/conventional-changelog-archived-repos/validate-commit-msg)，

这样子，一旦我们执行的不符合`git commit template`的提交的时候，ide就会自动禁止提交，并提示对应的内容，如下所示：

![异常的commit提交规范](https://img.91temaichang.com/blog/commot-error.png)

必须在修改为正确的git commit message之后，才可以正常提交代码。
