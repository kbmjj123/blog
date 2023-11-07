---
title: 在gitbook与博客中使用codepen
description: 在gitbook与博客中使用codepen
author: Zhenggl
date: 2022-06-15 08:06:38
categories:
    - [工具, 技巧]
tags:
    - 工具
    - codepen
    - 技巧
    - codepen
cover: codepen在gitbook与hexo中的应用封面.jpeg
---

### 前言
> 近期在编写博客以及在编写这个gitbook的时候，发现在gitbook上有一个插件，就是可以将平时自己编写的在线demo，以链接的方式，集成到gitbook中，再也不用自己去截图，并附加上额外的说明信息了，现特别整理出来关于它的一个集成过程，
> 以及在实际的编写过程中的一个使用。

### gitbook集成codepen(gitbook-plugin-codepens)
1. 首先，安装好对应的插件(gitbook-plugin-codepens)，建议采用npm的方式来安装，配置好国内的源之后，速度就嗖嗖嗖的了；
```shell
  npm install gitbook-plugin-codepens
```
2. 然后在对应的book.json中配置对应的codepen配置
```json
{
  "plugin": ["codepens"],
  "pluginsConfig": {
    "codepen": {
      "height": 600,
      "theme": 13200,
      "description": "我是描述文件",
      "defaultTab": "html"
    }
  }
}
```
3. 配置目标demo路径(这里以[https://codepen.io/kbmjj123/pen/mdXaoKb](https://codepen.io/kbmjj123/pen/mdXaoKb)为例)，对应的在*.md文件中配置的实际访问路径为：
```markdown
    [](codepen://kbmjj123/mdXaoKb?height=400&defaultTab=css,js,result)
```
👆这里也就是将用户名以及项目名给拼接进来

以下是对应的效果图：
![gitbook集成codepen](gitbook集成codepen.png)

4. 后续关于一直添加的测试用的demo例子，则可以直接使用外链来链接访问到即可

### hexo集成codepen(hexo-codepen-snippet)
1. 安装好对应的插件(hexo-codepen-snippet)
```shell
  npm install hexo-codepen-snippet
```
2. 配置博客全局codepen配置，在_config.yml配置文件中进行配置
```yaml
  codepen:
  src_prefix: 'https://codepen.io/kbmjj123/embed'
  default_tab: 'html,css,js'
  theme_id: light
  style: 'height: 400px; width: 100%;'
```
上面👆有一个地方需要注意的是**src_prefix**，这里是将其进行了一个拆分，这里原本的访问链接是
> https://codepen.io/kbmjj123/pen/mdXaoKb
> 拆分后，统一配置为：`https://codepen.io/用户名/embed`，否则会出现iframe跨域的问题

3. 在实际使用的地方配置这个demo的hash值即可，下面👇的配置key与value之间不能有空格
{% codepen slug_hash:'mdXaoKb' %}

