
### 博客系统介绍
这个是基于Hexo搭建的关于自定义的博客系统，用于个人学习之用，以下是当前博客系统的分类介绍

访问地址为：[https://www.91temaichang.com](https://www.91temaichang.com)

当前博客系统的框架目录为：
![模块目录框架](https://img.91temaichang.com/blog/blog-structure.png)

### 相关的指令：
`hexo new [Layout] <title>`
用来创建一个新的文档或者新的页面，这里的layout支持三种类型的布局，默认是post，还可以是page、draft，它们会被保存到不同的路径，而自定义的路径则与`post`相同
1. 新增一个博客文件
```bash
  hexo new page --path _posts/XXX "XXX"
```

2. 关于codepen的使用
直接在项目中使用以下的配置即可在界面中加入这个codepen的代码例子：
```markdown
{% codepen slug_hash:'KKeeJrG' %}
```
:point_up: 这里的`KKeeJrG`就是我们在codepen中的项目名称