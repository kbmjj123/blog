---
title: 你不知道的Chrome DevTools的骚操作(-)
author: Zhenggl
date: 2021-04-28 11:18:42
categories:
    - [工具插件, 开发工具]
tags:
    - 调试
    - 工具
cover_picture: https://img.91temaichang.com/blog/the-use-of-chrome-tools.png
---
### 引言
前端设备参差不齐、环境复杂，因此给前端的研发童鞋制造了许多的BUG，为了快速解决BUG，灵活运营调试工具就显得特别的重要了，因此这边整理了关于`Chrome`浏览器的调试方法，在Mac下，使用F12或者右键"检查"即可打开浏览器的调试工具。

#### 1、动态修改元素样式类名
增删类名在条件逻辑中比较常见，通过devtools可以直接动态修改/激活/禁用类名
1. 在DOM树中选中元素
2. 点击激活`.cls`
3. 可通过选择框动态修改是否使用该类名
4. 可通过`Add new class`输入框动态添加已定义类名

![动态修改class.gif](https://img.91temaichang.com/blog/dy-modify-class.gif)

👆除了给元素修改类名，还可以动态的添加css规则：

![动态添加css](https://img.91temaichang.com/blog/dy-add-style.gif)

#### 2、强制激活伪类
网页中的一些动效是基于例如`:active`、`:hover`等，当鼠标移动到控制台的时候，这些伪类就不生效，在控制台中也无法调试css样式，此时可以使用强制激活伪类
1. 选中具有伪类效果的元素
2. 点击`:hov`
3. 根据代码情况，勾选相应伪类
4. 在styles面板可动态调试伪类样式

![强制激活伪类](https://img.91temaichang.com/blog/active-hove.gif)

#### 3、计算样式定位到CSS规则【直接浏览最终生效的样式定义位置】
一个工程项目的DOM层级是比较复杂的，如果`font-size`这一样式属性，就可能存在多层覆盖，我们必须定位到最终表现生效的CSS，才能做出有效修改。
1. 在`Computed`面板中的`filter`输入框筛选样式属性名
2. 展开熟悉你个，可看到多处定义，且只有第一行是生效的
3. 鼠标hover时，左侧限时`->`，点击可以跳转到`Styles`面板中的CSS规则
4. 可在生效的CSS规则中修改样式

![修改计算样式CSS规则](https://img.91temaichang.com/blog/css-computed-modify.gif)

#### 4、颜色选择器
在调试CSS时，设置颜色相关属性的值，颜色有`HEX`、`RGBA`、`RGB`、`HSLA`的形式，这么多的颜色，我们可以通过Chrome提供的颜色选择器，动态修改颜色
1. 找到CSS中设置颜色的属性
2. 点击颜色值左侧的选择（彩色方块）

![颜色选择器](https://img.91temaichang.com/blog/css-color-modify.png)
#### 5、阴影选择器
阴影选择器用于`box-shadow`，可以直接通过选择可视化进行调整
1. 点击`box-shadow`属性右侧的*层叠偏移图标*，弹出阴影选择器
2. 通过颜色选择器面板可设置x/y轴偏移量、阴影模糊度和扩散度、内外阴影

![可视化设置box-shadow](https://img.91temaichang.com/blog/box-shadow-changer.png)

#### 6、属性值快速调整
鼠标滚轮可以实现css属性值的微调或快速调整，比如字体大小、旋转角度、宽高数值等等，鼠标滚轮不只是+-1
+ +-0.1： `Option` + 鼠标滚轮
+ +-1：滚轮前后滚动
+ +-10：`Shift` + 鼠标滚轮
+ +-100：`Command` + 鼠标滚轮，

#### 7、animation动画调试
某些元素动画效果可以通过"帧动画"、`transition`实现，开发实现过程的代码过于抽象，实际上还是得在浏览器中查看效果，Chrome开发工具提供了针对animation的调试面板。该面板可提供动画重播、暂停、预览、修改操作方法：
1. 打开控制台，键盘按`ESC`，调出Console面板
2. 点击Console面板左上角"竖三点"，弹出菜单，选择"Animations"，即可打开动画调试面板

![打开动画调试面板](https://img.91temaichang.com/blog/animation-edit.gif)

在动画面板可以看到帧动画的名称和对应的DOM节点，点击第一列的DOM节点，可以快速定位到Elements面板中DOM所在位置，同时Styles也会更新，可滚动Styles即可看到一定义的"帧动画"动画面板的作用：
+ 定位动画作用的DOM结构
+ 控制动画执行过程：播放、暂停、重播、减速动画、控制执行时间
+ 预览动画执行过程、动画时间曲线
+ 真挺记录所有动画过程

#### 8、赋值控制台变量到剪贴板
Console面板输出了很多的日志，当我们想要赋值一个打印的复杂对象时，发现直接赋值会导致数据丢失，此时只需要一个`copy()`函数，即可将变量赋值到剪贴板

![复制变量到剪贴板](https://img.91temaichang.com/blog/copy-varial.gif)

#### 9、网页可视化编辑
F12工程师，可以快速伪造网页了，在控制台(`Console`)执行：
+ `document.body.contentEditable="true"`
+ 或`document.designMode="on"`

![网页可视化编辑](https://img.91temaichang.com/blog/moni-edit.gif)

#### 10、模拟弱网环境
在`Network Tab`下，可在`Online`下拉框选择模拟弱网环境。

![设置弱网环境](https://img.91temaichang.com/blog/weak-network.png)

同时还可以添加自定义的网络环境可设置上传网速、下载网速和网络延时

![设置网络配置](https://img.91temaichang.com/blog/weak-network-setting.gif)

#### 11、XHR重放
`XML HTTP Request`会在`Network Tab`下记录，选中对应的`XHR`记录，右键可以重放网络请求。此外，如果还想在重放请求时修改请求参数，则可以复制请求包到命令行下修改后执行

