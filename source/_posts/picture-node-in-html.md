---
title: html中的picture是如何使用的
description: html中的picture是如何使用的, 与source标签以及img标签的配合使用，实现图像多媒体查询自适应效果
author: Zhenggl
date: 2023-05-09 22:45:50
categories:
  - [html, picture]
tags:
  - html
  - picture
  - source
cover_picture: html中的picture节点封面.jpg
---

### 前言
> 今天偶然遇到这个`picture`标签，平时在日常的业务开发过程中，比较少使用到该节点，查阅了`MDN`官方的文档， :cat2: 才知道存在着另外一种图片媒体资源标签：*通过`<picture>`标签来包含一个或者多个`<source>`元素和一个`<img>`元素，来为不同的显示设备/场景提供对应的图像版本*！
> 也就是说，可单纯直接通过`html`标签以及它的属性，来实现一个“自动媒体查询”的图像效果！！！如下图所示；
```html
<picture>
    <source srcset="https://interactive-examples.mdn.mozilla.net/media/cc0-images/surfer-240-200.jpg"
            media="(orientation: portrait)">
    <img src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/painted-hand-298-332.jpg" alt="">
</picture>
```
![picture的简单使用](picture的简单使用.gif)

:stars: 要决定加载哪个 URL，`user agent` 检查每个 `<source>` 的 `srcset`、`media` 和 `type` 属性，来选择最匹配页面当前布局、显示设备特征等的兼容图像

:stars: `picture标签`其实关键在于`<source>标签的运用`！

### source标签
> `<source>`是一个 :u7a7a: 标签，通常用来为`<picture>`、`<video>`、`<audio>`元素来提供多个媒体资源，一般放置在**流元素之前**，也就是让浏览器代理自行判断将使用哪个标签！

#### source的属性

| 属性 | 描述 |
|---|---|
| src | 与`<video>`或`<picture>`标签配合，代表媒体资源的地址 |
| type | 资源的MIME类型 |
| media | 资源的预期媒体的媒体查询，只能在`<picture>`标签中使用 |

:alien: 实际在使用过程中，采用优先定义的资源优先享有加载的权利，如下代码所示
```html
  <video controls>  
    <source src="movie.mp4" type="video/mp4">  
    <source src="movie.ogg" type="video/ogg">  
    Your browser does not support the video tag.
  </video>
```
:stars: 在这个例子中，如果浏览器支持MP4格式，则会使用movie.mp4文件进行播放；如果不支持MP4格式但支持OGG格式，则会使用movie.ogg文件进行播放。如果两种格式都不支持，则会显示指定的`<video>`标签内的文本提示。

:confused: 这里关键在于`media`属性的使用，那么这个属性一半都有哪些属性值呢？
:point_right: **通常情况下，这个属性可以取自任何标准的CSS媒体查询（Media Query）语句**

| 属性 | 描述 |
|---|:---|
| all | 表示对所有设备和媒体类型都适用 |
| print | 表示打印设备，如打印机等 |
| screen | 表示显示器、平板电脑、智能手机等屏幕设备 |

:warning: 除了上述标准的值之外，media属性还支持任何有效的CSS媒体查询语句，可以使用与CSS样式表相同的语法规则来编写，如下代码所示：
```html
  <video>
    <source media="(max-width: 480px)" src="example-small.webm" type="video/webm">
    <source media="(min-width: 481px)" src="example-large.webm" type="video/webm">
  </video>
```
:stars: 在这个例子中，如果设备的屏幕宽度小于或等于480像素，则使用名为example-small.webm的视频文件；如果设备的屏幕宽度大于480像素，则使用名为example-large.webm的视频文件。