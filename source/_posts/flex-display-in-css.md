---
title: flex查漏补缺
description: flex查漏补缺
author: Zhenggl
date: 2022-05-05 08:44:14
categories:
    - [css, display, flex]
tags:
    - css
    - display
    - flex
cover_picture: flex布局查漏补缺封面.jpeg
---

### 前言
> 弹性盒是一种简单而强大的布局方式，通常可以通过弹性盒指明空间的分布方式、内容的对齐方式和元素的视觉顺序，把不同的组件放置在页面中，内容可以横向或者纵向排布，还可以沿着一个轴布局，或者折成多行。
> 🪐 弹性盒模型布局最突出的一个特点就是，**能让元素对不同的屏幕尺寸和不同的显示器设备做好适配工作，在响应式网站中表现较好，因为其内容能根据可用空间的大小来增减尺寸！**，
> 弹性盒依赖于**父子关系**，在容器节点上声明`display: flex`或者`display: inline-flex`，便激活弹性盒布局，而设置了这个属性的元素则称之为`弹性容器`
>
> 🤔 为什么要叫**弹性**一词呢？我想原因应该有以下几个：
> 1. 容器与尺寸均不设置尺寸，可以按照其内容进行伸缩；
> 2. 适配性高，从布局上控制元素的摆放，又可以让元素自身控制其摆放；
> 3. 元素的伸缩适配；
> 4. 元素行的伸缩适配；

### 主轴与垂轴
> 弹性盒子中的元素沿着主轴的方向来排布，主轴的方向可能是水平的，也有可能是竖直方向上的，主要来自于👇的`flex-direction`的控制
> 以下附带相关的概念以及对应的位置的一个介绍：
> ![flex相关元素概念](flex相关元素概念.jpg)

### 弹性容器
> 声明了`display: flex/inline-flex`的元素，称之为弹性容器
> ⚠️ 弹性容器仅直接作用于直接孩子节点，对于孙子甚至更后的后代节点，不会发生任何的印象

![块级flex与行内flex](块级flex与行内flex.png)

👆可以看出块级与行内的弹性盒子的区别，这对于我们平时在设计元素摆放的时候很有帮助

⚠️ 只需要仅记住一个规则：**主轴总是与垂轴垂直相交的**，只要控制了主轴的方向，意味着垂轴的方向也就确定了

#### 主轴布局方向(flex-direction)
> 控制弹性容器的主轴方向的元素流动顺序，可以是从左到右、从右到左、从上到下、从下到上，使用的`flex-direction`属性来控制排布弹性元素的主轴

| flex-direction属性 | 描述 |
|---|---|
| 取值 | row / row-reverse / column / column-reverse |
| 初始值 | row |
| 适用于 | 弹性容器 |
| 继承性 | 否 |

⚠️ 关于`flex-direction`的使用过程中，如果取值*column*的话，那么其弹性元素原本的元素的块级别/行内元素身份则被抛弃掉，统一变成弹性盒子布局，比如像a标签，则变成了类似块级元素一样的展示形式，如下图：
![抛弃原本的标签属性](抛弃原本的标签属性.png)

🤔 如果弹性容器的宽度/高度不足以来存放弹性元素孩子节点的时候，将会发生什么情况呢？是否像文本那样子自动换行呢？
答案是否定的，弹性容器中用`flex-wrap`来控制元素的换行展示效果

#### 换行(flex-wrap)
> 如果弹性元素在主轴方向上放不下了，默认情况下弹性元素并不会发生换行动作，也不会自动调整尺寸，我们可以在容器上设置`flex-wrap`属性，允许弹性元素换行，变成多行或者多列(这取决于主轴的方向)，而不让弹性元素移除，或者所见尺寸，挤在统一行/列

| flex-wrap属性 | 描述 |
|---|---|
| 取值 | nowrap / wrap / wrap-reverse |
| 初始值 | nowrap |
| 适用于 | 弹性容器 |
| 继承性 | 否 |

✨ `flex-wrap`属性的作用(这里假定flex-direction为row)是限制弹性容器只能显示一行或者允许弹性元素在必要时显示多行，而在允许换行的时候，wrap与wrap-reverse则控制第二行是在第一行之下还是之上！！！

![不同的flex-wrap](不同的flex-wrap.png)

#### 合并属性(flex-flow)
> `flex-flow`属性用于定义主轴和垂轴的方向，以及是否允许弹性元素换行，其实就是👆`flex-wrap`与`flex-wrap`两者的组合

#### 布局弹性元素
> 在正常使用弹性布局的过程中，我们会不难发现当主轴方向上不够空间来放置弹性元素的时候，允许换行的情况下，会有留白区域的情况出现，如下图所示：
> ![flex空白存在现象](flex空白存在现象.png)
> 弹性元素可以仅靠主轴终边，或者在弹性容器居中，甚至可以在主轴上均匀分布，主要依赖于弹性容器的👇几个属性来实现的！

##### 弹性元素摆放(justify-content)
> `justify-content`属性🈯️明在弹性容器的主轴上如何分布各行里的弹性元素

| justify-content属性 | 描述 |
|---|---|
| 取值 | flex-start / flex-end / center / space-between / space-around / space-evenly |
| 初始值 | flex-start |
| 适用于 | 弹性容器 |
| 继承性 | 否 |

👇是不同的`justify-content`的展示效果：
![justify-content不同的效果](justify-content不同的效果.jpg)

🪐 这里针对集中特殊的情况进行对比说明一下：

| 取值 | 描述 |
|---|---|
| space-between | 第一个元素放在主轴起边，最后一个元素放在主轴终边，然后在剩下的每一个元素中放置等量的空白区域 |
| space-around | 将剩余空白区域根据弹性元素数量拆分为N+1份，然后各分配一半给每一个弹性元素，看起来就像每个弹性元素四周都有不折叠的外边距，⚠️**这里的第一个元素与主轴起边以及对后一个元素与主轴终边的距离是任意两个元素之间距离的一半** |
| space-evenly | 将剩余空白区域拆开，与`space-around`类似，只不过所有的间距是等长的 |

✨ 加入弹性容器禁止换行，并且内容溢出的话，`justify-content`还影响着溢出的内容，如下图所示：

![justify-content溢出的不同情况](justify-content溢出的不同情况.png)

✨ 而如果弹性容器允许换行的话，那么🈵️行的元素按照一行的方式来展示，而多出来的不够的铺满一整行的元素，则按照单个在一行中的位置来摆放，如下图所示：

![justify-content对可换行弹性容器的影响](justify-content对可换行弹性容器的影响.png)

![换行的justify-content容器](换行的justify-content容器.jpg)

##### 弹性元素对齐(align-items)
> 使用`align-items`属性，可以把所有弹性元素都向垂轴的起边、终边或中线对齐，`align-items`属性与👆的`justify-content`类似，只不过它是作用于垂轴方向上的

| align-items属性 | 描述 |
|---|---|
| 取值 | flex-start / flex-end / center / baseline / stretch |
| 初始值 | stretch |
| 适用于 | 弹性容器 |
| 继承性 | 否 |

👇是不同的`align-items`的效果展示：

![横向不同情况下的align-items](横向不同情况下的align-items.jpg)

⚠️ 由于flex布局默认的`align-items`属性值是*stretch*，因此其弹性元素将会在垂轴方向上拉伸，也就使得所有的弹性元素看起来都一样宽或者一样高，
而如果与此同时设置了`width`、`height`、`min-width`、`min-height`、`max-width`、`max-height`的话，`stretch`值将不会对该弹性元素造成影响，
另外，如果有外边距`margin`的话，也是与普通元素使用外边距一样，会让该弹性元素看起来比其他的弹性元素要小！！！

🪐 关于base-line基线对齐，这里有一点比较复杂，当设置为`base-line`的时候，一行中的弹性元素向第一条基线对齐，弹性行中，基线与垂轴起边那一侧外边距
边界之间距离最远的弹性元素，其外边距的外边界与弹性元素行垂轴起边那一侧的边对齐，其他的弹性元素的基线则与那个弹性元素的基线对齐。

👆看得自己一脸懵逼，其实也就简单的一句话，**弹性容器设置了`base-line`的时候，其弹性元素的对齐按照`font-size`最大的那个元素所在的行基线为准，其他的
兄弟弹性元素都按照这个来对齐**！！！

##### 弹性元素自身控制(align-self)
> 👆align-items是针对弹性容器来设置的，定义弹性容器中所有的弹性元素的对齐方式，但是，单个弹性元素的对齐方式可以使用`align-self`属性来覆盖，
> align-self的默认值也是stretch，其使用起来的方式与align-item没有什么太大的差异

##### 弹性元素行的对齐(align-content)
> 当垂轴方向上的长度是固定的话，然后弹性容器允许换行布局的话，就有可能出现留白，或者是空间不足，为了控制弹性元素**行**的对齐方式，弹性盒子规范提供了
> align-content属性，用于定义弹性容器在有额外的空间时在垂轴方向上应该如何对齐各个弹性元素**行**，以及空间不足时，应当怎么溢出

| align-content属性 | 描述 |
|---|---|
| 取值 | flex-start / flex-end / center / space-between / space-around / space-evenly / stretch |
| 初始值 | stretch |
| 适用于 | 多行展示的弹性容器 |
| 继承性 | 否 |

👇是不同的`align-content`的效果展示：

![不同的align-content](不同的align-content.jpg)

✨ 通过👆的效果对比，我们不难看出`align-content`其实就是将垂轴方向上的每一行当作是一个*弹性元素*，然后在垂轴上按照与`justify-content`一直的规则逻辑，
来控制弹性元素行在垂轴上的分布摆放！！！

### 弹性元素
> 前面我们已经了解到通过对容器节点设置`display: flex/inline-flex`可以让一个容器成为一个弹性容器，而在这个弹性容器中的元素则是弹性元素，
> 如果弹性元素并没有使用标签包裹的话，则该弹性元素是一**匿名弹性元素**，虽然匿名弹性元素也是一弹性元素，但是它无法像普通的弹性元素一样直接去设置属性，它只能直接从容器中继承一些属性来使用。

#### 弹性元素的特性
1. 弹性元素的外边距(margin)不折叠；
2. float和clear属性对弹性愿损不起作用，不会将弹性元素移出文档流；
3. 绝对定位(position: absolute)将会影响弹性元素，使其从文档流中移出，一般的我们可以使用弹性容器对其做基本的控制之后，然后再配合使用绝对定位来将自己进行额外的追加控制；

#### 弹性增长(flex-grow)
> `flex-grow`属性定义有多余的空间时，是否允许弹性元素增大，以及允许增大且🈶️多余的空间时，相对其他同辈弹性元素按照什么比例增大。
> 该属性的值始终为一个数字，**负数无效，可以不使用整数，主要大于或者等于0⃣️的数字即可，仅在弹性容器有多余的空间情况下生效**

| flex-grow属性 | 描述 |
|---|---|
| 取值 | number |
| 初始值 | 0 |
| 适用于 | 弹性元素 |
| 继承性 | 否 |

![flex-grow的计算规则](flex-grow的计算规则.jpg)

👆这里详细的讲解了关于弹性增长的一个计算规则，这里🈶️一个地方需要⚠️的是：
如果没有为元素设置宽度或者*弹性基准*，弹性基准默认为**auto**，即各弹性元素的基准为内容不换行是的宽度，auto是一个特殊的值，默认值为**content**！！！

#### 弹性缩减(flex-shrink)
> `flex-shrink`属性制定弹性缩减因子，该属性定义弹性容器在为设置换行属性(flex-wrap)时，其孩子弹性元素相对于其他同辈弹性元素将缩小多少。

| flex-shrink | 描述 |
|---|---|
| 取值 | number |
| 初始值 | 1 |
| 适用于 | 弹性元素 |
| 继承性 | 否 |

![相同弹性尺寸元素的计算](相同弹性尺寸元素的计算.png)

👆针对第三种情况，如果弹性元素不允许换行的话，那么第三个元素将优先计算自身的宽度，最后再将不足的尺寸，由前面两个元素来按照比例进行分配，如下所示：

![当flex-shrink遇到不换行的文本时](当flex-shrink遇到不换行的文本时.png)

上面第三个元素强制设置了`white-space:nowrap;`不换行，则当到达其content内容宽度限定时，将不再进行该元素的缩放，可以将剩余的缩放尺寸，交由给前面两个元素去按照各自所设置的比例去分配，对应缩小响应的尺寸

🪐 👆的情况中的弹性元素的宽度都是相同的，假如🈶️弹性元素的宽度是不一样的话，又会是怎样的一个情况呢？
为了拿到缩减因子比例，要拿缺少的空间除以个弹性元素的宽度与其缩减因子乘积的总和

![不同尺寸的弹性元素的缩减因子](不同尺寸的弹性元素的缩减因子.png)

⚠️ 在使用缩减因子的时候，如果遇到元素没办法再继续减少的情况(比如设置了min-width属性、或者其内容有固定宽度的img标签，或者是禁止换行的文本标签)，当较少到最小限制的时候，将不会再继续减少！！！

##### 不同的基准(即弹性元素尺寸参照物)

#### 弹性基线(flex-basis)
> 弹性元素的尺寸受内容以及盒模型属性的影响，`flex-basis`属性定义弹性元素的初始或者默认尺寸，即根据增长因子和缩减因子分配多余或者缺少的空间之前，先确定弹性元素的大小。
> 🤔为什么要确定弹性元素的基准呢？因为从👆的`flex-shrink`我们可以得知，在弹性元素发生缩减的情况下，需要根据不同的缩减因子以及弹性元素的尺寸来计算获得每一份缩减的比例

| flex-basis属性 | 描述 |
|---|---|
| 取值 | content / <length> / <percentage> / auto / initial |
| 初始值 | auto |
| 适用于 | 弹性元素 |
| 百分数 | 相对于弹性容器主轴尺寸来计算 |
| 继承性 | 否 |

✨ 默认情况下，普通块级元素的尺寸，由其父容器和元素的尺寸，以及盒模型属性决定，如果没有显示的声明或者继承尺寸相关的属性，元素的尺寸 = content + padding + border。

👉 当使用`content`值的时候，弹性元素的基准等于弹性元素中内容的尺寸，即最长一行内容或最宽哪个媒体对象在主轴上的长度。

🪐 **当`flex-basis`设置为auto的时候，该弹性元素的基准等于元素在主轴方向上的尺寸，相当于没有设置一样，而如果width设置了长度值的话，那么弹性基准就等于这个width的长度值，而如果width的值也是auto的话，那么
弹性基准则会回落为`content`**

**使用长度单位的基准：**
![使用了长度单位的基准计算规则](使用了长度单位的基准计算规则.png)

从👆我们可以得知，在使用了实际长度单位来作为弹性元素的基准的时候，优先以对应的长度单位来作为元素的基准来计算，而不是采用默认的auto以元素的长度单位了！！

##### 百分数基准
> `flex-basis`的百分数值相对于弹性容器的主轴尺寸来计算的！！


##### 零基准
> 如果样式中根本没有`flex-basis`或者`flex`属性，弹性基准默认是**auto**，如果声明了`flex`属性，但是没有设定弹性基准要素，那么弹性基准默认为0⃣️，
> 从表面上看，零基准貌似与auto基准类似，实际上零基准与auto基准相去甚远！！！
> **设置为auto时，只有多出来的空间按照比例分配给允许增大的弹性元素**
> **设置为0⃣️基准时，弹性容器的尺寸根据增长因子按比例分配给各个弹性元素**

![auto与零基准的区别](auto与零基准的区别.png)

#### 合并的flex属性(flex-grow + flex-shrink + flex-basis)
> 🤔为什么建议要使用简写的flex属性，因为如果缩减因子和增长因子各不相同的时候，结果很难以理解的！！！
> ![flex的组成](flex的组成.jpg)

| flex属性 | 描述 |
|---|---|
| 取值 | [<flex-grow> <flex-shrink>? <flex-basis>] / none |
| 初始值 | 0 1 auto，代表着不拉伸，允许按比例1来缩放，且优先各弹性元素的声明尺寸 |
| 适用于 | 弹性元素 |
| 百分数 | 只能是flex-basis的取值，代表相对于弹性容器的主轴尺寸来计算 |
| 继承性 | 否 |

🪐 `flex`属性允许只写一个值，**flex: 3 === flex: 3 0 0**，此时目标弹性元素具有弹性，也就是可以按照比例因子(3)来增大，而缩减因此减少为0，则不允许缩小，参考基准默认为0⃣️！！！！
👉 这也就明确解释了我们在平时只会简单的直接使用：flex: 1，而不知道这个过程发生了什么事情，比如有👇的情况：
![flex=1的过程认识](flex=1的过程认识.png)

👆这里设置了每个弹性元素的`flex: 1`，有👇几个步骤的流程：
1. 每个元素都是`flex: 1 0 0`;
2. `flex-basia=0`，代表着每个弹性元素按照统一的一个基准来计算，这个基准是0，则意味着将拿主轴尺寸的100%来分配;
3. `flex-grow=1`，每个元素根据自身比例因子1来分配弹性容器的剩余空间，👆第二点提及到这里的剩余空间为100%；
4. `flex-shrink=0`，每个元素在弹性容器不够宽度的时候，不会发生缩减的情况。

#### 主轴上的顺序(order)
> 默认情况下，所有的弹性元素的顺序都是0，归属于同一个排序体系当中，以出现在源码中的顺序沿着主轴的方向显示，
> 若想修改弹性元素的视觉顺序，将`order`属性设置为一个非0⃣️整数

| order属性 | 描述 |
| 取值 | integer |
| 初始值 | 0 |
| 适用于 | 弹性元素 |
| 继承性 | 否 |

![不同的order取值对应的顺序位置](不同的order取值对应的顺序位置.png)

### 弹性布局实战(模拟筒子展示)
1. 一饼效果
![图一效果](图一效果.jpg)
```html
<div class="container">
  <div class="top-container">
    <img class="one" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
</div>
```
```css
.container{
  display: flex;
  border: 1px solid;
  width: 200px;
  height: 200px;
  justify-content: center;
  align-items: center;
}
img{
  width: 100px;
  height: 100px;
}

```
2. 二饼效果
![图二效果](图二效果.jpg)
```html
<div class="container">
    <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
</div>
```
```css
.container{
  display: flex;
  border: 1px solid;
  width: 200px;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
img{
  width: 80px;
  height: 80px;
}

```
3. 三饼效果
![图三效果](图三效果.jpg)
```html
<div class="container">
    <img class="one" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  <img class="three" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
</div>
```
```css
.container{
  display: flex;
  border: 1px solid;
  width: 200px;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  box-sizing: border-box;
  padding: 12px;
}
img{
  width: 50px;
  height: 50px;
}
.one{
  align-self: flex-end;
}
.three{
  align-self: flex-start;
}
```
4. 四饼效果
![图四效果](图四效果.jpg)
```html
<div class="container">
  <div>
    
    <img class="one" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    
    <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    </div>
  <div>
    <img class="three" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  <img class="three" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  </div>
  
</div>
```
```css
.container{
  display: flex;
  border: 1px solid;
  width: 200px;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  box-sizing: border-box;
  padding: 12px;
}
img{
  width: 50px;
  height: 50px;
}

```
5. 五饼效果
![图五效果](图五效果.jpg)
```html
<div class="container">
  <div>
    
    <img class="one" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    </div>
  <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  <div>
    <img class="three" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  <img class="three" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  </div>
  
</div>
```
```css
.container{
  display: flex;
  border: 1px solid;
  width: 200px;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  box-sizing: border-box;
  padding: 12px;
}
img{
  width: 50px;
  height: 50px;
}

```
6. 六饼效果
![图六效果](图六效果.jpg)
```html
<div class="container">
  <div>
    <img class="one" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  </div>
  <div>
    <div>
        <img class="one" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
        <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    </div>
  <div>
    <img class="three" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img class="three" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  </div>
  </div>
</div>
```
```css
.container{
  display: flex;
  border: 1px solid;
  width: 200px;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 12px;
}
img{
  width: 50px;
  height: 50px;
}

```
7. 七饼效果
![图七效果](图七效果.jpg)
```html
<div class="container">
  <div class="top-container">
    <img class="one" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img class="three" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  </div>
  <div class="bottom-container">
    <div class="bottom-item-container">
    
    <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    </div>
  
  <div class="bottom-item-container">
    <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  <img class="" src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    
  </div>
  </div>
  
</div>
```
```css
.container{
  display: flex;
  border: 1px solid;
  width: 200px;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 12px;
}
img{
  width: 30px;
  height: 30px;
}
.top-container{
  width: 50%;
}
.top-container{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bottom-container{
  width: 50%;
  flex-direction: column;
}
.bottom-item-container{
  display: flex;
  justify-content: space-around;
}
.one{
  align-self: flex-end;
}
.three{
  align-self: flex-start;
}
```
8. 八饼效果
![图八效果](图八效果.jpg)
```html
<div class="container">
  <div class="item-container">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
	<img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  </div>
  <div class="item-container">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
	<img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  </div>
 
</div>
```
```css
.container{
  display: flex;
  border: 1px solid;
  width: 200px;
  height: 200px;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-evenly;
  box-sizing: border-box;
  padding: 12px;
}
img{
  width: 30px;
  height: 30px;
  
}
.item-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
```
9. 九饼效果
![图九效果](图九效果.jpg)
```html
<div class="container">
  <div class="item-container">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
	<img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  </div>
  <div class="item-container">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
	<img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  </div>
  <div class="item-container">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
	<img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
    <img src="https://img2.zhidianlife.com/image/2022/05/09/8c8dc36e-dea8-4003-8a7a-edbf785ff352.jpeg">
  </div>
</div>
```
```css
.container{
  display: flex;
  border: 1px solid;
  width: 200px;
  height: 200px;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-evenly;
  box-sizing: border-box;
  padding: 12px;
}
img{
  width: 30px;
  height: 30px;
  
}
.item-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
```
