---
title: css视觉效果经验分析
description: css视觉效果经验分析
author: Zhenggl
date: 2022-04-19 10:02:17
categories:
    - [css, 视觉]
tags:
    - css
    - 视觉
cover_picture: css视觉效果经验分析封面.jpeg
---

### 前言
> 我想直接摆脱关于css的胡乱使用现象，从根本上理解css在浏览器代理中的渲染机制，掌握视觉渲染模型的工作原理，自行判断所遇到的怪异行为！！！
> 通过学习css的基本原理，从根本上理解关于css的的布局逻辑，从而面对后续的特殊效果/复杂效果，更加游刃有余

### 元素框基础
> 不管是什么元素，css都嘉定每个元素都会生成一个或者多个矩形框，我们称之为元素框，如下图所示：

![元素框效果](元素框效果.png)

通过👆图的展示，对元素有一个大概的轮廓！

而对于css中关于元素框的分类，主要有一下几种，这边👇的文章也是针对这几种进行阐述

![元素框集合](元素框集合.png)

#### 相关概念

#### 容纳快

**容纳块：**
> 表示的是某个节点元素最近的块级父元素，如有以下的例子：

```html
  <body>
  <div>
  <p>这个是一个段落</p>
</div>
</body>
```

`div`是`p`段落最近的容纳块

🤔 为什么要解释容纳块呢？
✨ 因为容纳块决定了元素所能获得的最大宽度！！！

### 调整元素的显示方式
+ 改变元素的显示方式
> 下面开始来深入了解`display`属性的使用

| display属性 | 描述 |
|---|---|
| 取值 | `<display-outside> / <display-inside> / <display-listitem> / <display-internal> / <display-box> / <display-legacy>` |
| 初始值 | inline |
| 适用于 | 所有元素 |
| 继承性 | 否 |

👆 取值代表每种类型分组，具体都有以下的值

| 分组 | 取值 |
|---|---|
| display-outside | block / inline / run-in |
| display-inside | flow / flow-root / table / flex / grid / ruby |
| display-listitem | list-item |
| display-internal | table-* / ruby-* |
| display-box | contents / none |
| display-legacy | inline-block / inline-list-item / inline-table / inline-flex / inline-grid |


✨ 通过**display**属性，我们可以很方便的改变元素原本的"元素框模式"，比如说a标签，原本它是一个行内元素框，可以通过使用`display: inline-block;`将该元素调整为行内块级元素框，
使得它可以使用块级元素的其他属性，比如`text-align、 margin、vertical-align`等等，原本在a标签中无效的，由于使用了该标签，可以让我们随意地来使用

+ 块级框
> 默认情况下，块级框的宽度(width) = 左内边距(padding-left) 至 右内边距(padding-right)的横向距离长度，而高度(height)类似，
> 但有了`box-sizing`属性的控制后，上面这里的宽度计算规则就有点不一样了！！

| box-sizing属性 | 描述 |
|---|---|
| 取值 | content-box / padding-box / border-box |
| 初始值 | content-box |
| 适用于 | 能设置width或height的所有元素 |
| 继承性 | 否 |

👆 每个取值代表了当前元素的width以及height的不同计算规则，具体见以下例子：

![box-sizing的不同取值对应效果](box-sizing的不同取值对应效果.png)

+ 横向格式化
+ auto的使用
+ 负外边距(margin < 0)
+ 置换元素
+ 纵向格式化
+ 百分数高度
+ 自动调整高度
+ 折叠纵向外边距
+ 负外边距与折叠

### 行内元素


### 总结

