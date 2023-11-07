---
title: webpack插件-ProgressPlugin
description: webpack插件-ProgressPlugin
author: Zhenggl
date: 2023-01-04 08:06:19
categories:
  - [webpack, plugin]
tags:
  - webpack
  - plugin
cover: ProgressPlugin封面.jpg
---

### 前言
> `ProgressPlugin`提供了一种自定义编译过程中进度报告方式的方法！
> {% link 官方链接 https://webpack.js.org/plugins/progress-plugin/ true 官方链接 %}

### 使用方式
> 一般地，我们可以通过创建一个`ProgressPlugin`对象并传递允许的可选参数，来实现自定义输出的目的！
```javascript
// webpack.config.js
const {ProgressPlugin} = require("webpack");
module.exports = {
  plugins: [
    new ProgressPlugin({
      //... 参数说明见下表
    })
  ]
};
```
:point_up: 加入了对应的插件配置后，则有对应的 :point_down: 的日志输出
![加入了ProgressPlugin之后的输出](加入了ProgressPlugin之后的输出.png)

| 参数名称 | 类型 | 描述 |
|:---|---|:---|
| activeModules | boolean | 显示活动模块计数和一个正在进行的活动模块消息 |
| dependencies | boolean | 显示依赖的数量 |
| dependenciesCount | boolean | 显示的最小依赖数 |
| entries | boolean | 显示入口数量 |
| handler | HandlerFunction | 在每一步的过程中被调用 |
| modules | boolean | 显示模块数量 |
| modulesCount | boolean | 显示的模块数量起步数 |
| percentBy | string/null | 显示的百分比计算规则，可选值有：`entries`、`modules`、`dependencies`、`null` |
| profile | boolean | 是否收集步骤过程数据 |

:stars: 关于上表中的`handler`回调方法定义如下：
```javascript
  export type HandlerFunction = (
    percentage: number,
    msg: string,
    ...args: string[]
  ) => void;
```
:warning: 一旦定义了该方法的话，则原本其他的配置将全部失效，关于该回调方法中的参数描述如下：
1. percentage: 代表当前步骤的执行百分比；
2. msg: 对于当前步骤的描述；
3. args: 对于当前步骤所需的额外参数描述；