---
title: 回流与重绘
author: Zhenggl
date: 2021-03-25 11:21:16
categories:
    - [html]
tags:
    - 浏览器
cover_picture:https://img.91temaichang.com/blog/backflow-and-repaint.jpeg
---

### 写在前面
---
在讨论回流与重绘之前，我们需要知道`浏览器的渲染过程`

![浏览器渲染过程](https://img.91temaichang.com/blog/backflow-and-repaint-guide.jpeg)

从上面这个图我们可以看出，浏览器的渲染过程如下：

1. 解析HTML，生成DOM树，解析CSS，生成CSSOM树；
2. 将DOM树与CSSOM树结合，生成渲染树(Render Tree)；
3. Layout(回流)：根据生成的渲染树，进行回流(Layout)，得到节点的几何信息(位置，大小)；
4. Painting(重绘)：根据渲染树以及回流得到的几何信息，得到节点的绝对像素；
5. Display：将像素发送给GPU，展示到页面上(这一步其实还有很多的流程在其中，比如会在GPU将多个层合并为同一个层，并展示在页面中，而css3硬件加速的原理是新建合成层)。

渲染过程看起来很简单，让我们来了解一下每一步都具体做了什么。
#### 生成渲染树
![生成渲染树](https://img.91temaichang.com/blog/product-render-tree.jpeg)

为了构建渲染树，浏览器主要完成了以下工作：
1. 从DOM树的根节点开始便利每个可见节点；【`渲染树只包含可见的节点`】
2. 对于每个可见的节点，找到CSSOM树中对应的规则，并应用它们；
3. 根据每个可见节点以及其对应的样式，组合生成渲染树。

👆有了渲染树，我们就知道了所有可见节点的样式，然后计算它们在页面上的大小和位置，最后把节点绘制到页面上。
由于浏览器使用流式布局，对渲染树的计算通常只需要遍历一遍就可以完成，但`table`以及其内部元素除外，他们可能需要多次计算，通常需要花3倍于同等元素的时间，这也是为什么要避免使用`table`布局的原因之一。

### 回流
前面我们通过构造渲染树，我们将可见DOM节点以及它对应的样式结合起来，然后计算它们在视口(viewport)内的确切位置和大小，这个计算的阶段就是`回流`。

为了弄清楚每个对象在网站上的确切位置和大小，浏览器从根节点开始遍历，我们以👇这个实例来表示：
```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Hello world!</title>
    </head>
    <body>
      <div style="width: 50%;">
        <div style="width: 50%;">Hello World!</div>
      </div>  
    </body>
  </html>
```
![回流例子](https://img.91temaichang.com/blog/backflow-demo.jpeg)

从👆，我们可以看到，第一个div将节点的显示尺寸设置为视口宽度的50%，第二个div将其尺寸设置为父节点的50%，而在这个回流的阶段，我们就需要根据视口具体的宽度，将其转为实际的像素值。

➡️ 当渲染树中部分或者全部元素的尺寸、结构、或某些属性发生变化时，浏览器重新渲染部分或者全部文档的过程，叫做回流。

👇会导致回流的操作有：
1. 页面首次渲染；
2. 浏览器窗口大小发生变化；
3. 元素尺寸或位置发生变化；
4. 元素内容变化(文字数量或图片大小等等)
5. 元素字体大小变化
6. 添加或者删除可见的`DOM`元素
7. 激活`CSS`伪类(例如:`:hover`)
8. 查询某些属性或者调用某些方法

一些常用且导致回流的属性和方法：
+ clientWidth、clientHeight、clientTop、clientLeft
+ offsetWidth、offsetHeight、offsetTop、offsetLeft
+ scrollWidth、scrollHeight、scrollTop、scrollLeft
+ scrollIntoView()、scrollIntoViewIfNeeded()
+ getComputedStyle()
+ getBoundingClientRect()
+ scrollTo()


### 重绘
最终，我们通过构造渲染树和回流阶段，我们知道了哪些节点是可见的，以及可见节点的样式和具体的几何信息(位置、大小)，那么我们就可以将渲染树的每个节点都转换为屏幕上的实际像素，这个阶段就叫做重绘。

⚠️ *回流一定会触发重绘，但重绘不一定会触发回流*

### 浏览器的优化机制

### 减少回流和重绘
