---
title: mongodb在云服务器上安装与本地联调使用
description: mongodb在云服务器上安装与本地联调使用
author: Zhenggl
date: 2022-11-15 09:09:24
categories:
  - [数据库, mongodb]
tags:
  - 数据库
  - mongodb
cover: mongodb封面.png
---

### 前言
> 终于轮到关于mongodb的学习了，作为 :one: 前端开发佬，想要进入全栈开发的领域，必不可少要涉及到数据库方面的编程技能。
> 关于数据库的一个个人见解就是：**它是一种特殊的文件格式，隐藏了对内容的直接访问，提供相关便捷的方法来操作文件内容，提供增删查改逻辑操作，满足业务需求！**
> 而本文要学习的这个`mongodb`是属于`NoSQL(Not only SQL，不仅仅是SQL)`的一种，它与传统的关系型数据库有很大的区别， 传统的关系型数据库有 :point_down:  的一系列特性：
1. 原子性(Atomicity)
   事务里的所有操作要么全部做完，要么都不做，事务成功的条件是事务里的所有操作都成功，只要有一个操作失败，整个事务就失败，需要回滚。
   比如银行转账，从A账户转100元至B账户，分为两个步骤：1）从A账户取100元；2）存入100元至B账户。这两步要么一起完成，要么一起不完成，如果只完成第一步，第二步失败，钱会莫名其妙少了100元
2. 一致性(Consistency)
   数据库要一直处于一致的状态，事务的运行不会改变数据库原本的一致性约束。
   例如现有完整性约束a+b=10，如果一个事务改变了a，那么必须得改变b，使得事务结束后依然满足a+b=10，否则事务失败。
3. 独立性(Isolation)
   并发的事务之间不会互相影响，如果一个事务要访问的数据正在被另外一个事务修改，只要另外一个事务未提交，它所访问的数据就不受未提交事务的影响。
   比如现有有个交易是从A账户转100元至B账户，在这个交易还未完成的情况下，如果此时B查询自己的账户，是看不到新增加的100元的。
4. 持久性(Durability)
   一旦事务提交后，它所做的修改将会永久的保存在数据库上，即使出现宕机也不会丢失。

#### 什么是NoSQL
> 指的是非关系型数据库，不同于传统的关系型数据库的数据库管理系统的统称，**一般用于超大规模数据的存储，这些类型的数据存储不需要固定的模式，无需多余操作就可以横向扩展**

#### RDBMS :vs: NoSQL
> RDBMS
- 高度组织化结构化数据
- 结构化查询语言（SQL） (SQL)
- 数据和关系都存储在单独的表中。
- 数据操纵语言，数据定义语言
- 严格的一致性
- 基础事务

> NoSQL
- 代表着不仅仅是SQL
- 没有声明性查询语言
- 没有预定义的模式
- 键-值对存储，列存储，文档存储，图形数据库
- 最终一致性，而非ACID属性
- 非结构化和不可预知的数据
- CAP定理
- 高性能，高可用性和可伸缩性

### mongodb环境搭建(本文结合腾讯云服务器来搭建远程db)
1. 软件安装，这里采用的是直接下载压缩包，并提交到远程服务器中，安装目录为：`/usr/local/mongodb5/`
2. 配置目录
```shell
  mkdir -p /usr/local/mongodb5/data
  touch /usr/local/mongodb5/mongod.log
  touch /usr/local/mongodb5/conf/mongodb.conf
```
3. 配置统一的脚本命令
打开对应的配置文件
```shell
  vim /usr/local/mongodb/conf/mongodb.conf
```
并添加对应的内容
```shell
port=27017                                                                                                                                               
dbpath=/usr/local/mongodb5/data                                                                                                                          
logpath=/usr/local/mongodb5/logs/mongodb.log                                                                                                             
fork=true                                                                                                                                                
bind_ip=0.0.0.0                                                                                                                                          
#auth=true 
```
关于这个配置文件中具体参数的字段描述，见[官方链接](https://www.mongodb.org.cn/manual/188.html)，链接中所提及到的所有参数，都可以直接在配置文件中进行维护

4. 为方便管理，将这个mongodb的相关命令添加到环境变量中
```shell
vim ~/.bashrc
# 然后添加以下的命令
export PATH=$PATH:/usr/local/mongodb5/bin
# 然后调用对应的命令使得配置生效
source ~/.bashrc
```

5. 配置完成后，启动mongodb服务
```shell
mongod --config /usr/local/mongodb5/conf/mongodb.conf
```

6. 刚配置完成的mongodb服务，需要添加实际开发的开发者账号
因此，上述的`auth`字段为false，然后添加对应的账号、密码、数据库，如下所示：
![mongodb配置对应的开发者账号](mongodb配置对应的开发者账号.png)

7. 由于采用的是腾讯的centos8云服务器，因此需要开放对应的防火墙以及端口，:point_down: 列举关于防火墙相关命令的使用
   + 查看防火墙某个端口是否开放
   `firewall-cmd --query-port=27017/tcp`
   + 开放防火墙端口27017
   `firewall-cmd --zone=public --add-port=27017/tcp --permanent`
   注意：开放端口后要重启防火墙生效
   + 重启防火墙
   `systemctl restart firewalld`
   + 关闭防火墙端口
   `firewall-cmd --remove-port=27017/tcp --permanent`
   + 查看防火墙状态
   `systemctl status firewalld`
   + 关闭防火墙
   `systemctl stop firewalld`
   + 打开防火墙
   `systemctl start firewalld`
   + 开放一段端口
   `firewall-cmd --zone=public --add-port=40000-45000/tcp --permanent`
   + 查看开放的端口列表
   `firewall-cmd --zone=public --list-ports`
   + 查看被监听(Listen)的端口
   `netstat -lntp`
   + 检查端口被哪个进程占用
   `netstat -lnp|grep 27017`

```shell
firewall-cmd --zone=public --add-port=27017/tcp --permanent
systemctl restart firewalld
systemctl status firewalld
firewall-cmd --zone=public --list-ports
# 授权远程连接
/sbin/iptables -I INPUT -p tcp --dport 27017 -j ACCEPT
```

8. 并同时在腾讯的云服务器中将对应的端口给开放出来
![开放云服务器的27017端口](开放云服务器的27017端口.png)
