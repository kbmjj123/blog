---
title: Module与其家族们
author: Zhenggl
date: 2023-01-29 08:48:30
description: Module与它的家族们
categories:
  - [webpack, module]
tags:
  - webpack
  - module
cover_picture: module封面.jpg
---

### 前言
> `Module`，作为`webpack`中的基本模块单元，继承于`DependenciesBlock`，使其具备缓存其他模块而形成的依赖关系，也就是说，webpack中的关于模块的定义声明皆来自于此！
> ![module家族们](module家族们.png)
> 我们所定义的一个个文档都是一个个的模块，模块之间允许互相依赖，而依赖在程序中的表现形式，则是以**DependenciesBlock中的Dependency[]数组来存储的**

### DependenciesBlock
> **作为抽象的模块基类，允许添加/删除依赖，就像是Array数组般一样！**
> 1. 通过其成员属性`dependencies(Dependency数组类型)`，来维护引用依赖的其他模块，主要用与同步加载的其他模块；
> 2. 通过其成员属性`block(AsyncDependenciesBlock数组类型)`，来维护引用依赖的其他模块，采用异步分割代码加载的方式来加载的其他模块；
> 3. parent属性，指向父模块；

#### Depencency
> 作为依赖模块形成的基本单元，是一个模块关系的基本单元，可以认为是依赖的代码位置描述对象，其成员属性/方法主要有：
> 1. loc: 是一个DepencencyLocation对象，代表依赖形成所在的源码位置；
> 2. getReference(): 根据模版依赖图，来获取所引用的模块以及导出的模块；
> 3. getReferenceExports(): 获取当前依赖所导出的模块；
> 4. getExports(): 获取当前依赖所导出的模块名称；

#### AsyncDecendenciesBlock
> 继承于`DependenciesBlock`，可以理解为单独的另外一个模块，主要运用于异步加载模块的方式！

### Module
> 作为承载文件的抽象模块，继承于`DependenciesBlock`，在具备依赖关系形成的同时，额外提供了所有模块的抽象动作，使得所有的模块(比如js、json、其他格式)都拥有同样的交互！

### NormalModule
> 继承于`Module`，由 {% post_link normal-module-factory-in-webpack NormalModuleFactory %} 所创建，一般通过传递的`NormalModuleCreateData`参数对象来创建的普通模块对象！
> 关于该对象中的核心成员主要 :u6709:
1. parser: 作为模块代码的解析器，主要负责将当前模块内容解析为可识别的对象；
2. request: 字符串类型，主要提供当前模块所在的文件路径；
3. loaders: 提供的额外服务加载器，主要负责加载不同类型的文件；

:stars: 提供的关键API：**build**
```javascript
  build(options, compilation, resolver, fs, callback) {
    return this._doBuild(options, compilation, resolver, fs, hooks, err => {
      try {
				const source = this._source.source();
				result = this.parser.parse(this._ast || source, {
					source,
					current: this,
					module: this,
					compilation: compilation,
					options: options
				});
			} catch (e) {
				handleParseError(e);
				return;
			}
    });
  }
```
:stars: 关于上述中的`parser`，默认是`JavascriptParser`对象，通过`fs`模块，来读取一个文件(比如*.js)，获取该文件的内容，然后将获取的js字符串内容进行解析，使之成为一颗**AST树**，
![将字符串解析成一颗AST树](将字符串解析成一颗AST树.png)
在该AST树形成的过程中，也会触发响应的钩子方法(因为该对象中也存在着`hooks`成员属性，当解析到对应的内容的时候，可以通过监听的机制，来实现对js内容的监听)，比如可以使用 :point_down: 的方式来实现对自己编写的代码的内容进行一个监听：
```javascript
/* eslint-disable prettier/prettier */
class XXXPlugin {
	constructor(options) {
		this.options = options;
	}
	apply(compiler) {
		compiler.hooks.normalModuleFactory.tap('XXXPlugin', normalModuleFactory => {
			normalModuleFactory.hooks.parser.for('javascript/auto').tap('XXXPlugin', (parser, options) => {
				// 解析过程的动作
				parser.hooks.varDeclarationConst.for('testFun').tap('XXXPlugin', declaration => {
					console.info(declaration);
				})
			});
		});
	}
}
module.exports = XXXPlugin;
```
:point_up: 这里定义了一个插件，该插件主要负责对js解析器进行监听，当定义了`testFun`变量的时候，将这个定义的代码给输出来，如下图所示：
![自定义插件监听变量的定义](自定义插件监听变量的定义.png)

:confused: 这里 :u6709: 一个疑惑的是，这个parser好像从头到尾都没有被赋值传递进来过，怎么就突然拥有值了呢？它是在什么时候？通过什么方式来创建出来并赋值的呢？
:point_right: 这里需要追溯到`NormalModuleFactory`的创建过程，以及默认的插件被赋予的过程！首先，这个`webpack`的默认插件已经赋予了其对应的操作，如下图所示：
![JavascriptParser解析器插件设置的过程](JavascriptParser解析器插件设置的过程.png)
```javascript
// JAvascriptModulesPlugin.js
apply(compiler){
  compiler.hooks.compilation.tap(
			"JavascriptModulesPlugin",
			(compilation, { normalModuleFactory }) => {
        const hooks = JavascriptModulesPlugin.getCompilationHooks(compilation);
				normalModuleFactory.hooks.createParser
					.for("javascript/auto")
					.tap("JavascriptModulesPlugin", options => {
						return new JavascriptParser("auto");
					});
				normalModuleFactory.hooks.createParser
					.for("javascript/dynamic")
					.tap("JavascriptModulesPlugin", options => {
						return new JavascriptParser("script");
					});
				normalModuleFactory.hooks.createParser
					.for("javascript/esm")
					.tap("JavascriptModulesPlugin", options => {
						return new JavascriptParser("module");
					});
      });
}
```
:point_up: 这里的赋值，使得当`Compiler.hooks.compilation`创建一个新的`Compilation`对象时，就对这个`NormalModuleFactory.hooks.createParser`钩子动作进行了监听，在该监听实现中，对不同的解析器提供了不同的解析操作，这里的解析操作`JavascriptParser`，则使用了`acorn`库来进行对应的解析工作。一般都有以下的解析类型：
![NormalModuleFactory的parser钩子动作](NormalModuleFactory的parser钩子动作.png)
而当创建完成一个`NormalModuleFactory`对象的同时，会自动通过其钩子方法对应调用其自身的`createParser()`方法
```javascript
createParser(type, parserOptions = {}) {
		parserOptions = mergeGlobalOptions(
			this._globalParserOptions,
			type,
			parserOptions
		);
		const parser = this.hooks.createParser.for(type).call(parserOptions);
		if (!parser) {
			throw new Error(`No parser registered for ${type}`);
		}
		this.hooks.parser.for(type).call(parser, parserOptions);
		return parser;
	}
```
这里生成的`parser`将作为`NormalModule`的参数传递给这个`NormalModule`对象，实现每个module自己的“自解析”过程