---
title: JavaScript中的浏览器学习(Http篇)
author: Zhenggl
date: 2022-02-14 08:15:04
categories:
    - [javascript, web, 浏览器]
tags:
    - javascript
    - web
    - 浏览器
    - http
cover: http请求.jpeg
---

### 前言

> 重新认识Ajax，是`Asynchronous JavaScript and XML`的缩写(异步JavaScript和XML)，用来描述一种使用现有技术集合的‘新’方法，
> 使用脚本操控Http与WEB服务器进行数据交换，而不用重新加载页面的机制。
> 包括: HTML 或 XHTML,  CSS, JavaScript, DOM, XML, XSLT, 以及最重要的 XMLHttpRequest

![CS数据交互](CS数据交互.png)

通过上述的一个C/S之间的数据交互图，可以清楚了解到客户端与服务端的一个通信机制，web浏览器提供了`XMLHttpRequest`对象来进行通信，该对象提供了操控
Http的API，比如有get、post请求方式等等。

### 一、XMLHttpRequest的使用
![XMLHttpRequest继承关系](XMLHttpRequest继承关系.png)
1. EventTarget主要提供了XMLHttpRequest所需的对网络请求的一个监听机制，方便我们可以直接使用addEventListener对网络请求结果状态进行监听
2. XMLHttpRequestEventTarget是一个描述事件处理程序的接口，你可以在一个用于处理 XMLHttpRequest 事件的对象中使用到该事件处理程序
   - onabort:当请求失败时调用该方法
   - onerror:当请求发生错误时调用该方法
   - onload:当一个 HTTP 请求正确加载出内容后返回时调用
   - onloadstart:当一个 HTTP 请求开始加载数据时调用
   - onprogress:间歇调用该方法用来获取请求过程中的信息
   - ontimeout:当超时时调用，接受 timeout 对象作为参数；只有设置了 XMLHttpRequest 对象的 timeout 属性时，才可能发生超时事件
   - onloadend:当内容加载完成，不管失败与否，都会调用该方法
#### 1.1、基础使用
> var request = new XMLHttpRequest();

一个request对象包括有4个部分：
+ http请求方法method
+ http请求地址url
+ http请求头header
+ http请求参数data

而对应的一个响应包括有3个部分：
+ 状态码，代表请求成功或失败
+ 响应请求头集合
+ 响应体，可以是文本、二进制等

✨ 一个`XMLHttpRequest`被定义出来之后，通过send来发起网络请求动作，这时的request的状态readystate的值将会发生变化，而readystate的值一般都有以下
几种状态值

| 标识符 | 值 | 含义 |
|---|---|---|
| UNSENT | 0 | open尚未调用 |
| OPENED | 1 | open已调用 |
| HEADERS_RECEIVE | 2 | 接收到头信息 |
| LOADING | 3 | 接收到响应主体 |
| DONE | 4 | 响应完成 |

```javascript
  var request = new XMLHttpRequest(); // request.readyState === 0
  request.open('get', 'url'); // request.readyState === 1
  request.onreadystatechange = function(res) {
    // request.readyState === 3 ---> request.readyState === 4
  };
  request.send(); // request.readyState === 2
```
#### 1.2、编码请求体
一般地，服务端向定义的其接收端的参数的方式，对应的有以下几种：
+ 表单类型：即参数是以key+value的方式来传递，可以是get也可以是post请求；
+ JSON类型：即参数以JSON字符串的方式；
+ XML
+ 文件上传
+ multipart/form-data请求，即参数以文件+字符串的方式来一起传递
  - 一般使用浏览器提供的`FormData`对象，通过对*new*出来的`FormData`对象的api来*append*追加内容的

### 二、借助于script标签发起http请求：JSONP
script标签，可以作为一种Ajax传输机制，通过设置script的src属性，来获取服务端的数据，它不受浏览器同源的限制，可以从服务器请求数据，包含JSON编码的响应体会自动解码，
这就是JSONP(JSON with Padding)，将请求返回的数据直接赋值给到`document`进行内容的直接渲染
比如有以下的一个响应体：
> handleResponse([2, 3, {"bunk": "self info"}]);

对应的一般会在客户端代码中提供对应的方法操作：
```javascript
  function handleResponse(jsonArray){
	if(jsonArray){
		var ul = document.createElement('ul');
		jsonArray.forEach(item => {
			var li = document.createElement('li');
			li.innerText = item;
			ul.appendChild(li);
		});
		document.appendChild(ul);
	}
  }
```
于此对应的HTML内容将会引用以下这样子的一个标签：
```html
  <script src="http://xxx/function=handleResponse"></script>
```
当访问上述的html的时候，在加载到script中的内容返回到JSONP的内容的时候，将自动调用handleResponse方法，从而来实现数据的跨域请求加载操作！

对应的浏览器客户端于服务器端之间的交互如下：
![JSONP交互流程](JSONP交互流程.png)

### 三、服务端推送：Comet技术
一般地，我们如果想要在浏览器中订阅或者被动接收服务器端发送的请求，除了主动轮询的机制，浏览器还提供了一种Comet技术，而该技术提现到对应的浏览器API则是`EventSource`，`EventSource`是服务器推送的
一个网络事件接口，一个EventSource实例会对HTTP服务开启一个持久化的连接，以*text/event-stream*格式发送事件，会一直保持开启知道被要求关闭。
与WebSockets不同的是，EventTarget是单向的从服务端推送至客户端的
```javascript
  var eventSource = new EventSource('url');
  eventSource.onmessage = function(msg) {
    console.info(msg.data);
  };
  
```
上述的onmessage回调方法中的msg对象，为一MessageEvent对象API，包含有以下的属性
+ data：返回的String\Blob\ArrayBuffer，包含来自发送者的数据；
+ origin：返回一个表示消息发送者来源的字符串
+ lastEventId：当前事件唯一id
+ source：代表消息发送者
+ ports：对象数组，代表消息正通过特定通道发送的相关端口
