---
title: JavaScript中的浏览器学习(Window篇)
author: Zhenggl
date: 2022-01-17 18:46:53
categories:
    - [javascript, web, 浏览器]
tags:
    - web
    - javascript
    - window
cover_picture: window结构.jpeg
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
1. 在获取客户端访问记录信息的时候，可以使用navigator.userAgent属性来达到数据的采集
2. 在一些分销/分享场景情况下，navigator的属性组合，可以作为标识用户的唯一性作为参考
### 三、history
> window的history属性引用的是该窗口的History对象，History对象是用来把窗口的浏览历史用文档和文档状态的形式来表示的，
> ⚠️ 一般的，脚本不能访问已保存的URL

history提供的api有两个：back()、forward()，类似于浏览器的后退以及前进按钮

### 四、回调
#### 4.1、onload
在浏览器加载html完成后，宿主浏览器会自动调用onload函数，代表网页已加载完毕，可进行开始用户的一个js程序的运行
#### 4.2、onerror
onerror属性是一错误处理程序，这有点类似于安卓开发中的Application类实例级别的错误处理程序，如果没有定义该app的错误处理方法的话，app在出现未知异常时，将直接闪退，而浏览器则会在对应的控制台输出，
1. 当JavaScript运行时错误（包括语法错误）发生时，window会触发一个ErrorEvent接口的error事件，并执行window.onerror();
2. 当一项资源（如img或script）加载失败，加载资源的元素会触发一个Event接口的error事件，并执行该元素上的onerror()处理函数。这些error事件不会向上冒泡到window，不过（至少在Firefox中）能被单一的window.addEventListener (en-US)捕获
##### error的方式一
其方法成员参数都有：
```javascript
  window.onerror = function (message, source, lineno, colno, error) {  }
```
函数参数：
1. message：错误信息（字符串）。可用于HTML onerror=""处理程序中的event。
2. source：发生错误的脚本URL（字符串）
3. lineno：发生错误的行号（数字）
4. colno：发生错误的列号（数字）
5. error：Error对象（对象）
若该函数返回true，则阻止执行默认事件处理函数。
#### error的方式二
```javascript
  window.addEventListener('error', function(event){});
```
**ErrorEvent**类型的event包含有关事件和错误的所有信息。
#### ErrorEvent对象解析
> `ErrorEvent`事件对象在脚本发生错误时产生，它可以提供发生错误的脚本文件的文件名，以及发生错误时所在的行号等信息。

继承与**Event**，具体详见[链接](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)。
除了从**Event**那边继承而来的属性之外，还包含自身的自定义属性：这里数据的描述，见上方的`window.onerror`

### 五、阻塞性操作
这里较为简单，就不再阐述了
#### 5.1、alert
#### 5.2、promote
#### 5.3、confirm

### 六、异步操作，事件队列机制
#### 6.1、setTimeout(计时器，延迟执行某个任务)
#### 6.2、setInterval(计时器，固定时间段执行某个任务)

### 七、窗口管理
#### 7.1、open，打开一窗口
```javascript
  let windowObjectReference = window.open(strUrl, strWindowName, [strWindowFeatures]);
```
函数说明：是用指定的名称将指定的资源加载到浏览器上下文（窗口 window ，内嵌框架 iframe 或者标签 tab ）。如果没有指定名称，则一个新的窗口会被打开并且指定的资源会被加载进这个窗口的浏览器上下文中。
参数说明：
    - strUrl 指定了新开的窗口的链接地址，可以是相对路径/绝对路径
    - strWindowName 指定了打开的窗口的标题
    - option 指定了打开的窗口的其他额外属性：一个可选参数，列出新窗口的特征(大小，位置，滚动条等)作为一个DOMString。
返回值：
    windowObjectReference打开的新窗口对象的引用。如果调用失败，返回值会是 null 。
#### 7.2、close，关闭一窗口
方法关闭当前窗口或某个指定的窗口
> 该方法只能由 Window.open() 方法打开的窗口的 window 对象来调用。如果一个窗口不是由脚本打开的，那么，在调用该方法时，JavaScript 控制台会出现类似下面的错误：不能使用脚本关闭一个不是由脚本打开的窗口。

```javascript
  window.close();// 关闭当前窗口
```

⚠️ 在窗口关闭时，其document属性对象依旧存在。

假如有以下这样子一个场景：宿主窗口P打开了窗口A以及窗口B，且在A中定义了一属性函数fun(){console.info(this.a)}以及全局变量a，那么有以下几种情况：
1. A.opener === P ;  B.opener === P;  A.opener === B.opener;
2. B.parent === A.parent === P; P.self === P.top;
3. B.parent.A.a，可以直接输出结果；
4. B.parent.A.fun()，则输出的是A中的a，而不是B中的a，这里的this捆绑需要注意以下！


