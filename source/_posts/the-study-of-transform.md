---
title: css变形上岸
description: css变形上岸
author: Zhenggl
date: 2022-05-30 08:05:26
categories:
tags:
cover_picture: css变形学习封面.jpeg
---

### 前言
> 之前关于css变形(transform)只停留在2d级别上的简单理解，一旦涉及到较为负责组合的变形或者是旋转亦或者是缩放等变形操作的时候，就一头雾水，万脸懵逼，根本不晓得它是如何变化而来的。
> 在从2d进入到3d的世界的时候，个人觉得可以是借助于一个正方体，如下图所示：
> ![3d笛卡尔坐标](3d笛卡尔坐标.jpg)
> 从上图我们可以晓得，在2d的世界里，我们只是以`正视图`的角度来看待的一个元素，而z轴是从原点指向人视口的位置，这里以一个正方体来描述的话，然后再从`侧视图`的角度来看的话，关于x轴、y轴、z轴的位置，就会很明确了！！！
>
> 而css中的变形(transform)则是基于上面👆3个轴方向上的平移、缩放、旋转、偏移的变形操作来实现，因此掌握变形的几个要素的基础的话，对于掌握变形就能够迎刃而解了！！！


### 基本用法
> `transform`变形其实就一个属性而已，然而它是借助于不同的取值函数，来实现了不同样子的变换，一般它的取值由**一个或者多个有效的、按照一定顺序的变形函数**来组成，而变形的元素拥有自己的堆叠上下文，
> 经过缩放后的元素可能比变形前大或者小，但由一点需要⚠️的是：**元素在页面上所占据的空间与变形前保持不变**，这一点对于所有的变形函数都成立，并且**每一次变形都仅针对元素本身所在的坐标轴来变形**！！！

| transform属性 | 描述 |
|---|---|
| 取值 | `<transform-list> | none` |
| 初始值 | none |
| 百分数 | 相对范围框来计算 |
| 继承性 | 否 |

👆这里强调了以下几个关键点：
1. 一个或者多有变形函数(以空格来隔开单个变形函数)；
2. 一次只能处理一个变形函数，从最左边开始，一直到最后一个
3. 有效的变形函数(因为无效的变形函数将导致整个变形结果无效)；
4. 按照一定顺序的变形函数(因为有些变形行数在多个不同组合情况下，调整单个变形函数将会导致出现不同的变形效果);
5. 变形仅针对自身所在的坐标轴来言(比如旋转了，其坐标轴也跟着旋转，后续的其他变形操作将在此操作的基础坐标轴上变形)

#### 无效的变形函数
> 如果我们在使用变形函数的时候，不小心写错了单位(比如旋转的角度)的话，那么整个变形将完全无效，跟没有设置之前完全一致！！！

#### 按照一定的顺序变形函数
> 不同的单个变形函数的先后顺序，有可能会导致不同的变形结果

```html
<div class="container">
  <div class="item">
  未变形的div
</div>
<div class="item one">
  先平移，再旋转
</div>
<div class="item two">
  先旋转，在平移
</div>
</div>
```
```css

.item{
  border: 1px solid;
  margin: 12px;
  background: #FFC;
  padding: 12px;
  width: 150px;
  height: 150px;
  vertical-align: center;
  line-height: 150px;
}
.one{
  transform: translateX(100px) rotate(45deg);
}
.two{
  transform: rotate(45deg) translateX(100px);
}
```
![变形顺序的影响](变形顺序的影响.jpg)

🤔为啥有会上述两种不同的变换效果，这里采用不同的效果对比以下，并以动画的形式来展示对比，就能够很清楚的明白，如下图所示：
![先旋转再平移](先旋转再平移.gif)
![先平移再旋转](先平移再旋转.gif)

✨ 同时也说明了一个点，就是每个变形的原型的元素，都拥有自己的坐标轴体系，就算是进行的变形操作，其对应的坐标轴体系也跟着改变，比如上面👆的**先旋转再平移**的变形，拆分为以下的步骤就是：
![变形动作拆解](变形动作拆解.jpg)
从👆可以看出从第一次旋转变形后，元素所在的坐标轴的x/y轴发生了变化了，也相应的进行对应的旋转，然后再继续平移操作！！！



### 变形函数一览

| 平移 | 缩放 | 旋转 | 偏移 | 其他 |
|---|---|---|---|---|
| translate() | scale() | rotate() | skew() | matrix() |
| translateX() | scaleX() | rotateX() | skewX() | matrix3d() |
| translateY() | scaleY() | rotateY() | skewY() | perspective() |
| translateZ() | scaleZ() | rotateZ() | - | - |

#### 平移变形(translate、translateX、translateY、translateZ)
> 平移变形🈯️的是沿着一个轴或者多个轴进行移动，可接收`length/percentage`类型的数据，一般我们使用`translate()`函数指的是在2d维度下的平移变形，如果这个时候省略了第二个值的话，就相当于是使用了`translateX`。
> 而使用的`translateZ`则是控制元素往z轴方向上的变形，并且需要⚠️一个点：**translateZ不允许接收带单位的长度值，并且translate3d必须要完全传递3个参数，否则就当作是一个失败的变形动作**
> 以下图是对应的三个轴方向上的一个平移过程拆解
> ![translate3d的过程](translate3d的过程.jpg)

#### 缩放函数(scale、scaleX、scaleY、scaleZ)
> 缩放变形把元素放大或缩小，具体取决于提供的值。缩放函数的值都是无单位的实数，并且始终为正数。
> `scale`默认是在2d维度上进行的x/y轴方向上的缩放，而`scaleZ`或者`scale3d`则允许在z轴方向上进行缩放，如果我们想让元素具有一定的深度的话，可以是使用z轴方向上的
> 缩放来达到目的。
> 与`translate3d`一样，`scale3d`也是必须传递**3个**有效的数值才有效！！

#### 旋转函数(rotate、rotateX、rotateY、rotateZ)
> 旋转函数围绕着某个轴来旋转元素的，或者是绕3D空间中的一个向量来旋转元素。
> 旋转函数都是接收一个角度值，角度值以一个数字(可正可负)和一个有效的角度单位(deg、grad、rad、turn)表示，如果数字超出了对应单位的常规范围，那么它将化为
> 有效范围内的值的，也就是说437deg的效果与77deg的效果一致，只要没有动画的话。
>

✨ rotate其实实施的是2d旋转，是我们最常用的旋转方式，它的效果等同于rotateZ，绕着z轴来旋转

以下是不同效果的旋转，对比加深学习的印象
![不同的旋转](不同的旋转.png)

✨名词解析：向量，在数学中，向量也称为欧几里得向量、几何向量、矢量，🈯️的是具有大小和方向的量，它可以形象化地表示为带箭头的线段，箭头所指的方向代表向量的方向。

🤔为毛要这里要进行这个*向量*的学习呢？因为在3d空间中使用`rotate3d`是围绕着向量来进行旋转的
> rotate3d(x分量, y分量, z分量, 旋转角度值)，而原本在2d空间中的旋转，其实是相当于3d上的旋转，如下等式所示：
> rotate(45deg) = rotate3d(0, 0, 1, 45deg)，也就是旋转轴是x、y分量都是0⃣️，z轴分量是1，由原点指向z轴1方向上的向量，绕着这个向量来旋转45度
> rotateX(45deg) = rotate3d(1, 0, 0, 45deg)
> rotateY(45deg) = rotate3d(0, 1, 0, 45deg)
>
> 🤔 那么，如果3个轴方向上都有对应的分量的时候，这个时候应该是怎样的一个向量呢？
> 🪐 这里遵循一个原则：**站在向量的终点上来看向原点，即是向量的反方向，来看变形元素的旋转过程，也就是将向量反方向插入到元素所在的平面，然后让这个平面绕着向量来进行旋转对应的度数**，下面👇来针对这3种情况来具体一一分析一波：

1. rotate(45deg) = rotate3d(0, 0, 1, 45deg)
首先生成一个向量，该向量由原点指向z轴1分量的位置，套用一下规则，站在z轴终点的位置，看向原点，然后来看变形元素的旋转过程，元素绕着向量顺时针进行旋转45度，
因此站在常规观察者的位置上，元素的顶点远离观察者，元素的底部靠近观察者
2. 稍微复杂一点：rotate3d(1, 1, 0, 45deg)
![复杂3d旋转](复杂3d旋转.png)
如上图所示，如果我们正视图角度来看元素的时候，这里描述的向量是一个由原点指向右下角的向量，站在向量的终点位置上，看变形元素顺时针旋转45度，由于从不同角度来看变形元素的变化过程，看到的效果是不一样的。
3. rotate3d(-0.95, 0.5, 1 45deg)
![复杂3d旋转一](复杂3d旋转一.jpg)
从上图可以看出，所产生的向量，指向的是空间的左下前方，将向量插入到原本变形元素所在的平面，然后让这个平面绕着向量来进行旋转。

#### 倾斜函数(skew、skewX、skewY)
> 使元素往x/y轴方向上进行的倾斜，如下图所示：

![不同的倾斜效果对比](不同的倾斜效果对比.png)

#### 视域函数(perspective)
> 在3d空间中改变元素的形态时，基本上需要赋予元素一定的视域，这里的视域也就是站在距离元素多远的的位置来看元素，简单的理解，就是站在一个金字塔的顶点处，来看金字塔底部。
> 依赖来说，记录底部越近，看到的内容就越大，越清晰，但有时我们需要从远处来看，达到一个整体的视觉效果！！
> 设置这个视域函数的时候，需要在其他变形函数变形之前设置，也就是需要放到`transform`的第一位的位置，否则设置的视域则无效！
> 🤔纯看文字有些抽象，这里以实际的效果来展示一下即可清楚观察它的一个变换过程

```html
<div class="container">
  <div class="item one">
    元素一
  </div>
  <div class="item two">
    元素二
  </div>
</div>
```
```css
.container{
  display: flex;
  justify-content: space-around;
}
.item{
  border: 1px solid;
  width: 200px;
  height: 200px;
  text-align: center;
  vertical-align: middle;
  line-height: 200px;
}

.one{
  background: #FFC;
}
.one:hover{
  transform: rotateY(45deg);
  transition: all 1s;
}
.two{
  background: #CFF;
}
.two:hover{
  transform: perspective(100px) rotateY(45deg);
  transition: all 1s;
}
```
![不同的视域看到的效果](不同的视域看到的效果.gif)

### 辅助变形属性

#### 移动原点(transform-origin)
> 一般默认情况下，以元素的绝对中心作为变形的原点，比如关于旋转变形rotate，一般是绕着元素的中心来旋转的

![不同原点下的旋转](不同原点下的旋转.jpg)

从上面👆我们可以看出，不同原点下的变形，将会有不同的变换效果

#### 选择3D变形方式(transform-style)
> 一般默认情况下，我们在平面上得到的变形结果基本上是扁平的，因为我们始终都是正视着显示器屏幕的，然后我们也可以通过`transform-style`属性来设置变形的结果

| transform-style属性 | 描述 |
|---|---|
| 取值 | flat / preserve-3d |
| 默认值 | flat |
| 继承性 | 否 |

![不同变形结果样式的对比](不同变形结果样式的对比.png)

#### 背面处理(backface-visibility)
> 决定元素的背面在朝向我们的时候，是否要渲染背面

| backface-visibility属性 | 描述 |
|---|---|
| 取值 | visible/hidden |
| 初始值 | visible |
| 继承性 | 否 |
| 动画性 | 无 |

```html
<div class="section">
  <img src="https://m.360buyimg.com/mobilecms/s750x750_jfs/t1/84827/39/28981/357192/629486a3Ef7aaba33/bf987411a07f7056.jpg">
  <div class="back">
    我是背面的内容
  </div>
</div>
```
```css
.section{
  position: relative;
  transition: ease 1s;
  width: 200px;
}
.back, img{
  position: absolute;
  top: 0;
  left: 0;
}
.back{
  position: absolute;
  transform: rotateY(180deg);
  backface-visibility: hidden;
  background: rgba(255, 255, 255, 0.85);
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
}
img{
  width: 200px;
}
.section:hover{
  transform: rotateY(180deg);
  transform-style: preserve-3d;
}
```
![backface-visibility属性的应用效果](backface-visibility属性的应用效果.png)
