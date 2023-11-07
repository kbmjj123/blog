---
title: 每天一设计模式-适配器模式
description: 每天一设计模式-适配器模式
author: Zhenggl
date: 2022-03-21 07:55:00
categories:
    - [javascript, 设计模式]
tags:
    - javascript
    - 设计模式
    - 结构性模式
cover: 组合模式封面.jpeg
---

### 前言
> 组合模式，又叫部分-整体模式，将对象组合成树形结构一表示"部分整体"的层次结构。
> 该模式创建了一个包含自己对象的类，该类提供了修改相同对象组的方式，使得用户对单个对象和组合对象的使用具有一致性。

意图：将对象组合成树形结构以表示"部分-整体"的层次结构，使得用户对单个对象和组合对象的使用具有一致性；

主要解决：它在树形结构的问题中，模糊了简单元素和复杂元素的概念，客户程序可以像处理简单元素一样来处理复杂元素，从而使得客户程序与复杂元素的内部结构解耦；

何时使用：
1. 想表示对象的部分-整体层次结构(树形结构);
2. 希望用户忽略组合对象与单个对象的不同，用户将统一地使用组合结构中的所有对象

如何实现：树枝和叶子统一接口，树枝内部组合该接口

关键代码：树枝内部组合该接口，并且含有内部树形List，里面放Component

优点：
1. 高层模块调用简单；
2. 节点自由增加

缺点：在使用组合模式时，其叶子和树枝的声明都是实现类，而不是接口，违反了依赖倒置原则

使用场景：部分、整体场景，如树形菜单，文件、文件夹的管理。

### 代码实现
> 想要实现一个Form表单的表单元素自由组合创建

```javascript
function Base(){
  this.children = [];
  this.element = null;
}
Base.prototype = {
  init: function(){throw new Error('不能直接调用')},
  add: function(){throw new Error('不能直接调用')},
  getElement: function(){throw new Error('不能直接调用')}
};
function inheritObject(o){
  function F(){}
  F.prototype = o;
  return new F();
}
function inheritPrototype(SubClass, SupClass){
  var p = inheritObject(SupClass.prototype);
  p.constructor = SubClass;
  SubClass.prototype = p;
}
// ------- 以下是容器类的定义
function FormItem(id, parent){
  Base.call(this);// 使得FormItem拥有了children + element属性
  this.id = id;
  this.parent = parent;
  this.init();	//调用容器自身的init方法
}
inheritPrototype(FormItem, Base);
FormItem.prototype.init = function(){
  this.element = document.createElement('form');
  this.element.id = this.id;
  this.element.className = 'form-container';
}
FormItem.prototype.add = function(child){
  this.children.push(child);
  this.element.appendChild(child.getElement());
  return this;
}
FormItem.prototype.getElement = function(){
  return this.element;
}
FormItem.prototype.show = function(){
  this.parent.appendChild(this.element);
}
// ------一下是每一行子项的定义
function FieldsetItem(id, title){
  Base.call(this);
  this.id = id;
  this.title = title;
  this.init();
}
inheritPrototype(FieldsetItem, Base);
FieldsetItem.prototype.init = function(){
  this.element = document.createElement('fieldset');
  this.element.className = 'fieldset-container';
  var legend = document.createElement('legend');
  legend.innerText = this.title;
  this.element.appendChild(legend);
}
FieldsetItem.prototype.getElement = function(){
  return this.element;
}
FieldsetItem.prototype.add = function(child){
  this.children.push(child);
  this.element.appendChild(child.getElement());
  return this;
}
// ------一下是每一行组合的定义
function Group(id){
  Base.call(this);
  this.id = id;
  this.init();
}
inheritPrototype(Group, Base);
Group.prototype.init = function(){
  this.element = document.createElement('form-item');
  this.element.className = 'group-container';
}
Group.prototype.add = function(child){
  this.children.push(child);
  this.element.appendChild(child.getElement());
  return this;
}
Group.prototype.getElement = function(){
  return this.element;
}
// ------一下是每一个表单元素Label的定义
function LabelItem(id, name){
  Base.call(this);
  this.id = id;
  this.name = name;
  this.init();
}
inheritPrototype(LabelItem, Base);
LabelItem.prototype.init = function(){
  this.element = document.createElement('label');
  this.element.className = 'label';
  this.element.innerText = this.name;
}
LabelItem.prototype.add = function(){};
LabelItem.prototype.getElement = function(){
  return this.element;
}
// ------一下是每一个表单元素Input的定义
function InputItem(id){
  Base.call(this);
  this.id = id;
  this.init();
}
inheritPrototype(InputItem, Base);
InputItem.prototype.init = function(){
  this.element = document.createElement('input');
  this.element.className = 'input';
}
InputItem.prototype.add = function(){}
InputItem.prototype.getElement = function(){
  return this.element;
}
// ------一下是每一个表单元素Span的定义
function SpanItem(id, name){
  Base.call(this);
  this.id = id;
  this.name = name;
  this.init();
}
inheritPrototype(SpanItem, Base);
SpanItem.prototype.init = function(){
  this.element = document.createElement('span');
  this.element.className = 'span';
  this.element.innerText = this.name;
}
SpanItem.prototype.add = function(){}
SpanItem.prototype.getElement = function(){
  return this.element;
}
// 以下是对应的具体实现代码
var container = document.getElementById('container');
var form = new FormItem('myFormItem', container);
form.add(
	new FieldsetItem('account', '账号').add(
    	new Group('firstRow').add(
        	new LabelItem('account-label', '用户名：')
        ).add(
        	new InputItem('account-input')
        ).add(
        	new SpanItem('account-tip', '4到6位数字或字母')
        )
    ).add(
    	new Group('secondRow').add(
        	new LabelItem('pwd-label', '密码：')
        ).add(
        	new InputItem('pwd-input')
        ).add(
        	new SpanItem('pwd-tip', '6到12位数字或者密码')
        )
    )
).add(
	new FieldsetItem('info', '信息')
).show();
```

![组合模式输出结果](组合模式输出结果.png)


### 🤔模式思考
通过对公共动作的统一操作，提供一公共的接口，针对接口编程，来实现类对象的一个统一口径，上述的方式个人感觉还是有点考虑欠佳的，有点是为了实现这种设计模式而将代码进行了对应的这种设计模式的改造。

如果目前尚未有像`vue`、`react`等这种将组件拆分为多个组件元素的这种框架的话，就单纯的仅有jquery框架的话，或者就是1⃣️纯原生的方式来搭建页面的话，通过不断的操作DOM，来进行页面的组装与使用，
那么对于html节点的拼装与使用，将会是灾难性的操作，由于html节点都是一个个零散的颗粒度很细的元素，如果是单纯的直接怼页面标签，并做对应的业务开发，前期是可以满足到这个需求，但是一旦此项目进入
长期维护的状态的话，对元素的不断调整改造，改造成本将会越来越高，其实就是一标准的面向过程编程，而不是我们所倡导的面向对象编程了。

上述通过将html节点对象进行一个业务与界面的逻辑封装，集成到一统一的自定义节点对象中来维护，对外提供统一的访问/操作API，可以真正实现面向对象开发。

这有点与Android中的控件一样，通过将视图、数据、逻辑进行拆分，并配合起来，可以真正做到将零散的html节点，转换为面向对象编程的模式来管理。
