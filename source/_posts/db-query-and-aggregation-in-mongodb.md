---
title: mongodb中的query查询以及聚合管道查询
description: 本文通过罗列并按照不同的类型来整理关于mongodb中的查询筛选操作，以及对应罗列关于聚合管道的分类，将原本mongodb中的查询以及聚合管道按照类目分解的方式，帮助加深对mongodb的查询与聚合管道的理解！
author: Zhenggl
date: 2024-01-22 23:31:46
categories:
  - [后端, 数据库, mongodb]
tags:
  - mongodb
  - mongoose
keywords: mongodb查询语句, mongodb查询语句分类, mongodb聚合管道分类, mongodb查询语句一览 
cover:
---

### 前言
> 在看完`mongodb`的官方文档之后，还是有点一头雾水，对于一些相关的查询以及聚合管道很多不能够信手拈来，而且查询文档的时候也发现难以入手，本文主要针对相关的查询选择器以及聚合管道操作进行分类筛选，让自己对`mongodb`所提供的操作 :u6709: 一定的概念，然后通过这个分类来进行查询使用，加深理解印象！

### mongodb中的查询语句分类
> 一切以`db.collections.find()`方法入手，`mongodb`给我们抽象出来了这个统一的查询入口
> :warning: 在`mongodb`中，我们可以通过`mongosh`程序，通过`db.collections.method`不带括号的方式来查看一个方法的描述，如下图所示；
![db.collections.find方法查看](db.collections.find方法查看.png)
:star2: 通过这种方式，可以查看到该方法的定义与返回值等相关信息

:trollface: 在开始详细介绍这个查询过滤器分类之前，先看一下 :point_down: 的一个分类结构图:
![Mongodb中的查询一览](Mongodb中的查询一览.png)
:alien: 从上图可以看出，针对不同的查询筛选操作，进行了以下对应类目的分类：

1. [比较/范围筛选](比较/范围筛选)
2. [逻辑操作](逻辑操作)
3. [属性匹配](属性匹配)
4. [数组匹配](数组匹配)
5. [地理位置运算匹配](地理位置运算匹配)
6. [数学运算匹配](数学运算匹配)
7. [投影相关](投影相关)
8. [位运算匹配](位运算匹配)
9. [其他匹配操作](其他匹配操作)

#### 比较/范围筛选
> 主要用来筛选某个字段是否满足`大于`、`小于`、`相等`、`不等于`、`大于等于`、`小于等于`等条件
**:stars: 语法规则(以$gt为例)**
```shell
  db.users.find({ <field>: { $eq: <value> } })
```
:point_right: 查询users表中的field属性值等于value值的数据集合

所有的*比较/范围筛选*一览：

| 操作符号 | 描述 |
|---|:---|
| $eq | 筛选出等于某个值的数据集合 |
| $gt | 筛选出大于某个值的数据集合 |
| $gte | 筛选出大于等于某个值的数据集合 |
| $lt | 筛选出小于某个值的数据集合 |
| $lte | 筛选出小于等于某个值的数据集合 |
| $in |  筛选出在某个数组集合中出现过的数据集合 |
| $ne | 筛选出不等于某个值的数据集合 |
| $nin | 晒选出不在某个数组集合中出现过的数据集合 |

#### 逻辑操作
> 主要用来**"连接"**多个不同的筛选条件或者单独取反操作，可支持`逻辑与`、`逻辑或`、`逻辑非`、`逻辑不`操作
**:stars: 语法规则(以$and为例)**
```shell
  db.users.find({ $and: [ {<expression1>}, {<expression2>}, ..., {<expressionN>} ] })
```
:point_right: 上述语法中的`<expression1>`代表一个boolean执行结果的表达式，也就是同时满足多个不同的条件的表达式，这里的表达式可以是其他的筛选条件结果，比如有以下的使用情况：
```shell
  db.users.find({
    $and: [
      { userName: { $eq: 'koby' } },
      { age: { $gt: 18 } }
    ]
  })
```
:point_right: 用来查询users表中userName=koby并且age大于18岁的用户集合！

所有的*逻辑操作一览*

| 操作符号 | 描述 |
|---|:---|
| $and | 同时满足多个条件的数据集合 |
| $not | 不满足某个条件的数据集合 |
| $nor | 同时不满足多个条件的数据集合 |
| $or | 只要有一个条件满足的数据集合 |

#### 属性匹配
> 主要基于数据表字段或者类型的筛选条件，比如存在某个属性或者某个字段的类型判断逻辑
**:stars: 语法规则**
```shell
  db.users.find({<field>: {$exists: <boolean>}});
  db.users.find({<field>: {$type: <BSON type>}})
```
:point_right: 上述语句一主要查询users表中是否存在某个字段field，语句二则是查询user表中某个字段field的类型是否为某个BSON类型的数据

所有的*属性匹配一览*

| 操作符号 | 描述 |
|---|:---|
| $exists | 存在某个属性的数据集合 |
| $type | 存在某个BSON类型的字段值所组成的数据集合 |

#### 数组匹配
> 主要基于数据表中的数组类型字段进行匹配查询操作
> **:stars: 语法规则**
```shell
  db.users.find({<field>: {$all: [<value1>, <value2>, ... <valueN>]}})
  db.users.find({<field>: {$elemMatch: {<query1>, {query2}, ..., {queryN}}}})
  db.users.find({<field>: {$size: 3}})
```
:point_right: 上述语句一主要查询数组类型属性field的值是否都在`value1`、`value2`、`valueN`中出现到，如果是的话，则将其所在的记录添加到查询结果集合中。
语句二则是针对数组属性field中的元素进行query过滤筛选操作，也就是将数组属性中集合中的对象进行query匹配操作。
语句三则是针对数组属性field中元素长度等于3的记录，加入到集合中。

所有的*数组匹配*一览

| 操作符号 | 描述 |
|---|:---|
| $all | 针对某个数组类型的字段进行全亮匹配筛选，全部包含才将所在记录加入到结果集中 |
| $elemMatch | 针对数组属性中的元素进行query匹配操作，符合条件所在记录加入到结果集合中 |
| $size | 针对数组属性长度为size的记录，加入到结果集合中  |

#### 地理位置运算筛选

#### 数学运算匹配
> 通过数学运算求值操作，符合条件的情况，加入到查询结果集中！
> **:stars: 语法规则**
```shell
  db.users.find({$expr: {<expresstion>]}})
  db.users.find({$jsonSchema: {JSON Schema Object}})
  db.users.find({$mod: {divisor, remainder}})
  db.users.find({$regex: /pattern/})
  db.users.find({$where: <string|jscode>})
  db.users.find({$text: {$search:<string>}})
```

#### 投影相关

#### 位运算匹配

#### 其他匹配操作

### mongodb中的聚合管道分类

### 查询之后的操作