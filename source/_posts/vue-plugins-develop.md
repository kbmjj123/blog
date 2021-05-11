---
title: vue插件开发
author: Zhenggl
date: 2021-05-11 00:03:30
categories:
    - [开发框架, vue]
tags:
    - vue
cover_picture: https://img.91temaichang.com/blog/vue-plugins-develop.png
---

### 前言
插件的功能：
> vue插件通常用来为Vue添加全局功能，插件的功能防伪没有严格的限制，一般有一下几种：
> 1. 添加全局方法或者property。
> 2. 添加全局资源：`指令/过滤器/过渡等`
> 3. 通过全局混入来添加一些组件选项
> 4. 添加Vue实例方法，通过把它们添加到`Vue.prototype`上实现
> 5. 一个库，提供自己的API，同时提供上面的一个或多个功能

插件的使用
-----
通过全局方法`Vue.use()`使用插件，它需要在调用`new Vue()`启动应用之前完成：
```javascript
  // 调用`MyPlugin.install(Vue)`
  Vue.use(MyPlugin);
  new Vue({});
```
也可以传入一个可选的选项对象：
```javascript
  Vue.use(MyPlugin, { someOption: true });
```
⚠️ `Vue.use`会自动组织多次注册相同插件

### 插件的开发
> Vue.js的插件应该暴露一个`install`方法，这个方法的第一个参数是`Vue`构造器，第二个参数是一个可选的选项对象：
```javascript
  MyPlugin.install = (Vue, options){
	// 1. 添加全局方法或者property
	Vue.myGlobalMethod = function (){};
	// 2.添加全局资源
	Vue.directive('my-directive', {});
	// 3.注入组件选项，即注入组件重载属性+方法
	Vue.mixin({});
	// 4.添加实例方法
	Vue.prototype.$myMethod = (methodOptions) => {};
	// 5.注册全局组件，减免在每个需要调用的vue组件页面中import
	Vue.component('Name', Component);
  };
```
### 插件的功能范围
➡️ 根据上述对插件定义以及使用的描述，这边可以简单地整理下关于插件可使用的功能范围
+ 指令方面
  - v-lazy: 全局图片资源懒加载指令，通过自定义开发的指令，实现img标签图片的懒加载机制；
  - v-permission: 全局权限控制指令，精确到组件级别的权限控制；
+ 全局属性
  - $api: 对接口请求的统一封装，Vue.$api = ...;
  - $utils: 对本地工具类的统一封装并作为Vue的属性进行使用，Vue.$utils = ...;
  - $log: 开发调试阶段用于打印自定义日志相关，Vue.$log = ...;
+ 全局组件，以this.$dialog类似的方式来调用
  - $dialog: 全局自定义对话框
    ```javascript
      // 假设已正常开发一dialog组件：dialog.vue，当前页面为dialog.js，用于与Vue建立连接，快速调用$dialog动作
      let DialogComponent = require('./dialog.vue');
      let Dialog = {};
      Dialog.install = (Vue, options) => {
        // 如果dialog还在，则不做任何事情
        if(document.getElementsByClassName('dialog-box').length){
            return;
        }
        /**
        * el：提供一个在页面上已存在的DOM元素作为Vue实例的挂载目标。可以是css选择器，也可以是HTMLElement实例。
        * 在实例挂载之后，可以通过$vm.$el访问。
        * 如果这个选项在实例化时有用到，实例将立即进入编译过程。否则，需要显示调用vm.$mount()手动开启编译(如下)
        * 提供的元素只能作为挂载点。所有的挂载元素会被vue生成的dom替换。因此不能挂载在顶级元素(html, body)上
        * let $vm = new toastTpl({
        *   el: document.createElement('div')
        * });
        * */
        let DialogTpl = Vue.extend(DialogComponent);  // 创建Vue组件构造器
        let $vm = new DialogTpl(); //实例化
        let tpl = $vm.$mount().$el; //将实例$vm进行挂载，挂载完成后，就可以通过$el来访问到当前的实例
        document.body.appendChild(tpl);// 将挂载后的dialog插入到body中
        // 由于我们需要在所有的组件任意位置调用到this.$dialog，因此，我们需要在Vue.prototype的方法中加入
        Vue.prototype.$dialog = {
            show(options){
              if (typeof options === 'string') {  // 对参数进行判断
                $vm.text = options  // 传入props
              }else if (typeof options === 'object') {
                Object.assign($vm, options)  // 合并参数与实例
              }
              $vm.show = true  // 显示dialog，这里show原本是Dialog的一个自定义属性
            },
            hide(){
                $vm.show = false; 
            }
        };
      };
      export default Dialog;
    ```
  - 全局超时重新登录对话框
  - 全局自定义提示
+ 全局组件，以导入的方式使用
  - 图片资源上传(支持单图、多图、视频资源、文件资源等)
  - 图文编辑器
  - 预览组件
  - 倒计时
  - 省市区
  - 自带表单和页面pager的表格
  - 侧边栏
