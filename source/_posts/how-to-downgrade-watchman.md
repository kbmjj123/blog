---
title: 如何在降级watchman
description: 如何在降级watchman, 正确设置brew, 保持最新的brew并安装低版本的watchman
author: Zhenggl
date: 2023-04-04 08:11:42
categories:
  - [前端, 跨平台开发, react-native]
tags:
  - 前端
  - 跨平台开发
  - react-native
cover_picture: watchman的安装.png
---

### 前言
> :confounded: 近期在调试这个`react-native`相关项目的时候，由于系统进行了升级，意味着所有的环境都的重来，而且像`react-native`这框架，对环境特别的敏感，花了接近3天的时间，来折腾这个环境的重建，编写此文档，以便于后续其他人避免重复踩这样的雷

### brew的坑
> 首先，在macOS上的这个`brew`的源的管理，就算是拥有梯子来上网，估计也是心理一直在念F开头的单词吧，因此，我这边重新安装了完整的源，并设置了国内的源地址！

#### 1、卸载原来的brew
```bash
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
```
:stars: 期间可能需要输入密码，并同时忽略可能出现的warning，直到最后卸载成功！

#### 2、安装新的源
```bash
  /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```
:stars: 在提供的选项中选择这个“清华国内源”，感觉目前也就这个在国内可以使用了！

#### 3、配置生效
```bash
  source /Users/<本机用户名>/.bash_profile
```
整个过程安装非常舒服，没有一点点的等待！安装成功后，可直接查看已安装的版本
![查看安装后的brew版本](查看安装后的brew版本.png)

### watchman升级伤不起
> :alien: 安装过程后，发现原有的`react-native`项目居然运行了没有一点反应，官网也是没有具体明说，因此，在经过了疯狂的度娘以及谷哥之后，最后猜测会不会就是这个`watchman`的版本导致，因此当我执行`react-native run`的时候，一切都静静地，:point_right: 这里感觉就好像是卡住了一样，但又没有任何的提示，在经过了漫长的`react-native`源码调试后，猜测可能是这个`watchman`的版本导致，因此输入了`react-native doctor`，让他来检测当前我的一个环境情况：
![react-native的doctor命令查看异常信息](react-native的doctor命令查看异常信息.jpg)

:confused: 然后发现自己目前安装的就是最新的`watchman`版本，然后对比了一下同事的`watchman`版本，居然还停留在很久的`4.9.0`版本，然后结合这个信息，再继续在搜索结果，果然，也有童鞋遇到过这样子的问题！ :point_right: 那么解决的方案就很清晰了，就是将这个`watchman`的版本给降到v4.9.0版本的即可！

:space_invader: 原本以为方案就是这么的简单，就准备来着手干了，然后发现，居然目前的`brew`无法安装到4.9.0版本的`watch`，在经过漫长的尝试后，终于成功安装到旧版本的`watchman`，这里记录一下，方便以后可以随意的降级安装对应的macOS软件

#### 1、执行命令，查看watchman源信息
```bash
  brew info watchman
```
![brew_info查看软件的源信息](brew_info查看软件的源信息.png)

#### 2、copy上述的软件源地址信息，并检出
```bash
  git clone https://github.com/Homebrew/homebrew-core
```
#### 3、查找这个`watchman.rb`文件，找到这个文件的提交历史
![查找修改历史](查找修改历史.png)
通过该[历史修改连接](https://github.com/Homebrew/homebrew-core/blob/e2c833d326c45d9aaf4e26af6dd8b2f31564dc04/Formula/watchman.rb)查找到对应版本的修改记录！

#### 4、切换到对应的commit版本记录
```bash
  git checkout 1f6402dc70b1d056fffc3748f2fdcecff730d8843bb6936de395b3443ce05322
```

#### 5、执行安装动作
```bash
  arch -x86_64 brew install /相关路径/watchman.rb 
```
![查看当前的watchman版本](查看当前的watchman版本.png)
### 一切重归于好
再次运行命令：`react-native start`
![运行start](运行start.png)
同时在浏览器中访问生成的bundlejs相关文件：[访问bundleJS](http://localhost:8081/index.bundle?platform=ios)
![在浏览器中访问bundleJS文件](在浏览器中访问bundleJS文件.png)