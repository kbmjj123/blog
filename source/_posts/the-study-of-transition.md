---
title: css过渡变换学习
description: css过渡变换学习
author: Zhenggl
date: 2022-06-08 05:56:44
categories:
    - [css, transition]
tags:
    - css
    - transition
cover: css过渡封面.jpeg
---

### 前言
> css过渡代表的是在一段时间内，把css属性的*初始值*变成*终止值*，这种转变的触发是由于某种操作的响应，一般是由用户触发的，可以是
> 对类、id、其他状态等方式所引起的，正常情况下，无特殊说明的话，该动作是瞬间完成的！

### css过渡属性
1. transition-property
2. transition-duration
3. transition-timing-function
4. transition-delay
5. transition(复合简写属性)

✨ 观察以下👇的一个例子：
```html
<div>
  我是hover测试块
  <ul>
    <li>我是菜单</li>
    <li>我是菜单</li>
    <li>我是菜单</li>
    <li>我是菜单</li>
    <li>我是菜单</li>
  </ul>
</div>
```
```css
div{
  border: 1px solid;
  display: inline-block;
  padding: 10px;
  position: relative;
}
div:hover{
  background-color: #ccf;
  cursor: pointer;
}
div ul{
  transition: 200ms transform ease-in 50ms;
  transform: scale(1, 0);
  transform-origin: top center;
  position: absolute;
}
div:hover ul{
  transform: scale(1, 1);
}
```
![hover过渡动作](hover过渡动作.gif)

✨例子解析：
在上面的🌰中，过渡属性是*transfrom*，而触发的事件是*hover*，而过渡的持续时间是*200ms*，过渡时序为先慢后快，且延迟执行*50ms*，
由初始值scale(1,0)过渡到scale(1,1)。
⚠️ 一般情况下，过渡是应用到元素上的常规样式中声明的，而不是当目标属性变化时才去声明过渡效果，因为在常规样式中声明的话，当触发后要恢复
原本的初始状态时，才可以继续复用原本的过渡效果，恢复到原始状态。

🤔 假如将过渡效果设置到触发样式中的话，会发生怎样的一个情况呢？这里依旧已上述的🌰作为演示对比：
```css
div ul{
  transform: scale(1, 0);
  transform-origin: top center;
  position: absolute;
}
div:hover ul{
  transition: 200ms transform ease-in 50ms;
  transform: scale(1, 1);
}
```
![设置为过渡上的效果](设置为过渡上的效果.gif)

从上面👆我们可以看出，如果设置在过渡效果上的话，当恢复原来的状态的时候，是没有过渡效果的，因为过渡只设置在了触发的时候

#### 设置要过渡的属性(transition-property)
> 指定想要应用过渡效果的css属性名称，限定只在特定的属性上运用过渡效果，而其他属性则瞬间完成。

| transition-property属性 | 描述 |
|---|---|
| 取值 | `none|[all]<property-name>` |
| 初始值 | all |
| 继承性 | 否 |

✨ `transition-property`可以是以逗号分隔的属性列表，也可以是**none**，表示不过渡任何属性，还可以是默认的**all**，代表支持所有的*支持动画的属性*，
以逗号分隔的属性列表中，也可以包含关键词all。

⚠️ 如果只想部分属性进行过渡的话，则需要明确列出要过渡的属性值！

##### 禁用过渡效果
> 默认情况下，transition是没有过渡效果的，然而如果我们设置了过渡效果，然后后面又想着在特定的情况下是没有过渡效果的，这个时候，我们可以使用关键词**none**，代表禁用过渡效果，
> 禁用所有属性的过渡效果

##### 过渡事件
> 在DOM中，不管是哪个方向的过渡，不管过渡持续多久、延长多长，也不管过渡的属性是单独声明的还是涵盖在all中的，过渡结束后都会触发**transitionend**事件，有时看似单个声明的属性，
> 却会触发**多个transitionend**事件。
> 比如有：transition: border-radius 2s ease;
> 这里其中有4个`transitionend`事件的发生，来自于4个边角的事件；
> 再比如有：transition: padding 2s ease;
> 这里其中也有4个`transitionend`事件的发生，来自于4个内边距的事件

✨ 一般的，我们可以通过原生的方式来进行监听的设置：
```javascript
  document.querySelector('div').addEventListener('transitionend', function (ev) { 
  	console.info(ev);
   });
```

#### 设置过渡持续时间(transition-duration)
> 以逗号分隔的事件长度列表，单位为秒(s)或者毫秒(ms)，指定从初始值过渡到终止值所消耗的时长。

#### 调整过渡的内部时序(transition-timing-function)
> `transition-timing-function`属性用于控制过渡的步调，可以取的值有ease、linear、ease-in、ease-out、ease-in-out、step-start、step-end、steps(n, start)、steps(n, end)和cubic-bezier(x1, y1, x2, y2);
> 关于这个过渡的步调，建议可以直接借助于官网[https://cubic-bezier.com](https://cubic-bezier.com/#.17,.67,.83,.67)的学习，
> 在实际的coding过程中，可以直接借助于该网站所生成的函数来帮助我们达到目标效果！！！

![不同的贝塞尔函数](不同的贝塞尔函数.png)

#### 延迟过渡设置(transition-delay)
> `transition-delay`属性在元素上发生触发过渡变化与开始过渡之间插入一定的延迟，默认值是0，代表过渡立即开始

#### 复合属性(transition=property + duration + timing-function + delay)

### 反向过渡：退回起点
> 在最前面的🌰中，我们通过hover改变元素的状态，然后我们移出元素时，各个css属性将通过相同的过渡回到默认的状态，延迟是一样的，但是时序函数确是**相反**的

### 支持动画的属性与值
> 在css的世界中，有太多的属性需要记住与学习了，而且其中有不少的属性是支持过渡变化的，那么应该怎么来记住这些属性呢？
> 记住以下一点：只要属性是可以被内插值的，这个属性就可以通过css过渡，简单地理解，就是属性的值可以被转换为实数，然后往中间插入一个中间值的，就是可以被内插的！！！
