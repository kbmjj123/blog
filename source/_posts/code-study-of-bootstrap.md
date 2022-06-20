---
title: bootstrap的源码学习
description: bootstrap的源码学习
author: Zhenggl
date: 2022-06-18 08:02:51
categories:
    - [css, bootstrap]
tags:
    - css
    - bootstrap
cover_picture: bootstrap从入门到掌握.jpeg
---

### 前言
> 相信不少前端童鞋一开始接触前端，就直接是上三方的ui框架，但有没有想过这个第三方的ui框架，大部分是从**bootstrap**中演变而来的，形成更加方便的开发模式，那么假如撇开三方的ui框架，仅借助于bootstrap框架，我是否能够编写出轻量级的网站呢？
> 答案肯定是可以的，那么关于bootstrap应当如何使用呢？为什么它能够号称自己的移动优先的响应式ui框架呢？

### 关于媒体查询在bootstrap中的运用
> 在bootstrap中一般使用的是`ems`或者`rem`来定义绝大部分的尺寸，而`px`则被用来定义容器的媒体查询断点，也就是目前bootstrap中关于媒体查询断点单位的由来！
> 关键原因在于：**视口区域都会以像素为单位的，而且并不会随着字体尺寸变换而变化**。
>
> 在bootstrap中关于不同的媒体查询断点具体如下表所示：

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th></th>
      <th class="text-center">
        Extra small<br>
        <small>&lt;576px</small>
      </th>
      <th class="text-center">
        Small<br>
        <small>≥576px</small>
      </th>
      <th class="text-center">
        Medium<br>
        <small>≥768px</small>
      </th>
      <th class="text-center">
        Large<br>
        <small>≥992px</small>
      </th>
      <th class="text-center">
        Extra large<br>
        <small>≥1200px</small>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th class="text-nowrap" scope="row">容器最大宽度</th>
      <td>None (auto)</td>
      <td>540px</td>
      <td>720px</td>
      <td>960px</td>
      <td>1140px</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">类前缀</th>
      <td><code>.col-</code></td>
      <td><code>.col-sm-</code></td>
      <td><code>.col-md-</code></td>
      <td><code>.col-lg-</code></td>
      <td><code>.col-xl-</code></td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">总列数</th>
      <td colspan="5">12</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">列间隔宽度</th>
      <td colspan="5">30px(每一列占据15像素)</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">可嵌套</th>
      <td colspan="5">可以</td>
    </tr>
    <tr>
      <th class="text-nowrap" scope="row">列排序</th>
      <td colspan="5">支持</td>
    </tr>
  </tbody>
</table>

🪐🤔在平时的coding过程中，假如需要跟随着在bootstrap框架中的编码情况的话，可以是采用与bootstrap在编写对应的媒体查询配置中，采用同等同一个配置信息，然后进行自定义需要响应式布局元素的编写方式，但这意味着我们需要去深究关于**bootstrap**
中关于所有的媒体查询配置的逻辑，如果我们只是简单通过编译出来后的css代码进行关于媒体查询的使用的话，那么做出来的成品将会是可扩展性及其低下的，因为一旦从根本上调整了关于媒体查询断点的配置(比如有自身的响应式配置)，那么调整起来的工作量将会是毁灭性的，
因为编写的媒体查询的代码，意味着我们需要编写对应不同媒体查询断点下的样式，大大增加了因为媒体查询所带来的额外的大量关于css布局方面的代码。
更有甚者，我们需要掌握基本的关于scss的一个css与处理器的工作原理，掌握其中提供给我们的相关语法以及函数等的使用以及实际可能可以使用的场景。

### 容器、行、列(container、row、column)

#### 等宽列的实现

> **bootstrap**中的响应式布局，主要是通过container、row、column来实现的，通过在对应的容器中声明使用对应的*class(container、row、col以及其对应的媒体查询断点下的类)*，来实现的响应式布局的，其中基本的原理还是借助于**flex布的基本原理**来使用的，
> 比如有一下的一个例子：

```html
<div class="container">
  <div class="row">
    <div class="col">
      1 of 2
    </div>
    <div class="col">
      2 of 2
    </div>
  </div>
  <div class="row">
    <div class="col">
      1 of 3
    </div>
    <div class="col">
      2 of 3
    </div>
    <div class="col">
      3 of 3
    </div>
  </div>
</div>
```
```css
/*以下忽略其他相关的样式声明，比如container有多个不同媒体查询下的尺寸定义*/
.container{
    max-width: 1140px;
}
.row{
    display: flex;
    flex-wrap: wrap;
}
.col{
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
}
```
![container+row+col实现的基础响应式框架](container+row+col实现的基础响应式框架.png)

#### 不等宽的列
> 由于它是采用的*flex*来实现的响应式布局，在实际的编码过程中，经常会遇到不同等宽度的列的使用。
> 同样借助于*flex*布局，我们可以很方便的实现不同等分比例的列，通过**col-num**来实现即可

```html
<div class="container">
  <div class="row">
    <div class="col">
      1 of 3
    </div>
    <div class="col-6">
      2 of 3 (wider)
    </div>
    <div class="col">
      3 of 3
    </div>
  </div>
</div>
```
```css
.col-5{
    flex: 0 0 41.666667%;
    max-width: 41.666667%;
}
.col {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
}
```
✨通过上述这里*col*以及*col-5*两者的实际原理简单说明，可以清楚得出关于bootstrap中行的等分机制。


#### 自适应内容宽度
> 假如我们需要自动根据元素的尺寸，来自动的适配其宽度，那么我们可以使用`col-{breakpoint}-auto`类，来设置元素按照其尺寸进行自适应展示

```css
.col-md-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
}
```
以此来实现元素的自适应缩放，而且这里需要⚠️有一关键的地方：**所有的元素在设置响应式布局的时候，当屏幕尺寸缩放到最小尺寸的时候，都采用100%宽度来填充**

#### 不同屏幕尺寸下的列不同均分
> 🤔啥意思呢？就是控制在不同的屏幕宽度下的元素组成情况，比如在sm下，孩子元素以1-10-1的比例，在md下，孩子元素以2-8-2的比例来展示，
> 仅需要对应设置其中的`col-{breakpoint}-num`来对应控制其在不同的屏幕尺寸下的比例分配规则

```html
<div class="container">
<div class="row">
    <div class="col-6 col-md-4">.col-6 .col-md-4</div>
    <div class="col-6 col-md-4">.col-6 .col-md-4</div>
    <div class="col-6 col-md-4">.col-6 .col-md-4</div>
  </div>
</div>
```
![不同媒体断点下的效果](不同媒体断点下的效果.png)
✨通过上面👆的配置方式，我们可以很方便地控制在不同屏幕尺寸下元素的组成比例，这里与单纯的通过`col-num`的方式相比，要灵活得多！！

#### 统一配置行的列数(row-cols-num)
> bootstrap提供了一个超级简便的类(row-cols-num/row-cols-{breakpoint}-num)，通过该类，我们可以很快速且简单地控制每一行
> 的分布比例，使其按照一定的比例进行分布，也可以做到在不同的屏幕尺寸比例中进行分布！！！

```html
<div class="container">
  <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
  </div>
</div>
```
✨ 上面👆这里的列数，将在md下有4列，在sm下只有两列，而在其他屏幕下只有一列！


