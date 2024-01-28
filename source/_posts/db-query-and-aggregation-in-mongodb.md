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
:point_right: 语句一($expr)用于执行部分聚合管道操作。
语句二($jsonSchema)用于验证待查询的数据是否满足某个jsonSchema说明对象。
语句三($mod)用于过滤某个值是否能够被divisor求余，且余数为remainder。
语句四($regex)用于正则匹配某个字段是否满足某个正则表达式。
语句五($where)用户执行字符串表达式或者一个js函数，用于动态执行结果的集合判断。

#### 投影相关
> 投影运算符将指定操作返回的字段。
> **:stars: 语法规则如下**
```shell
  db.collection.find(query, projection)
```
:star2: 这里`query`为查询条件，用于过滤文档，而`projection`是投影操作符，用于指定要返回的字段，通过在projection对象中指定某些属性是否为1来控制是否查询返回结果中是否包含对应的字段！

> **:stars: `<array>.$`语法规则如下**
```shell
  db.collection.find(query, {"<field>.$": 1})
```
:point_right: 代表查询每个文档中的field数组中的第一个元素!

> **:stars: `$elemMatch`语法规则如下**
```shell
  db.collection.find({<field>: {$elemMatch: {condition1, condition2, ...}}})
```
:point_right: 可以在查询中用于指定对数组中的元素应用多个条件，从而筛选出对应的结果集合，可以理解为对记录中的数组字段进行瘦身，使得查询结果中仅返回符合搜索结果的结果！

:trollface: 比如有以下的一个文档：
```json
{
  "_id": 1,
  "scores": [
    {"type": "exam", "score": 80},
    {"type": "quiz", "score": 85},
    {"type": "homework", "score": 88},
    {"type": "homework", "score": 92},
  ]
}
```
:point_right: 如果我们想查找`scores`数组中`type`为"homework"并且`score`大于等于90的元素，可以使用`elemMatch`对数组进行投影瘦身操作：
```javascript
  db.collection.find({
    $elemMatch: {
      type: "homework",
      score: {$gte: 90}
    }
  })
```
:point_right: 将最终返回以下的结果：
```json
  {
    "_id": 1,
    "scores": [
      {"type": "homework", "score": 92}
    ]
  }
```
:confused: 这里我们可以看到`scores`属性被瘦身了，仅返回符合条件的查询结果！

> **:stars: `$slice`语法规则如下**
```shell
  db.collection.find(<query>, {<arrayField>: {$slice: <number>}})
  db.collection.find(<query>, {<arrayField>: {$slice: [<numer to skip>, <number to return>]}})
```
:point_right: 对查询结果中的arrayField属性进行裁剪，仅保留前number个元素集合

#### 位运算匹配

#### 其他匹配操作
1. $comment: 添加注释到查询的位次，使得配置文件数据更加容易解释和跟踪；
其语法规则如下：
```shell
  db.collection.find({<query>, $comment: <comment>})
```
:stars: 这里将用comment字符串来说明这个查询的过滤动作。

2. $rand: 生成一个0到1之间的随机小数数字；
其语法规则如下：
```shell
  db.collection.find({$expr: {$lt: [0.5, {$rand: {}}]}})
```
:stars: 这里将生成一个0到1的小数，使得聚合管道能够正常的运行！

### mongodb中的聚合管道分类

#### 相关概念
> 在开始整理关于这个`mongoose`的聚合管道之前，我们先来了解一下什么是聚合管道：*聚合管道是对db查询的一个补充，也可以通过聚合管道来`转换`或者`合并`操作来生成新的文档属性，并提供对基础数据的查询与筛选操作，*
> *聚合管道一般有多个`stage`组成，每个`stage`之间通过`pipe`连接而成，而且上一个`stage`的输出结果将作为下一个`stage`的输入，最终输出结果！* 
> 最终实现将多个文档的值分组在一起，也可以对分组数据执行操作以返回单个结果(比如总计、平均值、最大值和最小值等等)，还可以分析数据随时间的变化情况！
> 其执行过程如下图所示：
![聚合管道的执行过程](聚合管道的执行过程.png)

:warning: **正常情况下，使用了聚合管道将不会改变到原始的document，除非使用了`$merge`或者`$out`**

#### 使用方式
> 聚合管道以`aggregate()`方法开始，通过接收一数组作为参数，来实现多个不同的stage之间的连接
```javascript
  db.collections.aggregate([
    { $match: ... },
    { $group: ... },
    { $sort: ... }
  ], options)
```
:star2: 这里的数组中的每一对象都代表一个个的stage操作，一般情况下，都会针对文档中的某些属性进行相关的逻辑操作，采用`$属性名`的方式进行属性值的直接访问，采用`$$ROOT`代表对整个文档记录的访问，采用`$$属性名`则代表在聚合管道过程中使用了变量，对变量的值的访问！

#### 聚合管道的分类
> 在`mongodb`中提供了不同类型的管道来对文档进行操作，基本上体现为对文档的重塑操作
![mongodb聚合管道一览](mongodb聚合管道一览.png)

::trollface 从上图我们可以看出`mongodb`给我们提供了不少的管道操作，这里我们可以认为它给我们提供了不同的函数API，我们不用去深入了解到每个API具体的内容，我们所需要做的是了解知道都有哪些API，可以通过这些API来达到哪些方向的实现即可！！！

:point_down: 我们来进行其中一些常见的聚合管道进行分析

##### 聚合表达式操作符
> 在开始分析这个聚合管道之前，先来了解一波关于这个**聚合操作符**，:point_right: 与其说是聚合操作符，不如说是聚合操作函数，通过提供类似于`js函数调用的方式来提供属性的值`，其语法规则如下：
```javascript
  // 接收单个参数
  {
    <operator>: <argument>
  }
  // 接收多个参数
  {
    <operator>: [<argument1>, <argument2>, ...]
  }
```
:star2: 关于`mongodb`中的聚合操作符， :point_down: 下面整理了不同类型的聚合操作清单列表：
![聚合操作符一览](聚合操作符一览.png)
关于其中具体的操作符的使用，可通过{% link "官方文档" "https://www.mongodb.com/docs/manual/reference/operator/aggregation/" true 官方文档 %}进行检索使用！

##### 部分聚合管道使用
> 由于`mongodb`中提供了太多的聚合管道(也就是一系列的函数)，因此这边仅针对实际上可能经常使用到的聚合管道进行一个简单的说明。

###### $project
> 通过接收一个文档对象，指定传递给下一个`stage`所包含的字段，字段来源可以是原始字段，也可以是自定义计算出来的新字段

:star: 语法规则：
```javascript
  db.collections.aggregation([
    { $project: { <specifications(s)> } }
  ])
```
而关于其中的`specifications`可以有以下的参数形式：

| 表达式 | 描述 |
|---|:---|
| `<field>: <1 or true>` | 指定原始文档的field将作为下一个管道的文档参数 |
| `<field>: <0 or false>` | 排除某个字段field |
| `<field>: <expression>` | 添加/替换新的field，其值将由表达式`expression`来结果来提供 |

###### $group
> 根据标识符(后面我们称之为主键)将文档进行分组，主键通常是一个字段或者是一组字段的表示结果

:star: 语法规则：
```javascript
  db.collections.aggregation([
    {
      $group: {
        _id: <expression>, //主键
        <field1>: { <accumulator1>: <expression1> },
        ...
      }
    }
  ])
```
:star2: 上述的`_id`是必须的主键，代表分组结果的唯一id，**假如将这个_id赋值为null的话，则代表该阶段将返回一个聚合文档中的值的单个文档**，然后这个`field1`代表为自定义的属性，其属性值可由**聚合操作符**以及对应的**聚合操作表达式**来配合提供！！
:warning: 注意观察上述中的`accumulator`代表的是运算符的累加器，该累加器可以是其他的聚合操作符， :u6709: 以下对应的聚合操作符允许使用：

| 聚合操作符 | 描述 |
|---|:---|
| $accumulator | 用户自定义累加器函数 |
| $addToSet | 返回每个组的唯一表达式值的数组 |
| $avg | 返回某个数值字段的平均值 |
| $bottom、$bottomN、$top、topN | 根据排序顺序，返回指定组内底部/顶部元素 |
| $bottomN | 同`$bottom`，只不过返回其中的N个数据 |
| $count | 返回组中文档数 |
| $first、$firstN、$last、$lastN | 返回组内的第一/最后一个或N个元素的聚合 |
| $max、$maxN、$min、$median | 返回每个组中的最大、最大N个、最小、中位数元素或元素的集合 |
| $mergeObjects | 组合输入的多个文档来创建新的一个文档 |
| $percentile | 返回与指定百分位值相对应的数组集合 |
| $push | 返回每组文档的表达式值数组 |
| $sum | 字段值的累加结果 |
| $stdDevPop、$stdDevSamp | 总体标准差、样本标准差 |

###### $count
> 对文档进行计数操作，并返回对应的属性，有点类似于`$group` + `$project`两者的结合
:star: 语法规则：
```javascript
  db.collections.aggregation([
    { $count: <property> }
  ])
```
:star2: 这里的`property`代表即将输出的结果为`{ property: "数量" }`

###### $match
> 过滤文档，将其指定匹配的条件的文档传递到下一个`stage`
:star: 语法规则：
```javascript
  db.collections.aggregation([
    { $match: { <query> } }
  ])
```
:star2: 这里的`query`与普通的db查询过滤筛选动作一致！

###### $merge
> 将聚合管道的结果输出到集合中，可以来自同个数据的集合，也可以来自于不同数据库的集合中，因此此`stage`必须为聚合操作中的最后一个`stage`
:star: 语法规则：
```javascript
  db.collections.aggregation([
    {
      $merge: {
        into: <collection> or { db: <db>, coll: <collection> },
        on: <identifier field> or [<identifier field1>, ...],
        let: <variables>,
        whenMatched: <replace|keepExisting|merge|fail|pipeline>,
        whenNotMatched: <insert|discard|fail>
      }
    }
  ])
```
:confused: 这里的语法规则比较复杂， :point_down: 将列举一个例子进行说明一下： 
比如有一个存储了用户购买历史的集合historys：
```json
  [
    { "_id": 1, "user": "Alice", "totalPurchase": 100 },
    { "_id": 2, "user": "Bob", "totalPurchase": 150 },
    { "_id": 3, "user": "Alice", "totalPurchase": 50 }
  ]
```
接下来，我们将使用`$group`来计算每个用户的总购买额，然后使用`$merge`将结果存储到一个新的集合中：
```javascript
  db.historys.aggregation([
    {
      $group: {
        _id: '$user',
        totalPurchase: { $sum: '$totalPurchase' }
      }
    },
    {
      $merge: {
        into: 'userPurchaseSummary',
        whenMatched: 'merge',
        whenNotMatched: 'insert'
      }
    }
  ])
```
:point_right: 这里将结果存储至`userPurchaseSummary`表中，当该表中并没有一样的`_id`主键时，则直接执行`whenNotMatched=insert`操作，如果有匹配的一样的`_id`主键，则将两者进行值的合并，并替换到新的结果记录中！

:trollface: 在上述的语法规则中有另外的两个参数`on`和`let`，`on`参数用于指定在目标集合中匹配文档的条件，一般是一个表达式，用于指定源文档与目标文档对比条件，一般默认是`_id`， 代表将使用两个collection中的`_id`来进行做对比

###### $lookup

#### 聚合管道使用思考
> :confused: 既然聚合管道可以理解一个个串联起来的待执行函数，那么如果数据量一旦大的话，数据库的执行效率将有很大的限制因素，因此需要针根据实际情况，仅进行相关顺序的控制， :point_down: 整理了相关情况下的一个`stage`执行顺序的声明:

1. 对于需要筛选过滤后再执行的管道，采用`$match`，且必须将这个`$match`给放置在第一的位置，因此可以筛掉很大一部分数据，为后续其他`stage`的执行获得了较大的性能提升空间；
2. 对于需要将聚合结果怼到另外一个collection中的情况，需要将使用`$merge`，并且还需要将其作为最后的一个`stage`来使用；



### 查询之后的操作