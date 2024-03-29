---
title: js运行机制
author: Zhenggl
date: 2021-03-15 17:46:20
categories:
  - [前端, javascript]
tags:
  - javascript
  - EventLoop
cover: js运行机制封面.png
---

### 一、前言
JS是`单线程`,`单线程`,`单线程`的，为毛是单线程的，这里的单线程是指的在浏览器环境下JS执行引擎是单线程的。

单线程意味着同一时间内只能做一件事，为毛不能有多线程的，这样子可以提高效率啊。

> JS的单线程，与它的用途有关。作为浏览器脚本语言，JS的主要用户就是与用户互动，以及操作DOM。这就决定了它必须只能是单线程的，
> 否则会带来很复杂的同步问题。比如假设同时有两个线程，一个在某个DOM上添加内容，另一个在DOM上删除内容，同时操作同一个DOM，
> 那么浏览器应该以哪个为准来对应渲染页面呢？

因此，为了避免复杂性，从JS一诞生，就只能是单线程的，这个是JS语言的核心特征，将来也不会改变到。

为了利用多核CPU的计算能力，Html5提出WebWorker标准，允许JS脚本创建多个线程，但是子线程完全收主线程的控制，切worker子线程
不得操作DOM，仅能通过发送消息的方式告知主线程来操作DOM。

#### 1.1、进程与线程
> 进程和线程的主要区别在于他们是不同的操作系统资源管理方式。进程有独立的地址空间，一个进程奔溃后，在保护模式下不会对其他进程
> 产生影响，而线程只是一个进程中的不同执行路径而已，一个进程可以同时有多个不同的线程

一个程序运行，就分配了一个独立的运行的地址空间，进程分配一个或者多个不同的线程，进程是操作系统分配资源的最小单位，线程是CPU调度的最小单位。

#### 1.2、浏览器是多进程的
打开资源管理器，可以看到浏览器开了很多个进程，每一个tab页都是单独的一个进程，所以一个页面奔溃之后一般不会影响到其他页面

![浏览器是多进程](system-task.png)

浏览器包含以下几个进程：

- Browser进程：浏览器的主进程（负责协调、主控），只有一个
- 第三方插件进程：每个类型的插件对应于一个进程，仅当使用该插件时才创建
- GPU进程：最多一个，用于绘制3D等
- 浏览器渲染进程（浏览器内核）（renderer进程，内部是多线程的）：默认每个Tab标签对应一个进程，互不影响

#### 1.3、浏览器渲染进程
**浏览器渲染进程是多进程的**，也是一个前端人最关注的，它主要包括有以下几个线程：
![浏览器进程以及线程](browse_task.png)
- GUI渲染线程
    * 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等；
    * 当界面需要重绘(Repaint)或由于某种操作引发回流(reflow)时，该线程就会执行；
    * `GUI渲染线程与JS引擎线程是互斥的`，当JS引擎执行时GUI线程会被挂起，GUI更新会被保存在一个队列中等到JS引擎空闲时立即被执行；
- JS引擎线程
    * 也称为JS内核，负责处理javascript脚本程序；
    * JS引擎线程负责解析javascript，运行代码；
    * JS引擎一直等待着任务队列中任务引擎的到来，然后加以处理，一个Tab页(renderer进程)中无论什么时候都`只有一个JS线程`在运行JS程序；
    * `GUI渲染线程与JS引擎线程是互斥的`，因此如果JS执行时间过长，就会造成页面渲染不连贯，导致页面渲染加载阻塞；
- 事件触发线程
    * 归属于浏览器而不是JS引擎，用来控制事件循环(可以理解为，JS引擎自己都忙不过来，需要浏览器另开线程协助)；
    * 当JS引擎执行代码块如setTimeout时(也可以是来自浏览器内核的其他线程，比如鼠标点击、AJAX异步请求等)，会将对应任务添加到事件线程中；
    * 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的尾部，等待JS引擎的处理；
    * 注意，由于JS的单线程关系，所有这些待处理队列中的事件必须排队等待JS引擎来处理(当JS引擎空闲的时候才会执行)
- 定时触发器线程
    * 传说中setTimeout与setInterval所在线程；
    * 浏览器定时计数器并不是属于JS引擎计数的，(因为JS引擎是单线程的，如果处于阻塞线程状态就会影响计时的准确度)；
    * 因此通过单线程来计时并触发定时(计时完毕后，添加到事件队列中，等待JS空闲后执行)；
    * W3C在HTML标准中规定，规定要求setTimeout中低于4ms的时间间隔为4ms；
- 异步http请求线程
    * 在XMLHttpRequest建立连接后，是通过浏览器新开一个线程来发起请求动作；
    * 检测到状态发生变更后，如果有设置回调方法的话，异步线程就陈升状态变更事件，将这个回调再放入到事件队列中，由JS引擎执行；

#### 1.4、JS引擎是单线程的
`GUI渲染与JS引擎是互斥的`，为了防止渲染出现不可预测的结果，因为JS是可以直接操作dom的，如果JS引擎与其他线程和GUI线程同时操作DOM的话，那么渲染前后就可能不一样了，
因此执行JS引擎的时候，GUI线程会被挂起，执行GUI的时候，JS引擎会被挂起。因此JS引擎会阻塞页面的家在，`*这也就是为毛要将JS代码放在body标签之后，在所有的html内容之前，为了防止阻塞GUI线程，造成页面白屏*`

#### 1.5、WebWorker
由于JS是单线程的，所有任务只能在一个线程上完成，一次只能做一件事，前面的任务未完成的情况下，后面的任务只能等着
> Web Worker是为JavaScript创造多线程环境，允许主线程创建Worker线程，将一些任务分配给后者运行，在主线程运行的同时，Worker线程在后台运行，两者互不干扰，等到Worker线程完成计算任务，再将结果返回给主线程，这样子的好处是，一些密集型或者高延迟的任务，被Worker线程承担来，主线程就会很流畅，不会被阻塞或拖慢

WebWorker有几个特点：
  - 同源限制，分配给Worker线程运行的脚本文件，必须与主线程的脚本同源；
  - DOM限制：不能操作DOM；
  - 通信联系：Worker与主线程不在同一个上下文环境中，不能直接通信，只能通过消息的方式进行通信；
  - 脚本限制：不能执行alert()和confirm()方法；
  - 文件限制：无法读取本地文件

#### 1.6、浏览器渲染流程
  - 用户输入URL，DNS解析程请求IP地址；
  - 浏览器与服务器建立连接(tcp协议、三次握手)，服务器处理返回html代码块；
  - 浏览器接收html代码块，将代码块解析程dom树、解析css为cssObject；
  - dom树和cssObject结合成render树；
  - GPU合成，输出到屏幕上；

### 二、JS事件循环
上面扯了那么多，下面开始进入正题
#### 2.1、同步任务与异步任务
  - 同步任务：代码同步执行
  - 异步任务：代码异步执行
设计理念：因为同步执行异步任务比较耗时，而且代码中绝大部分都是同步代码，因此我们先执行同步代码，把异步任务交给其他线程去执行，如定时触发线程、异步http请求线程等，
然后等异步任务完成了或者被回调了就在执行他们，这种`调度同步、异步任务的策略，就是JS事件循环`：
  - 1. 执行整体代码，如果是同步任务，就直接在主线程上执行，形成一个执行栈；
  - 2. 当遇到异步任务是，`就交给其他线程执行`，当异步任务执行完了，就往事件队列里面`塞一个回调函数`；
  - 3. 一旦执行栈中所有的同步任务都执行完毕了，就会读取事件队列，从队列头部去一个任务塞到执行栈中，开始执行；
  - 4. 一直重复步骤3的操作
![JS Event Loop](JS-event-loop.png)

以上就是JS事件循环了，确保了同步任务与异步任务有条不紊的执行，只有当前执行栈中任务被执行完了，主线程才会去读取事件队列，看看有没有任务要执行，每次取一个来执行

简单的分析一波老生长谈的setTimeout
```javascript
  setTimeout(() => {
  	console.info('异步操作');
}, 0);
  console.info('同步操作');
```
- 发现有一setTimeout，就挂起交给定时器触发线程执行(定时器会在指定等待的时间到了之后，将回调函数塞到事件队列中)；
- 执行同步任务console，直接塞入执行栈执行；
- 从上到下执行完毕后，执行栈为空了；
- 从事件队列中去一任务，塞到执行栈中执行
- 事件队列清空；
#### 2.2 JS是单线程，怎样执行异步的代码？
单线程就意味着所有任务都必须排队，前一个任务结束，才会执行后一个任务，如果前一个任务很耗时，后一个任务就不得不一直等着。

JS引擎执行异步代码而不用等待，是因为有消息队列和事件循环。

    - 消息队列：消息队列是一个先进先出的队列，它里面存放着各种消息
    - 事件循环：主线程重复地从消息队列中取消息到执行栈中进行执行的过程

![JS执行异步任务的示意图](js-async-task.png)

从上图我们可以得出这样子的一个结论，就是：
> 异步过程的回调函数，一定不在当前这一轮事件循环中执行。
#### 2.3 宏任务与微任务
##### 2.3.1 宏任务、微任务
除了广义的同步任务和异步任务，JavaScript单线程中的任务可以细分为宏任务和微任务：

    - macro-task：javascript(整体代码)，setTimeout，setInterval，setImmediate，I/O，UI Rendering，
    -process.nextTick，Promise，Object.observe，MutationObserver

##### 2.2.2 事件循环与宏任务、微任务
每次执行栈执行的代码就是一个宏任务(包括每次从事件队列中获取一个事件回调并放到执行栈中执行)

再检测本次循环中是否存在微任务，存在的话，就依次从为任务的任务队列中读取执行完所有的微任务，再读取宏任务的任务队列中的任务执行，再执行所有的微任务，如此循环。
JS的执行顺序就是每次事件循环中的宏任务-微任务。

    - 第一次事件循环，整段代码作为宏任务进入JS主线程执行
    - 上述代码扔到执行栈中执行，遇到异步代码，就挂起交给其他线程执行(主线程代码依旧继续执行，异步代码执行完毕后)
    - 同步代码执行完毕，读取微任务队列，若有待执行的微任务，则微任务清空；
    - 页面渲染
    - 反复执行上述操作

具体如下示意图所示：
![宏任务与微任务的调度](task_job_schedule.png)
用代码来翻译一下就是：
```javascript
  //宏任务
  for(let macrotask of macrotask_list){
  	// 执行一个宏任务
    macrotask();
    // 执行所有的微任务
    for(let microtask of microtask_list){
    	microtask();
    }
    // UI渲染
    ui_render();
  }
```
![宏任务与微任务执行流程](task_job_luicheng.png)
##### 2.2.3 事件循环与页面渲染
在ECMAScript中，微任务称为jobs，宏任务称为task。
浏览器为了能够使得JS内部task与DOM任务有序的执行，会在一个task执行结束后，在下一个task执行开始前，对页面进行重新渲染；
*(task -> ui_render -> task -> ...)*
具体可以看一下代码
```javascript
  document.querySelector('#xxx').style.color = 'yellow';
  Promise.resolve().then(() => {
  	document.querySelector('#xxx').style.color = 'red';
  });
  setTimeout(() => {
  	document.querySelector('#xxx').style.color = 'blue';
  	Promise.resolve().then(() => {
  	for(let i = 0; i < 99999; i ++ ){
  		console.log(i);
    }	
    })
  }, 17);
```
我们来看一个效果
![宏任务与微任务效果](task_job_demo.gif)
刚开始div的文本内容会变红色，跟着等到console打印完成后，变为蓝色
针对上述的运行效果，我们来分析一波：
  - 第一轮事件循环，将代码塞到JS线程栈中执行，dom使文本变为黄色，然后遇到Promise微任务，微任务塞到事件队列中，接着遇到宏任务setTimeout，则交由定时器触发线程；
  - 第一轮宏任务执行完了，检查微任务队列中是否有任务，执行微任务，并清空队列，dom操作使得文本变红色，此时setTimeout还没有执行到；
  - render渲染线程进行渲染，是文本变红色；
  - 第二轮循环，执行栈是空的，检查微任务队列；
  - setTimeout执行了，将任务塞到事件队列中，从事件队列中拿事件出来，塞到线程栈执行；
  - 执行第一个同步任务，dom使得文本变蓝色，第二个是微任务，塞入微任务队列中，此时同步任务执行完毕，检车微任务中是否有任务执行，并清空队列，微任务中console同步任务，此时JS引擎一直在执行，GUI线程被挂起，一直等到console同步任务执行完；
  - GUI渲染线程进行渲染，使文本变蓝色
  - 事件循环结束
> HTML5标准规定了setTimeout的第二个参数最小值不得低于4毫秒，如果低于这个值，就会自动增加

##### 2.2.4 Vue.$nextTick
用vue的小伙伴可能在工作中会经常用到这个api，Vue的官方介绍：
> 将回调延迟到下次DOM更新循环之后。在修改数据之后立即使用它，然后等待DOM更新
其内部实现就是利用了microtask(微任务)，来延迟执行一段代码(获得dom节点的值)，即当前所有同步代码执行完后执行microtask
