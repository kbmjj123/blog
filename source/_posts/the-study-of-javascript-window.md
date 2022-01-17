---
title: JavaScript中的浏览器学习--(Window篇)
author: Zhenggl
date: 2022-01-17 18:46:53
categories:
    -[web, javascript, window]
tags:
    - web
    - javascript
    - window
cover_picture :window结构.jpeg
---

### 前言
首先先来看一下window的一个组成部分，如下图：
![window结构图](window.png)
### 一、location(浏览器定位与导航)
window对象的location属性，引用的是Location对象，它表示该窗口中当前显示的文档的URL，并定义了对应的方法来操作新的文档。
> Document对象中的`location`属性也引用到Location对象，这两者指向的是同一个对象：
```javascript
  window.location === document.location;
```
#### 1.1、组成部分
看以下图片的展示，关于location的一个组成成分：
![location的组成](location的组成.jpg)
通过上述的标注，我们可以很方便的看出location的组成部分，以及在实际的项目中来使用他们。

**hash**：返回的是URL中的"片段标识符"部分，一般是#之后的内容
**search**：返回是的URL中?后面的参数内容，一般可以使用&来将参数与key给分离开来

如有以下的一个输出结果来说明上述场景：
![location的输出](location的输出.png)

#### 1.2、location提供的api方法
1. assign：跳转至下一个页面；
2. replace：替换当前链接；
3. reload：重新载入当前页面

### 二、navigator
> window.navigator属性引用的是包含浏览器厂商和版本信息的Navigator对象
#### 2.1、组成部分
![Navigator对象](Navigator对象.png)
#### 2.2、应用场景

### 三、history
> window的history属性引用的是该窗口的History对象，History对象是用来把窗口的浏览历史用文档和文档状态的形式来表示的，
> ⚠️ 一般的，脚本不能访问已保存的URL

history提供的api有两个：back()、forward()，类似于浏览器的后退以及前进按钮
### 四、回调
#### 4.1、onload
#### 4.2、onerror
### 五、阻塞性操作
#### 5.1、alert
#### 5.2、promote
#### 5.3、confirm
### 六、异步操作，事件队列机制
#### 6.1、setTimeout(计时器，延迟执行某个任务)
#### 6.2、setInterval(计时器，固定时间段执行某个任务)
### 七、窗口管理
#### 7.1、open，打开一窗口
#### 7.2、close，关闭一窗口
