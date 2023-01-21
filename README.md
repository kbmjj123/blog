
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

3. 关于使用外部链接，并采用新开窗口的方式
```markdown
{% link "ProgressPlugin.js" "https://www.91temaichang.com/2023/01/04/webpack-plugin-progress/" true ProgressPlugin.js %}
```

4. 关于使用内部链接的方式
```markdown
{% post_link webpack-plugin-progress ProgressPlugin.js %}
```

5. 引用外部链接，通过`target=_blank`的方式打开链接
{% link 展示的文字 外部链接地址 true hover的标题 %}

6. 项目中采用的是`fontawesome4.7.0`版本的字体图片，要使用的时候，可以直接浏览[fontawesome.com](https://fontawesome.com/v4/icons/)进行浏览

7. 关于草稿箱的使用
  + 新增一草稿文档文件，无需定义其完整目录
  ```bash
    hexo new draft --path webpack-plugin-delegated "DelegatedPlugin"
  ``` 
  这个命令将会在对应的`_drafts`目录中创建对应的草稿文件以及对应的文件夹
  + 迁移草稿文件以及文件夹，调整为正式的博客文档
  ```bash
    hexo publish webpack-plugin-delegated
  ```

