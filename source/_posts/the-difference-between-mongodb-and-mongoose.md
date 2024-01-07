---
title: Mongodb与Mongoose关于schemaType的差异性
description: 通过对接分析关于schemaType在mongoosedb与mongoose的差异性，来加深对schemaType的理解与掌握
author: Zhenggl
date: 2024-01-07 07:47:22
categories:
  - [后端, 数据库, mongodb]
tags:
  - mongodb
  - mongoose
keywords:
  - mongodb中的schema
  - mongodb中的schemaType
  - mongoose中的schemaType
  - schemaType在mongodb与mongoose中的表现
cover: 在mongodb与mongoose中的SchemaType封面.png
---

### 前言
> mongodb是一个机遇分布式文件存储的开源数据库系统，使用的非关系型数据库的设计，其提供了一种高性能、高可用一集易扩展的数据库解决方案。其主要的特点有：`文档导向`、`无模式`、`索引支持`、`复制与高可用性`、`自动分片`、`丰富的查询语言`、`聚合工具`等特性。
> mongoose是一个开源的对象文档映射器(ODM)库，主要为`node.js`提供了一种高效的方式来管理mongodb数据库中的数据，其通过模型定义(Schema definition)、数据验证(Data validation)、查询构建(Query building)、中间件(Middleware)、插件体系(Plugins)等功能，极大的简化了使用mongodb的复杂性！
> `schema`作为`mongodb`与`mongoose`的抽象单元，提供了基础的抽象服务！

### 什么是schemaType？它有什么作用？
> 在`mongodb`中最基本单元是文档(doc)，而文档则由一个个的字段构成，`mongodb`中采用`schema`的抽象概念来对文档进行抽象化，而`schemaType`则是对`schema`中每一个字段的属性的描述，理解了`mongodb`与`mongoose`中关于`schemaType`的不同，可以更好的加深对`schema definition`模型的定义，更好地将业务逻辑抽象出来，更好的管理数据库
:point_right: 可以简单的将`schemaType`理解为*js中不同的数据类型定义*

### mongodb中的schemaType与mongoose中的schemaType都有哪些
> :point_down: 看一下两者的成员枚举对比：
![mongodb与mongoose中的schemaType对比](mongodb与mongoose中的schemaType对比.png)
:star2: 可以发现，基本上除了`Map`类型之外，其他的都一样， :confused: 那么，既然`mongodb`已经基本上拥有`mongoose`所提供的数据类型了，为什么还要多此一举，在`mongoose`中再次声明相关的同样的类型呢？？

:trollface: **mongoose支持潜逃的schema、枚举、自定义验证器等特性，以及可以通过插件扩展的方式来接入更多的schemaType，这些特性都是`mongoose`的在`mongodb`原声驱动基础之上，提供的额外抽象和方便操作！！** :warning: 值得注意的是，在`mongoose`中的某些属性，比如：`trim`、`uppercase`、`lowercase`、`match`等等，这些都是`mongoose`提供的应用层面上的数据预处理和校验功能，而非`mongodb`数据库层面支持的特性！！！

:new_moon_with_face: 既然说提供`mongoose`提供的这些类型是对`mongodb`额外进行的特性追加，那么，它是如何实现的呢？？

### mongoose中对于schema以及schemaType是如何使用的
:trollface: 直接上代码吧，比较容易理解一点

```javascript
  const mongoose = require('mongoose')
  const userSchema = mongoose.schema({
    account: String,
    phone: {
      type: String,
      unique: true
    },
    age: {
      type: String,
      min: 1
    }
  });
```
:-1: 平时在直接使用`mongodb`的时候，可能就直接怼上去了，并没有太多专门针对schema做如此详细的定义，通过提前对schema中的schemaType的类型的定义声明，可以在更新这个schema数据的时候，提前做一个校验，减少错误信息的录入！！

### 与mongoose的schemaType类型相对应的属性都有哪些？
![Mongoose中的SchemaType](Mongoose中的SchemaType.png)

