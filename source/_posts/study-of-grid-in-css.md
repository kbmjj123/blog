---
title: 初次见你栅格布局
description: 文章从基础到系统的全面解读关于栅格布局所设计到的相关知识点来进行深入，对每个属性的使用进行一一的剖析，尝试以另外一种不同的布局方式来布局前端页面，提升浏览器的渲染效率
author: Zhenggl
date: 2022-05-10 08:51:49
categories:
    - [css, grid]
tags:
    - css
    - grid
keywords: CSS Grid, 栅格布局, Grid容器, Grid项, 栅格行和列, 栅格模版, 栅格轨道, 栅格单元格, 栅格间距, 栅格对齐, 栅格流动性, 栅格线命名, 栅格区域
cover: 初次见你栅格布局.jpeg
---

### 前言
> 之前一直认为栅格布局距离自己那么的遥远，对于其愈发又是如此的复杂又感觉深不可测的样子，在看到别人编写了关于栅格布局的相关代码时，看着云里雾里的，按照官方所说的`栅格布局时最普适的布局系统`，
> 那么我觉得这个很有必要来学习并驾驭它，从而布局自己更加强大的布局系统！
> **栅格布局依赖于行和列，无需考虑各个部分在源文档中的顺序，利用自定义的超级灵活而又复杂的组合来创建对应的栅格线，形成至于对应的栅格轨道，来满足于不同场景下的栅格布局，**
> 栅格之内还可以嵌套栅格布局，也可以在栅格中使用表格或弹性容器。
> 🤔 这里提及到的栅格布局、栅格线、栅格轨道都是些什么？如何使用栅格布局来布局自己的系统界面？栅格布局真的🈶️那么的普适吗？👇一一道来！！！

#### 栅格容器的创建
> 与弹性盒子布局类似，栅格布局也包括有普通栅格容器与行内栅格容器，通过使用`display: grid`以及`display: inline-grid`来创建对应的容器。

#### 栅格容器的特点
> 虽然普通栅格容器是块级的，但是只是它的行为与块级容器很像而已，两者之间还是有一定的区别的：
> 1. 浮动的元素不会打乱栅格容器，这意味着栅格容器不会移动到浮动元素的下方；
> 2. 栅格容器的外边距不与其后代的外边距折叠

### 栅格布局的属性

![栅格基本要素](栅格基本要素.jpg)

针对👆栅格布局中的相关元素的一个介绍：
1. 栅格轨道(grid track)： :u6307: 的两条相邻的栅格线之间夹住的整个区域，从栅格容器的一遍延伸到对边，也就是栅格行或者栅格列，其尺寸由栅格线的位置决定；
2. 栅格单元(grid cell)： :u6307: 的4⃣️条栅格线所形成的一个区域，内容没有其他栅格线贯穿；
3. 栅格区域(grid area)： :u6307: 的4⃣️条栅格线所形成的一个区域，可以由一个或者多个栅格单元来构成，最小的栅格区域是一个栅格单元，最大的栅格区域是整个栅格容器；

⚠️ 栅格线的数量没有限制，爱定义多少就定义多少！！

#### 放置栅格线(grid-template-rows/columns)
> 放置栅格线的方式忒多了，看着头晕，可以说是没有像普通的css属性那样子有比较容易且简单的属性规则。
> 使用整个属性，基本上就可以确定栅格容器中的栅格线，**栅格中的一切都依赖于栅格线，如果放置不当，整个布局就容易垮掉**

| 栅格线属性(grid-template-rows/columns) | 描述 |
|---|---|
| 取值 | `<track-list>` / `<auto-track-list>` |
| 初始值 | none |
| 适用于 | 栅格容器 |
| 百分数 | 百分数值相对于对应的栅格容器行/列内轴尺寸来计算 |
| 继承性 | 否 |

✨ `<track-list>`与`<auto-track-list>`的句法十分复杂，而且可以嵌套很多层

✨ 栅格线可以使用数字来引用，也可以为其命名，一条栅格线可以有多个不同的名字，可以使用其中一个名字来使用，在实际的运用过程中，尽量是使用不重复的名字来作为栅格线的引用，如下图所示：
![栅格线的编号与命名](栅格线的编号与命名.jpg)

👆这里纵向第二条栅格线，拥有了编号2⃣️以及column-two、second-column两个名称

#### 宽度固定的栅格轨道
> 这里的宽度，可以用固定的长度值单位，也可以使用百分比，`宽度固定`的栅格线 :u6307: 的是栅格线之间的距离不随着栅格轨道中内容变化而变化

```html
<div class="container">
  <div class="item one">
    第一个元素
  </div>
  <div class="item two">
    第二个元素
  </div>
  <div class="item three">
    第三个元素
  </div>
</div>
```
```css
.container{
  border: 1px solid;
  padding: 12px 0;
  background: #CCD;

  display: grid;
  grid-template-columns: 100px 50% 150px;
}
.item{
  padding: 12px;
  background: #FFC;
}
.one{
  background: #FCF;
}
.two{
  background: #CCF;
}
```

![固定宽度的栅格轨道](固定宽度的栅格轨道.png)

👉 第一条栅格线在栅格容器起边100px的位置，第二条栅格线距离第一条栅格线的栅格容器轴宽度的50%长度位置处，第三条在距第二条150px的位置，共3条栅格线，将栅格容器横向分割为4份，
而其中的第二列的宽度，将会随着栅格容器的宽度变化而变化，当栅格容器的宽度不足以来填充元素的时候，栅格元素将按照正常的溢出，如下图：

![溢出的栅格布局](溢出的栅格布局.png)

🤔 如果这里我们想要为每一条栅格线命名的话，应当怎么做呢？
> `grid-template-columns: [start col-one] 100px [col-two] 50% [col-three] 150px [stop end]`;

![命名的固定宽度栅格线](命名的固定宽度栅格线.png)

👉 以栅格线作为起点，栅格线与栅格线之间形成栅格轨道，所以其命名规则是：`[...[...栅格线名称] 轨道长度]`

🤔 在实际的编码过程中，我们可能需要限制某个栅格元素的最小值与最大值，保证元素的宽度不溢出栅格容器，也就是类似于`min-width/height`，可以使用 **minmax(a, b)** ，其中a是最小尺寸，b是最大尺寸，
这里有一个需要⚠️注意的地方，如果最大值比最小值小的话，最大值将会被忽略，将使用最小值来作为轨道的固定长度，当然我们还可以使用**calc()**来计算

![设置了最小极值的栅格元素](设置了最小极值的栅格元素.png)

👆这里中间第二个栅格元素设置了极值最小值为50px，当栅格容器不够宽度来容纳栅格元素的时候，这里优先计算固定的第一以及第三个栅格轨道的宽度，然后再来将挤压第二个栅格轨道

#### 弹性栅格轨道
> 在实际的项目过程中，我们更经常性遇到的是具有弹性的栅格元素，可以根据栅格容器的尺寸，来分配对应的空间

##### 份数单位(fr)

```html
<div class="container">
  <div class="item one">
    第一个元素
  </div>
  <div class="item two">
    第二个元素
  </div>
  <div class="item three">
    第三个元素
  </div>
</div>
```
```css
.container{
  border: 1px solid;
  padding: 12px 0;
  background: #CCD;
  display: grid;

  grid-template-columns: 1fr 1fr 1fr;
}
.item{
  padding: 12px;
  background: #FFC;
}
.one{
  background: #FCF;
}
.two{
  background: #CCF;
}
```
![弹性栅格轨道](弹性栅格轨道.png)

而当栅格容器的宽度发生变化时，栅格元素的尺寸也跟随着发生改变
![变短的栅格容器](变短的栅格容器.png)

##### 混用的固定长度与弹性单位
> `grid-template-columns: 100px 1fr 50% 1fr;`

👆混用的方式，其计算规则是，优先计算固定长度的元素，然后将剩余的空间，按照对应的所占比例进行分配
![混用的栅格元素](混用的栅格元素.png)

👉fr与minmax()表达式的混合使用，🈶️一个明确规定：**最小值部分不允许使用fr单位**

##### 根据内容设定轨道尺寸(min-content与max-content的使用)
> 首先，先来可以一下两种方式的不同效果
> ![min-content与max-content的区别](min-content与max-content的区别.png)
>
> 从👆的效果图我们可以看出，`max-content`是宽度尽量大，以防止换行，这个值一般意味着尽量多占据可用空间，而`min-content`则是尽量少占据空间，够显示内容即可，特别是对于文本的内容，其最小宽度为一个连续性的字符串为准。
> 假如弹性元素中🈶️图片元素的话，那么其宽度/高度将会以图片的的宽度/高度作为其最小的尺寸

🤔 假如设置了`max-content`，然后栅格容器的宽度不足以容纳对应的栅格元素，那么对应的栅格元素将跟随者溢出
![溢出的栅格元素二](溢出的栅格元素二.png)

##### 根据轨道中的内容适配(fit-content)
> 除了使用`min-content`以及`max-content`之外，还可以使用`fit-content()`函数以简练的方式表达特定类型的尺寸模式，这个函数的一个伪公式如下：
> `fit-content(argument) = min(max-content , max(min-content, argument))`
> 针对👆这个公式的基本意思是：
> 1. 确定`min-content`与`argument`中的较大值；
> 2. 然后拿上面的较大值与`max-content`比如，去其中的较小值，作为最终的值的

```html
<div class="container">
  <p>
    asdijoiq qweoijas qoiwe
  </p>
  <p>
    阿斯顿李克强为哦i橘子偶见哦吖司机到is简单阿婆撕破粉底很高
  </p>
  <p>
    起哦为u离开；发的感慨；脸上的肌肤个；卢卡斯简单；法律框架啊是；开发丹丽就是的；可当爽肤水卡解放路口；考拉是否了解到；否；立法局啊是打开链接啊快点睡懒觉阿莱克斯大家阿里将圣诞快乐
  </p>
</div>
```
```css
.container{
  display: grid;
  grid-template-columns: fit-content(200px) fit-content(260px) fit-content(360px);
  background: #FFC;
}
p{
  margin: 0;
  border: 1px solid;
}
```
![fit-content的计算公式套用结果](fit-content的计算公式套用结果.jpg)

##### 重复的栅格线(repeat函数)
> 如果我们想要创建的每一个栅格轨道的尺寸是一样的话，或许我们不想一个个地输入尺寸值，这里可以借助于`repeat()`函数，减少一次次的录入

```html
<div class="container">
<p>123</p>
<p>123</p>
<p>123</p>
<p>123</p>
<p>123</p>
<p>123</p>
<p>123</p>
<p>123</p>
<p>123</p>
<p>123</p>
</div>
```
```css
.container{
display: grid;
grid-template-columns: repeat(10, 80px);
  border: 1px solid;
}
p{
  background: #CCF;
  margin: 12px;
}
```
![重复的栅格元素](重复的栅格元素.png)

👆这样子我们就创建了10个列轨道，每个轨道的宽度都是80px

✨ 如果我们想要实现一个有规律的循环重复的话，也可以利用`repeat()`函数来

**自动填充的轨道：**
> 重复简单的模式，直到填满整个栅格容器为止。
> grid-template-rows: repeat(auto-fill, [top] 5em [bottom]);
> 👆这里每隔5em放置一条栅格线，直到没有空间为止，比如对于一个限定高度为21em的栅格容器，则上面的代码相当于重复了4x5em的轨道。
> ⚠️在一个轨道模版中只能有一个自动重复的模式，也就是不能同时有repeat(auto-fill, ...)的情况出现，🈶️且只能🈶️一个；但是，如果是固定的重复模式与自动填充的重复模式结合在一起，是可以的，如下所示：
> grid-template-columns: repeat(auto-fill, 2em) repeat(3, 4em);

#### 栅格区域(grid-template-areas)
> 前面提及到，栅格区域是由一个或者多个栅格cell组件的**规则**区域

| 栅格区域属性 | 描述 |
|---|---|
| 取值 | none / `<string>` |
| 初始值 | none |
| 适用于 | 栅格容器 |
| 继承性 | 否 |

🤔 在初次遇见整个属性时，觉得也忒奇葩了，基本没有固定的内容，拥有的仅仅是一个带组织结构的布局效果，如下所示：
```html
  <div id="grid">
      <span class="h">我是h</span>
      <span class="l">我是l</span>
      <span class="c">我是c</span>
      <span class="f">我是f</span>
  </div>
```
```css
    #grid{
        display: grid;
        grid-template-areas: 
        "h h h h"
        "l c c c"
        "l f f f";
    }
    span{
      padding: 12px;
      background: #FFC;
      border: 1px solid;
      text-align: center;
    }
    .h{
      grid-area: h;
    }
    .l{
      grid-area: l;
    }
    .c{
      grid-area: c;
    }
    .f{
      grid-area: f;
    }
```
👆代码对应的效果如下：
![grid-template-area效果](grid-template-area效果.png)

实际在栅格容器中的栅格区域效果如下：
![栅格容器中的栅格区域](栅格容器中的栅格区域.jpg)

✨ 在栅格容器设定好对应的栅格区域布局之后，需要针对每个跨多个栅格cell的元素进行配置所占领的区域，使用`grid-area`来声明所占据的栅格区域空间，才能够实现上述的效果！！！
栅格区域的每个栅格cell代表，可以是任意的自定义字符串

⚠️ 对于`grid-template-areas`的值的设置，必须是由一个/多个字符串组成的结果，而且如果组成的栅格区域形状太过于复杂的话，整个栅格区域的值将会变得无效，目前仅支持是**矩形**形状的！！！！

✨ 如果只是想把部分栅格单元定义为栅格区域的一部分，其他的单元不标注其名称，那么可以使用一个或者多个.字符占位，如下所示：
```css
    #grid{
      border: 1px solid red;
      height: 200px;
      display: grid;
      grid-template-areas: 
        "h h h h" 
        "l . . ." 
        "l f f f";
    }
```
![没有名称的栅格单元](没有名称的栅格单元.png)
👆这里的空白区域的栅格单元不属于任何区域

🪐 定义好栅格容器的布局之后，需要设置容器中每个栅格轨道的尺寸，借助于上面的`grid-template-rows/columns`属性来配合定义
```html
  #grid{
      border: 1px solid red;
      height: 300px;
      display: grid;
      grid-template-areas: 
        "h h h h" 
        "l c c c" 
        "l f f f";
      grid-template-columns: repeat(4, 200px);
      grid-template-rows: 80px 1fr 60px;
      
    }
```
![区域配合栅格线的使用](区域配合栅格线的使用.png)

✨ 一般情况下，如果没有特殊的长度限定，**设置的栅格区域会填充整个栅格容器**，如果栅格区域比栅格容器要小，则会根据情况额外新增多至少一条栅格线

👉 现在具名栅格区域所创建的行和列 :u6709: 了轨道尺寸了，如果提供的轨道尺寸数量比区域轨道的数量要多，那么多出来的轨道将放在具名区域之后，如下代码所示：
```html
  <div class="grid">
      <header class="header">header</header>
      <nav class="left">left</nav>
      <nav class="right">right</nav>
      <section class="footer">footer</section>
    </div>
```
```css
    .grid{
      display: grid;
      grid-template-areas: 
        "header header header header"
        "left ... ... right"
        "footer footer footer footer";
      border: 1px solid red;
      background: #FFC;
      padding: 2px;
      grid-template-rows: 40px 10em 3em 20px;
      grid-template-columns: 1fr 20em 1fr 1fr 1fr;
    }
    .header{
      grid-area: header;
      text-align: center;
      border: 1px solid;
    }
    .left{
      grid-area: left;
      border: 1px solid;
      text-align: center;
    }
    .right{
      grid-area: right;
      border: 1px solid;
      text-align: center;
    }
    .footer{
      grid-area: footer;
      text-align: center;
      border: 1px solid;
    }
```
![栅格容器轨道多于栅格区域.png](栅格容器轨道多于栅格区域.png)

✨ 在使用栅格区域的时候，其实已经对应地生成栅格线的名字了，比如👆这里的栅格区域，划分为了header、left、right、footer4个区域，
比如header，header区域的行起边以及列起边都叫做`header-start`，header区域的行终边与列终边都叫做`header-end`，而footer也是类似，栅格线都是直接穿过整个栅格区域的，如下图所示：
![栅格区域中自动命名的栅格线](栅格区域中自动命名的栅格线.png)
👆这里这种机制，我们称之为`栅格线的隐式命名`

### 在栅格中附加元素
> 👆花了这么庞大的篇幅来讲解整个栅格容器、栅格线，目前是为了后续方便的附加栅格元素来做铺垫的，**只有清楚了解了关于栅格容器中栅格线的配置与其在容器中的分布规则，才可以根据整个栅格线来附加栅格元素**！！

#### 使用行线和列线(grid-row-start/end，grid-column-start/end)
> 我想把元素的边界附加在某条栅格线上，通过这种方式将元素附加在行线与列线上

| 行/列线属性 | 描述 |
|---|---|
| 取值 | auto / `<custom-ident>` / `[<integer> && <custom-ident>]` / `[span && [<integer> && <custom-ident>]]` |
| 初始值 | auto |
| 适用于 | 栅格元素和绝对定位的元素(前提是容纳块为栅格容器) |
| 继承性 | 否 |

🤔第一次看见这个属性的描述，真的是万脸懵逼，直接上代码，方便理解：
```html
<div class="grid">
  <div class="one">
    one
  </div>
  <div class="two">
    two
  </div>
  <div class="three">
    three
  </div>
</div>
```
```css
.grid{
  display: inline-grid;
  border: 1px solid;
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(5, 40px);
}
.one{
  background: #FFC;
  text-align: center;
  border: 2px solid;
  grid-row-start: 2;
  grid-row-end: 4;
  grid-column-start: 2;
  grid-column-end: 4;
}
.two{
  background: #FCC;
  text-align: center;
  border: 2px solid;
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 5;
  grid-column-end: 10;
}
.three{
  background: #CFC;
  text-align: center;
  border: 2px solid;
  grid-row-start: 4;
  grid-row-end: 5;
  grid-column-start: 6;
  grid-column-end: 7;
}
```
![将栅格元素附加到栅格线上](将栅格元素附加到栅格线上.png)
👆这里通过设置行线与列线的起边与终边，将元素**附加**到栅格线上，通过栅格线的编号指明元素应该放在栅格容器中的什么位置，编号从左到右、从上到下、**从1开始逐渐增加**。

⚠️ **如果省略结束栅格线，那么结束栅格线使用序列中的下一条栅格线**。

🤔这里为什么要叫附加呢？原因是原本通过栅格容器的容器布局与栅格区域的设定，已经是将
栅格容器给划分为不同的区域的了，那么再通过👆这种方式是额外地追加元素到栅格容器中的，并且追加的元素，将会以**挤压**其他栅格单元的方式，展示在栅格容器中，**被挤压的栅格单元则被自动往后排**，这里所说的“挤压”指的是没有额外定义的栅格线位置的栅格元素！！！
![附加与普通栅格元素的效果](附加与普通栅格元素的效果.png)

🪐 此外，还可以使用另外一种表达方式来表示附加的元素，将结束值改为**span 1**，或者只使用**span**
```css
.one{
    grid-row-start: 4; 
    grid-row-end: span 1;
    grid-column-start: 5;
    grid-column-end: span;
}
```
👆这里如果span后面有数字的话，意思是**跨指定数目的栅格轨道**

关于属性值*span*的使用，可以在start也可以在end使用，**向确定了编号的栅格线的反方向计数**，有以下两种具体的行为：
1. 如果确定了开始栅格线，将结束值设定为span，则向栅格线的结束方向计数；
2. 如果确定了结束栅格线，将开始值设置为span，则向栅格线的开始方向计数；

![将元素附加在栅格线上-span](将元素附加在栅格线上-span.jpg)

🪐 在指定栅格线的位置的时候，正数代表是从栅格线编号递增的方向上数，而负数则代表的是从后往前数，比如说，想要将一个元素放在栅格右下角那个栅格单元中，而不用去管这个栅格容器中有
多少行多少列，可以直接是按照下面的定义：
```css
.four{
  background: #FCF;
  text-align: center;
  border: 2px solid;
  grid-row-start: -1;
  grid-column-start: -1;
}
```
![固定在右下角的附加栅格元素](固定在右下角的附加栅格元素.png)
⚠️ 而且使用了-1作为行线以及列线的值的时候，将会从原本的栅格轨道中往外怼出另外的一个栅格轨道出来，根据其自身的内容进行填充

🪐 **与自定义名称的栅格线的配合使用:**
如果我们在栅格容器中使用了自定义名称来定义栅格线的话，那么与行线/列线的配合使用，可以达到不一样的效果，如下所示：
```css
.grid{
  display: inline-grid;
  border: 1px solid;
  grid-template-columns: 2em repeat(8, [col-a] 40px [col-b] 40px) 2em;
  grid-template-rows: repeat(5, [R] 40px);
}
nav{
  border: 1px dashed;
  text-align: center;
}
.four{
  background: #FCF;
  text-align: center;
  border: 2px solid;
  grid-row-start: R 3;
  grid-column-start: col-b 6;
}
```
![自定义栅格线名称与行线列线的配合](自定义栅格线名称与行线列线的配合.png)
针对上述的代码以及运行结果做一个分析：
1. 首先，设置栅格容器的行列栅格线分布，从而来确定其基础的效果；
2. 其次，利用行/列线的值来进行定义，确定元素从哪一条行线、列表开始分布;
3. 然后，利用span属性值来限定该附件的元素应该横跨多少个栅格单元；

⚠️ 这里由于栅格容器设置的重复的栅格线的属性为`repeat(8, [col-a] 40px [col-b] 40px)`，这意味着里面由8组col-a + col-b所组成的16个轨道，然后配合span来定义横跨多少个col-a轨道组
![横跨多个自定义的区域](横跨多个自定义的区域.png)

🪐 这里再联合之前所学习到的栅格区域的配置，由于配置后所形成的自动栅格线的关系，可以直接从生成后的栅格线名称(*-start/end)来直接使用

#### 行线与列线的简写属性(grid-row/column)
> grid-row-start、grid-row-end的简写属性grid-row代表的是：grid-row-start/grid-row-end的机制，
> 前一部分定义的是开始的栅格线，后一部分定义的是结束栅格线。

⚠️ 如果值中没有/，只有一个值的话，那么定义的是开始栅格线，结束栅格线取决于开始栅格线的值，如果栅格线是用名称来引用的话，那么结束的栅格线也是用这个名称来引用，也就是：
`grid-column: col;` === `grid-column: col / col;`
代表的啥意思呢？👉栅格线将从指定的名称的栅格线开始一直延伸到下一条同名栅格线，不管中间有多少栅格单元！！！👉这也同时说明了在使用栅格区域的时候，可以使用同一个名称来表示行线以及列线，表示这个栅格单元区域！！！

✨ 如果只提供了一个数字，那么第二个数字则被设置为`auto`，也就是：
`grid-column: 1;` === `grid-column: 1 / auto;`

```html
<div id="grid">
  <div id="header">
    header
  </div>
  <div id="footer">
    footer
  </div>
  <div id="sidebar">
    sidebar
  </div>
  <div id="content">
    content
  </div>
  <div id="custom">
    自定义块
  </div>
</div>
```
```css
#grid{
  height: 200px;
  border: 1px solid;
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar content"
    "footer footer"
    ;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 25% 75%;
}
#header{
  grid-row: header;
  grid-column: header;
  text-align: center;
  background: #FFC;
}
#footer{
  grid-row: footer;
  grid-column: footer-start / footer-end;
  text-align: center;
  background: #CFC;
}
#sidebar{
  text-align: center;
  background: #FCF;
  grid-row: sidebar;
  grid-column: sidebar;
}
#content{
  grid-row: content;
  grid-column: content;
  background: #CCF;
}
#custom{
  background: #DDA;
  grid-row: 1;
  grid-column: 1;
}
```
![简写的行线与列线的使用](简写的行线与列线的使用.png)
👆这里有一个情况需要注意一下，就是通过行线+列线来附件元素的时候，有可能会导致附件的元素发生重叠现象，比如👆上面的*自定义块*，它将盖住*header*，挡在其上面

👉**最佳实践：**
不要使用相同的名称命名栅格区域和栅格线，有些情况下可能不会受到这一问题的影响，但是最好始终把线和区域的名称分开，以免导致命名解析冲突！！

#### 隐式栅格
> 一般情况下，我们所定义的栅格都是显示定义的，也就是通过`grid-template-rows/columns`来定义行与列的，以及显示地将元素附加到栅格线上的。
> 🤔假如栅格元素超出了显示定义的栅格容器的话，会出现一个怎样的情况呢？

![隐式创建的栅格线以及生成的栅格轨道](隐式创建的栅格线以及生成的栅格轨道.jpg)

🪐 从上面👆我们可以看出，当栅格元素单元超过栅格容器的高度/宽度的时候，将会自动的创建栅格容器的额外的栅格线，而且如果没有定义它**流出部分**的宽度以及高度(grid-auto-rows以及grid-auto-columns)的话，它将会根据自身的内容进行适当性的流出！！！！

#### grid-row/column-start/end的错误处理
> 当我们编写的属性不小心写错的时候，它也提供了一些错误处理机制供给我们：
> 1. 比如grid-row-start与grid-row-end不小心写反了，那么它将会自动对调两个值；
> 2. 如果grid-row-start与grid-row-end的声明为span跨度，那么结束线的跨度将被放弃，替换为auto，而开始线则相当于span 1

#### 使用区域(grid-area)
> 使用行线与列线可以附件元素到某条栅格线上，但有更加方便的机制，直接是把元素指定给定义好的栅格区域，
> 一般是配合栅格区域(grid-template-areas)来使用的，先在定义好栅格区域，然后再通过区域的赋予(grid-area)属性，将栅格单元赋予到对应的区域上

| grid-area属性 | 描述 |
|---|---|
| 取值 | `<grid-line>[<grid-line>]{0, 3}` |
| 初始值 | - |
| 适用于 | 栅格元素和绝对定位的元素(在栅格容器中) |
| 继承性 | 否 |

根据它的一个使用情况，个人将其分为以下两种方式的配置：

##### 仅用一个"区域单词"来 :u6307: 定某个区域
```html
<div id="grid">
  <div id="masthead">
    masthead
  </div>
  <div id="sidebar">
    sidebar
  </div>
  <div id="main">
    main
  </div>
  <div id="navbar">
    navbar
  </div>
  <div id="footer">
    footer
  </div>
</div>
```
```css
#grid{
  display: grid;
  grid-template-areas: 
    "masthead masthead masthead masthead"
    "sidebar main main navbar"
    "sidebar footer footer footer"
    ;
}
#grid > div{
  border: 2px solid;
  text-align: center;
  padding: 20px;
}
#masthead{
  grid-area: masthead;
}
#sidebar{
  grid-area: sidebar;
}
#main{
  grid-area: main;
}
#navbar{
  grid-area: navbar;
}
#footer{
  grid-area: footer;
}
```
![声明各个区域的栅格布局](声明各个区域的栅格布局.png)

上面👆这里简单的通过`grid-area`属性直接 :u6307: 定栅格区域中的某个块(这里也就是隐式地声明了区域的开始与结束的线，同名的栅格元素将自动合并为一个大的栅格区域，因此当声明的某个栅格区域名称比如header时，则代表的是从第一条header-start到最后一条header-end栅格线)，可以快捷的指定某个区域的对应关系！

##### 利用4条栅格线来 :u6307: 某个区域
✨ 除了用一个"区域单词"来指定之后，还可以使用栅格线来 :u6307: 定
```css
#grid{
  display: grid;
  grid-template-rows: [r1-start] 1fr [r1-end r2-start] 2fr [r2-end];
  grid-template-columns: [c1-start] 1fr [c1-end c2-start] 1fr [c2-end];
}
#grid > div{
  border: 2px solid;
  text-align: center;
  padding: 20px;
}
#one{
  grid-area: r1-start / c2-start / r1-end / c2-end;
  background: #FFC;
}
#two{
  grid-area: r1-start / c1-start / r1-end / c1-end;
  background: #CCF;
}
#three{
  grid-area: 2 / 1 / 3 / 3;
  background: #CFC
}

```
![直接声明区域的4条栅格线](直接声明区域的4条栅格线.png)

上面👆用了4条栅格线来指定某个栅格区域的方式，这里需要⚠️注意这里4条栅格线的一个顺序，与盒子模型的属性相反方向的，遵循
> `上 -> 左 -> 下 -> 右`
> 也就是对应于：
> `grid-row-start -> grid-column-start -> grid-row-end -> grid-column-end`

🪐⚠️ 这里如果提供的值少于4个，那么它将会按照与*盒子模型*️类似的替换规则方式：
1. 如果只有3个值，那么最后一个`grid-column-end`则与`grid-column-start`的取值一致；
2. 如果只有两个值，那么`grid-row-end`与`grid-row-start`一致，`grid-column-end`与`grid-column-start`一致；
3. 如果只有1个值，那么则代表另外3个值都复制了提供的这个值，**这里也就说明了如果只配置了一个值的时候，它会直接拿`grid-template-areas`区域中的区域来指定**。


#### 栅格元素重叠
> 一般情况下，我们在使用栅格布局的时候都尽量避免重叠，然后，在实际使用的过程中，如果没有注意，是有可能导致栅格元素的重叠的
> 比如上面的🌰中，我们将第二栅格元素的结束列线设置为与第一个的一致的时候，将会导致其产生一个重叠的效果，如下图所示：

![重叠的栅格元素](重叠的栅格元素.jpg)

### 栅格流(grid-auto-flow)
> 上面👆已提及到的所有的场景以及例子，除了测试用做为效果展示的元素之外，其他的栅格元素基本上都已经是确定 :u6307: 定了自身在栅格容器中的位置，🤔那么如果没有明 :u6307: 定的节点元素，它们是如何摆放的呢？
> 根据上面的🌰我们可以看出，没有明确 :u6307: 定的元素，将会在默认的栅格流的作用下，按照**顺序**一个一个地放入到栅格容器中，但实际的情况，有可能比较复杂，下面👇就一一道来！！

| grid-auto-flow属性 | 描述 |
|----|----|
| 取值 | `[row / column] / dense` |
| 初始值 | row |
| 适用于 | 栅格容器 |
| 继承性 | 否 |

✨ 栅格流主要分为两种模式：
1. 行优先/列优先(row/column)
2. 密集流(dense)

👇下面针对这两种模式来进行一个对比分析，从而来理解其用法：

![不同栅格流模式对比](不同栅格流模式对比.png)

🤔针对栅格流模式，特别是关于密集型模式下，可以实现一个自定义的栅格画廊效果，将这个计算出每个栅格所需要占据的尺寸，然后进行一个无规则栅格效果的展示，但是需要⚠️的是：要使得元素按照剩余空间来填充区域的话，必须控制好元素出现的位置！！

### 自动增加的栅格线(grid-auto-rows/columns)
> 前面我们也已经提及到，如果栅格元素的**尺寸或者数量**超过原本定义的栅格容器，那么将会在原本的栅格容器中自动创建隐式栅格线，而且，这里如果创建出来的栅格线在没有定义其隐式轨道的尺寸的话，将根据元素自身的内容进行创建以及延伸，
> 听起来 :u6709: 些许抽象，这里同样也是以对比的方式来罗列出来

| 自动增加的栅格线属性 | 描述 |
|---|---|
| 取值 | `<track-breadth> / minmax(<track-breadth>, <track-breadth>)` |
| 初始值 | auto |
| 适用于 | 栅格容器 |
| 计算值 | 取决于具体的栅格轨道尺寸 |
| 备注 | `<track-breadth>` :u6307: 的是`length / percentage / flex / min-content / max-content / auto` |

:stars: 关于取值的范围看起来🈶️些许抽象，这里同样也是以对比的方式来罗列出来

![声明了隐式轨道尺寸的对比](声明了隐式轨道尺寸的对比.png)

### 释放栅格空间
> 目前缩减的栅格元素大都挤在一起的，元素与元素之间并没有间隔，🤔如果想要拥有间隔在不同的元素之间的话，应当如何处理呢？
> 一般的又 :point_down: 下面几种方式:

#### 栏距(gap)
> 栏距(gap)是两个栅格轨道之间的间隔，好像把轨道之间的栅格先加粗，让它具有一定的宽度，这有点类似于表格样式中的`border-spacing`，
> 一方面栏距能在栅格单元之间添加间隔，另一方面，一个轴上只能设置一个间隔值

| grid-row/column-gap属性 | 描述 |
|---|---|
| 取值 | `<length>` |
| 初始值 | 0 |
| 适用于 | 栅格容器 |
| 继承性 | 否 |

⚠️ 这里的取值说明这两个值只能是一个长度值，而且是必须大于0的，使用了该属性之后的栅格元素，每一行/列都向后移对应长度。

```css
#grid{
  display: grid;
  grid-template-rows: 80px 80px 80px;
  grid-template-columns: 80px 80px;
  grid-auto-flow: row;
  grid-auto-rows: 80px;
  grid-auto-columns: 80px;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
}
```
![设置了栅格栏距的栅格容器](设置了栅格栏距的栅格容器.png)

✨ 简写的栏距(`grid-gap = grid-row-gap grid-column-gap`)

#### 与盒模型的配合
> 设置栅格元素中的元素margin>0时，元素的可见部分将在所处的栅格区域中向内收缩，设置margin<0时，可见部分将向外扩张，如下所示：

```html
<div id="grid">
  <div>item</div>
  <div class="one">item</div>
  <div>item</div>
  <div class="two">item</div>
  <div>item</div>
</div>
```
```css
#grid{
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding: 12px;
}
#grid > div{
  padding: 12px;
  border: 5px solid;
  text-align: center;
  background: #FFC;
}
.one{
  margin: 12px;
}
.two{
  margin: -12px;
}
```
![正负内外边距](正负内外边距.png)

#### 复用弹性盒子的对齐方式
> :warning: 正常情况下，如 :u7121: 特殊设置，栅格元素的尺寸一般是填充其所在的栅格轨道交叉所形成的区域的。
> 栅格布局中也可以实现类似于弹性盒子布局中的一些属性与值，来实现与之类似的布局效果。
> 而且需要注意的一个点就是：**设置了弹性属性的栅格元素或者容器，其栅格元素的尺寸将不会填充整个栅格单元**，关于弹性布局的相关知识，可参考之前的另外一篇文章：{% post_link flex-display-in-css 弹性布局 %}

| 栅格弹性属性 | 描述 |
|---|---|
| 取值 | left / right / start / end / center / stretch / `[space-between / space-around / space-evenly]` |
| 备注 | `[space-between / space-around / space-evenly]`这个仅针对`justify-content`以及`align-content`有效 |

![栅格布局中的弹性属性取值](栅格布局中的弹性属性取值.png)

1. justify-self的使用
💎用法：作用于单个栅格元素，仅针对单个栅格单元中的内容有效
```html
<div id="grid">
  <div class="item ">
    item1
  </div>
  <div class="item">
    item2
  </div>
  <div class="item item3">
    item3
  </div>
</div>
```
```css
#grid{
  display: grid;
  grid-template-rows: 80px;
  grid-template-columns: repeat(3, 80px);
  border: 1px solid;
  grid-gap: 5px;
  padding: 12px;
}
.item{
  border: 3px solid;
  text-align: center;
}
.item1{
  justify-self: left;
}
.item3{
  justify-self: right;
}
```
![justify-self的使用](justify-self的使用.png)
从👆我们可以看出`justify-self`是作用于单个栅格元素，并以其所在的栅格单元作为其自身的容纳块，并进行横向方向上的位置控制

![justify-self的不同取值效果](justify-self的不同取值效果.png)

2. justify-items的使用
💎用法：作用于整个栅格容器，相当于每个栅格元素都设置了`justify-self`的效果一样；
3. justify-content的使用
💎用法：作用于整个栅格容器，将整个栅格容器的内容控制在某个位置上，如下图所示：
![justify-content的使用](justify-content的使用.png)
4. align-self，与justify-self雷同，只不过是纵方向
5. align-items，与justify-items雷同，只不过是纵方向
6. align-content，与justify-content雷同，只不过是纵方向

:trollface: 简而言之，`[justify/align]-[items/content/self]`就是用来控制栅格容器/栅格元素的横/纵向内容分布，一旦设置，则栅格元素原本的“stretch”失效，然后，这个`items与content`是作用于栅格容器的，`self`则是作用于栅格元素！！！

#### 分层与排序(z-index与order)
> 使用`z-index`与`order`来实现定位属性中`z-index`的效果。
