---
title: 栅格布局学习总结与实战
description: 栅格布局学习总结与实战
author: Zhenggl
date: 2022-05-22 08:04:25
categories:
    - [css, grid]
tags:
    - css
    - grid
cover_picture: 栅格布局总结与实战封面.jpeg
---

### 前言
> 近期，学习了关于栅格布局的一个知识点，看着一头雾水，属性的值不确定，且规律多变，看着好像毫无规则可言，而且与其他的布局也可以配合使用，
> 个人觉得🈶️必要对习得的知识点进行一个总结，加深自身对该知识点的一个理解与使用，以便于后续能够很顺畅的来使用，而不是单纯的copy度娘到的
> 别人家的代码，也不知道个中缘由！！！

### 总结
首先甩出这边针对属性以及其组成，整理的一个脑图吧：

![栅格布局](栅格布局.png)

🪐 刚开始初步学习完成栅格布局，有点不明白为毛要整如此复杂的布局，在完成自己设置的例子demo出来了之后，发现它的强大之处，比起其他的布局，比如弹性盒子布局、盒子模型、定位、浮动等等，
具有重大的优越性，也渐渐地明白了它的一个存在意义，这里整理了以下关于布局的一些相关的优越性：
1. 减少html节点的层数，提高渲染效率；
我想这个应该是每个前端人都应该关注的，如今写代码的人到处都有，刚毕业的应届生都能够胜任基本的编码工作，如果对于布局编码方面，没有编写出普适性、兼容性高的代码，那么是没有多大的竞争优势的；
2. 屏幕兼容性高，可伸缩延展；

### 实战

#### 实战一：实现类似目前的商家管理系统中的上、左、右工字形的框架布局
```html
<div class="container">
  <header class="header">header</header>
  <nav class="nav">
  	<ul class="nav-menu-container">
      <li class="menu-item-container">
      	菜单一的名称
      </li>
      <li class="menu-item-container">
      	菜单二
      </li>
      <li class="menu-item-container">
      	菜单三三
      </li>
      <li class="menu-item-container">
      	菜单
      </li>
    </ul>
  </nav>
  <div class="content-container">
    这个是选中菜单后展示的内容
  </div>
  <div class="footer">
    <div class="footer-item-container">
      关于我们
    </div>
    <div class="footer-item-container">
      关于我们
    </div>
    <div class="footer-item-container">
      关于我们
    </div>
    <div class="footer-item-container">
      关于我们
    </div>
  </div>
</div>
```
```css
*{
  padding: 0;
  margin: 0;
}
.container{
  width: 100%;
  height: 100vh;
  background: #f2f2f2;
  display: grid;
  grid-template-areas:
    'header header header header'
    'nav content content content'
    'footer footer footer footer';
  grid-template-rows: 60px 1fr 80px;
  grid-template-columns: minmax(100px, max-content) 1fr;
}
.header{
  background: #CCF;
  padding: 12px;
  grid-area: header;
  display: grid;
  align-items: center;
}
.nav{
  grid-area: nav;
  background: #FFC;
}
.nav-menu-container{
  list-style: none;
}
.menu-item-container{
  list-style: none;
}
.content-container{
  grid-area: content;
  background: #FFF;
  
  
}
.footer{
  grid-area: footer;
  background: #CFC;
  display: grid;
  grid-template-columns: repeat(4, calc(100px));
  justify-items: center;
  align-items: center;
  justify-content: center;
}
.footer-item-container{
  background: #3F2;
  padding: 10px;
}
```

![实现工字形的效果](实现工字形的效果.png)

这里简单针对上面👆的🌰进行一个解析：
1. 设置整体为栅格布局，并根据栅格区域，来设置填充内容，同时设置每一个轨道的尺寸，完成整体视图框架的设置，同时这里需要考虑到不同屏幕分辨率尺寸的效果展示；
2. 根据栅格区域，分配好每一个栅格元素所占据的"坑"；
3. 自行设置每个子区域中栅格元素的控制，通过与弹性盒子类似的配置，针对栅格容器进行的配置;
4. 每个子区域又可以设置为栅格布局，而且还可以做到免添加多一层的方式，达到底部footer区域的内容居中展示的效果

#### 实战二：实现不规则图形块填充栅格容器效果
```html
<div class="container">
  <div class="item">item</div>
  <div class="item">item</div>
  <div class="item one">one</div>
  <div class="item">item</div>
  <div class="item">item</div>
  <div class="item">item</div>
  <div class="item">item</div>
  <div class="item two">two</div>
  <div class="item">item</div>
  <div class="item">item</div>
  <div class="item one">item</div>
</div>
```
```css
*{
  padding: 0;
  margin: 0;
}
.container{
  background: #f2f2f2;
  display: inline-grid;
  border: 10px solid;
  gap: 10px;
  grid-template-rows: repeat(5, 100px);
  grid-template-columns: repeat(5, 100px);
  
}
.item{
  text-align: center;
  background-color: #FFC;
  display: grid;
  align-items: center;
  grid-auto-flow: dense;
}
.one{
  grid-row: auto/ span 2;
  grid-column: auto/ span 2;
  background: #CFD;
}
.two{
  grid-row: auto / span 3;
  grid-column: auto / span 3;
  background: #81E;
}
```
![实现不规则色块画廊](实现不规则色块画廊.png)
