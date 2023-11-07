---
title: jenkins+gradle+pgyer+email => 安卓持续集成打包apk流程
author: Zhenggl
date: 2021-05-18 00:48:49
categories:
tags:
cover: jenkins%20android.jpeg
---

#### 前言

以前开发的时候，一般流程是开发调试，提测的时候，给测试甩安装包或者是安装的二维码，各测试同时自行下载安装验证，但提供安装包的过程又臭又长，如果对于频繁需要修改bug并进行快速回归的话，单单通过`android studio`开发工具来提供的话，
不仅效率低，而且打包时间大大占据了开发者的bug调试时间，因此，需要jenkins等持续集成平台来提供，也就是app的开发者，不再提供apk安装包，由测试同事自行到`jenkins`上索取安装包进行安装

#### jenkins环境的安装
首先，先安装`jenkins`环境，访问jenkins网址 [https://www.jenkins.io/zh/](https://www.jenkins.io/zh/)，选择适合自己的版本进行下载并安装，这边选用的是mac环境下的jenkins

通过`brew`命令来安装jenkins：

+ 安装最新的jenkins LTS 版本：`brew install jenkins-lts`
+ 或者安装指定版本的LTS：`brew install jenkins-lts@VERSION`
+ 启动jenkins服务：`brew services start jenkins-lts`
+ 重启jenkins服务：`brew services restart jenkins-lts`
+ 更新jenkins服务：`brew upgrade jenkins-lts`

#### jenkins插件的安装
要实现jenkins上从gradle -> apk -> 蒲公英 -> 邮件/直接输出
这一流程，需要对应安装相应的插件

##### android Gradle插件的安装与配置

![安装android Gradle插件](jenkins-plugins-gradle.png)

gradle插件安装完成后，需要在目标机器上搭建android开发环境，用于打包安卓apk，具体安卓的开发环境安装流程就不再描述了

安装完成后，需要提供android的sdk的home目录以及ndk的home目录，`export`到PATH全局环境变量中

随后，在`jenkins`中，配置`gradle`的全局工具环境:

![配置gradle工具的环境](jenkins-tools-gradle.png)

然后，对应需要在`环境变量`中，加入gradle的环境变量

![加入gradle全局环境变量](jenkins-global-env.png)

配置完成后，我们则可以在jenkins上进行安卓代码的打包

##### email配置

由于我们需要发送邮件，因此需要对邮件客户端进行配置，如下图：

![email设置](jenkins-email-setting.png)

注意上面这里的smtp密码，这里我采用的是163邮箱，需要登录到对应的邮箱系统上获取这个SMTP Password，

邮件通知配置，需要与上面维护一致账号密码以及端口

![邮件通知设置](jenkins-email-notice.png)

##### 蒲公英插件的安装与使用(有大神提供了现成的jenkins插件，就直接使用了)

#### 记一完整的流程配置

1. 新增一自由任务

2. 配置构建策略

![构建策略](jenkins-build-rule.png)

1. 配置jenkins参数化构建，即在jerkins中提供参数列表或者其他形式的表达，供用户输入或者选择

![参数化构建](jenkins-build-params.png)

1. 配置代码管理，从git上拉取代码

![拉取代码](jenkins-code-mag.png)

1. 根据配置好的`gradle`插件，直接选择gradle打包命令，并输入对应的打包命令

![打包命令](jenkins-build-action.png)

6. 配置蒲公英上传所需参数以及打包后的apk代码

![上传至蒲公英](jenkins-upload-pgy.png)

7. 配置发送邮件的配置
![发送邮件配置](jenkins-send-email.png)

8. 邮件内容维护
![邮件内容维护](jenkins-send-email.png)

9. 发起一jenkins执行动作

![执行动作](jenkins-start-action.png)

10. 配置的邮件接受者将在任务成功执行完成后，收到配置的邮件，这里是将打包结果以及打包后的二维码通过邮件的方式发出来

![发送邮件](jenkins-start-action.png)
