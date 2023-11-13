---
title: WebWorker的学习与使用
author: Zhenggl
date: 2021-12-08 16:14:31
categories:
- [javascript]
tags:
- javascript
cover: cover-web-worker.png
---
### 前言
> JavaScript是单线程的，如果需要进行多线程的话，一般是不可能的，因为从头到尾只有一个线程在执行，对于多线程则需要协同配合，分享可执行时间，线程A执行一段时间，
> 然后线程B执行一段时间，能否就是新开一个线程，可以从头到尾来执行，而不会影响到原本的JS主线程呢？
### 引入
👉在宿主浏览器中提供了以下这样子的一套机制：浏览器提供多个不同的js引擎实例，每个实例都各自运行在自己的所属线程中，来执行不同的程序，程序中每一个这样子的独立多线程部分被称为是一个WebWorker，  
每个WebWorker都可以与js主线程进行通讯。
### 现状
WebWorker目前的一个兼容性：
![worker的浏览器兼容率](can-i-use-worker.png)
### worker使用
🧠这个有点想像安卓开发中的UI主线程与非UI线程之间，非UI线程主要做一些耗时长、繁琐的逻辑运算，然后通过消息通讯机制的方式进行通讯。

#### 1、 以下是Js主线程与WebWorker之间的一个通讯过程：
![worker的浏览器兼容率](worker-demo.png)
从上面我们可以看出js主线程与webworker之间的通讯方式是对称的。
worker与主线程之间的数据传递通过这样的消息机制来进行：双方都使用`postMessage`方法发送各自的消息，使用onmessage事件处理函数来响应消息(消息被包含在Message的事件的data属性中)，⚠️这个过程中的数据并不是被共享而是被复制！

附带上关于JS主线程与Worker线程之间的一个通讯代码：
![worker的浏览器兼容率](message-between-js-worker.png)
⚠️ 专用的Worker与创建Worker的程序之间是一对一的关系，也就是说一个页面中可以创建出多个worker。

➡️ 如果worker发生错误的话，worker会触发主线程的`error`事件，worker内部也可以监听`error`事件
```javascript
  worker.addEventListener('error', function (event){
  	/**
  	* event.lineno：代表错误的js行数
  	* event.filename：代表错误的js文件名
  	* event.message：代表错误的消息
  	* */
  	console.log(
  		`ERROR: Line ${event.lineno} , in ${event.filename}, : ${event.message}` 
  	);
  });
```

#### 2、worker的相关api
![worker的相关api](the-api-between-worker-js.png)
🤔在实际的开发场景过程中，我们更多的是同时打开了多个浏览器的选项卡，然后在每个选项卡中与worker发生通讯，这个时候，我们更倾向于是与同一个worker来进行通信，比如worker在处理完成后，将结果通过`postMessage`的方式进行
回传，假如这个时候还是使用的专有worker的话，那么就会出现页面的对同个资源的污染，因此我们需要一种能够让多个页面同时共享同一个worker的。

### 共享worker
一个共享的worker可以被多个脚本使用--即使这些脚本正在被不同的window、iframe或者worker访问，这里有一个先决条件：同时引用这个worker的js必须是同源。
#### 1、生成一共享worker
```javascript
  var shareWorker = new SharedWorker('xxx.js');
```
上述这里使用的`ShareWorker`的方式来创建一个共享worker，与专有的worker的区别是，它是通过worker的端口port属性对象来进行通信的，且在开始传递之前，端口连接必须是被显示的打开，这里使用的start()方法
#### 2、共享worker的使用
##### 2.1、宿主端对shareWorker的使用
```javascript
  // 宿主端初始化worker
  shareWorker.port.start();
  // 宿主端设置的消息通知的回调
  shareWorker.port.addEventListener('message', function (ev) {  });
  // 宿主端发送消息
  shareWorker.port.postMessage('some things message');
```
##### 2.2、worker端的使用
```javascript
  addEventListener('connect', function(evt){
  	var port = evt.ports[0];
  	// 初始化端口
  	port.start();
  	// 针对端口进行监听
  	port.addEventListener('message', function (evt){});
  	// 发送消息给宿主端
  	post.postMessage('...');
  	
  });
```
### worker能够达到的高度
#### 1、worker的限制
![worker的限制](the-limit-of-worker.png)
#### 2、worker能访问到的资源
![worker能访问到的资源](the-resources-for-worker.png)
### worker结合目前vue实战思路
由于目前大部分项目采用的vue全家桶开发的项目，因此这边直接介绍关于在vue中使用worker
#### 1、下载依赖
在vue项目中一般使用的[worker-loader](https://www.npmjs.com/package/worker-loader)

安装`worker-loader`
```shell script
  npm install -D worker-loader
```
vue.config.js中的配置
```javascript
  module.exports = {
	configureWebpack: config => {
    	config.module.rules.push({
      	test: /\.worker.js$/,
      	use: {
        	loader: 'worker-loader',
                // 允许将内联的 web worker 作为 BLOB
                options: {inline: 'no-fallback' } 
      	  }
      	})
	},
	parallel: false // 打包报错的配置
  }
```
⚠️这样子配置了之后，只有是以*.worker.js结尾的文件才有效
#### 2、项目示例
```vue
  <script>
    import Worker from 'xxx.worker.js';
    export default {
      mounted(){
        this.worker = new Worker();
        this.worker.postMessage({});
        this.worker.onmessage = evt => {
          console.info(evt.data);
        };
      },
      beforeDestroy(){
        this.worker && this.worker.terminate();
      }
    }
  </script>
```
#### 3、进阶用法
一般的，我们不想在程序的每一个地方，都去写上面这个Worker，并设置监听，我想要的是在统一的一个地方进行监听处理，然后进行该动作的执行，因此，我们可以针对该想法💡进行一个设计：
1. 将worker放至在插件或者是main.js应用程序入口处来导入以及示例化，监听，也就是将上述的代码，由vue文件迁移到单独的work-opt.js文件中，并对外暴露对应的方法，用于注册、监听、发送消息操作；
2. 既然需要在每个vue的地方获取其他任何一处js来进行与worker进行通信，这里我们可以是将发送消息动作，挂载在`vue实例`中，通过this.$postMessage(...)的方式，作为在任意一处地方对worker进行发送消息的动作；
3. 在多个vue文件中需要响应worker发送过来的消息，这里我们可以是通过设计统一的一个数据通讯接口，按照以下的格式进行的设计：
```json
  {
    "method": "调用的方法名",
    "params": "传递的参数"
  }
```
然后配合`vuex`，在统一的`onMessage`回调方法被调用的时候通过method方法名，直接发起对`vuex`中的`mutation`进行调用，然后再由`getters`，动态计算到相关的捆绑了`getters`的计算属性，做到实时更新的目的。
![worker与vue全家桶的实战](work-use-in-vue.png)

------
### 参考链接
- [Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
