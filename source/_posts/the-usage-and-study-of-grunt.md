---
title: grunt的学习与应用
description: grunt的学习与应用
author: Zhenggl
date: 2022-11-21 09:53:38
categories:
  - [打包, nodejs, grunt]
tags:
  - 打包
  - nodejs
  - grunt
  - Gruntfile
cover: grunt封面.jpeg
---

### 前言
> 在完成一两天的通读`grunt`[在线文档](https://gruntjs.com/)之后，原来`grunt`也并没有那么地复杂，首先他是一个nodejs程序，无非就是将反复重复的工作(比如有压缩、编译、单元测试、linting等操作)通过脚本来自动化，只需要进行一个命令的执行，即可完成一系列既定执行顺序的操作，可以理解为一系列固定流程的脚本集合，他的庞大主要在于他所提供的插件，在运行`grunt`的过程中，可以通过对插件的使用，来满足于实际的业务需要！

### Gruntfile文件组成
![Gruntfile的组成](Gruntfile的组成.png)
![Gruntfile文件组成](Gruntfile文件组成.png)
:confused: 这里有一个疑问，就是为毛这个`Gruntfile.js`要设计为对外暴露一函数对象？这个问题将留到 :point_down: 来进行分析！

:confused: 关于`Gruntfile`文件的组成描述如下：
1. 由包裹的 :one: 函数包裹，也就是对外暴露一函数方法，该方法接收一`grunt`对象；
2. 执行grunt的`initConfig`方法，并传递对应的配置；
3. 加载这个`initConfig`配置中所需的任务/目标所依赖的三方任务(loadNpmTasks)；
4. 注册这个配置文件对外暴露的任务API动作；

### grunt程序的运行过程
![grunt脚本程序的执行过程](grunt脚本程序的执行过程.png)
![grunt-cli的执行顺序](grunt-cli的执行顺序.png)

:confused: 关键在于`liftup`库，它主要用于执行一个CLI脚本程序，这里它写了一个gruntjs程序，然后通过`lifeup`库来创建一个系统任务，用来执行这个gruntjs程序，这个`liftup`可以简单地理解为是一个读取`package.json`以及配置的参数，来实现的可以以一js来作为系统的执行程序的库，最终这个`grunt-cli`其底层是调用`gruntjs`程序的，也就是说`grunt-cli`是脚本`grunt`应用程序包装器，通过全局安装的命令来执行这个grunt脚本的！
执行的入口就在`grunt.tasks()`函数中

:stars: 也就是说，当执行程序(比如`grunt`命令)，由`grunt-cli`命令来执行这个`grunt.tasks()`方法，针对之前已经配置好的配置以及依赖的三方任务库，完成一系列既定流程的任务的执行，从 :point_up: `Gruntfile`文件的组成我们可以晓得`grunt`对象所提供的方法有：`initConfig`、`loadNpmTasks`、`registerTask`等，但其实`grunt`对象所提供的方法以及属性远不止这些！！

#### grunt的组成
> :confused: 在开始进入这个`grunt`的组成学习之前，先来了解为什么`Gruntfile`必须定义为一函数，而且它里面的`grunt`参数又是什么？
> 要理解这个问题，需要从`grunt-cli`的执行程序开始来分析这个！！
![grunt执行的开始](grunt执行的开始.png)
:stars: 上面这里调用了`grunt.tasks()`方法，进入到了任务初始化阶段
![task初始化阶段](task初始化阶段.png)
![加载Gruntfile文件](加载Gruntfile文件.png)
![调用Gruntfile方法](调用Gruntfile方法.png)
:stars: 因此，`Gruntfile`文件中必须定义为一个方法，该方法中的`grunt`参数grunt对象，提供了一系列配置的动作，通过预先配置好的动作，在执行程序的时候好自动加载到对应的配置信息！

:trollface: 关于grunt的组成在运行时的打印如下图所示：
![grunt打印输出](grunt打印输出.png)
:point_down: 对应结合源码整理一下`grunt`的一个架构图：
![grunt架构组成](grunt架构组成.png)

##### 任务的加载、存储
> 在`grunt`的模块中，:u6709: 一个比较核心的模块`task`，他负责给`grunt`提供最底层的任务支撑，那么关于这个`task`，他是怎样的一个组成结构？他是如何来为`grunt`提供服务的呢？
> 通过阅读源码，可以得知`grunt`中提供了两个task文件(其中一个task“继承于”另外一个task)，一个位于`grunt/lib/util/task.js`(这里我们称之为父类)，另一个位于`grunt/lib/grunt/task.js`(这里我们称之为子类)，
> 而且，关于这个父子关系的继承实现中有一个微妙的用法如下(这里为方便解读，将两者相关的代码写到一起，并做了相应的调整为方便展示)：
```javascript
// 父类task
function Task(){}
export.Task = Task;
export.create = function(){
  return new Task();
}
// 子类task
var parent = parentTask.create(); // 创建父类的一个实例对象(该对象拥有一系列的实力方法以及各自的一份拷贝)
var task = Object.create(parent); // 以父类实例对象来创建对应的子类对象，而不是原型对象，那么所有的子类对象都直接拥有了相对应的实例属性 + 实例方法
```
从源码的结构我们可以得知，父类task负责任务参数的获取、任务队列(_queue)的管理与执行等相关动作，而子类task则负责加载任务(不管是三方库任务还是自定义的任务)，比如通过子类直接从`init-->loadTask-->loadNpmTasks-->loadTasks-->loadTask-->registerTask`，来实现将`Gruntfile`文件中函数所执行的内容，交由子类task来实现，而且完成配置的过程中，顺便将即将要执行的父类task任务队列(_queue)给丰满起来了！
:stars: 这里关键分析一下关于`registerTask()`方法的定义与实现(因为父子都有定义，而且这个是核心任务的注册实现过程)，以`jshint`插件为例(如下图所示):
![jshint在grunt中的使用](jshint在grunt中的使用.png)
当调用了`grunt.registerTask('test', [jshint]);`时，发生了什么事！！
```javascript
  // 在子类中定义的一对象，用来缓存相关的注册任务
  var registry = { tasks: [], untasks: [], meta: {} }; 
  // 在Gruntfile文件中最终真实调用的注册任务方法
  // 这里name = 'test'，arguments = ['test', [jshint]]
  task.registerTask = function(name){
    // 将注册的任务名称添加到tasks数组中
    registry.tasks.push(name);
    // 调用父类task中的registerTask方法，并传递参数['test', [jshint]]
    parent.registerTask.apply(task, arguments);
    var thisTask = task._tasks[name]; //从对象中的中的_tasks对象中获取刚缓存的组装后的任务对象
    //******* 以下时开始的往fn函数中切入函数逻辑操作 ********
    var _fn = thisTask.fn;  // 取出原本的fn函数
    thisTask.fn = function(arg){
      // ...此处省略一系列的追加额外属性到task对象中的相关操作，使得所有的任务都有统一的输出操作！！
    }
    return task;
  }
```
:point_down: 关于父类中的`registerTask`方法定义(仅展示核心相关代码)：
```javascript
Task.prototype.registerTask = function(name, fn){
  var tasks = this.parseArgs(fn); // 将参数[jshint]解析成一[jshint]
  fn = this.run.bind(this, fn); // 这里的this是子类对象，fn为[jshint]数组，将fn定义为run方法，并捆绑上下文为子类对象，参数为[jshint]，捆绑函数动作，而且该动作只有在任务开始时触发
  this._tasks[name] = { name: name, info: info, fn: fn }; // 将这个任务以及对应的函数回调缓存到_task对象中
}
```
:point_down: 关于父类中的`run`方法定义如下:
```javascript
Task.prototype.run = function(){
  // [jshint].map(this._taskPlusArgs, this);
  var things = this.parseArgs(arguments).map(this._taskPlusArgs, this);
  // things的数据结构为：{task: task, nameArgs: name, args: args, flags: flags}
  this._push(things);// 将things添加到_queue队列中
  return this;
}
```

:point_down: 是对应的`registerTask`的一个流程：
![registerTask的过程](registerTask的过程.png)

:stars: 另外，再补充上关于Task的一个结构图如下：
![grunt中的Task模块](grunt中的Task模块.png)

##### 任务的执行
> 一切任务的执行，从task.start()开始
> 该动作有两个流程：
> 1. 执行`task.run(name)`方法将任务添加队列`task._queue`队列中；
> 2. 执行任务的`task.start()`方法

##### registerTask与registerMulTasks的区别
> 首先来看下面的一个一个对比输出结果:
![grunt两种注册任务的方式对比](grunt两种注册任务的方式对比.png)

:stars: 在定义grunt的任务过程中，可以`this.async()`方式来返回一个`done`函数，然后在异步执行结束的时候，调用这个`done`函数，来告知grunt当前异步已执行完毕，如下图所示：
![异步的grunt任务执行过程](异步的grunt任务执行过程.png)

##### grunt的插件
> 对照官方的文档，直接对应初始化了一个插件，对于插件的要求如下：
![grunt插件的定义](grunt插件的定义.png)

:confused: 这里为什么插件的定义一定要在`tasks`目录中，而且导出的方法是一个接收`grunt`的函数呢？ 
:point_down: 来分析一下关于插件的加载过程，一切也是从`task.loadNpmTasks`方法中入手
```javascript
  task.loadNpmTask = function(name){
    // 此处省略好多代码
    var tasksdir = pash.join(root, name, 'tasks');  // 找到插件中的tasks目录
    if(grunt.file.exist(tasksDir)){
      loadTasks(tasksdir);
    }
  }
```
```javascript
  function loadTasks(tasksdir){
    var files = grunt.file.glob.sync('*.{js,coffee}', {cwd: tasksdir, maxDepth: 1});
    files.forEach(function(filename){
      loadTask(path.join(tasksdir, filename));
    });
  }
```
```javascript
  function loadTask(filepath){
    // 此处省略好多代码
    fn = require(path.resolve(filepath));
    if(typeof fn === 'function'){
      fn.call(grunt, grunt);
    }
  }
```
:point_up: 对上面的代码进行一个简单的描述就是：**`loadNpmTasks`的过程，其实就是找寻对应的已经安装的依赖，在其安装目录`node_modules`中找到对应的依赖包目录中的tasks目录中的`js/coffee`文件，然后来执行这个文件中的方法，并传递对应的grunt对象！**

### grunt给我带来了什么?
+ 统一的编程范式
  - 通过统一的编码习惯结构，可快速尽性web站点或者自研库的自动化测试、打包等流程，实现一键打包的交付操作；
+ 编码技巧
  - 面向适配器编程，当需要往所有的函数追加一系列自定义的操作时(比如函数执行前后输出函数的执行时间)，可以先用一中间变量nfn获取到源fn地址，然后重载源函数，加入对应的执行逻辑代码后，再执行回原本的nfn方法，通过call/apply的方式；
  - 面向函数对象"未来实现"编程，可以将自身的服务定义为扩展性很强、支持热拔插的方式(比如插件)，将一个个的插件定义为一函数，同时接收库对象(比如grunt)，以此来实现程序的"未来实现"编程；
  - 实现父子关系继承的手法：采用将父类的实例对象当做子类的原型对象，那么所有的子类都拥有对应的实例方法的同时，还拥有着各自自身的一份属性的拷贝，这有点像java中的面相对象编程；
  - 在调试这个grunt的时候，发现需要跟随着源码来进行的断点调试，才能够清楚地知晓关于其中的程序执行过程，因此可以根据grunt的打包结果产物进行执行分析，可以在vscode中进行以下的断点设置来跟进：
    ![vscode关于grunt的断点调试配置](vscode关于grunt的断点调试配置.png)