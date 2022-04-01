---
title: 如何利用gitbook来编写自己的网络书籍
description: 如何利用gitbook来编写自己的网络书籍
author: Zhenggl
date: 2022-04-01 08:51:16
categories:
tags:
cover_picture: 如何利用gitbook来编写自己的网络书籍.jpeg
---

### 前言
> 之前一直想在网上针对一些三方框架或者方案编写自己的一个使用手册/阅读笔记，原本自己的hexo博客比较适合平时自己的点击积累，但不能够像一本书这样子来浏览，因此，
> 我在网上找相关的，终于发现有这样的一个框架：gitbook，可以用它来编写一样的markdown文件，来组织自己的书籍/手册的一个目录

### gitbook介绍
> `gitbook`是一个基于`node.js`的命令行工具，使用`github/git`和`markdown/asciiDoc`来构建精美的电子书。
> `gitbook`支持输出静态网页和电子书等多种格式，其中默认输出静态网页格式。

### gitbook使用
> `gitbook`主要有三个工具：

1. `gitbook`命令行工具；
2. `gitbook Editor`官方编辑器(目前新版已找不到了);
3. `gitbook.com`官网在线编辑；

这里主要是介绍`gitbook`命令行工具的方式来创建自己的电子书

#### gitbook命令行

##### 1、初始化项目
```shell script
  gitbook init
```
**语法说明：**
初始化项目，如果目录是空的话，就会自动创建`README.md`以及`SUMMARY.md`两个文件，如果这两个文件已经存在的话，则会自动更新这两个文件

##### 2、运行项目
```shell script
  gitbook serve
```
**语法说明：**
将初始化后的项目启动成为一个本地服务，我们可以直接在浏览器中访问项目，预览书籍效果，运行效果如下：
![gitbook运行效果](gitbook运行效果.png)

运行项目时，会生成_book目录，该目录代表着已生成的html页面以及其他资源

##### 3、gitbook指令一览
关于`gitbook`的帮助、版本等指令就不再重复说明了，这里主要讲解一下这个gitbook的其他指令：
![gitbook指令一览](gitbook指令一览.png)

1. build [book] [output]: 构建生成书籍
```shell script
  # 构建生成书籍到默认的_book目录中
  gitbook build 
```
```shell script
  # 构建生成书籍在自定义目录中
  gitbook build ./ /Users/zhenggl/Desktop/My\ Blog/blog/
```
2. server [book] [output]: 启动本地服务器；
3. install [book]: 安装所有的依赖插件，这里是指的定义在配置根目录的配置文件中的`book.json`中的插件定义；
4. parse [book]: 解析电子书
5. pdf [book]: 输出pdf格式的电子书

#### 4、gitbook配置一览
> 一般的，我们需要在根目录中新增一个文件名为：`book.json`，来作为整本书籍的配置文件

| 变量 | 描述 |
| --- | --- |
| root | 包含所有图书文件的根文件夹的路径，处理book.json |
| structure | 指定自述文件，摘要，词汇表等的路径 |
| title | 书籍的书名，默认从README.md文件中提出的 |
| description | 书籍的描述，默认是从README.md文件中提取出来的 |
| author | 作者名 |
| isbn | 国际标准书号ISBN |
| language | 本书的语言类型，默认是en，中文简体是：zh-hans |
| direction | 文本阅读顺序，可以是rtl(从右向左)或者是ltr(从左到右) |
| gitbook | 应用使用的gitbook版本 |
| links | 在左侧导航栏添加的链接信息 |
| plugins | 要加载的插件列表，默认插件有：fontsettings、highlight、livereload、lunr、search、sharing |
| pluginsConfig | 插件的配置 |

✨ 去处自带的插件，可以在插件名称前面加`-`
```json
  {
      "plugins": [
        "-search"
      ]
  }
```
👉 添加插件完成后，要进行`gitbook install`安装对应的插件依赖

⚠️ 由于`gitbook install`下载速度贼慢，因此我们可以直接使用npm/yarn来直接下载，同时也免去了`gitbook install`安装插件的过程

#### 5、gitbook插件一览
> ✨ 在查询如何使用插件的时候，我们可以直接在npm中搜索对应的插件名称：gitbook-plugin-**来查询对应的插件
> gitbook默认自带的有5个插件：

+ highlight：代码高亮
+ search：导航栏查询功能(不支持中文)
+ sharing：右上角分享功能
+ font-settings：字体设置
+ livereload：为gitbook实时重新加载

> 实用插件一览

1. back-to-top-button: 会到顶部
2. chapter-fold: 左侧目录折叠，支持多层目录，点击导航栏的标题名就可以实现折叠扩展
3. code: 代码添加行号和复制按钮
4. copy-code-button: 代码块复制按钮
5. todo: 添加待办事项
6. insert-logo: 将logo插入到导航栏的上方中
7. search-pro: 高级搜索(支持中文)
8. advanced-emoji: 支持emoji表情
9. shareing-plus: 分享当前页面，比默认的sharing插件多了一些分享方式
10. page-copyright: 页面页脚版权(内容比较多，具体看对应的配置)
11. page-toc-button: 悬浮目录
12. ancre-navigation: 悬浮目录和回到顶部
13. klipse: 嵌入类似IDE的功能
14. donate: 打赏功能
15. pageview-count: 阅读量计数
16. auto-scroll-table: 表格滚动条
17. popup: 弹出大图
18. custom-favicon: 修改标题栏图标


### 开始编写

#### 目录配置
> 当我们想好怎么安排好章节的时候，就可以通过修改`SUMMARY.md`中的内容，然后再次使用`gitbook init`命令，这个时候会根据`SUMMARY.md`中的内容，生成对应的文件结构，
> 如果文件不存在，则会自动创建，`SUMMARY.md`文件的内容如下：
```markdown
    # Summary
    * [Introduction](README.md)
    * [第一章](chapter-one/readme.md)
        * [第一节](chapter-one/section-one/readme.md)
        * [第二节](chapter-one/section-two/readme.md)
    * [第二章](chapter-two/readme.md)
        * [第一节](chapter-two/section-one/readme.md)
        * [第二节](chapter-two/section-two/readme.md)
```
对应生成的目录结构如下：
![gitbook目录生成](gitbook目录生成.png)

👉 最佳实践，在开始着手编写之前，利用`gitbook init`脚本，来生成即将要编写的书籍的目录结构，并统一创建对应的目录以及文件

⚠️ 假如我们是手动创建的文件或者文件夹的话，就要对应维护好`SUMMARY.md`文档中的结构

#### 内容编写
内容的编写参考md文件内容的编写规则，如果有引用到本地图片的时候，则仅需要简单地将图片以及md文件放在一起来直接引用即可

#### 预览发布
通过`gitbook serve`命令，可以实时的针对本地编写的md文件进行预览；

当完成编写后，我们可以是将书籍通过`gitbook build`生成对应的html，并提交的服务器上

✨ 我这边由于与hexo博客文件放一起的，因此我可以是作为hexo中忽略文件夹来一起发布，节省我的发布时间，当然，也可以是将这本书单独发布，进行独占一二级域名的方式
