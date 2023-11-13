---
title: JavaScript中浏览器的学习
author: Zhenggl
date: 2022-01-15 07:16:52
categories:
    - [javascript, web, 浏览器]
tags:
    - javascript
    - web
    - 浏览器
cover: web浏览器.jpeg
---

### 前言
> 在学习了关于javascript的过程中，我们所编写的代码都是基于web浏览器来进行运行的，web浏览器是提供的javascript的一个宿主环境，通过对该宿主环境的学习，可以很清楚地了解到宿主是如何执行JavaScript的，以及宿主提供了什么环境来执行JavaScript程序的

以下是对应的一个浏览器解析并执行js的一个过程：
![Web浏览器解析执行js过程](Web浏览器解析执行js过程.jpg)

从这里可以看出web浏览器是如何对JavaScript进行执行的。为了防止肆意地对浏览器进行操作，浏览器自身也提供了针对javasc的一系列限制条件：

### 一、浏览器对JavaScript的一个限制条件

1. JavaScript程序可以打开一个新的浏览器窗口，但是为防止广告商滥用弹出窗口，使得只有响应了用户的触发事件才能够允许打开窗口，不能通过程序自动打开窗口；
2. JavaScript程序可以也仅能关闭自己所打开的窗口，不能通过程序关闭其他人打开的窗口；
3. Html中的FileUpload元素中的`value`属性是只读的，假如设置了这个属性，那么可以偷偷地将想要的信息上传到自己的服务器，会造成用户隐私信息的泄漏；
4. 根据同源策略，不能以不同的文档中读取内容。而根据不严格的同源策略：利用文档的domain属性，。控制是否允许读取来自不同站点的数据，一般设置为该站点对应的二级域名，则可以保证通过域名下的其他域名均可以访问到。

### 二、浏览器所提供的JavaScript执行环境一览

![JavaScript浏览器环境](JavaScript浏览器环境.png)
