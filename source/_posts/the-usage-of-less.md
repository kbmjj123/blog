---
title: less的使用
description: less的使用, less如何使用, 肝了less
author: Zhenggl
date: 2023-03-30 21:39:27
categories:
  - [前端, css, les]
tags:
  - 前端
  - css
  - less
cover_picture: less封面.jpg
---

### 前言
> 像JS般来思考`less`，即可 :u6709: 一定的深刻认识！！！ :point_down: 是对应的官方文档
{% link "less官方文档" "https://less.bootcss.com/" true less官方文档 %}
:stars: 从官方的文档学习整理了 :point_down: 
[less组成](less.png)

:alien: 这里仅针对常见的几个模块(场景)进行详细地介绍！！

### 变量
> *js中采用的let/const/var等关键词来定义一个变量*
> 而在`less`中，则采用`@`关键词来定义一个变量！
```less
  @color: blue;
  .a{
    color: @color;
  }
  p{
    background-color: @color;
  }
```
![less变量的简单使用](less变量的简单使用.png)

#### 变量的其他特殊用法

##### 变量插值
> *js中采用模版字符串的方式，来实现字符串与变量/常量的拼接*
> 而在`less`中，则采用`@{...}`的方式，来实现字符串规则的拼接，可以用在`选择器名称`、`属性名称`、`URL`、和`@import`语句！
:point_right: **变量作为选择器名称插槽**
```less
@btn: btn;
.@{btn}-blue{
	background-color: blue;
}
.@{btn}-red{
	background-color: red;
}
```
![插槽变量的使用](插槽变量的使用.png)

:point_right: **变量作为属性名称**
```less
  @color: color;
  @bgColor: background-color;
  p{
    @{color}: yellow;
    @{bgColor}: white;
  }
```
![变量作为属性的使用](变量作为属性的使用.png)

:point_right: **变量作为URL拼接**
```less
  @image: "../../image";
  p{
    background-image: url("@{image}/xxx.png");
  }
```
![变量作为URL拼接使用](变量作为URL拼接使用.png)

:point_right: **变量作为@import语句使用**
```less
  @library: "library.less"
  @import "@{library}";
```
![变量作为import来使用](变量作为import来使用.png)

##### 变量的变量
> :confused: 这听着有点绕，其实就是用一个变量引用另外一个变量，仅此而已
```less
  @bgColor: "yellow";
  @yellowBg: @bgColor;
  p{
    background-color: @@yellowBg;
  }
```
![变量的变量](变量的变量.png)

##### 类似于js中的var变量提升使用
> 类似于`js`中的所使用的`var`变量提示，直接使用而后定义！
```less
  .lazy-var{
    color: @primary;
  }
  @primary: @blue;
  @blue: blue;
```
![变量的懒加载](变量的懒加载.png)

##### 直接捞其他属性直接使用
> 在less中，可以在已经定义的属性对象中，捞出其中的css属性作为变量来直接使用!
```less
  p{
    color: blue;
    border: 1px solid $color;
  }
```
![直接捞出属性作为变量使用](直接捞出属性作为变量使用.png)

### 混入(mixin)
> 关于混入，意思是通过预先定义的一个样式“块对象”(这里我们称之为：创建一个mixin)，将这个“块对象”作为一个“js对象”来使用，我们可以像`js`的`函数变量`来思考它，主要 :u6709: :point_down: 几个特性！！
```less
  .a, #b{
    color: white;
    backgound-color: red;
  }
  // 上面这里我们定义了一个样式“块对象”，可以用id选择器，也可以用类选择器来表示，然后通过对应的`样式选择器()`来混入引用
  .mixin-class {
    .a();
  }
  .mixin-id {
    #b();
  }
```
![混入的基本使用](混入的基本使用.png)

:warning: `mixin`混入在定义的时候，可以带括号，也可以选择不带括号，**这里不带括号的`mixin`则代表将不生成对应的mixin代码块**！！

#### 混入的几种常见用法

##### 包含选择器的整块混入
> 混入可以不仅仅可以包含属性，还可以包含选择器
```less
  .my-hover-mixin() {
    &:hover {
      border: 1px solid red;
    }
    .parent{
        color: green;
    }
  }
  button {
    .my-hover-mixin();
  }
```
![整块使用的混入](整块使用的混入.png)

##### 命名空间
> 如果想在更复杂的选择器中混合属性，你可以堆叠多个id或类!
```less
  #id{
    .m1{
      background: red;
    }
    .m2(){
      color: blue;
    }
  }
  .a{
    #id.m1();
    #id.m2();
  }
```
![堆叠的命名空间](堆叠的命名空间.png)

##### 提高权重的全量important
> 在 `mixin` 调用之后使用`!important`关键字将其继承的所有属性标记为`!important`!
```less
  .foo(){
    color: red;
    background-color: blue;
  }
  .a{
    .foo() !important;
  }
```
![提高属性权重的混入](提高属性权重的混入.png)

##### 传递参数的混入
> `mixin` 也可以接受参数，这些参数是在混合时传递给选择器块的变量
```less
  .foo(@color){
    color: @color;
    border: 1px solid @color;
  }
  p{
    .foo(yellow);
  }
```
![接收参数的混入](接收参数的混入.png)

:star: 这里的参数还可以像`es6.0`中的函数一样，提供默认的值，当没有传递参数时，采用默认的值！
```less
  .foo(@color: blue){
    color: @color;
    border: 1px solid @color;
  }
  p{
    .foo(yellow);
  }
  div{
      .foo();
  }
```
![默认参数的混入](默认参数的混入.png)

##### 像java一样可重载的函数
> 通过定义多个具有相同名称和不同参数个数的混入，可使用重叠使用的目的！
```less
  .mixin(@color) {
    color-1: @color;
  }
  .mixin(@color, @padding: 2) {
    color-2: @color;
    padding-2: @padding;
  }
  .mixin(@color, @padding, @margin: 2) {
    color-3: @color;
    padding-3: @padding;
    margin: @margin @margin @margin @margin;
  }
  .some .selector div {
    .mixin(#008000);
  }
```
![重叠调用的混入](重叠调用的混入.png)

:warning: 上面这里的第三个混入没有被执行到，是因为其中的`@padding`没有默认值，没有被使用，因此整个混入没有执行到，假如我们追加多一个同名混入，且其中的参数都覆盖到的话，那么也是可以被正常调用的！
```less
  // 我是追加的混入
  .mixin(@color){
    color-4: @color;
    border: 1px solid @color;
  }
```
![追加覆盖调用的混入](追加覆盖调用的混入.png)

##### 命名参数的直接混入
> `mixin` 引用可以通过名称而不是位置来提供参数值，任何参数都可以通过其名称来引用，并且它们不必按任何特殊顺序排列!
> **这有点像将`js`函数中的参数给集中到一个对象中来使用的方式！**
```less
  .mixin(@color: black; @margin: 10px; @padding: 20px) {
    color: @color;
    margin: @margin;
    padding: @padding;
  }
  .class1 {
    .mixin(@margin: 20px; @color: #33acfe);
  }
  .class2 {
    .mixin(#efca44; @padding: 40px);
  }
```
![参数map命名调用](参数map命名调用.png)

##### 混入中的参数统一指代`@arguments`
> `@arguments`在 `mixin` 中有特殊含义，它包含调用 `mixin` 时传递的所有参数，如果我们不想处理单个参数，这很有用！！
> **这就像是js函数中的`argument`变量一样！**
```less
  .box-shadow(@x: 0, @y: 0, @blur: 1px, @color: #000) {
    -webkit-box-shadow: @arguments;
      -moz-box-shadow: @arguments;
            box-shadow: @arguments;
  }
  .big-block {
    .box-shadow(2px, 5px);
  }
```
![混入参数的统一变量指代](混入参数的统一变量指代.png)

##### 可变参数的混入以及剩余参数的指代`@rest`
> `...`可以让我们的`mixin`接收可变化的参数，`@rest`可让我们使用接下来剩余的参数
> **这就像是js函数中的可变参数以及剩余参数变量的使用一样！**
```less
  // 仅匹配0个参数
  .mixin(){
      color-0: blue;
  }
  // 可匹配0～N个参数
  .mixin(...){
      color-all: blue;
  }
  // 可匹配0～1个参数
  .mixin(@a: 1px){
      color-1: yellow;
  }
  // 可匹配0～N个参数
  .mixin(@a: 1px, ...){
      color-all-1: green;
  }
  // 可匹配1～N个参数
  .mixin(@a, ...){
      color-1: orange;
  }
  .p{
      .mixin();
  }
```
![匹配执行结果](匹配执行结果.png)

##### 混入的参数是另外一个变量(模式匹配)
> 有时，我们可能希望根据传递给它的参数更改混入的行为！
> **也就是参数是可变的另外一个参数**
```less
  .mixin(dark, @color) {
    color: darken(@color, 10%);
  }
  .mixin(light, @color) {
    color: lighten(@color, 10%);
  }
  .mixin(@_, @color) {
    display: block;
  }
```
![动态的混入](动态的混入.png)

##### 仅取混入的某个属性(混入属性访问)
> 可以使用属性/变量访问器从已评估的混入规则中选择一个值!
> **也就是将混入的map样式对象中取其中的一个值来使用**
```less
  .average(@x, @y) {
    @result: ((@x + @y) / 2);
  }

  div {
    // call a mixin and look up its "@result" value
    padding: .average(16px, 50px)[@result];
  }
```
![混入的属性访问](混入的属性访问.png)

##### 受保护的混入(守卫)
> 当我们想匹配表达式时，守卫很有用，而不是简单的值或元数，通过受保护的混合而不是if/else语句来实现条件执行
```less
  .mixin(@a) when (lightness(@a) >= 50%) {
    background-color: black;
  }
  .mixin(@a) when (lightness(@a) < 50%) {
    background-color: white;
  }
  .mixin(@a) {
    color: @a;
  }
```
![受保护的混入](受保护的混入.png)

:star: 通过使用一个关键`when`，对变量`@a`进行了一个守卫拦截，不匹配的将不采用对应的混入(之前的基本上是无条件混入的方式)！

:alien: 守卫中可用的比较运算符的完整列表是：`>, >=, =, =<, <`。此外，关键字`true`是唯一的真值

### 嵌套(父选择器)
> 运算符表示嵌套规则&的父选择器，在将修改类或伪类应用于现有选择器时最常使用!
```less
  a {
  color: blue;
  &:hover {
    color: green;
  }
}
```
![父选择器的嵌套使用](父选择器的嵌套使用.png)

:stars: 关于嵌套选择器的使用，一句话概括一下：**将`&`当作是嵌套的父选择器名称即可**

:warning: 有一个需要注意的是：当这个`&`被反过来使用的时候，代表的是将所属的嵌套父选择器反过来使用！！
```less
  .header {
    .menu {
      border-radius: 5px;
      .no-borderradius & {
        background-image: url('images/button-background.png');
      }
    }
  }
```
![逆向使用的嵌套选择器](逆向使用的嵌套选择器.png)

### CSS守卫(when与if)
> `less`中允许通过使用`when`以及`if`关键词，来实现针对某个符合条件下的

### 函数
