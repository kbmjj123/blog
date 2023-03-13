---
title: 你不知道的Chrome DevTools的骚操作(-)
author: Zhenggl
date: 2021-04-28 11:18:42
categories:
    - [工具插件, 开发工具]
tags:
    - 调试
    - 工具
cover_picture: the-use-of-chrome-tools.png
---
### 引言
前端设备参差不齐、环境复杂，因此给前端的研发童鞋制造了许多的BUG，为了快速解决BUG，灵活运营调试工具就显得特别的重要了，因此这边整理了关于`Chrome`浏览器的调试方法，在Mac下，使用F12或者右键"检查"即可打开浏览器的调试工具。

#### 1、动态修改元素样式类名
增删类名在条件逻辑中比较常见，通过devtools可以直接动态修改/激活/禁用类名
1. 在DOM树中选中元素
2. 点击激活`.cls`
3. 可通过选择框动态修改是否使用该类名
4. 可通过`Add new class`输入框动态添加已定义类名

![动态修改class.gif](dy-modify-class.gif)

👆除了给元素修改类名，还可以动态的添加css规则：

![动态添加css](dy-add-style.gif)

#### 2、强制激活伪类
网页中的一些动效是基于例如`:active`、`:hover`等，当鼠标移动到控制台的时候，这些伪类就不生效，在控制台中也无法调试css样式，此时可以使用强制激活伪类
1. 选中具有伪类效果的元素
2. 点击`:hov`
3. 根据代码情况，勾选相应伪类
4. 在styles面板可动态调试伪类样式

![强制激活伪类](active-hove.gif)

#### 3、计算样式定位到CSS规则【直接浏览最终生效的样式定义位置】
一个工程项目的DOM层级是比较复杂的，如果`font-size`这一样式属性，就可能存在多层覆盖，我们必须定位到最终表现生效的CSS，才能做出有效修改。
1. 在`Computed`面板中的`filter`输入框筛选样式属性名
2. 展开熟悉你个，可看到多处定义，且只有第一行是生效的
3. 鼠标hover时，左侧限时`->`，点击可以跳转到`Styles`面板中的CSS规则
4. 可在生效的CSS规则中修改样式

![修改计算样式CSS规则](css-computed-modify.gif)

#### 4、颜色选择器
在调试CSS时，设置颜色相关属性的值，颜色有`HEX`、`RGBA`、`RGB`、`HSLA`的形式，这么多的颜色，我们可以通过Chrome提供的颜色选择器，动态修改颜色
1. 找到CSS中设置颜色的属性
2. 点击颜色值左侧的选择（彩色方块）

![颜色选择器](css-color-modify.png)
#### 5、阴影选择器
阴影选择器用于`box-shadow`，可以直接通过选择可视化进行调整
1. 点击`box-shadow`属性右侧的*层叠偏移图标*，弹出阴影选择器
2. 通过颜色选择器面板可设置x/y轴偏移量、阴影模糊度和扩散度、内外阴影

![可视化设置box-shadow](box-shadow-changer.png)

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

![打开动画调试面板](animation-edit.gif)

在动画面板可以看到帧动画的名称和对应的DOM节点，点击第一列的DOM节点，可以快速定位到Elements面板中DOM所在位置，同时Styles也会更新，可滚动Styles即可看到一定义的"帧动画"动画面板的作用：
+ 定位动画作用的DOM结构
+ 控制动画执行过程：播放、暂停、重播、减速动画、控制执行时间
+ 预览动画执行过程、动画时间曲线
+ 真挺记录所有动画过程

#### 8、赋值控制台变量到剪贴板
Console面板输出了很多的日志，当我们想要赋值一个打印的复杂对象时，发现直接赋值会导致数据丢失，此时只需要一个`copy()`函数，即可将变量赋值到剪贴板

![复制变量到剪贴板](copy-varial.gif)

#### 9、网页可视化编辑
F12工程师，可以快速伪造网页了，在控制台(`Console`)执行：
+ `document.body.contentEditable="true"`
+ 或`document.designMode="on"`

![网页可视化编辑](moni-edit.gif)

#### 10、模拟弱网环境
在`Network Tab`下，可在`Online`下拉框选择模拟弱网环境。

![设置弱网环境](weak-network.png)

同时还可以添加自定义的网络环境可设置上传网速、下载网速和网络延时

![设置网络配置](weak-network-setting.gif)

#### 11、XHR重放
`XML HTTP Request`会在`Network Tab`下记录，选中对应的`XHR`记录，右键可以重放网络请求。此外，如果还想在重放请求时修改请求参数，则可以复制请求包到命令行下修改后执行

![复制http请求的curl](http_request_copy_curl.png)

针对XHR请求，一般业务场景下返回的数据报文都是json数据，因此还可以右键弹出菜单中选择复制response

![复制http返回的response](http_copy_response.png)

#### 12、不一样的Console
在浏览器控制台中打印原始的字符串内容，并且根据不同的"等级"，而文字的颜色有所不同。

![不同等级、不同颜色的console](different_console_info.png)

#### 13、表格形式展示JSON数据
`console.table()`更加直观展示`JSON`格式数据

![表格展示JSON数据](json_table_showing.png)

#### 14、截图
网页截图，一般情况下，我们都是使用第三方工具，其实Chrome已经提供了截图功能，其使用方法如下：

![输入命令使用截图](chrome_capture.png)

+ `Capture area screenshot`
  自定义选中截图区域，和常用截图工具类似
+ `Capture full size screenshot`
  截图HTML完整渲染图
+ `Capture node screenshot`
  截取某个DOM节点的渲染图，使用前得在`Elements Tab`下选择`DOM`节点
+ `Capture screenshot`
  截取浏览器视窗所见屏幕

#### 15、Performance
性能监控，在调试某个web网页，想要查看从HTML渲染到屏幕的过程或运行时用户交互时的渲染、重绘、重拍、内存占用、页面变化过程，那么就可以在`Performance Tab`下，点击红色小圆点即可录制页面的完整变化过程

![web performance](web_performance.png)

+ 截图
+ 内存占用，如果要更加专注的了解内存的情况，可在Memory Tab下录制查看，其右侧的"垃圾桶"按钮是主动进行垃圾回收

![垃圾回收](cabier_recycle.png)

+ js调用栈，可定位到对应的js文件在source中预览

![js调用栈](js_envoke_stack.png)

通过该面板，可更加直观地看到与脚本代码执行地表现关系，方便定位在渲染中出现地显示问题。

#### 16、右侧调试器
##### 16.1 Watch
> 变量监控，对加入监听列表地变量进行监听，在该面板的右侧有"添加"和"刷新"变量列表的按钮
##### 16.2 Call Stack
函数调用栈，断点执行到当前函数的调用栈，根据调用栈可以非常方便检索到项目何处主动"递进"调用了该函数，在解决编辑器做分页异常时通过调用栈以及源码面板中实时展示的变量，及时地定位到了产生问题地原因。

![Call Stack](call_stack.png)
##### 16.3 Scope
作用域，当前断点所在函数所有属性的值。Scope会显示三种类型的值：Local、Closure和Global。

##### 16.4 BreakPoints
展示断点列表，将每个断点所在文件/行数/该行简略内容展示，勾选/取消勾选断点列表中的选择框，可激活/禁用断点

##### 16.5 XHR Breakpoints
调试XHR，输入XHR的URL中的关键词，即可对URL中含有关键词的XHR进行拦截

##### 16.5 DOM Breakpoints
DOM断点，在`Elements`面板中右键DOM树中的节点，可以设置条件断点

![dom breakpoints](dom_breakpoints.png)

+ **subtree modifications：** 子节点变化
+ **attribute modifications：** 当前节点属性修改
+ **node remove：** 当前节点被移除

##### 16.6 Global Breakpoints
全局监听，在这里可以看到全局有哪些时间监听被注册绑定了什么函数，还可以移除(`Remove`)对应的全局事件监听

![global breakpoints](global_breakpoints.png)

##### 16.7 Event Listener Breakpoints
事件监听断点，打开这个列表，在触发该事件时进入断点，调试器会停留在触发事件代码行。展示事件列表，选择要监听的事件，勾选即可

![event listener breakpoints](event_listener_breakpoints.png)

#### 17、左侧导航栏
##### 17.1 Page
整个`Source Tab`，顾名思义就是源码面板，默认选择"Page"，在这里可以看到以域名为列表的静态资源文件目录树，点击文件在主视图可以预览静态文件

![page](source_page.png)

##### 17.2 Snippets
代码片段，开发者自己写一段调试代码的代码片段，比如解析`json`数据等工具函数，在代码片段中的代码可以访问当前叶脉呢中的变量和函数，不会因刷新而丢失。
+ 右键即可`run`
+ 不需要的时候可以右键`remove`
![Snippets](snipptes.png)

#### 18、主视图区域
即预览静态资源的区域，类似于编辑器，顶部可以切换已打开的脚本/资源文件。预览是最基本的功能，主视图/面板还有其他重要功能。断点的类型有三种：

![main breakpoints](main_breakpoints.png)

##### 18.1 普通断点
点击代码行序号直接添加断点，效果类似于在代码中手动加入`debugger`

##### 18.2 条件断点
与此同时可修改当前断点为条件断点，需要添加条件代码片段用于判断当前断点是否需要中断

![条件断点](condition_breakpoints.png)

如上图，添加了条件断点，相当于修改了源代码，主视图区域的背景色会变成浅黄色，表示`已编辑`

##### 18.3 黑盒script
项目中例如引用了`jquery.min.js`之类的库文件，我们调试的时候，并不需要关心，那么可以将此类脚本文件右键选择添加到`黑子脚本`中，那么在`debug`单步调试时，就不会进入到此类库文件中，减少了调试步骤

![黑盒script](black_boax.png)

#### 19 Coverage
代码使用率统计，支持运行时录制统计，在例如我们引入了`jquery`但是只用了一个`hide()`方法，那么对于`jquery`的代码使用率是非常低的

![统计js代码使用率](coverage-js.png)

#### 20 网页性能优化
监控牙面重绘、重拍时变化的区域进行高亮处理，还可以查看帧率相关信息，用于网页性能优化
##### 20.1 Rendering
在`more tools`菜单中可选择`Rendering`工具

![Rendering](rendering.png)

##### 20.2 Layers
当一个页面足够复杂的时候，在`css`的加持下，可能会出现一些渲染性能问题，这时候，可以通过`Layers`工具显式地查看`DOM`层关系。
在`more tools`菜单中选择`Layers`工具

![Layers](layers.png)

#### 21、移动端H5调试
`Chrome`浏览器支持移动端`Android`移动设备的调试，`Safari`支持IOS移动设备的调试，`Chrome`调试`Android`移动设备的步骤如下：

1. 数据链连接`PC`与`Android`设备，`Android`设备开启开发者模式允许调试模式
2. `Chrome`浏览器地址栏访问：`chrome://inspect`，可进入调试网页

![chrome浏览器调试android设备](chrome_debug_android.png)

3. 支持设备、网页`App`、页面、`Chrome`插件、`Works`和其他类型的调试
4. 点击`inspect`就可以如正常调试网页一般来调试移动端里面的`webview`中运行的`web`程序

![chrome inspect 页面内容](chrome_inspect_android.png)
