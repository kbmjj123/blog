---
title: 在vscode中开启代码提示
description: 在vscode中开启代码提示
author: Zhenggl
date: 2022-10-21 11:52:00
categories:
  - [编码规范, vscode]
tags:
  - vscode
  - coding
cover_picture: 在vscode中开启代码提示封面.gif
---

### 小技能
> 在习惯了webstorm这ide之后，转战vscode的时候，:u6709: 着诸多使用上的不习惯，特别是关于这个编码提示，个人已经习惯了webstorm自带的代码提示功能，在上手vscode的时候，发现这个也需要自己来整
> :stars: 可以使用`@type`来进行日常coding的提示，仅仅需要在项目目录中运行以下脚本：

```shell
  npm install --save-dev @types/node
```
引入types模块进行代码提示，然后对应的再新增一文件：**config.js**，并在该文件中维护以下内容：
```javascript
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```
:trollface: 配置完成后，即可看到如下的一个代码提示效果：
![vscode代码提示](vscode代码提示.gif)