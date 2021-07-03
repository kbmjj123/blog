---
title: 通过verdaccio服务搭建内部npm管理
author: Zhenggl
date: 2021-03-08 14:17:01
categories:
  - [积累与沉淀,自定义服务]
tags:
  - verdaccio
  - npm
  - nrm
  - Node.js
cover_picture: https://img.91temaichang.com/blog/verdaccio.jpeg
---

*关于如何要共享组件？目前公司的前端项目比较多，涉及到中后台业务系统，有存在不少组件，在不同的业务系统中使用的，为了避免疯狂的ctrl +C > ctrl + V，一堆的维护工作，这边搭建了内部的私有源，又不能将公司的一个资源扔到公共的npm上，因此这边利用verdaccio + gitlab来搭建以及维护蜘点前端公共的组件服务，通过verdaccio来管理组件的上传以及可视化管理，gitlab来管理组件的版本以及迭代，满足组件的更新迭代；*
### 一、为啥子要使用私有源呢

1. 加快共有npm包的安装速度；
2. 避免本地npm install指向源，避免cnpm等其他源拉取npm包不及时的问题；
3. 私有源会将已经使用的npm包缓存下来，提升个人本地/打包环境npm包的安装速度；
4. 把公共代码上传到私有源，可以在多个git仓库项目中通过npm的方式来使用；
5. A仓库 封装了一个 video组件，想给B仓库使用。那就可以制作一个 video组件仓库，然后发布到 私有源上。A和B仓库使用的时候就 npm install 组件库，let api = require('组件库') 啦~ 这个步骤和 发公有npm包是一模一样的，只是发的位置不一样而已。

### 二、通过verdaccio服务，搭建内部npm管理

1. 访问[verdaccio官网](https://verdaccio.org/docs/zh-CN/authentification)按照这个一步一步来就行
2. 如果是本地电脑 不需要改 verdaccio的 config.yaml配置文件，如果是服务器部署，那你需要改 config.yaml的配置
3. 我们这里按服务器部署为例子
4. 你需要先安装上 ```shell node npm pm2```
5. ```shell npm install -g verdaccio```
6. 创建一个 非root的账户
7. 在此账户下 执行verdaccio，且找到 config.yaml文件
8. 要在内部机器上运行，因此，需要这是局域网访问，vim修改config.yaml，新增一行，保存：
```shell
listen: 0.0.0.0:4873
```
verdaccis 跑一下，显示一下内容就正常了；
![verdaccio效果图](https://img.91temaichang.com/blogimage2021-1-18%2017_8_18.png)

### 三、日常使用–切换npm源

1. 由于内部npm也是使用的npm来管理，因此，需要一专门的工具，来管理源的切换；
2. 打开命令行工具，安装npm切换源的快捷工具npm/nrm：```shell npm install -g nrm```
3. 输入命令：```shell nrm ls```，可以看到以下截图，前面有个小星星的，代表当前源是指向哪里的
4. 输入命令：```shell nrm add``` 源名称 源地址，创建一个新的源
5. 输入命令：```shell nrm use``` 源名字，切换使用的源
![nrm 切换源](https://img.91temaichang.com/blog/image2021-1-18%2017_11_37.png)

### 四、日常使用

1. 切换使用的源；
2. 通过npm安装依赖即可；

### 结束
至此，整个内部npm的使用以及发布就已经全部说明完成了，无论团队的开发者/使用者来说，只要用nrm将源切换为私有源就可以了。
verdaccio通过代理的形式，把私有包和官方包且分开；
![内部npm管理示意图](https://img.91temaichang.com/blog/6622941-aa413cf524c5fa90.png)
