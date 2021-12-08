---
title: WebWorker的学习与使用
author: Zhenggl
date: 2021-12-08 16:14:31
categories:
- [javascript]
tags:
- javascript
cover_picture: cover-web-worker.png
---
### 前言
> JavaScript是单线程的，如果需要进行多线程的话，一般是不可能的，因为从头到尾只有一个线程在执行，对于多线程则需要协同配合，分享可执行时间，线程A执行一段时间，
> 然后线程B执行一段时间，能否就是新开一个线程，可以从头到尾来执行，而不会影响到原本的JS主线程呢？
### 引入
👉在宿主浏览器中提供了以下这样子的一套机制：浏览器提供多个不同的js引擎实例，每个实例都各自运行在自己的所属线程中，来执行不同的程序，程序中每一个这样子的独立多线程部分被称为是一个WebWorker，  
每个WebWorker都可以与js主线程进行通讯。
### 现状
WebWorker目前的一个兼容性：
![worker的浏览器兼容率](can-i-use-worker.png)
### worker使用
🧠这个有点想像安卓开发中的UI主线程与非UI线程之间，非UI线程主要做一些耗时长、繁琐的逻辑运算，然后通过消息通讯机制的方式进行通讯。
以下是Js主线程与WebWorker之间的一个通讯过程：
![worker的浏览器兼容率](worker-demo.png)
从上面我们可以看出js主线程与webworker之间的通讯方式是对称的。
附带上关于JS主线程与Worker线程之间的一个通讯代码：
![worker的浏览器兼容率](message-between-js-worker.png)
⚠️ 专用的Worker与创建Worker的程序之间是一对一的关系，也就是说一个页面中可以创建出多个worker。


