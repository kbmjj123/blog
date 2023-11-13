---
title: webpack中如何加载loader的
description: webpack中如何加载loader的, 如何自定义webpack的loader, webpack拦截解析内容
author: Zhenggl
date: 2023-02-15 05:55:18
categories:
  - [webpack, loader]
tags:
  - webpack
  - loader
cover: webpack中的loader封面.jpg
---

### 前言
{% link "webpack官方loader介绍" "https://www.webpackjs.com/concepts/loaders/" true webpack官方loader介绍 %}
> 关于`webpack`中的`Loader`，平时项目中可能比较少用到，一般的脚手架程序都自动集成相关的`loader`，但是如果我们能够将不同的`loader`给搭配起来，形成项目自身特色的loader集合体的话，在开发/编码过程中可以提升不少的效率，而且也让程序可以 :u6709: 更健壮的稳定性！
> :confused: 那么什么是Loader？如何使用Loader？Loader的加载执行过程是怎样的？一般都有哪些常用的Loader？如何自定义Loader来辅助工作？

### 什么是Loader？
> *loader用于对模块的源代码进行转换，可以让我们在使用`import`或者'load'模块时`预处理`文件*，通过对`loader`的定义与使用，可以让我们在处理不同的文件格式时，采用不同的文件解析协议，比如像`*.hbs`、`*.vue`等文件，通过采用对应的`loader`来将其解析为不同的内容！
> 比如将typescript转换为普通的js，活着将内联图像转换为data URL，甚至允许我们直接在js模块中直接导入css文件。
> :confused: 关键在于预处理，使得我们的所有的模块(文件)加载时都可以先处理转换一下，采用一些官方的公共库来进行对代码/资源的统一转换

### 如何使用Loader？
> 一般地，我们都是在`webpack`地配置文件webpack.config.js中，将这个`loader`给配置使用的，可以是来自于`node_module`目录下的`loader`，也可以是自己编写的`loader`，两者的一个区别主要是在于其中的路径编写方式的区别(node_module下的loader则直接编写loader的名称，而自定义编写的loader则采用相对于webpack.config.js的相对路径js文件)
> 比如 :u6709: :point_down: `css-loader`以及`ts-loader`，我们可以使用`css-loader`来解析加载`*.css`文件，而使用`ts-loader`来解析加载`*.ts`文件
```bash
  npm install --save-dev css-loader ts-loader
```
```javascript
  module.exports = {
    module: {
      rules: [
        { test: /\.css/, use: 'css-loader' },
        { test: /\.ts/, use: 'ts-loader' },
        { test: /\.js/, use: './MyCustomLoader.js' }  // 这里是自定义的loader
      ]
    }
  }
```
:star: 上面这里我们定义了`css-loader`来处理*.css文件，而使用的`ts-loader`来处理的*.ts文件，使用自定义编写的MyCustomLoader.js来处理*.js文件。

:stars: 其实，对于同一种文件，可以 :u6709: 不同的loader来处理，也就是这里的`use`可以是一个数组，如下代码所示：
```javascript
  module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ["babel-loader", "./MyLoader.js", "./MyLoader1.js", "./MyLoader2.js"],
          exclude: /node_modules/
        }
      ]
    }
  };
```
:point_up: 这里对*.js文件采用了4个loader来加载，关于这里 :four: 个loader的执行过程，将在 :point_down: 的加载过程的分析中具体阐述。

:warning: 处理官方推荐的在`webpack.config.js`文件中配置loader的使用，还有一种比较特殊的方式：**内联impor**的方式，来使用`import`的方式，在每个语句中使用对应的loader，而这里loader的方式也有点特殊，如下所示：

:alien: 假如我们需要在一个js中加载css，想要通过`import`语句来加载style.css文件！！！

```javascript
  import styles from 'style-loader!css-loader?modules!./style.css';
```
**通过为内联 import 语句添加前缀，可以覆盖 配置 中的所有 `loader`, `preLoader` 和 `postLoader`**
:point_up: 的import语句等同于
```javascript
  module.exports = {
    module: {
      rules: [
        {
          test: /\.js/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                module: true
              }
            }
          ]
        }
      ]
    }
  };
```
:warning: 注意这里的use可以是一个字符串数组(采用默认的loader配置)，也可以是一个对象数组(可使用自定义的loader配置)

:stars: 这里回过头来对上述的**内联loader**的使用做一个简单的阐述：
![内联loader使用规则](内联loader使用规则.jpg)
1. loader与loader之间只用一个`!`来分割；
2. 在import语句的最开端，使用`规则限定符`来限定对loader的使用：
   1. 使用`!`前缀，代表将禁用所有已配置的 normal loader(普通 loader)；
      ```javascript
        import Styles from '!style-loader!css-loader?modules!./styles.css';
      ```
   2. 使用`!!`前缀，代表将禁用所有已配置的 loader（preLoader, loader, postLoader）；
      ```javascript
        import Styles from '!!style-loader!css-loader?modules!./styles.css';
      ```
   3. 使用`-!`，代表将禁用所有已配置的 preLoader 和 loader，但是不禁用 postLoaders
      ```javascript
        import Styles from '-!style-loader!css-loader?modules!./styles.css';
      ```
3. 选项可以传递查询参数，例如 `?key=value&foo=bar`，或者一个 JSON 对象，例如 `?{"key":"value","foo":"bar"}`


#### Loader的特性
> 从上述[如何使用Loader？](#如何使用Loader?)的相关使用情况，可以通过 loader 的预处理函数，为 `JavaScript` 生态系统提供更多能力。用户现在可以更加灵活地引入细粒度逻辑，例如：压缩、打包、语言转译（或编译）和 更多其他特性，结合官方文档，我们可以整理出 :point_down: 几个关于loader的使用特性：
1. loader 支持链式调用。链中的每个 loader 会将转换应用在已处理过的资源上。一组链式的 loader 将按照相反的顺序执行。链中的第一个 loader 将其结果（也就是应用过转换后的资源）传递给下一个 loader，依此类推。最后，链中的最后一个 loader，返回 webpack 所期望的 JavaScript；
2. loader 可以是同步的，也可以是异步的；
3. loader 运行在 `Node.js` 中，并且能够执行任何操作，也就是它是单纯地在nodejs环境中运行的，是一个node程序；
4. loader 可以通过 `options` 对象配置（仍然支持使用 query 参数来设置选项，但是这种方式已被废弃）；
5. 除了常见的通过 package.json 的 main 来将一个 npm 模块导出为 loader，还可以在 module.rules 中使用 loader 字段直接引用一个模块；
6. `loader` 能够产生额外的任意文件，因为是普通的node程序，因此可以产生任何过程文件以及操作文件。

### Loader的加载执行过程是怎样的？
> **从左到右pitch，从右到左loader，pitch返回值导致上一loader直接执行并结束**

#### pitch与loader的执行顺序
> :confused: 在`webpack.config.js`中定义的关于loader的配置，它是如何被加载已经运行的呢？首先，先看一下一个自定义的以下配置:
```javascript
  module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ["babel-loader", "./MyLoader.js", "./MyLoader1.js", "./MyLoader2.js"],
          exclude: /node_modules/
        }
      ]
    }
  };
```
:stars: 这里对js文件配置了多个loader加载的过程，这里咱们可以先看一下它的一个输出结果(我在对应的loader都做了一个输出动作)
```javascript
  module.exports = function(source){
    console.info('我是MyLoader');
    return source;
  };
  module.exports.pitch = function(remainingRequest, precedingRequest, data){
    console.info('我是MyLoader的pitch');
  };
```
![正向定义-逆向执行](正向定义-逆向执行.png)
:stars: 这里的loader其中都被正向pitch了，然后逆向执行了， :confused: 为什么会是这样子的呢？ 
:point_right: `loader` 总是 从右到左被调用。有些情况下，`loader` 只关心 `request` 后面的 元数据(metadata)，并且忽略前一个 `loader` 的结果。在实际（从右到左）执行 `loader` 之前，会先 从左到右 调用 `loader` 上的 `pitch` 方法 :point_right: 也就是说，使用的`pitch()`，方法通过返回一个元数据，让后续的loader捕获到，从而直接进度loader的主要方法中，实现跳级loader，如下所示：
![跳级的Loader](跳级的Loader.png)
:point_up: 完整的执行过程如下：
![pitch与loader的执行过程](pitch与loader的执行过程.jpg)
从上述的执行过程我们可以得出以下 :point_down: 几个关于`loader`编写时的技巧：
1. 使用自定义的pitch方法返回值，可**提前结束**当下的Loader并直接进入上一个Loader的loader主方法中；
2. 在pitch方法中可往其参数data中写入数据，然后相应的loader主方法可通过函数上下文`this.data`对象来访问到写入的数据；
3. pitch方法中 :u6709: :three: 个参数，第一个remainingRequest代表的是处理的文件路径，第二个precedingRequest代表的是下一个Loader的路径，第三个data则是当前Loader的缓存数据。

#### loader主方法被执行过程
![loader的执行上下文](loader的执行上下文.png)
:confused: 既然每一个Loader主方法都是一个函数，那么这个函数是怎么被调用到的？知道了这个函数怎么被调用的，也就知道了这个函数的上下文对象是谁了！！

:alien: 一切从代码出发！从之前的关于webpack的执行过程了解到，关于对源代码的读取解析过程，最终都变成每个`NormalModule`自身的`build()`操作，同样的，我们也是从这个`NormalModule._doBuild()`方法入口，进入loader的调用执行过程！

:warning: 最终发现，它是凭借三方库{% link loader-runner https://www.npmjs.com/package/loader-runner true loader-runner %}，通过其对外暴露的`runLoaders`方法，通过传递在`webpack.config.js`中定义的`转换后的loaders`配置，来对资源进行处理的，而这个`runLoaders`方法所传递的参数格式如下：
```javascript
  runLoaders({
    // 文件路径
    resources: 'abs/path/to/file.txt?query',
    // 通过从webpack.config.js中转换而来的loaders路径以及接受参数数组
    loaders: ["abs/path/to/loader.js?query", "abs/path/to/loader2.js?query"],
    // loader上下文所需的参数配置
    context: { miniMize: true },
    // 可选参数，额外提供的loader对于资源的处理函数
    processResource: (loaderContext, resourcePath, callback) => {},
    // 额外的读取资源的方法api，只有在未提供processResource方法的时候才会被调用到
    readResource: fs.readFile.bind(fs)
  }, function(err, result) {
    // 处理完成后的结果，主要存储于result对象中，result.result可以是一个字符串或者是一个Buffer对象
  });
```

完整的过程如下：
![runLoaders的过程](runLoaders的过程.png)
针对该过程， :u6709: :point_down: 几个需要注意的对象以及方法：
1. LoaderContext: 我们可以看出主要是创建一个`LoaderContext`上下文对象，并使用该对象来负责执行对应的loader资源的，而这个`LoaderContext`的主要组成如下：
![LoaderContext上下文](LoaderContext上下文.png)
而且，从我们所编写的`webpack.config.js`中的rules可以知道，一个资源可以被多个Loader以链式的方式来调用的，而在`LoaderContext`中则是用一个分隔符"!"来将不同的loader进行分割开来，而传递的options参数，则是作为query属性来进行的存储(如下图所示)！
![loader以特殊分隔符分割的原因](loader以特殊分隔符分割的原因.png)
2. 所编写的loader模块被加载的过程：
![模块加载执行的过程](模块加载执行的过程.png)
这里采用`eval()`的方式，来实现`import`动态加载代码目的；
3. **loader主方法被执行**
![调用主方法传递的参数](调用主方法传递的参数.png)
![调用主方法内容](调用主方法内容.png)
:point_up: 从上面我们可以看出`loader/pitch`方法，都是被一个IIFE包裹执行的函数，而且是**将其上下文捆绑为LoaderContext对象**，这也就说明了为什么我们在 :point_up: 的loader主方法中通过`this.data`可以访问到当前loader所存储的数据的原因了！

### 一般都有哪些常用的Loader？
{% link 官方常用的loader https://www.webpackjs.com/loaders/ true 官方常用的loader %}

### 如何自定义自己的Loader？
{% link 官方编写自己的loader https://www.webpackjs.com/contribute/writing-a-loader/#guidelines true 编写自己的loader %}
```javascript
module.exports = function(source){
	console.info('我是MyLoader');
	console.info(this);
	console.info(this.data);
	return source;
};
module.exports.pitch = function(remainingRequest, precedingRequest, data){
	console.info('我是MyLoader的pitch');
	data.value = '999';
};
```
:stars: 从上述的分析中，我们也已经实现了自定义Loader，也就是对外暴露一个方法，可采用ESM/CommonJS的方式来导出(被加载的时候采用的同步或者异步的区别而已，这里我们采用的同步加载的机制)，通过对外暴露的方法对象中对源文件或者是上一个Loader处理完成后的文件进行处理，并return出去，传递给到下一个Loader对象！

:alien: 而关于这个`自定义Loader`的编写规范，在{% link 官方建议的编写规范 https://www.webpackjs.com/contribute/writing-a-loader/#guidelines true 官方建议的编写规范 %}中也有提及到！
在编写自定义Loader的时候， :u6709: :point_down: 两个工具包可辅助编写：
1. {% link loader-utils https://www.npmjs.com/package/loader-utils true loader-utils %}: 提供了许多有用的工具，但最常用的一种工具是获取传递给 `loader` 的选项;
2. {% link schema-utils https://www.npmjs.com/package/schema-utils true schema-utils %}: 包配合 `loader-utils`，用于保证 `loader` 选项，进行与 `JSON Schema` 结构一致的校验