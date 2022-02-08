---
title: JavaScript中的浏览器学习(Css篇)
author: Zhenggl
date: 2022-01-29 08:42:14
categories:
    - [javascript, web, 浏览器, css]
tags:
    - javascript
    - web
    - 浏览器
cover_picture: javascript-css.jpeg
---

### 前言
🤔 为什么要学习脚本化CSS？脚本化CSS是什么？如何使用CSS脚本化？

> 脚本化CSS可以将一些动画效果，利用js来配合css进行实现出来，也可以单独仅使用js来将其实现出来。
> CSS即为`Cascading Style Sheet`层叠样式表，这里的层叠，代表了应用于文档*document*中元素的样式规则，是来源于各个"来源"的层叠，这里的"来源"有多个：
+ 浏览器默认样式表1⃣️
+ 文档的样式表2⃣️
+ 元素的样式表
  - 内联样式表3⃣️
  - 外联样式表4⃣️
根据上述样式表的层层属性的覆盖，来达到最终的效果，当未出现重复的属性的覆盖的时候，一般覆盖顺序是：
  3⃣️ > 4⃣️ > 2⃣️ > 1⃣️

✨ 在*document*中的外联样式，可以有两种方式来定义
1. 单独的XXX.css文件管理，在文档中通过`<link>`节点来引用，并指定源地址为链接到XXX.css文件
2. 在文档中直接引用，通过在`<head>`节点中定一个的一个`<style>`节点，在`<style>`节点中包含对于的样式表定义

### 如何脚本化CSS
#### 一、利用style属性，更改元素样式
> e.style.fontSize = '30px';

🤔 首先，上述的`e.style`返回的是一个*CSSStyleDeclaration*对象，该对象是一个 CSS 声明块,CSS 属性键值对的集合，该对象可被以下几种方式获取：
+ HTMLElement.style：用于操作单个元素的样式
+ CSSStyleSheet：document.styleSheets[0].cssRules[0].style 会返回文档中第一个样式表中的第一条 CSS 规则
+ Window.getComputedStyle()：将 *CSSStyleDeclaration* 对象作为一个只读的接口

CSSStyleDeclaration中有一属性*cssText*，代表的其style完整的字符串，可通过修改其内容，或者做部分内容的替换，来达到元素的css替换，其效果等同于
attr的设置，以下两种方式是一样的效果的：
> e.style.cssText = s;  // s代表一个完整的cssText字符串
> e.setAttribute('style', s);

🤔 其次，style中的属性名称，采用的平常我们编码中的驼峰式的编码格式，原本的`font-size`属性，在style中为`fontSize`
🤔 最后，style中属性的值，都是用的字符串来表示

#### 二、元素的计算样式
当我们给元素e设置css属性的时候，e不仅拥有了被设置的属性，还拥有了来自于父容器所提供的css属性，将所有由父亲、祖先节点所赋予的属性集合到一起，则组成了
当前css所拥有的完整属性集合，一般地，我们可以通过以下的方式来获得
> var s = window.getComputed(element, String/null);

上述中的*s*为一个CSSStyleDeclaration对象，该对象为**只读**属性，*element*为一查询的节点，*String/null*则是伪对象的字符串，比如"hover"

🆚 计算样式对象(以下称ComputedStyleDeclaration)与CSSStylDeclaration对象之间的区别：
+ ComputedStyleDeclaration中的属性是只读属性
+ ComputedStyleDeclaration中的属性的值是绝对值，是计算后的像素级别的值
+ ComputedStyleDeclaration中不计算复合属性，而是拆分为多个不同的单属性，比如没有margin，而是拆分为marginTop，marginLeft，marginBottom，marginRight
+ ComputedStyleDeclaration中并无`cssText`属性

#### 三、修改style，一次修改多个样式，脚本化css类
通过HTML.class属性，对应于一属性类名进行关联，如下：
> e.className = 'xxx';

👉 如果有多个类需要作用于同一个元素的时候，不能单纯的使用*className*来作用于一元素，否则将会造成类的替换，
而应该使用的*classList*属性，是一个只读属性，返回一个元素的类属性的实时 DOMTokenList 集合。
相比将 element.className 作为以空格分隔的字符串来使用，classList 是一种更方便的访问元素的类列表的方法。
*classList*虽然是只读属性，但其提供的`remove`以及`add`方法，可以帮助我们很快捷地来增删单个className类

#### 四、直接操作样式表
##### 4.1、样式表对象CssStyleSheet
`CssStyleSheet`代表的样式表本身，一般有两种方式可以使用，一种是作用于单个文档，在html中的style节点使用，另外一种是通过link来引用的外部样式表。
一个CSSStyleSheet包含了一组表示规则的*CssRule*对象，该CssRule规则可能如下：
> h1, h2{
>   font-size: 30px
> }

我们可以通过以下的方式来获取一个文档/元素的样式表对象：
> var s = document.stylesheets;

其提供的*deleteRule*以及*insertRule*方法，可用于动态的删除/添加一个样式规则

##### 4.2、操作CssStyleSheet
> var rules = document.styleSheets[0].cssRules;

上述中的`rules`是一数组，由*CssRule*对象组成的，包含`@import`以及`@page`指令。
而每一个*CssRule*对象是一个基类，用于定义 CSS 样式表中的任何规则，包括规则集（rule sets）和 @ 规则（at-rules），
该规则类型中的属性type代表了其使用的哪一种规则，CSSRule.STYLE_RULE，对应于`CSSStyleRule`对象，
该`CSSStyleRule`包括两个属性：selectedText、style-->
selectedText代表的作用于样式表的样式选择，比如上述中的h1,h2，
而style则是一CSSStyleDeclaration对象，代表的一个样式对象

##### 4.3、创建样式表
> var style = document.createElement('style');
> var header = document.getElementByTag('head')[0];
> header.appendChild(style);

通过上述方式，可以将一style动态创建出来，并赋予对应的值来控制其展示样式。
