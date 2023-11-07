---
title: javascript数据类型
author: Zhenggl
date: 2021-03-08 17:59:24
categories:
  - [前端, javascript, 基础]
tags:
  - javascript
  - 基础概念
cover: js-data-type.jpeg
---

***请注意：JS的数据类型有8种***

### 一、JS数据类型的结构
在ES5的时候，我们所知晓的数据类型有6种：`Number`、`String`、`Boolean`、`undefined`、`Null`、`object`。
ES6中新增一种Symbol，这种类型的对象永不相等，即使创建的时候传入相同的值，可以用来解决属性名冲突的问题，作为标记。
谷歌67版本还出现了一种bigInt，是指安全存储、操作大整数。

根据上面描述，我们可以整理出对应如下的结构图：
![JS数据类型结构图](js-data-type-struture.png)

可以将js的8中数据类型拆分为3个大类：基本数据类型 + 对象类型 + 其他类型
然后基本数据类型包含：`Number`、`String`、`Boolean`、`undefined`、`Null`，
对象类型(object)包含：`function`、`array`、`date`

### 二、实际场景下，容易混淆的情况
#### 2.1 JS中typeof输入分别是什么

1. typeof {} 与 typeof [] 输出的都是object；
2. typeof console.info 输出的是function；

*`有一点需要注意：NaN是Number中的一种，非Number`*

`关于isNaN的注意点`
1. 用isNaN()检测是否是非数值类型，如下图：
![isNaN](WX20210309-184249.png)
2. Number('123') == NaN?，这里Number('123')输出的是123，123是不等于NaN的，因此为false

### 三、如何判断数据类型？
#### 3.1 上面有提及到
#### 3.2 toString()
函数作用：其他类型转成string的方法
支持的数据类型有：number、boolean、string、object
不支持的数据类型有：null、undefined
#### 3.3 toLocalString()
函数作用：将数组转成本地字符串

![toLocalString](WX20210309-185011.png)
#### 3.4 检测数据类型的方法
1. instanceof 操作符

![instanceof 操作符](WX20210309-185237.png)

2. 对象的constructor属性

![利用对象的contructor属性](WX20210309-185616.png)

3. Array.isArray()检查数据是否为数组

![利用Array.isArray](WX20210309-185747.png)

### 四、null与undefined有什么区别？
Null只有一个值，是null，一个不存在的对象；
undefined只有一个值，是undefined，没有初始化，undefined是从null中派生出来的。
简单理解就是：undefined是没有定义的，null就是定义了变量，但没有给变量赋值。
### 五、== 与 === 有什么区别，一般在什么场景下使用？
==：表示相同。比较的是物理地址，相当于比较两个对象的hashCode，肯定不相等的。类型不相同，值也可能相等。比如 '1' == 1 为true；
===：表示严格相同，严格判断类型是否相同。

### 六、总结：
1. undefined类型，只有一个值，在使用var/let/const来声明变量但为对其进行初始化的时候，这个变量就是undefined;
2. null类型，只有一个值，null表示一个空对象指针，这也就是为毛typeof null返回的是object的原因；
3. Boolean类型，只有true/false两个值，true不一定等于1，false不一定等于0；
4. Number类型，数字类型，表示数据的整数和浮点数
5. String类型，字符串，可用单引号也可以用双引号表示，字符串不可改变(`一般任何的基本数据类型都是不可改变的`)，改变某个变量保存的字符串，首先要销毁原来的字符串，然后用另一个字符串来填充。
6. Object类型， ES5中的对象其实就是一组数据和函数的集合体，对象可以通过new操作符来创建，创建object类型的实例并为其添加属性或方法，就可以自定义创建对象，如下：
```javascript
  let obj = new Object();
```
object的每个实例都有以下属性和方法：

| 属性名称 | 类型 | 作用 |
| --- | --- | --- |
| constructor | function | 保存着用于创建当前对象的函数，构造函数constructor就是object() |
| hasOwnProperty(propertyName) | function | 用于检查给定的propertyName属性是否在当前对象实例中，而不是在他的原型中 |
| isPrototypeOf(Object) | function | 用于检查传入的对象是否是对象原型 |
| propertyIsEnumerable(propertyName) | function | 属性是否可被枚举，是否可以被使用for-in语句 |
| toLocaleString() | function | 返回对象的执行环境地区字符串表示 |
| toString() | function | 返回对象的字符串表示 |
| valueOf() | function | 返回对象的字符串表示，通常与toString返回的一致 |
