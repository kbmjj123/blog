---
title: vue源码调试
description: vue源码调试
author: Zhenggl
date: 2022-03-26 12:09:46
categories:
    - [vue, 源码]
tags:
    - vue
    - 源码
cover: vue源码调试封面.jpeg
---

### 前言
最近在熟悉关于vue的公共api的时候，有时真的怀疑关于这个api方法是否真的是这样子执行，执行顺序是怎样的，为什么是这样子的逻辑。
带着问题来解读代码，但需要深入到代码中才能够了解到具体的程序执行逻辑。

工欲善其事必先利其器，这里就需要对源码进行调试，那么应当如何进行源码的调试呢？

### 配置步骤

#### 一、配置文件入口添加source-map
![配置文件入口添加source-map](配置文件入口添加source-map.png)

#### 二、执行命令：npm run dev
将在dist目录中生成对应的vue.js文件
![执行脚本-生成vue.js文件](执行脚本-生成vue.js文件.png)

#### 三、添加调试网页，直接采用cdn方式来使用
![调试页面-引用vue.js文件](调试页面-引用vue.js文件.png)

#### 四、在浏览器中访问页面，通过在vue源码代码中添加debugger直接加入断点
![vue源码调试](vue源码调试.gif)
