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

| 描述 | 描述 |
|---|---|
| 取值 | <position> |
| 继承性 | false |
| 动画性 | false |

`<postion>` 中的取值范围为：
[left|center|right|top|bottom] | [<percentage>] | [<length>] && [left|center|right|top|bottom] | [<percentage>] | [<length>]
也就是它接收两个参数，分辨指定其x位置还有y位置

✨ 当它设置为center值的时候，代表着背景图片的中心点与元素的中心点重合

✨ 当设置为负数的数值的时候，代表将这个背景图片分布在元素之外

⚠️ `background-position`是可以接收4个参数的，代表的意思是从对应的位置往对应方向上偏移多少个像素还是多少百分比，如下所示：
```html
  <style>
  .p{
    background-position: right 33% bottom 30px;
  }
</style>
```
👆 这行代码表示将p的背景图片放置在距离右边33%、距离底部30px的位置

### background-origin
> 有了👆的`background-position`，我们可以改变放置在元素背景中的图像的位置，但是，如果不想让位置相对元素内边距的外边界(默认行为)来计算呢？
> 我们可以使用background-origin属性来设置，`background-origin`属性确定计算源图像的位置时以什么的边界作为基准

| 描述 | 描述 |
|---|---|
| 取值 | border-box / padding-box / content-box |
| 初始值 | padding-box |
| 继承性 | false |
| 动画性 | false |

| 取值 | 描述 |
|---|---|
| border-box | 背景图像从边框处开始绘制(计算) |
| padding-box | 背景图像从padding处开始绘制(计算) |
| content-box | 背景图像从内容处开始绘制(计算) |

比如有以下的一个代码以及对应的执行效果：
![background-origin属性对应效果](background-origin属性对应效果.png)

### background-clip
> 裁剪背景，背景会填满元素的整个背景区域，一直以来，背景一直延伸到边框的外边界，而css中有一个属性能够控制背景延伸到何处。

| 描述 | 描述 |
|---|---|
| 取值 | border-box / padding-box / content-box |
| 初始值 | border-box |
| 继承性 | false |
| 动画性 | false |

而对于该值的不同属性描述如下：
| 取值 | 描述 |
|---|---|
| border-box | **默认值**，背景绘制在边框内 |
| padding-box | 背景绘制在padding边框内 |
| content-box | 背景绘制在内容边框内 |

比如有以下的一个代码以及对应的执行效果：
![background-clip的使用对比](background-clip的使用对比.png)

### background-repeat
> 设置如何平铺对象的`background-image`属性，默认情况下，会从垂直和水平方向上平铺

| 描述 | 描述 |
|---|---|
| 取值 | repeat / repeat-x / repeat-y / no-repeat / space / round |
| 初始值 | repeat |
| 继承性 | false |
| 动画性 | false |

取值描述如下：
| 取值 | 描述 |
|---|---|
| repeat | 横竖方向都平铺 |
| repeat-x | 横方向上平铺 |
| repeat-y | 竖直方向上平铺 |
| no-repeat | 不平铺，仅有一图像背景 |
| space | 类似于flex布局中的justify-content属性，根据图像大小来设置屏幕数量，并采用类似于space-between的分布效果 |
| round | 如果背景区域的一边到对边之间无法重复整数次，那么图像将被缩小或者放大，使其刚好重复整数次 |

✨ 与其他属性`background-position`的配合，如果`background-position`被设置为'center'的话，那么这个背景图像将从中间的位置向两侧开始平铺，如果只设置单个方向上进行平铺的话，那么对应的只会在对应方向居中的位置进行平铺的

### background-attachment
> 控制背景固定在元素的某个位置还是随着元素一起发生滚动，当元素出现滚动条的时候。
> 使用`background-attachment`可以将源图像声明为固定在视区中，从而免受滚动的影响

| 描述 | 描述 |
|---|---|
| 取值 | scroll / fixed / local |
| 初始值 | scroll |
| 继承性 | false |
| 动画性 | false |

取值描述如下：
| 取值 | 描述 |
|---|---|
| scroll | **默认值**，`随着页面滚动而滚动` |
| fixed | 固定在元素的背景位置，不随着内容滚动而滚动 |
| local | 背景图片会随着元素内容的滚动而滚动 |

对应的对比效果如下：
![background-attachment属性效果对比](background-attachment属性效果对比.png)

### background-size
> 控制背景图像的尺寸展示，我们可以控制背景图像的大小展示，已符合节点元素的宽高

| 描述 | 描述 |
|---|---|
| 取值 | length / percentage / auto / cover / contain |
| 初始值 | auto |
| 继承性 | false |
| 动画性 | false |

取值描述如下：
| 取值 | 描述 |
|---|---|
| length | 设置背景图的宽度和高度，第一个值设置宽度，第二个值设置高度，如果只给一个值，则第二是auto |
| percentage | 将计算相对于背景定位区域的百分比，如果只给一个值的话，则另外一个为auto |
| cover | 保持图像的宽高比并将图像缩放成完全覆盖背景定位区域的最小大小 |
| contain | 保持图像的宽高比并将图像缩放成适合背景定位区域的最大大小 |

以下是对应的执行效果：
![background-size的使用效果](background-size的使用效果.png)

⚠️ 这里有一点需要关注的是：percentage类型的值，它的一个参照物是由`background-origin`所定义的区域来作为决定的，按照参照物的百分比来换算的！

关于auto值的计算规则有以下三个步骤：
1. 如果只设置了一个值为非auto，且图像包含有尺寸信息，那么另外一边则会自适应按照比例来展示；
2. 如果第一步失败了，图像则按照原来的尺寸展示；
3. 解析为100%。

✨ **覆盖与容纳：**
![background-size的执行结果](background-size的执行结果.png)
