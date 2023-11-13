---
title: 踩了marked.js的坑后，我选择了markdown-it
description: 踩了marked.js的坑后，我选择了markdown-it, markdown-it如何使用
author: Zhenggl
date: 2023-03-18 08:09:03
categories:
    - [前端, javascript]
tags:
    - javascript
    - coding
    - markdown
cover: markdown-it-封面.jpeg
---

### 前言
> 近期在折腾这个`chatGPT`的时候，发现在进行字符串的拼接过程中，如果出现了代码的话， :confused: 一旦在代码中出现换行符的时候，`marked`库就自动将其识别为一个`code-block`，导致我们在解析这个字符串内容的时候，一下子出现普通文字，一下子出现代码块，硬生生给自己找了坑！
> 在经过两天的奋战后，问了一下chatGPT，然后它居然堂而皇之地承认了！
> :trollface: 在经过一大段时间的调查与尝试，最后采用了`markdown-it`，个人觉得很有必要将这个给 :pencil2: 下来，以免其他人以及自己在未来的工作学习中又重复踩到这个雷！

:point_down: 是对应的待验证的一段代码
```python
def fibonacci(n):
    if n < 0:
        return None
```

:confused: 大家会发现这是一段未结束的代码，而且在实际的字符串拼接过程中，它是没有代码块结束符号的，具体解析过程如下图所示：
![marked将非换行符识别成了整块的字符串](marked将非换行符识别成了整块的字符串.png)
![marked将换行符识别成了代码块终止的标志](marked将换行符识别成了代码块终止的标志.png)

:stars: 从上述可以看出`marked`它会**自动地将代码块中的一个换行符当作是一个代码块终止的标志**，所以才会有这个代码块与普通的字符串来回切换的异常情况！！

:bug: 那么应当如何来解决这个问题呢？ :point_right: 最终，这边采用了`markdown-it`库来替代这个`marked`！！

:stars: 这里 :u6709: 必要来针对这两者是如何使用做一个记录，方便后续自己更好地分辨使用！

### marked
{% link "marked官方文档" "https://marked.js.org/" true marked官方文档 %}
>  按照官方文档所描述的，`marked.js`是一个快速的、轻量级的markdown编译器，用于解析markdown、非阻塞的，而且支持代码风格配置(highlight)的解析库！

#### 如何使用
**安装依赖**
```bash
  npm install marked
```
**执行解析操作**
```javascript
  marked.parse(markdownString[, options] [, callback] );
```
而关于这里的参数说明如下：

| 参数 | 类型 | 描述 |
|---|---|:---|
| markdownString | String | 待解析的markdown文档内容 |
| options | Object | key-value的键值对对象，与`marked.setOptions()`所传递的参数一致 |
| callback | Function | 解析处理完成的回调函数，也可以作为`options`对象参数的属性来使用 |

#### 参数一览
> 关于这个`options`参数，其所提供的属性以及描述如下：
```javascript
// Create reference instance
import { marked } from 'marked';

// Set options
// `highlight` example uses https://highlightjs.org
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, lang) {
    const hljs = require('highlight.js');
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false
});

// Compile
console.log(marked.parse(markdownString));
```
:point_up: 上述代码对应的属性描述如下：

| 属性 | 类型 | 默认值 | 描述 |
|---|---|---|:---|
| async | boolean | false | 如果设置为true，则`walkTokens`函数将是异步的并且这个`marked.parse()`将在解析后返回一个promise |
| baseUrl | string | null | 如果有相对链接link，则设置其作为相对链接的根链接 |
| breaks | boolean | false | 设置为true则代表在单独的一行或者注释中添加一个`<br>`换行标签(前提是`gfm`=true) |
| gfm | boolean | true | 使用标准的[GitHub Flavored Markdown (GFM) 规范](https://github.github.com/gfm/) |
| headerIds | boolean | true | true则代表往对应的`h1、h2、h3、h4`添加id属性 |
| headerPrefix | string | '' | 在发出标题（h1、h2、h3 等）时作为 id 属性前缀的字符串 |
| highlight | function | null | 用于对代码块进行高亮处理的函数，一般借助于`highlight`三方库 |
| langPrefix | string | 'language-' | 当针对的`code-block`使用的代码高亮块时，追加的class类名前缀，便于与系统的其他区分开来 |
| mangle | boolean | true | 自动链接的电子邮件地址将使用 `HTML` 字符引用进行转义 |
| pedantic | boolean | false | 如果为true，则尽可能符合原始`markdown.pl`，不修复原始的降价错误或行为，关闭并覆盖 `gfm` |
| renderer | object | new marked.Renderer() | 包含将标记呈现为 `HTML` 的函数的对象 |
| sanitize | boolean | false | true则代表将使用`sanitizer`函数清理传递给`markdownString`的HTML，**已废弃属性** |
| sanitizer | function | null | 见`sanitize`属性描述 |
| silent | boolean | false | true则代表当解析异常时，不抛出任何的异常信息 |
| smartypants | boolean | false | true则代表对引号以及破折号使用“智能”印刷标点符号 |
| tokenizer | boolean | new marked.Tokenizer() | 一个包含从markdown创建标记的函数对象 |
| warkTokens | function | null | 在每一个token调用的时候所出发的函数 |
| xhtml | boolean | false | true则针对单节点标签加一个'/' |

#### marked自定义renderer
> 在使用的`marked.js`使用过程中，我们通常是针对`options`中的`renderer`属性进行重载，来实现自定义的渲染机制！！！
```javascript
// Create reference instance
import { marked } from 'marked';

// Override function
const renderer = {
  heading(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return `
            <h${level}>
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${level}>`;
  }
};
marked.use({ renderer });
// Run marked
console.log(marked.parse('# heading+'));
```

### markdown-it
{% link "markdown-it官网" "https://github.com/markdown-it/markdown-it" true markdown-it官网 %}
> 快速而且易于扩展的`markdown解析库`，它支持语法扩展以及语法糖(URL自动链接、排版器)
![markdown-it兼容代码块的展示](markdown-it兼容代码块的展示.png)

### markdown-it如何使用
{% link "markdown-it的相关API文档" "https://markdown-it.github.io/markdown-it/" true markdown-it的相关API文档 %}

:stars: 简单使用
```javascript
// node.js, "classic" way:
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
var result = md.render('# markdown-it rulezz!');

// node.js, the same, but with sugar:
var md = require('markdown-it')();
var result = md.render('# markdown-it rulezz!');

// browser without AMD, added to "window" on script load
// Note, there is no dash in "markdownit".
var md = window.markdownit();
var result = md.render('# markdown-it rulezz!');
```

:stars: 单行使用
```javascript
var md = require('markdown-it')();
var result = md.renderInline('__markdown-it__ rulezz!');
```

:stars: 通过配置参数使用， :point_right: 可通过预定义的配置(`commonmark`、`zero`、`default`)来生成
```javascript
// commonmark mode
var md = require('markdown-it')('commonmark');

// default mode
var md = require('markdown-it')();

// enable everything
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});

// full options list (defaults)
var md = require('markdown-it')({
  html:         false,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                              // This is only for full CommonMark compatibility.
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                              // useful for external highlighters.
  linkify:      false,        // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
  typographer:  false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: function (/*str, lang*/) { return ''; }
});
```

#### 使用过程需注意的点
1. linkify-it: 在其中 :u6709: 使用到对文档字符串中的中文链接检测库[linkfy-it链接](http://markdown-it.github.io/linkify-it/doc/#LinkifyIt)；
2. highlighting: 在markdown一般都有对代码高亮的展示，可通过引用该库来实现代码高亮的配置；