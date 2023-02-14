---
title: webpack中的模块管理
description: ESM, CommonJS, AMD, webpack中的模块管理
author: Zhenggl
date: 2023-02-14 05:34:09
categories:
  - [webpack]
tags:
  - webpack
cover_picture: webpack中的模块封面.jpg
--- 

### 前言
---
> 本文主要着重介绍关于`webpack`中的模块是如何管理的，其实在网络上已经也有不少的文章关于`ES6`、`CommonJS`、`AMD`的相关介绍了，本文主要侧重于这个模块管理的使用方式！
> 三者都是对模块进行依赖管理的目的，实现同步/异步加载的目标！

### ESM
> `ESM`主要包含 :u6709: :two: 个关键词：`import`和`export`！

#### export
> `export` 语句用于从模块中导出实时绑定的函数、对象或原始值，以便其他程序可以通过 `import` 语句使用它们。被导出的绑定值依然可以在本地进行修改。在使用 `import` 进行导入时，这些绑定值只能被导入模块所读取，但在 `export` 导出模块中对这些绑定值进行修改，所修改的值也会实时地更新。
> 存在 :u6709: 种方式的导出：
> 1. 命名导出（每个模块包含任意数量）
> 2. 默认导出（每个模块包含一个）

**语法规则：**
```javascript
// 导出单个特性
export let name1, name2, …, nameN; // also var, const
export let name1 = …, name2 = …, …, nameN; // also var, const
export function FunctionName(){...}
export class ClassName {...}

// 导出列表
export { name1, name2, …, nameN };

// 重命名导出
export { variable1 as name1, variable2 as name2, …, nameN };

// 解构导出并重命名
export const { name1, name2: bar } = o;

// 默认导出
export default expression;
export default function (…) { … } // also class, function*
export default function name1(…) { … } // also class, function*
export { name1 as default, … };

// 导出模块合集
export * from …; // does not set the default export
export * as name1 from …; // Draft ECMAScript® 2O21
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …;
export { default } from …;
```

#### import
> 静态的 `import` 语句用于导入由另一个模块导出的绑定

:warning: 在希望按照一定的条件或者按需加载模块的时候，动态 `import()` 是非常有用的。而静态型的 `import` 是初始化加载依赖项的最优选择。

**语法规则：**
```javascript
import defaultExport from "module-name";
import * as name from "module-name";
import { export } from "module-name";
import { export as alias } from "module-name";
import { export1 , export2 } from "module-name";
import { foo , bar } from "module-name/path/to/specific/un-exported/file";
import { export1 , export2 as alias2 , [...] } from "module-name";
import defaultExport, { export [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name";
var promise = import("module-name");
```

##### 动态导入
> 标准用法的 import 导入的模块是静态的，会使所有被导入的模块，在加载时就被编译（无法做到按需编译，降低首页加载速度）。有些场景中，你可能希望根据条件导入模块或者按需导入模块，这时你可以使用动态导入代替静态导入。下面的是你可能会需要动态导入的场景：
1. 当静态导入的模块很明显的降低了代码的加载速度且被使用的可能性很低，或者并不需要马上使用它。
2. 当静态导入的模块很明显的占用了大量系统内存且被使用的可能性很低。
3. 当被导入的模块，在加载时并不存在，需要异步获取。
4. 当导入模块的说明符，需要动态构建。（静态导入只能使用静态说明符）
5. 当被导入的模块有副作用（这里说的副作用，可以理解为模块中会直接运行的代码），这些副作用只有在触发了某些条件才被需要时。（原则上来说，模块不能有副作用，但是很多时候，你无法控制你所依赖的模块的内容）

**动态导入语法**
```javascript
import('/modules/my-module.js')
  .then((module) => {
    // Do something with the module.
  });
  // 也可使用await关键词来等待
let module = await import('/modules/my-module.js');
```

:stars: `import()`语法在webpack中将会把一个模块以及它所引用的子模块分割到一个单独的chunk中来加载！

:warning: 关于`import(params)`中的参数(params)表达式定义，这里的params不能是完全的“**动态的参数**”，而是**必须至少包含一些关于模块的路径信息**，包可以限定于一个特定的目录或文件集，以便于在使用动态表达式时 - 包括可能在 `import()` 调用中请求的每个模块! :point_right: 也就是说，这个`params`参数，必须是明确的已知路径！

### CommonJS
> `CommonJS` 的目标是为浏览器之外的 JavaScript 指定一个生态系统
> `webpack` 支持以下 `CommonJS` 的方法：

#### require
> 已同步的方式检索其他模块的导出!

**语法规则：**
```javascript
require(dependency: String);
var $ = require('jquery');
var myModule = require('my-module');
```

#### require.resolve
> 已同步的方式获取模块的 ID

#### require.cache
> 多处引用同一模块，最终只会产生一次模块执行和一次导出。所以，会在运行时（runtime）中会保存一份缓存。删除此缓存，则会产生新的模块执行和新的导出

```javascript
var d1 = require('dependency');
require('dependency') === d1;
delete require.cache[require.resolve('dependency')];
require('dependency') !== d1;
```

#### require.ensure
> `webpack`特有，后续被`import()`所代替！
**语法规则：**
```javascript
require.ensure(
  dependencies: String[],
  callback: function(require),
  errorCallback: function(error),
  chunkName: String
)
```
:star: 给定 `dependencies` 参数，将其对应的文件拆分到一个单独的 `bundle` 中，此 `bundle` 会被异步加载。当使用 `CommonJS` 来引用模块语法时，这是动态加载依赖项的唯一方法。这意味着，可以在模块执行时才允许代码，只有在满足特定条件时才会加载 `dependencies`

### AMD
> `AMD`（Asynchronous Module Definition）是一种定义了用于编写和加载模块接口的 JavaScript 规范
**语法规则：**
```javascript
define([name: String], [dependencies: String[]], factoryMethod: function(...))
define(['jquery', 'my-module'], function ($, myModule) {
  // 使用 $ 和 myModule 做一些操作...
  // 导出一个函数
  return function doSomething() {
    // ...
  };
});
```
:star: 如果提供了 dependencies 参数，就会调用 factoryMethod 方法，并（以相同的顺序）导出每个依赖项。如果未提供 dependencies 参数，调用 factoryMethod 方法时会传入 require , exports 和 module（用于兼容！）。如果此方法返回一个值，则返回值会作为此模块的导出

### 三者对比

| 模块机制 | 静态加载 | 动态加载表达式 | 异步加载 |
|---|---|---|---|
| ESM | :white_check_mark: | :x: | :white_check_mark: 
| CommonJS | :white_check_mark: | :white_check_mark: | :white_check_mark: 
| AMD | :white_check_mark: | :x: | :white_check_mark: 