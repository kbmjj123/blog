---
title: 理解不一样的padding/border/margin
description: 理解不一样的padding/border/margin
author: Zhenggl
date: 2022-04-23 10:55:36
categories:
tags:
cover: 理解不一样的padding-border-margin封面.jpeg
---

### 前言
> css中每一个元素都会生成一个矩形框，也就是元素框，在正常的节点元素摆放的过程中，如果按照默认的规则来摆放的话，则会按照其占据的空间，按照流式布局方面进行一个一个来摆放。
> 网上已遍布同质化的学习知识较多，这边仅整理关于额外同类型的知识点的重复说明，这里想整理一个关于自己在学习过程中的不一样的见解！！！

### 盒子模型
> 直接上图，一图胜千言
> ![css元素盒子模型](css元素盒子模型.png)


### 复值的规则
> 像padding、border、margin这些属性，一般遵循上、右、下、左的顺序来摆放，如果有重复的值的定义的话，可以采取节省值的方式，比如只有一个值的时候，代表4个方向的边都设置为这个值，
> 设置为两个值的时候，代表设置的上下、左右方向的值。

![复值的规则](复值的规则.jpg)

### 行内元素的适用规则
![padding对行内元素的影响](padding对行内元素的影响.png)
⚠️ 根据上图，影响一个行中元素的竖直方向上的，只有竖直属性才会影响到，也就是只有横向方向的padding才生效了！！！

#### 行内非置换元素的运用

##### padding在行内元素的使用
> 置换元素中的padding属性，都会出现在内容的四周，并且背景色会填充到内边距区域，也就是padding会将border推开，远离内容
> ![置换元素中的padding](置换元素中的padding.png)

##### border在行内元素的使用
> 规则基本上与块级元素的处理方式一直

⚠️ 不管把行内元素的边框设置为多宽，元素的行高都不会改变，行高不变的话，则意味着该元素在一行中纵向的偏移量不会因为border而变化。

✨ 而行内置换元素则不一样，会因为设置了其高度而导致内容被推开！！

##### margin在行内元素的使用

### 边框
> 元素的内边距之外是边框，边框是元素的内容和内边距周围的一到多条线段，默认情况下，元素的背景在边框的外边界处终止。
> 边框有三个要素：宽度、样式、颜色

✨ `border`属性也是允许直接通过单独定义4个方向上的border属性，也遵循👆所提及到的`复值`的机制来定义元素的边

#### 圆角边框
> 边框的知识点已经是很清晰的了，但是有去了解过其中具体是如何将这个边框给计算出来的吗？？
> 下面以一个图示来展示具体的一个测量原理：
> ![border-radius的一个测量规则](border-radius的一个测量规则.png)
> 👆的图示用一句话简单的来描述：用一个定义的圆角宽度的圆来做为边框的圆角度数！！

#### 图像边框(border-image)
> 1. 利用图像来绘制边框，一般需要使用`border-image-source`来告知所采用的图片，也就是定义边框图像的来源；
> 2. 使用`border-image-slice`，告诉如何使用图像来裁剪处对应的区域，来作为边框的内容；
> 3. 也可以使用`border-image-width`，告诉裁剪出来的边框本身的宽度；
> 4. 有时，我们可以根据提供的简单的图像，来作为元素的边框，类似于*background-image-repeat*，通过`border-image-repeat`来告诉如何来重复边框内容展示我们所想要的效果；

##### border-image-slice
> 像其他元素一样，制定上、右、下、左边缘的图像**向内偏移，可以理解为4个方向上的向内偏移，将图片分成9⃣️个区域：4⃣️个角 + 4⃣️条边 + 中间区域**，一般来说，中间区域将会被抛弃(完全透明处理),
> 除非填写关键词，也遵循👆的*复值*的规则。

| 取值 | 说明 |
|---|---|
| number | 数字表示图像的像素(位图图像)或向量的坐标(如果图像是矢量图像) |
| % | 百分比图像的大小是相对的：水平偏移图像的宽度，垂直偏移图像的高度，该属性默认值是100% |
| fill | 保留图像的中间部分 |

比如有👇的一个场景：
![border-image-source的使用](border-image-source的使用.png)

🤔 为什么会是这样子的效果呢？？明明设置了`border-image-source`属性，使用一个原型的浏览器图标来作为元素的边框，怎么就只有4个角有图标边框，而其他的没有呢？这里问题留到👇来回答！

✨ 咱们先来看看关于这个属性的一个使用/测量原理了～～
![border-image-slice的裁剪过程](border-image-slice的裁剪过程.gif)
> 根据上述效果图，我们可以得知，`border-image-slice`属性在图像上放置4条裁剪线，然后从border边缘向内偏移一定数量(默认是100%)，
> 而关于`border-image-slice`有以下的一个关键说明：
> **如果左右两边的[border-image-slice]的宽度之和大于或等于图像的宽度，那么上边与下边的border将不展示，而如果是上下两边的[border-image-slice]的宽度和大于或等于图像的高度，则左边与右边的border不显示**

✨ 若设置为小于50%的情况，则有以下的效果：
![将border-image-source设置为小于50%的结果](将border-image-source设置为小于50%的结果.png)

👆 另外可以发现一个现象：中间区域不见了！！！而通过在`border-image-slice`属性后追加**fill**属性，则可以将其展示出来，效果如下图所示：

![将中间背景给展示出来](将中间背景给展示出来.png)

🪐 这里是对应的一个分析：
1. 首先元素框的`border-width`被设置为了20px，这将决定了border的宽度为20px，也就是上述中的四个角的图标的宽度为20px；
2. 其次，`border-style`被设置为了`solid`，这里必须要设置，否则图像将不会展示出来；
3. 这里由于`border-image-slice`的宽度默认设置为100%，因此只展示了4⃣️个角落的border，其他4边的border不展示；

##### border-image-width
> 正常情况下，使用了`border-image-slice`，其裁剪出来的元素border宽度受`border-width`控制的，当然我们也可以通过设置`border-image-width`来控制元素框border图像的宽度
> `border-image-width`与`border-image-slice`属性类似，只不过`border-image-width`裁剪的是边框框本身。

![border-image-width使用说明](border-image-width使用说明.png)

##### border-image-repeat
> 之前👆的学习知道，除了4个角落之外，其他边要么是拉伸，要么不展示，那么🤔如何来控制元素像`background-repeat`那样子来平铺图像作为border的背景呢？？

| 取值 | 描述 |
|---|---|
| stretch | 默认值，拉伸平铺 |
| repeat | 重复平铺图像，直到占满每一边的边框区域为止，将图像放到每一条边框的中间位置，然后向边框的两边进行平复重复延伸 |
| round | 拿各边的边框长度区域除以图像的尺寸，然后取整为最近的整数，平铺这一数量的图像，在这个过程中图像可能会被拉伸或压缩 |
| space | 每一边的边框区域也是先除以要平铺的图像的尺寸，然后向下取整，而且图像不会被拉伸或被压缩，而是均匀分布在边框区域中 |

🪐 👇来针对👆提及到的每一种情况进行实际例子的描述

首先附上基础的div边框的相关代码
```css
    div{
      width: 400px;
      height: 200px;
      line-height: 200px;
      text-align:center;
      border: 28px solid;
      border-image-source: url("https://www.runoob.com/try/demo_source/border.png");
      border-image-slice: 28;
}
```

以下是对应的每个属性的一个运行效果
![stretch效果](stretch效果.png)
![repeat效果](repeat效果.png)
![round效果](round效果.png)
![space效果](space效果.png)


### 轮廓(outline)
> 一般直接绘制在边框的外侧，都有以下的三个属性：
> 1. 轮廓不占据任何空间；
> 2. 轮廓可以不是矩形；
> 3. 用户代理通常在元素处于`:focus`的时候渲染轮廓
> 4. 无法单独设置一边的轮廓。

#### outline-style
#### outline-width
#### outline-color

✨ 根据上述的三个属性，可以将轮廓简写为：`outline: outline-color | outline-style | outline-width`
