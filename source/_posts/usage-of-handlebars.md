---
title: handlebars的用法
description: handlebars的用法
author: Zhenggl
date: 2022-11-22 06:12:30
categories:
  - [javascript, javascript模版引擎, handlebars]
tags:
  - javascript
  - javascript模版引擎
  - handlebarse
cover_picture: handlebars封面.png
---

### 前言
> 从`express`的脚手架中默认初始化的是`handlebars`模版引擎，那么它是怎样的一个引擎呢？平时在项目过程中是否有使用到它的一个场景呢？
> :point_right: 我打算搭建多另外一个站点，模仿`less`的关于文档的快捷在线浏览中文站点，不想仅仅单纯通过翻译别人的网站，而自己根本不清楚其中的一个使用相关原理，因此，我开始这个自建CMS站点之路，
> 而且从国内目前的前端来看，以前的前端一来就直接上手`jquery`，现在立马就进入`vue/react/angular`+`webpack`，但对比国外的开发佬，好像人家一来就是静态站点，然后配合相关的工具比如`grunt`打包，编写自己的CMS生态，
> 借助于`grunt`来实现的`grunt`生态体系，我也在另外一篇文章中详细阐述了`grunt`是什么以及如何使用的，本文主要分享一下关于`handlebars`是如何使用的，以及在使用的过程中有一些不清晰的概念以及用法，记录到文档中，方便自己
> 以及他人后续学习！

### 官方介绍
[官方链接](https://handlebarsjs.com/zh/)
> 什么是Handlebars?
> 使用模版和输入对象来生成HTML或其他文本格式，该模版看起来像常规的文本，但是它带有嵌入式的`Handlebars`表达式
> 首先先看看 :point_down: 的简单使用例子:
{% codepen slug_hash:'KKeeJrG' %}

:stars: 这里的的使用方式采用的是CDN引用js的方式，一般流程 :u6709: :point_down: 的使用流程：
1. 找到script模版对应的html字符串内容；
2. 使用`Handlebars.compile()`返回一个template函数的入口
3. 结合模版template函数，加上上下文对象一同执行，输出结果html字符串，展示到界面上

