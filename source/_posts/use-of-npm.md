---
title: npm的常用功能
description: npm的结构与使用
author: Zhenggl
date: 2022-08-06 00:06:59
categories:
    - [node, npm]
tags:
    - code
    - npm
cover_picture: npm常用功能.jpg
---

### 前言
> 在经历了一系列前端开发的项目之后，对于npm的了解，只是知道它可以用来安装项目的依赖库，但殊不知关于npm，其他它还有更多更好好玩的地方。
> 首先，我们需要明白的是：
> **NPM借助于CommonJS规范，将CommonJS规范给实现出来，从而实现包的管理**

### 查看帮助
> 在学习的过程中，主要借助于[官方中文文档](https://www.npmjs.cn/)，来协助自己对于这个npm的一个学习
> 另外，在实际的编码过程中，还可以借助于原本`npm脚本命令`来学习关于npm的相关命令

1. 查看帮助：npm
```shell script
  npm
```
![npm帮助入口](npm帮助入口.png)
通过直接输入`npm`命令，可直接查看到`npm`所能够支持的所有脚本，然后再借助于`npm help <具体命令>`来查看具体的命令的作用，以及可接受的参数，比如有 :point_down: 的命令：
```shell script
  npm help login
```
![npm帮助脚本命令](npm帮助脚本命令.png)

### 安装依赖包
> **NPM最常用的命令用法，其执行语句是`npm install XXX`，这里的`XXX`代表的就是一个包名，执行该命令之后，将会在当前目录下创建`node_modules`目录，并将所依赖的包名(这里是XXX)，
> 对应在`node_modules`目录中创建`XXX目录`，然后我们可以借助于`require('XXX')`，来引用到这个包(这个取决于node模块的查找规则)

#### 安装全局包
> 如果包中含有命令行工具，那么需要执行`npm install XXX -g`命令进行全局模式的安装，需要 :warning: 的是，这里并不是将包安装到全局的`node_modules`目录中，而是将包中的`bin`字段，
> 所对应的脚本，链接到与`node可执行程序`同一个目录下，使得该命令可以在任何地方进行通过命令行执行到，这里以`hexo`，咱们已经全局安装了`hexo`，那么这个程序`hexo`的命令所在的目录是在
> `/usr/local/bin/hexo`
> 对应的包目录则被安装到
> `/usr/local/lib/node_modules/hexo-cli/bin/hexo`
![hexo的安装目录](hexo的安装目录.png)
从 :point_up_2: 上面可以看出hexo被安装在与node同一个目录的下软链接，链接到对应目录中的
![node模块的查找路径](node模块的查找路径.png)

#### 安装本地包
> 对于一些没有发布到NPM上的包，或者是因为网络原因导致无法直接安装的包，可以通过将包下载到本地，然后在本地进行安装，对应的只需要在`package.json`文件中，将对应包名的版本号，调整为
> 包所在的未知即可，可以是包含package.json的包，也可以是一个url地址，还可以是一个目录下有package.json文件的目录

#### 从非官方源安装
> 一般的，如果一个公司企业内部的包，不想对外发布出去的话，那么则可以采用内部源的机制，通过搭建内部源的方式，搭建一个前置于npm的企业内部npm，进行正常的包管理，
> 这里可借助于`nrm`命令，快速进行内部源与外部源的切换，然后利用npm相关的脚本(npm login --registry=内部源地址)来登录到内部源，并使用正常的`npm`命令来进行
> 企业内部包的管理，这里可以参考之前所学习整理的关于搭建自己的[npm私源链接](https://www.91temaichang.com/2021/03/08/verdaccio-custom-npm/)

### NPM钩子命令
> npm所提供的bin目录下的脚本程序的执行，我们还可以在其对应的钩子命令中定义出来，这有点类似于一个应用程序的生命周期，比如我们有需要这样子的一个场景，需要检测我们的程序被安装的次数，以及安装后被立马打开的次数，
> 来分析程序的一个吸引力，那么我们可以借助于`npm钩子命令`，让包在安装或者卸载等一系列过程中提供的钩子机制(其实就是回调函数)，来进行对应的数据采集与记录！如下所示：

```json
{
  "script": {
    "preinstall": "preinstall.js",
    "install": "install.js",
    "uninstall": "uninstall.js",
    "test": "test.js"
  }
}
```
:star2: 程序所能够提供的钩子命令不只 :point_up_2: 所列出来的几个钩子命令，还有以下的几个

| 钩子命令 | 描述 |
|---|---|
| prepublish | 在程序被打包以及发布前执行，属于预发布动作 |
| prepare | 在prepublish执行之前 |
| prepublishOnly | 在publish之前 |
| prepack | 在打包之前执行 |
| postpack | 打包动作完成，且移到目标位置时触发 |
| publish、postpublish | 发布动作执行之后 |
| preinstall | 预安装之前，也就是在install之前 |
| install、postinstall | 安装之后 |
| preuninstall、uninstall | 在uninstall安装之前 |
| postuninstall | 在uninstlal卸载之后 |
| preversion | 在确定版本号修改之前 |
| version | 在通过npm version命令之后，但在提交代码之前 |
| postversion | 在npm version命令以及提交代码之后 |
| pretest、test、posttest | 在npm test执行的时候触发 |
| prestop、stop、poststop | 在npm stop执行的时候触发 |
| prestart、start、poststart | 在npm start执行的时候触发 |
| prerestart、restart、postrestart | 在npm restart执行的时候触发 |
| preshrinkwrap、shrinkwrap、postshrinkwrap | 在npm shrinkwrap执行的时候触发 |

### 发布包
> 一般的包的发布流程有以下的几个步骤：
> 1. 编写模块包文件
> 2. 初始化包描述文件package.json，借助于`npm init`脚本命令，来快速初始化包描述文件
> 3. 注册npm账号，或者是内部添加发布者账号
> 4. 登录到对应的源上，使用`npm login --register=源地址`
> 5. 发布包到npm上，使用`npm publish`命令来发布
> 6. 安装自己已经发布的包，使用`nrm`切换环境，然后再使用普通的`npm install`安装依赖，或者还可以是`npm install XXX --register=npm源`的方式
> 7. 管理包权限，通过`npm owner`来管理包的所有者

### 分析包
> 当一个包被依赖下载下来的时候，单纯的看代码有点晕，这里可以是直接借助于`npm ls`来查看当前包中的一个依赖管理，对包有一个大概的轮廓！！
