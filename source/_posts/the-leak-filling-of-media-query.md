---
title: 媒体查询精进攻略
description: 媒体查询查漏补缺
author: Zhenggl
date: 2022-06-15 07:43:34
categories:
    - [css, media, print]
tags:
    - css
    - media
    - print
cover: 媒体查询精进攻略封面.jpeg
---

### 前言
> css所作用的载体显示设备，则是对应的媒体，对于不同的媒体设备，其展现效果由于硬件设备的原因，需要对应的有所区别，虽然平时在日常的业务或者编码过程中很少涉略到，但是一旦遇到，如果只是淡出的度娘别人的代码，
> 自己反而不知道里面各种原因的话，那么无疑是埋了个雷在代码中。🤔我想要从根本上理解关于媒体的使用、媒体查询的使用，在不同媒体中的作用效果等，无需再去依赖别人的代码，而且，有一个关键的地方，别人的未必是
> 100%准确，可能有不适合自身业务场景。

### 媒体查询
> 得益于html与css定义的媒体查询(media query)机制，我们可以针对样式表做出限制，只应用于特定的媒体(屏幕或者印刷品)和符合**指定条件**的媒体.
> 根据使用方式，可以使用以下三种方式的媒体查询机制：

1. 在style标签中使用**media**属性，并赋上对应的值
```html
<style type="text/css" media="print">
  body{ font-family: "Times New Roman"; }
</style>
```

2. 在每个css样式表中导入的时候来限定
```css
@import url(xxx.css) screen;
```

3. 在样式表中使用关键词@media来表示
```css
@media screen {
  body{ font-family: "Times New Roman"; }
}
```

✨ 在使用媒体查询的时候，可以同时对媒体进行组合，比如可以同时使用*screen, print*两种媒体，代表两种媒体下css均生效

#### 媒体类型
+ all: 所有能呈现内容的媒体；
+ print: 打印给非盲用户看的文档，或者是文档的打印预览；
+ screen: 呈现文档的屏幕媒体，可以是电脑显示器或者手持设备；
+ speech: 语音合成器、屏幕阅读器或者其他音频渲染设备

#### 媒体描述符的组成
> 媒体描述符 = 一个媒体类型 + (1个或多个媒体特性列表)
> eg: `@media all and (min-resolution: 96dpi){...}`
> 这里的all可以不写，媒体特性列表必须要使用括号包裹起来，两者之间使用and/not来连接起来

#### 媒体特性
> 描述媒体特征的属性，用于对使用的媒体做进一步的限定，做到更加精确的匹配！
> 多个媒体特性符使用and/not来进行连接

1. **and**: 把两货或者更多的媒体特性连接在一起，每一个特性的结果都必须为true，整个查询的结果才为true，比如有：
`eg: @media all and (min-resolution: 96dpi) and (max-resolution: 156dpi){...}`
2. **not**: 对整个查询的结果取反，如果所有的条件都满足，则不应用样式表，⚠️这个关键词只能在媒体查询开头使用，比如：
`eg: @media not (min-resolution: 96dpi) and (max-resolution: 156dpi){...}`

#### 媒体特性描述符一览
:warning: 以下所有的描述符的值都不能为负数，而且特性描述符必须用括号包裹起来！！！

| 描述符 | 取值 | 描述 |
|---|---|---|
| **width/min-width/max-width** | length | 🈯️用户代理显示区域的宽度 |
| **height/min-height/max-height** | length | 🈯️用户代理显示区域的高度 |
| **device-width/min-device-width/max-device-width** | length | 🈯️输出设配整个渲染区域的宽度，即屏幕宽度 |
| **device-height/min-device-height/max-device-height** | length | 🈯️输出设配整个渲染区域的宽度，即屏幕高度 |
| **aspect-ratio/min-aspect-ratio/max-aspect-ratio** | ratio | 🈯️媒体特性中的width/height的比值 |
| **device-aspect-ratio/device-min-aspect-ratio/device-max-aspect-ratio** | ratio | 🈯️媒体特性中的device-width/device-height的比值 |
| **color/min-color/max-color** | integer | 判断输出设配是否支持彩色显示以及彩色的色量 |
| **color-index/min-color-index/max-color-index** | integer | 输出设备的色彩搜索列表中共有多少颜色 |
| **monochrome/min-monochrome/max-monochrome** | integer | 判断显示器是否单色 |
| **resolution/min-resolution/max-resolution** | resolution | 🈯️以像素密度表示的输出设备的分辨率，单位可以是dpi/dpcm |
| **orientation** | portrait/landscape | 横屏还是竖屏 |
| **scan** | progressive/interlace | 输出设备使用的扫描方式 |
| **grid** | 0/1 | 判断设备是否基于栅格的输出设备 |

✨ 从上面的描述符可以看出，基本上每个描述符都可以使用min/max来限定的，因此我们平时在编码过程中所编写的css相关属性，也是仅在一定范围内的媒体特性内有效的！！！

### 关于响应式布局
> 关键在于考虑每一个媒体特征查询的影响，也就是尽量保证不同的媒体特性描述符之间是尽量不会互相干扰的，而且各自拥有自己的一个生态边界的，需要考虑不同媒体特性下的css效果，而且需要覆盖的全部媒体设备！！！
> 🤔 如何编写好对应的媒体特性适配，以及在适配的过程中，支持两种不同的设备切换

### 印刷样式
> 关于印刷样式的编写，可能平时所接触的业务coding需要的场景比较少，但是这边如果没有系统地掌握整个印刷知识体系的话，是不可能胜任于关于印刷方面的编码工作的

#### 屏幕与印刷品的区别
1. 尺寸: 一般印刷品比如打印，都有明确指定纸张的尺寸大小，因此可以使用pt也可以是使用cm/inch，比如🈶️不少的印刷样式表的开头有这样的一个声明：
```css
body{
font: 12pt "Times New Roman", "Times NR", Times, serif;
}
```
2. 字体: 无衬线字体最符合屏幕设计，而且该字体在印刷品上的可读性更好；
3. 大小: 由于知道印刷品大小，在定义文字尺寸、字体大小的时候，可使用pt/cm/in明确的物理测量单位
4. 背景: 一般直接去掉背景以节省墨水
```css{
* {
 color: black !important;
 background: transparent !important;
}
```

#### 页面尺寸
![纸张页面模型](纸张页面模型.png)

🪐 页面框在@page中定义，size属性用于定义页面框的具体尺寸，比如有以下的例子
`eg: @page{ size: 7.5in 10in; margin: 0.5in }`
@page是与@media一样的属性块，块中可以有任意多数量的样式，而**size属性只在@page块中有效**

✨ 以下是关于@page关键词的一个具体使用的实战效果：
```css
@media print{
				@page{
					size: A5 portrait;
				}
				h1{
					page-break-after: always;
				}
			}
```

🪐 而在一些高版本的浏览器中，我们则可以控制打印页面根据不同的元素来控制其方向，比如有以下的一个情况：

*场景：* 我们在打印数据的时候，想要控制文本按照正常的方向总纵向打印，然后对于有出现表格的情况下，由于表格列数较多，需要控制表格是横向方向来打印的，🤔这个时候，应该怎么做呢？？？
```css
@media print{
				@page table{
					size: landscape;
				}
				table{
					page: table;
				}
			}
```
![控制局部元素的打印方向](控制局部元素的打印方向.png)
上面👆这里只需要对table表格进行page属性的配置，而我们在使用page的时候，需要预先定义纸张针对table名称的设定，这样子，我们只需要在对应的元素的样式属性中引用该属性即可！！！

下面👇附上关于@page以及page属性的浏览器兼容性，在使用打印的时候需要注意以下：
![@page属性的兼容性](@page属性的兼容性.png)
![page属性的兼容性](page属性的兼容性.png)

✨ 这里附上相关的伪类整理：

| 伪类一览 | 描述 |
|---|---|
| `:left` | 指的页面的左侧 |
| `:right` | 🈯️页面的右侧 |
| `:first` | 选择文档的第一页面为目标 |
| `:blank` | 针对任何"故意留白"的页面 |

✨ `:left`以及`:right`伪类，主要是用来设置page左右两边不同的间距用的

##### 页面区域(size)
> 整个属性用于定义页面区域的尺寸

| size属性 | 描述 |
|---|---|
| 取值 | `auto/length[1,2]/page-size/(portrait/landscape)` |
| 初始值 | auto |
| 适用于 | 页面区域 |
| 继承性 | 否 |

✨ 值landscape是表示将布局旋转90度，一般是作为辅助属性来配置的，比如有size: auto landscape！！！
这里说着关于整个页面区域的使用，看着着实有些抽象，直接上代码具体讲解以下：
```html
<html>
	<head>
		<style>
			@page{
				size: 11.69in 16.54in;
				background-color: #FFC;
				color: red;
				margin:  3.7in;
			}
		</style>
	</head>
	<body>
		我是内容
	</body>
</html>
```
![默认screen效果](默认screen效果.png)
![打印效果](打印效果.png)

对比上面两个效果，可以看到定义在@page中的属性，只有在打印/印刷情况下生效的！！！而且，由于配置了页面的尺寸，当我们使用pdf方式来打印的时候，会按照我们所要求的纸张尺寸来打印

##### 分页(page-break-before、page-break-after、page-break-inside)
> 在分页媒体中，时常需要控制在何处分页，分页行为使用`page-break-before`和`page-break-after`两个属性控制，这两个属性所接受的值是一样的

| page-break-before/after属性 | 描述 |
|---|---|
| 取值 | auto/always/avoid |
| 初始值 | auto |
| 适用于 | 无浮动的块级元素 |
| 继承性 | 否 |

![对比使用了打印分页效果](对比使用了打印分页效果.png)
上面👆🌰中针对h1设置了在该元素之后都分页，因此打印的时候，页面将会自动分页，**这对于在控制我们的书籍打印输出的时候，非常有用，我们想在阅读网站的时候内容紧凑一点，然后又想在打印书籍的时候，按照标题来打印**

✨ 而像`page-break-inside`属性则是用于控制元素内容尽量不分页打印，但是，假如元素的内容过多的话，也是避无可避的！！！

### 关于打印印刷的额外知识点
