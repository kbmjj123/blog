---
title: Sentry前端/APP日志监控的使用
author: Zhenggl
date: 2022-02-14 14:23:28
categories:
    - [前端,日志监控]
tags:
    - 前端
    - 日志监控
cover_picture: sentry-cover.jpeg
---

### 前言
为提高前端快速定位线上问题，减少跟用户/测试拿账号+密码进行bug的重现，这边利用Sentry来搭建了内部的一套日志监控系统，目前可以满足于APP + WEB/H5端 + 小程序的一个日志监控服务，
记录线上程序脚本异常，通过收集浏览器相关信息环境，且针对业务方面的异常进行数据的采集，并提交到日志服务器中，提供邮箱告警机制，主动快速响应处理线上问题，保证线上问题的正常运作。
### 一、项目接入(Vue)
*由于目前的项目大都使用的vue开发框架，因此这边前端暂时仅提供vue的使用*
1. 安装依赖
```shell script
  npm install --save @sentry/vue @sentry/tracing
```

2. 入口文件`main.js`的引入
```javascript
  import * as Sentry from '@sentry/vue';
  import { Integrations } from '@sentry/tracing';
  // 然后是日志服务的初始化
  Sentry.init({
      Vue,
      dsn: "http://6ce276ed6d5f43bea71464a0efee522a@192.168.199.25:9000/2",
      integrations: [
        new Integrations.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),    // router为当前SPA的路由
          tracingOrigins: ["localhost", "my-site-url.com", /^\//]   //my-site-url为api接口服务的地址，用于跟踪api
        })
      ],
      tracesSampleRate: 1.0
  });
```
### 二、业务/自定义异常汇报
对于业务方面的异常，一般需要提供发生错误信息的所有相关操作，比如接口地址，接口参数，当前用户状态等等，因此需要业务自行将产生这个业务异常的当前信息全部提交到日志服务器中，来完成远程bug的一个复现，
这边可以提供1⃣️公共的方法，集成到当前的组件库的方法库中，比如🈶️以下的一个示例代码：
```javascript
  // 比如在axios的统一网络请求响应回调处理函数中
  import { BugReport } from 'XXX';
  BugReport.report({
    env: 'product/development/test',  //当前环境
    errorMsg: ''
  });
```

