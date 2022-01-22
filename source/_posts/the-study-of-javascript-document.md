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
> 描述了任何类型的文档的通用属性与方法。
> 根据不同的文档类型（例如HTML、XML、SVG，...），还能使用更多 API：使用 "text/html" 作为内容类型（content type）的 HTML 文档，
> 还实现了 HTMLDocument 接口，而 XML 和 SVG 文档则（额外）实现了 XMLDocument 接口。

### 零、Document与DOM文档对象模型
#### 1、DOM文档对象模型

> DOM 树包含了像 `<body>` 、`<table>` 这样的元素，以及大量其他元素。
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

![Document的继承关系](Document的继承关系.png)

![Node与HTMLXXX](Node与HTMLXXX.png)

🤔 HTMLElement与Element的区别：前者代表的是具体对应的某个Html元素，HTMLElement集成与Element，比如要使用`img`节点的src属性，那么我们需要在HTMLImageElement中获取到
对应的src属性，该属性从HTMLImageElement中继承而来，一般用Image()函数将会创建一个新的HTMLImageElement实例，它的作用是与document.createElement('img')的功能是一致的！

👉 因此，需要了解这个HTMLElement中的属性都有哪些

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
##### 1.1.4、EntityReference(只读属性，后续浏览器不兼容)
##### 1.1.5、Element
文档中的所有节点都是Element节点表示，自从Element接口继承自Node，通用的Node接口方法 获取属性可用于检索元素的所有属性集
![Element](Element.png)
对上述图片中的部分方法的解析：
> var attrNode = element.getAttributeNode(attrName);
- 根据提供的字符串属性名称，返回指定元素的指定属性节点
- `attrNode` 获得的属性返回值，是`Attr`节点，nodeType 为 2
- `attrName` 是一个包含属性名称的 字符串

> element.normalize();
+ Node.normalize() 方法将当前节点和它的后代节点”规范化“（normalized）。在一个"规范化"后的DOM树中，不存在一个空的文本节点，或者两个相邻的文本节点。
+ 注1：“空的文本节点”并不包括空白字符(空格，换行等)构成的文本节点。
+ 注2：两个以上相邻文本节点的产生原因包括：
  - 通过脚本调用有关的DOM接口进行了文本节点的插入和分割等。
  - HTML中超长的文本节点会被浏览器自动分割为多个相邻文本节点。
比如有以下的一个例子
```javascript
    var wrapper = document.createElement("div");
    wrapper.appendChild(document.createTextNode("Part 1 "));
    wrapper.appendChild(document.createTextNode("Part 2 "));
    // 这时(规范化之前),wrapper.childNodes.length === 2
    // wrapper.childNodes[0].textContent === "Part 1 "
    // wrapper.childNodes[1].textContent === "Part 2 "
    wrapper.normalize();
    // 现在(规范化之后), wrapper.childNodes.length === 1
    // wrapper.childNodes[0].textContent === "Part 1 Part 2"
```
##### 1.1.6、Attr
![Attr继承关系](Attr继承关系.png)
> Attr 节点继承自Node，但不被认为是文档树的一部分。Node上定义的常用属性，如 parentNode, previousSibling, 和 nextSibling
> 对于 Attr节点来说都为null。然而，你可以使用 ownerElement 来得到拥有这个属性的元素。
![Attr](Attr.png)
针对上述属性的解析：
+ `name` 返回属性的名称
+ `specified` 返回是否已经定义该属性的值的标识
+ `value` 返回属性的值

##### 1.1.7、Comment
> Comment 代表标签（markup）之间的文本符号（textual notations），也就是Html注释
![Comment继承关系](Comment继承关系.png)
该接口没有特定的方法，但从其父类 CharacterData 继承方法，以及间接从 Node 继承部分方法。
##### 1.1.8、CharacterData
> CharacterData 抽象接口（abstract interface）代表 Node 对象包含的字符。这是一个抽象接口，意味着没有 CharacterData 类型的对象。
> 它是在其他接口中被实现的，如 Text、Comment 或 ProcessingInstruction 这些非抽象接口。
该接口对象中的属性/方法有：
> ![CharacterData](CharacterData.png)
##### 1.1.9、Entity
> HTML 实体是一段以连字号（&）开头、以分号（;）结尾的文本（字符串）。
> ![Entity](Entity.png)
##### 1.1.10、Notation

从上述的Node的一个组织结构，我们可以不难看出浏览器其实是采用的组织树的方式来进行对文档整体的渲染，将普通的html文本内容，直接渲染成为一棵树的，
而其后代节点由于继承了Node对象，可以直接使用Node对象中的属性以及方法。
以下提供关于Node节点所提供的属性+api，可供上述任何一个孩子节点直接使用，从而来操作到整棵节点树。
![Node一览](Node一览.png)

### 二、元素的外观(尺寸与位置)
#### 2.1、文档

#### 2.2、视口

#### 2.3、文档与视口的联系

#### 2.4、尺寸

#### 2.5、位置

#### 2.6、实际测量方案
