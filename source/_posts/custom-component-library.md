---
title: vue自定义组件库
author: Zhenggl
date: 2021-03-20 09:42:55
categories:
    - [开发框架, vue]
tags:
    - vue
    - 自定义组件
    - npm
cover: custom-component-library.jpeg
---

### 一、前言
针对目前实际开发过程中，企业团队内部经常会使用一些功能一样的组件，不想到处复制粘贴，又不能将组件提交到公共的npm上，毕竟是公司的隐私信息，想像iView/ElementUI这些开发框架一样，使用到公司内部的所有系统中，因此，需要搭建公司内部的npm，npm如何搭建就不再描述了，可以参考另外一篇博客文章，这里主要是讲解下如何搭建自定义的组件库，并提供给到各个业务系统使用
### 二、组件库的制作
#### 2.1 组件库的初始化
这里是在vue脚手架的基础上，自定义开发项目的公共组件库，并调整组件库的项目目录结构：

![组件库目录](component-directory-structure.png)

从👆组件库我们可以看出，与标准的vuecli创建出来的项目有所区别的：

+ examples：存放着对每个组件的使用示例
+ lib：打包后的结果文件，以便于全局引用
+ packages：组件库所有的目录，每个组件都已单目录文件命名，且对应提供各自的index.js对外引用，且在packages根目录中提供公共的index.js，对每个组件进行安装；
+ public：项目运行所在的html模版
+ vue.config.js：vue cli3.0对应的配置文件，里面对应配置每个页面的访问链接
+ package.json：项目的package文件
#### 2.2 组件库中组件的开发
这里一一个倒计时组件为例子：
首先一个组件的目录结构如下
+ count-down
  - count-down.vue: 组件的内容与逻辑
  - index.js: 组件对外暴露的方式
  - readme.md: 组件的一个使用文档
在组件count-down.vue中，针对其name属性，一般是首字母大写的驼峰式描述：CountDown，便于后续index.js直接引用，并对外暴露；
index.js的内容如下：
```javascript
import CountDown from './count-down';
CountDown.install = Vue => {
  Vue.component(CountDown.name, CountDown);
};
export default CountDown
```
将CountDown组件暴露给Vue注册，然后在公共的入口js(packages/index.js)处暴露出来
```javascript
import CountDown from './count-down'
export const components = {
	CountDown
};

const install = Vue => {
	if (install.installed) return;
	Object.keys(components).forEach(key => {
		Vue.component(key, components[key]);
	});
};

if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue);
}
export default {
	version: '0.0.5',
	install,
	...components
}
```
对外暴露的统一的组件调用，至此，组件的编写以及对外暴露的方式均已完成
### 三、组件库的验证使用
#### 3.1 组件的示例验证
组件开发完成了，总要验证当前组件是否可用咯，因此，需要在对应的examples目录中，通过vue.config.js配置每个组件的示例路由，对组件的功能逻辑进行验证
```javascript
module.exports = {
	pages: {
		//定义多个不同的page
		index: {
			entry: 'examples/count-down/main.js',
			template: 'public/index.html',
			filename: 'index.html'
		}
	},
	chainWebpack: config => {
		config.resolve.alias
			.set('@', path.resolve('examples'))
			.set('~', path.resolve('packages'));
		// lib目录是组件库最终打包好存放的地方，不需要eslint检查
		config.module
			.rule('eslint')
			.exclude.add(path.resolve('lib'))
			.end()
			.exclude.add(path.resolve('examples/docs'))
			.end();
		// packages和examples目录需要加入编译
		config.module
			.rule('js')
			.include.add(/packages/)
			.end()
			.include.add(/examples/)
			.end()
			.use('babel')
			.loader('babel-loader')
			.tap(options => {
				return options;
			});
	}
}
```
通过上述配置，将本地examples目录作为验证的页面，配置对应的页面路由
#### 3.2 组件的打包发布
组件开发并验证完毕后，需要对其进行打包操作，在package.json中的scripts节点中新增一动作
```shell script
  lib: vue-cli-service build --target lib --name xx-component --dest lib packages/index.js
```
👆指令意思是：组件库的名称为xx-component，组件库入口文件为packages/index.js，生成的结果文件存放在lib目录中。

组件发布到内部npm，升级package.json中的version版本号，然后利用nrm切换到内部npm源地址，直接运行以下执行指令发布到npm上
```shell script
  npm publish
```
### 四、组件库的安装与使用
上面已经将组件库发布到内部npm了，那么我们需要在项目中直接用组件，首先先安装依赖，npm指向内部npm的优先
```shell script
  npm install xx-component --save
```
#### 3.1 全局使用
在main.js文件中引入组件库
```javascript
  import XXComponent from 'xx-component';   //导入组件库
  import 'xx-component/lib/xx-component.css';//导入组件库全局样式
  Vue.use(XXComponent); //全局使用组件库
  // ...
  // 以下是具体的组件使用，因为是全局引用，因此直接使用即可------test.vue
  <template>
    <div>
      <count-down/>
    </div>
  </template>
```
#### 3.2 按需加载(推荐)
随着组件库维护越来越大，不可能一口气导入，否则项目打包出来的体积会比较大，因此利用`babel-plugin-import`以及`babel-plugin-component`来实现按需加载
在main.js中引入样式文件：
```javascript
  import 'xx-component/lib/xx-component.css';//导入组件库全局样式
```
然后，在根目录中新建一文件：babel.config.js(babel7.0以后的写法)，
```javascript
module.exports = {
	"presets": [
		"@vue/app"
	],
	"plugins": [
		[
			"import",
			{
				"libraryName": "xx-component",
				"libraryDirectory": "packages"
			}
		]
	]
};
```
👆plugins是一二维数组，其中每个子元素都是一个数组，libraryName代表的是组件库名称，libraryDirectory代表的是组件所在的目录，用于告知如何找到组件并使用组件
这样子之后，我们就可以直接在实际的页面组件中引用并使用组件了
```vue
  <template>
    <div>
      <count-down/>
    </div>
  </template>
  <script>
    import { CountDown } from 'xx-component';
    export default {
      components: {
        CountDown
      }
    }
  </script>
```

