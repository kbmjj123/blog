---
title: CSS中的background相关属性详解
description: CSS中的background相关属性详解
author: Zhenggl
date: 2022-03-31 14:55:10
categories:
    - [css, background]
tags:
    - css
    - background
cover_picture: css中的background属性封面.jpeg
---

### 前言
> 平时在用三方UI库的时候，那爽🉐️不要不要的，但是作为一个前端开发者，如果连基本的界面都不能画好的话，又怎么能够胜任得了后续复杂不断的业务变动以及页面的交互呢。
> 之前从来没有考虑过这个问题，认为不懂的内容，只需要简单的度娘就可以了，实际上，更重要的是要关注于基础，凡事多问几个为什么。
> 本文从元素的背景属性：background来进行诠释，向自己解析其中是如何将背景给发挥🉐️淋漓尽致的。

开局先上一幅图，了解一个整体的概况：

![CSS中的Background属性](CSS中的Background属性.png)

### background-image
> 设置元素的背景图片

| 描述 | 描述 |
|---|---|
| 取值 | <image> |
| 继承性 | false |
| 动画性 | false |

`<image>`中的取值范围为：[<uri>|<linear-gradient>|<repeating-linear-gradient>|<radial-gradient>|<repeating-radial-gradient>]

⚠️ 这里🈶️一个点需要注意的是：background-image允许接收多个不同的参数，代表这不同的背景，同时需要配合background-position来控制不同的背景元素。如下代码所示：
```html
  <style>
  #example{
    background-image: url(img_flwr.gif), url(paper.gif);
    background-position: right bottom, left top;
    background-repeat: no-repeat, repeat;
    padding: 15px;
  }
</style>
```

![background-image多张图片效果](background-image多张图片效果.png)

✨ 由此可见，我们通过对应在顺序位置上进行属性的配置，可以达到针对一个元素进行多个背景的同时配置。

### background-position
> 指定背景图片的具体位置

