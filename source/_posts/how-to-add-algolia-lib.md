---
title: 如何给你的CMS项目添加搜索服务
description: 本文将一步一步带你免费搭建自己CMS文档站点的统一的algolia搜索服务
author: Zhenggl
date: 2023-12-07 18:56:18
categories:
  - [工具插件, algolia]
tags:
  - 工具插件
  - cms
  - algolia
keywords: 文档搜索服务, 一键集成文档搜索服务, algolia集成过程, CMS集成algolia, 免费搭建文档在线搜索服务
cover: hexo集成algolia封面.jpeg
---

### 前言
> :confused: 我们平时在浏览一些开源的在线文档的时候，经常会使用到这个搜索功能，方便自己快速检索到感兴趣的信息，本文将具体带一把，关于如何在自己的文章管理系统中加入此服务，先瞄一眼以下的一个集成后的效果：
![algolia效果](algolia效果.gif)

:trollface: 是不是觉得也很好用，想要在自己的文档中使用这个吗？下面将一步一步带你进入`algolia`搜索的世界！！

### 什么是algolia
> `algolia` 是一家提供搜索和发现解决方案的公司。他们的主要产品是 `algolia search`，这是一个用于网站、移动应用和其他应用程序的搜索引擎服务。`algolia` 的搜索引擎旨在提供快速、可定制和易于集成的搜索体验。

> `algolia` 的搜索引擎基于分布式架构，利用了云计算和搜索算法来提供高性能的搜索服务。它支持全文搜索、模糊搜索、过滤、排序和其他高级搜索功能，使开发人员能够创建强大的搜索体验，提高用户在应用程序中找到所需信息的效率。

### 如何集成algolia
> 这里以我的`hexo`博客文档为例，在当前项目中集成三方库 {% link hexo-algoliasearch https://github.com/LouisBarranqueiro/hexo-algoliasearch true hexo-algoliasearch %}，通过借助于这个库，可以快速地在我们的项目中集成这个文档搜索服务

:confused: 这里假定我们已经注册好了这个`algolia`的账号，并在对应的控制台上创建好了相应的app应用，如下图所示：
![自主创建的algolia项目](自主创建的algolia项目.png)

:star2: 同时在我们的项目中安装对应的搜索服务
```shell
  npm install hexo-algoliasearch
```
然后，对应地在全局的`_config.yml`配置文件中加入这个项目的配置，如下部分代码所示：
```yml
  algolia:
  enable: true
  appId: 这个是我们申请到的appId
  apiKey: 这个是app对应的key
  indexName: 这个是创建indec时所使用的名字
  adminApiKey: 这个是可通过后台代码经由API来发布对应的index索引相关文件
  chunkSize: 5000
  fields:
    - content:strip:truncate,0,500
    - excerpt:strip
    - gallery
    - permalink
    - photos
    - slug
    - tags
    - title
```

:triumph: 一切看起来都好像挺顺利的，然而，一旦开始搜索的时候，就疯狂的报**400错误**，后面经排查，原来这个`algolia search`是需要 :moneybag: 的， :angry: 不可能吖，别人都可以集成，我应该也可以的吖，原来单纯的通过这种自主注册的方式，是需要付费的，我们应该加入一个免费的team，然后再由这个免费的team来分配给我项目，:confused: 那么，应该如何加入到这个免费的team里面呢？
:point_down: 可通过下面的链接
{% link 申请成为免费的plan https://docsearch.algolia.com/apply/ true 申请成为免费的plan %}
![申请成为免费的plan](申请成为免费的plan.png)

:clock1: 然后就等待平台审核了，一般审核结果将会通过绑定的邮箱发送结果给我们：
![审核结果通知](审核结果通知.png)

:point_down: 并附带上集成流程：
![集成流程](集成流程.png)

:point_down: 集成完毕之后，需要上 {% link 生成网站索引管理后台 https://crawler.algolia.com/ true 生成网站索引管理后台 %} 取点击生成当前站点的索引相关文件，成功之后，效果如下：
![crawling重新生成](crawling重新生成.png)

:ghost: 这样子之后，就能够实现像在前言中的效果图一样，可通过关键词来搜索并进入到搜索结果页面了， :point_down: 是对应的每次点击搜索的数据统计效果：
![集成搜索结果](集成搜索结果.png)

### 个人整理的集成algolia搜索服务的一般流程
![集成algolia搜索服务的流程](集成algolia搜索服务的流程.png)