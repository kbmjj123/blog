---
title: Hexo + github + netlify搭建自己的博客系统
author: Zhenggl
date: 2021-03-07 16:27:48
categories:
  - [积累与沉淀,自定义服务]
tags:
  - hexo
  - github
  - netlify
cover_picture: https://img.91temaichang.com/blog/hexo-github.jpg
top: 1
---

### 一、开始使用
#### 1.1简介
根据Hexo官方描述，Hexo是一个快速、简介且高效的博客框架，使用markdown解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

#### 1.2安装
##### 1.2.1环境需求

 - Node.js(版本不得低于10.13，建议使用Node.js12.0及以上)
 - Git

以上两个就不在描述具体如何安装了，度娘一大把
#### 1.3 Hexo安装
```shell
npm install -g hexo
```

### 二、开始使用
#### 2.1 创建博客项目，并初始化
安装完成后，可直接通过hexo创建并初始化项目，通过以下命令
```shell
hexo init blog
```
通过上述命令，我们创建并初始化了项目名为blog的Hexo项目
```shell
cd blog && npm install 
```
#### 2.2 目录结构分析说明
进入blog项目，并安装相关的依赖，通过以下示意图我们可以简单的讲解下项目的目录结构，以及对应的文件作用：
![目录结构](https://img.91temaichang.com/blog/directory-structure.png)
1. .deploy_git: 通过github进行打包部署，所生成的待提交的静态资源文件；
2. scaffold: 通过`new`命令创建出来的页面所需的模版，默认是拿的page作为模版；
3. source: 通过`new`命令创建出来的页面资源的*.md文件目录，一般我们创建的页面，都在这个目录里面，按照`new`命令对应的标题来命名的；
4. themes：引用的三方样式，可直接通过配置文件，引用第三方已开发完成并使用中的模版；
5. _config.yml：整个blog项目的配置文件，从整体上对项目进行全局配置；

#### 2.3 项目配置文件说明
_config.yml为项目的全局配置文件，一般我们通过配置该文件，对项目整体上进行统一的配置，具体对应哪些字段就不再重复说明了，官方文档上已经解说得很清楚的了，详情请直接访问官方的 [链接](https://hexo.io/zh-cn/docs/configuration)
##### 2.3.1 上线部署的配置
```yaml
deploy:
  type: git # 通过git方式来提交
  repo: https://github.com/kbmjj123/hexo-blog.git # 关联github仓库
  branch: main #代码分支
```
### 三、Hexo命令解读：
官方对Hexo的相关命令均进行了详细的说明，具体可以浏览官方的[链接](https://hexo.io/zh-cn/docs/commands)进行熟悉；

### 四、开始写作：
#### 4.1 通过命令创建一新的页面
```shell
hexo new page 文件名称 // 如果文件名称由多个字符串构成，需要使用引号将文件名称包裹起来
```
#### 4.2 通过上述命令，我们可以在对应的`source/_posts`目录中，看到我们添加的文件目录以及对应的*.md文件
#### 4.3 写作完成后，进行资源文件生成，并发布
```shell
hexo g && hexo d // g为generate、d为deploy的缩写
```
这里生成后的资源，均会在.deploy_get目录中生成对应的资源文件，并自动提交至github上，前提是已经在本地将github的key给维护进来了。

### 五、托管到Netlify
#### 5.1 注册Netlify
打开[链接](https://www.netlify.com)进行netlify的注册，并选择代码托管的方式来注册
![注册方式](https://img.91temaichang.com/blog/directory-structure.png)
#### 5.2 创建新的Site，并选择github作为来源
![创建site](https://img.91temaichang.com/blog/netlify-create.png)
#### 5.3 然后选择我们刚刚在github上创建的项目
![选择项目](https://img.91temaichang.com/blog/netlify-choose-project.png)
#### 5.4 选择对应的项目分支
![选择分支](https://img.91temaichang.com/blog/netlify-choose-branch.png)
#### 5.5 接着等一会，netlify会帮我们创建对应的网站，并生成其二级域名
![创建成功](https://img.91temaichang.com/blog/netlify-created-site.png)
#### 5.6 添加项目域名
![配置域名](https://img.91temaichang.com/blog/netlify-edit-domain.png)
#### 5.7 配合下拉弹出的记录值，到域名注册服务商那边，对应配置记录
![获取记录](https://img.91temaichang.com/blog/netlify-edit-domain2.png)
对应登录阿里云控制台，找到域名，对应进入解析配置中心，并对应添加两条记录：
![阿里云DNS解析](https://img.91temaichang.com/blog/aliyun.png)
#### 5.8 解析成功后，我们即可以直接使用自定义域名的方式，来直接访问到我们的blog了
![配置后的访问](https://img.91temaichang.com/blog/blog.png)

