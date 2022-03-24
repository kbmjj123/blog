---
title: 每天一设计模式-享元模式
description: 每天一设计模式-享元模式
author: Zhenggl
date: 2022-03-24 08:15:36
categories:
    - [javascript, 设计模式]
tags:
    - javascript
    - 设计模式
    - 结构设计模式
cover_picture: 享元设计模式封面.jpeg
---

### 前言
> 享元模式主要用于减少创建对象的数量，以减少内存占用和提高性能，通过运用共享技术有效地支持大量的细粒度的对象，避免对象间拥有相同内容造成多余的开销.
> 这种模式尝试重用现有的同类对象，如果未找到匹配的对象，则创建新对象。

**意图**：运用共享技术有效地支持大量细粒度的对象；

**主要解决**：在有大量对象时，有可能会造成内存溢出，我们把其中公共的部分给抽象出来，如果有相同的业务请求，直接返回在内存中已有的对象，避免重新创建对象；

**何时使用**：
1. 系统中有大量的对象时，有可能会造成内存溢出；
2. 这些对象大量消耗内存；
3. 这些对象的状态大部分可以外部化(通过外部传递数据直接完成功能的实现)；
4. 这些对象可以按照内蕴状态分为很多组，当把外蕴对象从对象中剔除出来时，每一组对象都可以用一个对象来代替；
5. 系统不依赖于这些对象身份。

**如何使用**：用唯一标识码判断，如果在内存中有，则返回这个唯一标识码所标识的对象

**应用实例**：
1. Java中的String，如果有则直接返回，如果没有则创建一个字符串保存在字符串缓存池里面；
2. 数据库中的连接池

**注意事项**：
1. 注意划分外部状态和内部状态，否则有可能引起线程安全；
2. 这些类必须有一个工厂对象加以控制

### 代码实现
```javascript
  var BaseDialog = function(title, content){
	this.title = title || '温馨提示';
	this.content = content;
};
BaseDialog.prototype = {
	show: function(){
		console.info(this.title + "---->" + this.content);
	},
	close: function(){
		console.info("hide me!!!")
	}
};

var TipDialog = function(title, content){
	BaseDialog.call(this, title, content);
};
TipDialog.prototype = BaseDialog.prototype;
TipDialog.prototype.showMe = function(){
	this.show();
	console.info('append showMe action!');
};

var LoadingDialog = function(state){
	BaseDialog.call(this, '', '加载中，请稍后...');
	this.state = state;
};
LoadingDialog.prototype = BaseDialog.prototype;
LoadingDialog.prototype.changeState = function(newState){
	this.state = newState;
};

var DialogFactory = function(){
	var dialogMap = {};	//缓存的对话框对象存储对象
	function createDialog(type){
		var dialog;
		switch(type){
			case "tip":
				dialog = new TipDialog("温馨提示", "自定义固定提示");
			break;
			case "loading":
				dialog = new LoadingDialog("loading");
			break;
		}
		return dialog;
	}
	return {
		getDialog: function(type){
			if(dialogMap[type]){
				return dialogMap[type];
			}else{
				dialogMap[type] = createDialog(type);
				return dialogMap[type];
			}
		},
		getCurrentMap: function(){
			return dialogMap;
		}
	}
}

var factory = DialogFactory();
for(var i = 0; i < 5; i ++){
	var dialog = factory.getDialog(i % 2 === 0 ? "loading" : "tip");
	console.info(dialog);
	dialog.show();
}
console.info(factory.getCurrentMap());
```

![享元模式下的对象](享元模式下的对象.png)

### 模式实际场景思考🤔
通过享元模式，我们可以将一些公共的对象的方法和属性进行一个统一的封装，并将其通过之前所学习过的单例模式，进行一个缓存，当用户第一次使用的时候，将会进行一个初始化，通过内省的机制，
来将对象缓存对象给统一管理起来，通过这种方式，并配合工厂模式，根据不同类型来创建具有公共属性/方法的对象，并额外补充对应的操作，使得公共的信息可以通过统一的口径来创建，
同时额外的信息/操作可以通过方法接口调用的方式，来进行传递/调用！！

✨ 上面的对话框例子，我们可以将程序中出现的对话框资源进行统一的管理，达到减少不必要的额外的内存资源的损耗。
