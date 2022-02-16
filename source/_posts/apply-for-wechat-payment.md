---
title: 关于申请开通微信支付的文档描述
author: Zhenggl
date: 2022-02-16 10:17:00
categories:
    - [业务, 微信, 支付]
tags:
    - 微信支付
    - 微信商户
cover_picture: https://img2.zhidianlife.com/image/2022/02/16/c4a01f06-bfc1-4d61-9396-0ca92d971399.jpeg
---

### 前言
由于需要在目前的区域平台开通微信支付功能，提供给到企业区域平台配置自有收款业务，因此特别整理关于微信小程序/公众号注册、微信支付商户开通指引流程

### 资料准备
![资料准备](https://img2.zhidianlife.com/image/2022/02/16/c3d6b9a4-4a16-4100-9f5b-7a60f3b9f7f9.png)
上述是需要准备的相关资料，由于需要同时注册公众号/小程序 + 微信商户号，因此，需要同时准备上述资料。

### 小程序/公众号开通指引
1、小程序注册流程，[点我查看](https://kf.qq.com/faq/170109iQBJ3Q170109JbQfiu.html)，若其中流程有使用企业对公打款动作的话，需要在注册成功后，
用对应企业的对公银行账号进行打款，有类似以下的一个打款效果图：
![打款验证](https://img2.zhidianlife.com/image/2022/02/16/001d82b6-6cd6-4443-bd46-cedf0861808e.png)
2、小程序认证申请流程，[点我查看](https://kf.qq.com/faq/170109F7ZVzq170109MnQRNN.html)，认证过程需要下载一pdf的公函，需要将该pdf给下载下来，
然后签名盖章，填写对应的日期，然后将整张图片进行拍照，并在认证流程过程中来提交上传，[公函](https://img2.zhidianlife.com/image/2022/02/16/ee5c3d4d-af25-44e9-9229-fa79194e8f28.png)
3、提交完成认证信息后，需要进行一次300费用的支付，用对应公函上的**实名认证**的微信账号进行扫码付款
4、以上所有的流程通过后，微信将会安排对应的客服人员进行一次电话回访，对所填写的信息的一个确认，⚠️这里需要需要注意的是需要确保资料都填写无误，若多次填写错误，
将导致认知费用无效，🉐️继续重新支付认证的支付费用。

### 微信支付商户开通指引

#### 介绍
> 微信支付，是微信向有出售物品/提供服务需求的商家提供推广销售、支付收款、经营分析的整套解决方案，包括多种支付方式，
> 如付款码支付、JSAPI支付、小程序支付、APP支付、电脑网站支付、企业微信支付、H5支付，以及多种支付工具，如微信红包、代金券等。
#### 申请规则
1、微信支付商家仅面向企业、个体工商户、政府及事业单位、民办非企业、社会团体、基金会类型商户开放。
[如何选择主体类型？](https://kf.qq.com/faq/180910IBZVnQ180910naQ77b.html)
2、1个微信号最多可有1个流程中的入驻申请单（即，签约后可再次提交另一个申请单）

#### 申请流程
##### 一、提交资料
在线提交营业执照、身份证、银行账户等基本信息，并按指引完成账户验证。
点击下方的*立即申请*按钮，进入微信商户账号的申请，效果图如下：
![申请商户](https://img2.zhidianlife.com/image/2022/02/16/64d5c7c5-4269-4fc3-82b0-b7929518ad2f.png)

[立即申请](https://pay.weixin.qq.com/index.php/apply/applyment_home/guide_normal)

提交申请成功后，需要进行一次打款验证，可以是法人直接在认证的微信账号上进行验证，也可以使用对公银行进行打款验证：
这里是打款验证的流程：[点我查看](https://kf.qq.com/faq/180910U7V3qu180910aU32Ar.html)

##### 二、签署协议
微信支付团队会在1-2个工作日内完成审核，若审核通过，包含商户号的开户信息会通过邮件和公众号推送给超级管理员，
超级管理员在线签约后，即可获得正式交易权限和商户平台各项产品能力[如何签署协议](https://kf.qq.com/faq/180910Rn6FbI180910ZbYNn2.html)？

##### 三、绑定场景(该操作比较涉及技术概念，建议由技术配合进行配置)
因商户的微信支付交易发起依赖于公众号、小程序、移动应用（即APPID）与微信支付商户号（即MCHID）的绑定关系，
所以，还需在签约后登录对应APPID平台完成绑定关系确认。（若申请单中未填写公众号/小程序/移动应用，需在签约后自行发起绑定）
[如何确认绑定关系](https://kf.qq.com/faq/180910QZzmaE180910vQJfIB.html)？

##### 四、支付参数配置(该操作比较涉及技术概念，建议由技术配合进行配置)
根据不同的接入场景，需要对应提供以下几种不同的支付接入配置方式：
1. 自有H5商城网站在微信中访问，调用起微信的支付业务[点我查看具体业务描述](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_1)，对应的
前往在商户号中的操作指引是：[操作指引](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_3)；
2. 自有H5商城网站在非微信浏览器中访问，远程唤起微信支付业务[点我查看具体业务描述](https://pay.weixin.qq.com/wiki/doc/api/H5.php?chapter=15_1)，对应的
前往商户号中的操作指引是：[操作指引](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_3);
3. 利用自由商城提供的付款二维码，用微信app自带的扫一扫功能扫码付款[点我查看具体业务描述](https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=6_1)，对应的
前往商户号中的操作指引是：[操作指引](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_3);
4. 小程序支付[点我查看具体业务描述](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_11&index=2)，对应的
前往商户号中的操作指引是：[操作指引](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_3)

### 退款证书配置(该操作涉及技术性配置，建议由技术同事协助)
#### 商户API证书

> 1、技术开发人员在调用微信支付安全级别较高的接口（如：退款、红包、付款）时，会使用到商户API证书。
> 2、商户API证书是用来证实商户身份的， 证书中包含商户号、证书序列号、证书有效期等信息，需要由证书授权机构(Certificate Authority ，简称CA)签发，以防证书被伪造或篡改。
> 3、根据颁发证书的CA类型，可以将商户API证书分为两种：
>（1）微信支付颁发的商户API证书——证书文件和私钥文件可从商户平台直接下载。
>（2）权威CA颁发的商户API证书——商家可自行生成或使用微信支付提供的证书工具生成证书请求串。
> 证书请求串提交到商户平台后才能获得证书文件。如果是自行生成证书请求串，私钥文件请注意安全保存。如果是通过微信支付证书工具生成证书请求串，则私钥只能通过证书工具导出。证书下载地址如下：
> windows版本 ：[https://wx.gtimg.com/mch/files/WXCertUtil.exe](https://wx.gtimg.com/mch/files/WXCertUtil.exe)
> mac版本 ：[https://wx.gtimg.com/mch/files/WXCertUtil.dmg](https://wx.gtimg.com/mch/files/WXCertUtil.dmg)

#### 如何获取商户API证书
1、获取商户API证书需要商户号的超级管理员才能操作，详细步骤如下：
[点我查看流程](https://kf.qq.com/faq/161222NneAJf161222U7fARv.html)

2、安装证书
[点我查看安装证书](https://kf.qq.com/faq/18020867ZZf6180208Yzyem6.html)
