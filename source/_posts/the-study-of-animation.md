---
title: 我想要实现自由落体的球
description: 我想要实现自由落体的球
author: Zhenggl
date: 2022-06-09 08:12:01
categories:
    - [css, animation]
tags:
    - css
    - animation
cover_picture: 实现自由落体的球封面.jpeg
---

### 前言
> 我想要实现一个⚽️自由落体的过程动画？
> 在未接触到动画之前，我想除了度娘或者谷哥之外，别无选择，但是，我想自己利用动画，实现出这样子的一个效果出来，意味着我需要学习关于动画方面的相关知识点，才能够来实现这里提及到的效果。
>
> 那么，什么是动画？它与之前习🉐️的过渡有什么区别呢？我需要掌握哪些知识点，才能够实现这里说到的动画呢？
> 动画都有哪些属性呢？具体这些属性如何配合来使用的呢？下面一一道来！！

### 与过渡的区别
> **相同点：** css属性的值都在一段时间内发生变化！！
> **不同点：**
> 1. 动画对变化的方式有很大的控制权，尤其是通过关键帧实现的css动画能**设定是否以及如何重复动画，还能够深度控制整个动画的过程**；
> 2. 过渡触发的是属性值的隐式变化，而动画变化过程中用到的属性值要在关键帧中显式声明；
> 3. 动画改变的属性值可以不在元素的前后两个状态中，比如在它的默认状态下，或者根本没有。

### 动画的相关概念

#### 关键帧
> 若想要给元素添加动画效果，就必须要有一个关键帧，一个具有名字的关键帧，采用关键词`@keyframe`来定义可复用的css关键帧动画，然后将该名字赋予要设置动画的元素。

![关键帧的组成](关键帧的组成.jpg)

#### 关键帧选择符
> 关键帧选择符是动画持续时间内的时间点，可以是百分数，也可以是关键词`from`与`to`

##### from与to选择符

##### 百分比选择符

#### 支持动画的属性

#### 不支持动画但不能被忽略的属性

#### 通过脚本编辑关键这动画


### 动画的使用
![css动画animation](css动画animation.png)
```html
<span>我是即将动画的元素</span>
```
```css
@keyframes color-ful{
  from{
    background: red;
  }
  to{
    background: green;
  }
}
span{
  padding: 20px;
  background: red;
  display: inline-block;
  cursor: pointer;
  animation-name: color-ful;
  animation-duration: 2s;
  animation-iteration-count: 10;
}
```
![背景变化的动画](背景变化的动画.gif)

上面👆这里是一个简单的动画使用，一般关于动画的设置使用步骤如下：
1. 

#### 🈯️定动画名称(animation-name)

#### 定义动画时长(animation-duration)

#### 设置动画迭代次数(animation-iteration-count)

#### 设置动画播放方向(animation-direction)

#### 延迟播放动画(animation-delay)

#### 动画事件(animationstart、animationiteration、animationend)

#### 动画链

#### 延迟动画中的迭代

#### 改变动画的内部时序(animation-timing-function)

#### 设置动画的播放状态

#### 设置动画的填充模式(animation-fill-mode)

### 动画简写(animation)
