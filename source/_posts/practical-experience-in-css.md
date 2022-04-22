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
> 横向格式化属性有7⃣️个，分别是：
> margin-left, border-left, padding-left, width, padding-right, border-right, margin-right
> 这7⃣️个属性影响着块级框的横向布局，而一般地这7⃣️个属性加起来的值要等于*容纳块*的宽度。
> 这7⃣️个属性中能够使用**auto值**的属性是：width，margin-left和margin-right，其他的属性只能是具体的值，或者是默认的值0

![能够设置为auto值的横向格式化属性](能够设置为auto值的横向格式化属性.png)

+ auto的使用
> 在width、margin-left和margin-right三个属性中，如果将其中一个属性设置为具体的值，那么设置为auto值的那个属性长度要能够满足元素框等于父元素。
> 举个例子：比如7⃣️个属性加起来的值等于500px，margin-right=100px，margin-left=auto，padding以及border横向值都为0⃣️，width=100px，那么最终得出的结果将会是：margin-left=300px

![margin-left自动计算](margin-left自动计算.png)

✨ 从👆某种意义上来将，`auto`可以用于补全总和所缺的尺寸，但是，🤔如果将这3个属性都设置为auto的话，会是怎样的一个情况呢？？
![三个属性都是auto的情况](三个属性都是auto的情况.png)

根据上图的效果，如果都是auto的话，那么将会直接与默认的情况一直，也就是为0⃣️，还有另外一种情况，如果3个加起来的值不等于500的话，那么会是怎样的状况呢？
![三个加起来不等于容纳块的宽度](三个加起来不等于容纳块的宽度.png)

✨ 如果有width=auto，以及其中一个外边距的值为auto的话，那么又会是怎样的一个情况了呢？
![width以及另外一个边距值为auto](width以及另外一个边距值为auto.png)
这里设置为auto值的外边距将为0。

🪐 在常规的流动方式下，要想让元素居中布局，一般是采用margin-left=margin-right=同样的宽度，然后中间width采用auto来实现。

+ 负外边距(margin < 0)
**7⃣️个属性中只有margin-left以及margin-right允许设置为负值**，🤔当设置为负数的属性时，发生了什么事情呢？效果图如下：
![负外边距](负外边距.png)

👆 这里由于margin-right设置为负数，因此它往外跑了50px

⚠️ 就算是设置为负数的外边距，它还是符合最开始所提出来的公式：
> margin-left + border-left + padding-left + width + padding-right + border-right + margin-right = 容纳块的宽度
> 对于上述的负数的情况，依然有以下的公式成立：
> margin-left(100px) + border-left(0) + padding-left(0) + width(450px) + padding-right(0) + border-right(0) + margin-right(-50px) = 容纳块(500px)
> 👆这里的450px是通过公式反向计算出来的，不信看下图：
> ![负数外边距的实际测量结果](负数外边距的实际测量结果.png)

+ 置换元素
> 我们平时所遇见的img、input等标签都是置换元素，这些置换元素本身并没有宽度可言，如果没有额外的设置其元素的宽度尺寸信息，那么在load到图片之后，将会以图片的的宽度来作为展示。
> 一般的，如果我们设置了其宽度，然后高度不设置的话，它将会根据宽度然后按照比例来进行赋值对应的高度，反之如果设置了高度，宽度也会根据高度并按照比例来进行设置！！！

+ 纵向格式化
> 一般来说，元素的内容决定了其默认的高度，当原本其width不够存放内容的时候，其高度将会自动撑开，🤔如果元素的容纳块也限制高度的话，那么子元素的高度不断撑开，将会超处容纳块的高度，如下图所示：
> ![子元素高度超过容纳块高度](子元素高度超过容纳块高度.png)
> 这个时候，需要借助于`overflow/overflow-y`属性，控制当子元素内容超出是，以滚动条的方式来展示子元素的内容
>
> 纵向格式化也涉及到7⃣️个属性：margin-top、border-top、padding-top、height、padding-bottom、border-bottom、margin-bottom，同样也遵循一个公式：
> margin-top + border-top + padding-top + height + padding-bottom + border-bottom + margin-bottom = 容纳块的高度

⚠️ margin-top、height、margin-bottom的值允许被设置为auto，margin-top以及margin-bottom必须设置为具体的值，否则取默认的0⃣️，与横向属性所不同的是，如果margin-top=margin-bottom=auto的时候，
二者都会被计算为0⃣️，因此也就不能像横向属性那样，将二者设置为0，让其在所在的容纳块中竖直方向上居中布局

+ 百分数高度
> 如果在已知容纳块高度的前提下，可以采用百分比的方式来设置元素的高度，让其元素根据容纳块高度来对应赋值自身的相对高度，
> 但是，如果在未知容纳块的高度的前提下，采用的百分比的方式，将与auto以及0⃣️的方式一样，如下图所示：
> ![自动填充高度的百分比高度](自动填充高度的百分比高度.png)


+ 折叠纵向外边距
> 何谓"折叠"，相邻的纵向外边距会折叠，简单来说，就是在**竖直**方向上的两个元素，如果两个元素都有外边距margin属性的话，那么在分布内容的时候，就会发生一个折叠的效果，如下图所示：
> ![纵向折叠与横向折叠](纵向折叠与横向折叠.png)
> 折叠的计算规则：以较大的外边距来作为最终的折叠长度来计算

### 行内元素

#### 相关术语与概念

![行内元素](行内元素.png)

> 一行中各元素的行内框高度的确定流程如下：

+ 确定行内各非置换元素和匿名文本的`font-size`和`line-height`的值，然后用后者减去前者，得到行距，然后将行距除以2，分别添加到字体框的上方和下方；
+ 确定各置换元素的纵向格式化的7⃣️各属性，并加起来，得到一个值(这里暂称为：kHeight);
+ 确定各内容在一行的基线上方和下方分别超出多少；⚠️这里需要提前知道各个元素和匿名文本的基线在何处，以及整体一行的基线在何处，然后把基线对齐，而置换元素的底边需要与一行的基线对齐；
+ 若有设置了`vertical-align`属性的元素，则需要计算纵向偏移值有多少，这里纵向对齐改变了元素与基线之间的距离，从而使行内框向上或向下移动一定的距离
+ 在知道所有行内框的位置之后，计算行内框的高度：基线与最高的那个行内框顶边之间的距离加上基线与对那个行内框底边之间的距离！！！

将👆这里的流程，转为对应的效果图，来加深对该效果的理解：

![css中行内元素摆放逻辑规则](css中行内元素摆放逻辑规则.png)

🪐 从上面可以得出结论：
+ 一个行框高度由其所在的元素的最高高度来确定！！！
+ 在布局元素的时候，一定要确定元素的基线，如果是文本类型，则需要将文本的基线与一行的基线对齐后，如果是置换元素，则将底边与基线底边对齐！！
+ 就算将行内元素的line-height设置为0，那么其行高也不会因为设置为0导致重合，它还是会去找寻基线，并与之对齐。

### 总结

