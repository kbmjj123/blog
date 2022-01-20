---
title: JavaScript中的浏览器学习(Document篇)
author: Zhenggl
date: 2022-01-19 08:27:51
categories:
    - [javascript, web, 浏览器]
tags:
    - javascript
    - web
    - 浏览器
cover_picture: document组织架构图.jpeg
---

### 前言

> Document 接口表示任何在浏览器中载入的网页，并作为网页内容的入口，也就是DOM 树。
> `Document`接口描述了任何类型的文档的通用属性与方法。
> 根据不同的文档类型（例如HTML、XML、SVG，...），还能使用更多 API：使用 "text/html" 作为内容类型（content type）的 HTML 文档，  
> 还实现了 HTMLDocument 接口，而 XML 和 SVG 文档则（额外）实现了 XMLDocument 接口。
![Document的继承关系](Document的继承关系.png)

### 零、Document与DOM文档对象模型
#### 1、DOM文档对象模型
> DOM 树包含了像 <body> 、<table> 这样的元素，以及大量其他元素。
> 它向网页文档本身提供了全局操作功能，能解决如何获取页面的 URL ，如何在文档中创建一个新的元素这样的问题。
> DOM模型用一个逻辑树来表示一个文档，树的每个分支的终点都是一个节点(node)，每个节点都包含着对象(objects)。
> DOM的方法(methods)让你可以用特定方式操作这个树，用这些方法你可以改变文档的结构、样式或者内容。
> 节点可以关联上事件处理器，一旦某一事件被触发了，那些事件处理器就会被执行。
比如下面的一个对应解析树结果
```html
  <html>
    <head>
      <title>Sample Document</title>
    </head>
    <body>
      <!-- 以下是一个注释节点 -->
      <h1>An Html Document</h1>
      <p>This is a <i>Simple</i> document</p>
    </body>
  </html>
```
🤔根据上述代码，生成的对应的html的节点树的结构如下：
![Document](Document.png)
任何的一个html节点，均会被渲染为一个以`Document`为起点的节点树。在浏览器中，一般根据`document`对象来对Dom树以及节点进行操作的。
⚠️ DOM 将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合。

#### 2、Document对象接口

document与DOM之间的关系，可以用以下一个等式来表示：
> API (web 或 XML 页面) = DOM + JS (脚本语言)
### 一、对节点元素的选取

#### 1.1 Node节点家族
既然可以生成一html节点树，那么我们想要操作到每一个节点的话，应当如何来操作到对应的节点呢？
需要有统一的一个方案，来操作到整棵树以及树上的每一个节点，如下图：
要理解DOM节点是如何组织以及管理整棵树的，需要先了解到其中的关于DOM、Node、以及其他所有节点的一个继承、组织关系
![Node及其后代节点组织结构](Node及其后代节点组织结构.png)

按照以前的编码思维，我们经常使用的节点一般是：Document、Element、Attr，其他的比较少涉及到，现在针对这上述的所有孩子节点，这边进行一个学习知识的整理

##### 1.1.1、Document
> 文档接口表示整个HTML或XML文档。从概念上讲，它是文档树的根，并提供对文档数据的主要访问。
> **由于元素、文本节点、注释、处理说明等不能存在于文档的上下文之外，因此文档界面还包含创建这些对象所需的工厂方法。**
> 创建的节点对象具有ownerDocument属性，该属性将它们与在其上下文中创建它们的文档相关联。
![Document对象](Document对象.png)

##### 1.1.2、DocumentFragment
> DocumentFragment是“轻量级”还是“最小”Document对象。希望能够提取文档树的一部分或创建文档的新片段是非常常见的。
> 想象一下，通过移动片段来实现一个用户命令，比如剪切或重新排列文档。希望有一个可以保存这些片段的对象，为此使用节点是很自然的。
> 但事实上Document对象可以扮演这个角色，一个Document对象可能是一个重量级对象，具体取决于底层实现。真正需要的是一个非常轻量级的对象。
> `DocumentFragment`就是这样一个对象，一般我们如果直接针对document中的节点进行的任何操作，都会立刻让节点在每次操作中重新发起渲染动作；

##### 1.1.3、DocumentType
> 每个Document有一个 文档类型其值为null或者 文档类型对象。
> ![DocumentType](DocumentType.png)
##### 1.1.4、EntityReference
##### 1.1.5、Element
##### 1.1.6、Attr
##### 1.1.7、Comment
##### 1.1.8、CharacterData
##### 1.1.9、Entity
##### 1.1.10、Notation

从上述的Node的一个组织结构，我们可以不难看出浏览器其实是采用的组织树的方式来进行对文档整体的渲染，将普通的html文本内容，直接渲染成为一棵树的，
而其后代节点由于继承了Node对象，可以直接使用Node对象中的属性以及方法。
以下提供关于Node节点所提供的属性+api，可供后续任何一个孩子节点直接使用，从而来操作到整棵节点树。
![Node一览](Node一览.png)

### 二、元素的外观(尺寸与位置)
#### 2.1、文档

#### 2.2、视口

#### 2.3、文档与视口的联系

#### 2.4、尺寸

#### 2.5、位置

#### 2.6、实际测量方案
