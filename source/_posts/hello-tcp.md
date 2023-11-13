---
title: 你好TCP
description: 你好TCP
author: Zhenggl
date: 2022-10-18 05:47:37
categories:
  - [http, tcp]
tags:
  - http
  - tcp
cover: 你好TCP封面.jpeg
---

### 前言
> 平时工作过程中基本上天天都在和TCP打交道，:confused: 但 :u6709: 多少童鞋又能够清楚地知晓关于TCP是什么，它的一个工作过程又是怎样的呢？因此，我想整理本次的一个学习文档，来帮助自己更好的理解关于什么是TCP？他 :u6709: 什么特点？他是怎样工作的？来更好地理解程序/代码的一个工作过程！

### 什么是TCP
> **传输控制协议(Transmission Control Protocol)**，是一种面向连接的、可靠的、基于字节流的传输层通信协议。
> TCP旨在适应支持多网络应用的分层协议层次结构。 连接到不同但互连的计算机通信网络的主计算机中的成对进程之间依靠TCP提供可靠的通信服务。

> 应用层向TCP层发送用于网间传输的、用**8位字节**表示的数据流，然后TCP把数据流分区城适当长度的报文段，之后TCP把结果包传给IP层，由IP层来通过网络将包传送给接收端的TCP层，而且为了保证不丢包，给每一个包分配一个**序号**，同时序号叶保证了传送到接收端的包按序接收，然后接收端对已成功收到的包发回一个相应的确认(ACK)，如果发送端在合理的往返延(RTT)内未收到确认，那么对应的数据包就被认为是丢包了，然后重新发起传递机制

:star2: 对应的工作过程如下：
![TCP与IP通讯的过程](TCP与IP通讯的过程.png)

### TCP的特点
> TCP是一种面向广域网的通信协议，目的是在跨越多个网络通信时，为两个通信的端点之间提供一条具有 :point_down: 特点的通信方式：
> 1. 基于流的方式；
> 2. 面向连接；
> 3. 可靠通信方式；
> 4. 在网络状况不佳的情况下尽量降低系统由于重传带来的带宽开销；
> 5. 通信连接维护是面向通信的两个端点的，而不考虑中间网段和节点。

为 :u6e80: 足 :point_up_2: 这些特点，TCP协议做了 :point_down: 的规定：
1. 数据分片：在发送端对用户数据进行分片，在接收端进行重组，由TCP确定分片的大小并控制分片和重组；
2. 到达确认：在接收端接收到分片的时候，根据分片数据序号向发送端发送一个确认；
3. 超时重发：发送方在发送分片时启动超时定时器，如果在规定的时间之内没有收到相应的确认，就重新发送数据包；
4. 滑动窗口：TCP连接每一方的接收缓冲空间大小都固定的，接收端只允许另一端接收缓冲区所能接纳的数据，TCP在滑动窗口的基础上提供流量控制，以防止较快主机致使慢主机的缓冲区溢出；
5. 失序处理：作为IP数据层传输给TCP层的数据包可能会失序，TCP将对收到的数据进行重新排序，将接收到的数据以正确的顺序交给应用层；
6. 重复处理：作为IP数据层传输给TCP层的数据包可能会重复，TCP的接收端必须对收到的数据做一个去重操作；
7. 数据校验：TCP将保持它首部和数据的校验和，这是一个端到端的校验和，目的在于检测数据在传输过程中的任何变化，**如果收到的分片校验和有差错，那么TCP将丢弃这个分片，并回复不确认收到此报文段，从而导致发送端重新发送！**

:star2: TCP段由header与data组成，header必须包含有10个必填字段和一个可选的扩展字段组成，而data则紧跟在header之后， 而TCP报文则构成IP报文的数据部分，如下图所示：
![tcp报文与ip报文的组成](tcp报文与ip报文的组成.png)

:point_down: 是关于TCP header的一个组成结构：

<table class="wikitable" style="margin: 0 auto; text-align:center">
<tbody><tr>
<th style="border-bottom:none; border-right:none;"><i>偏移量</i>
</th>
<th style="border-left:none;">8位字节
</th>
<th colspan="8">0
</th>
<th colspan="8">1
</th>
<th colspan="8">2
</th>
<th colspan="8">3
</th></tr>
<tr>
<th style="border-top: none">(8位字节)
</th>
<th>(位)</th>
<th>&nbsp;7</th>
<th>&nbsp;6</th>
<th>&nbsp;5</th>
<th>&nbsp;4</th>
<th>&nbsp;3</th>
<th>&nbsp;2</th>
<th>&nbsp;1</th>
<th>&nbsp;0</th>
<th>&nbsp;7</th>
<th>&nbsp;6</th>
<th>&nbsp;5</th>
<th>&nbsp;4</th>
<th>&nbsp;3</th>
<th>&nbsp;2</th>
<th>&nbsp;1</th>
<th>&nbsp;0</th>
<th>&nbsp;7</th>
<th>&nbsp;6</th>
<th>&nbsp;5</th>
<th>&nbsp;4</th>
<th>&nbsp;3</th>
<th>&nbsp;2</th>
<th>&nbsp;1</th>
<th>&nbsp;0</th>
<th>&nbsp;7</th>
<th>&nbsp;6</th>
<th>&nbsp;5</th>
<th>&nbsp;4</th>
<th>&nbsp;3</th>
<th>&nbsp;2</th>
<th>&nbsp;1</th>
<th>&nbsp;0</th></tr>
<tr>
<th>0
</th>
<th>0
</th>
<td colspan="16">源端口</td>
<td colspan="16">目标端口</td>
</tr>
<tr>
<th>4
</th>
<th>32
</th>
<td colspan="32">序列号
</td></tr>
<tr>
<th>8
</th>
<th>64
</th>
<td colspan="32">确认码 (如果设置了ACK)
</td></tr>
<tr>
<th>12
</th>
<th>96
</th>
<td colspan="4">数据偏移</td>
<td colspan="3">保留位<br><b>0 0 0</b></td>
<td><div style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: -0.12em; line-height:1em; width:1em;">NS</div></td>
<td><div style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: -0.12em; line-height:1em; width:1em;">CWR</div></td>
<td><div style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: -0.12em; line-height:1em; width:1em;">ECE</div></td>
<td><div style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: -0.12em; line-height:1em; width:1em;">URG</div></td>
<td><div style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: -0.12em; line-height:1em; width:1em;">ACK</div></td>
<td><div style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: -0.12em; line-height:1em; width:1em;">PSH</div></td>
<td><div style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: -0.12em; line-height:1em; width:1em;">RST</div></td>
<td><div style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: -0.12em; line-height:1em; width:1em;">SYN</div></td>
<td><div style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: -0.12em; line-height:1em; width:1em;">FIN</div></td>
<td colspan="16">窗口大小
</td></tr>
<tr>
<th>16
</th>
<th>128
</th>
<td colspan="16">校验和</td>
<td colspan="16">紧急指针(如果设置了URG)
</td></tr>
<tr>
<th>20<br>
</th>
<th>160<br>
</th>
<td colspan="32" rowspan="3" style="background:#ffd0d0;">选项(如果数据偏移量>5，则末位补充0字节)<br>
</td></tr>
<tr>
<th>⋮
</th>
<th>⋮
</th></tr>
<tr>
<th>60
</th>
<th>480
</th></tr></tbody></table>

![TCP报文](TCP报文.png)

:stars: 通过对 :point_up: 表格的分析，我们下面针对其中必备的10个属性进行一一解析：

1. 源端口(source port)：16bits，标志发送端口
2. 目标端口(destination port)：16bits，标志目标端口
3. 序列号(sequence number)：32bits，具有双重作用：
   * 如果 SYN 标志设置为 (1)，则这是初始序列号。实际第一个数据字节的序列号和相应 ACK 中的确认号就是这个序列号加 1；
   * 如果 SYN 标志清零 (0)，则这是当前会话的该段的第一个数据字节的累积序列号。
4. 确认码(acknowledgment number)：32bits，如果设置了 ACK 标志，则该字段的值是 ACK 的发送者期望的下一个序列号。这确认收到所有先前的字节（如果有的话）。每一端发送的第一个 ACK​​ 确认对方的初始序列号本身，但没有数据。
5. 数据偏移(data offset)：4bits，以32位字节指定TPC标头的大小，用来表明TCP首部中32bit字的数目，通过它可以知道一个TCP包它的用户数据从哪里开始;
6. 预留位(reserved)：3bits，未来使用，默认设置为0；
7. 标志位(flags)：9bits，包含 :u6709: 一系列二进制标志，如下图所示：
![TCP标志位的定义](TCP标志位的定义.png)
8. 窗口大小(window size)：16bits，接收窗口的大小，它指定该段的发送者当前愿意接收的窗口大小单位的数量；
9. 校验和(checksum)：16bits，用于对 TCP 报头、有效负载和 IP 伪报头进行错误检查。伪报头由源 IP 地址、目标 IP 地址、TCP 协议的协议号 (6) 以及 TCP 报头和有效负载的长度（以字节为单位）组成；
10. 紧急指针(urgent pointer)：16bits，如果设置了 URG 标志，则这个 16 位字段是与指示最后一个紧急数据字节的序列号的偏移量；

### TCP的工作过程
> TCP协议操作可分为 :three: 个阶段，连接建立是一个多步骤的握手过程，在进入数据传输阶段之前建立连接，数据传输完成后，连接终止关闭连接并释放所有分配的资源
> TCP 连接由操作系统通过代表本地通信端点的资源（Internet 套接字）进行管理。在 TCP 连接的生命周期中，本地端点会经历一系列状态变化

#### 三次挥手
> 在客户端尝试与服务器连接之前，服务器必须首先绑定并监听一个端口以打开它以进行连接：这称为被动打开。一旦建立了被动打开，客户端可以通过使用三向（或三步）握手启动主动打开来建立连接

1. **SYN**：主动打开是由客户端向服务器发送一个 SYN 来执行的。客户端将段的序列号设置为随机值 A；
2. **SYN+ACK**：作为响应，服务器回复一个 SYN+ACK，确认号设置为比接收到的序列号多一个，即 A+1，服务器为数据包选择的序列号是另一个随机数 B；
3. **ACK**：最后，客户端将 ACK 发送回服务器。序列号设置为接收到的确认值，即 A+1，确认号设置为比接收到的序列号大一，即 B+1。

:star2: 步骤 1 和 2 建立并确认一个方向的序列号。步骤 2 和 3 建立并确认另一个方向的序列号。完成这些步骤后，客户端和服务器都收到了确认，并建立了全双工通信。

:point_down: 是对应的三个步骤的流程
![三次握手确立通讯](三次握手确立通讯.png)

#### 四次握手
> 连接终止阶段使用四次握手，连接的每一侧独立终止。当一个端点希望停止它的一半连接时，它会发送一个 FIN 数据包，另一端用 ACK 确认该数据包。因此，典型的拆除需要来自每个 TCP 端点的一对 FIN 和 ACK 段。发送第一个 FIN 的一方用最终的 ACK 响应后，它会等待超时，然后才最终关闭连接，在此期间本地端口无法用于新连接；如果与先前连接相关联的延迟数据包在后续连接期间传递，这可以防止可能发生的混淆。
> :warning: 也可以通过 3 次握手来终止连接，当主机 A 发送一个 FIN 并且主机 B 回复一个 FIN 和 ACK（将两个步骤合二为一）并且主机 A 回复一个 ACK​​。
> :confused: 一些操作系统，例如 Linux 和 HP-UX，实现了半双工关闭序列。如果主机主动关闭连接，但仍有未读的传入数据可用，则主机发送信号 RST（丢失任何接收到的数据）而不是 FIN。这可确保 TCP 应用程序知道存在数据丢失

![TCP_CLOSE](TCP_CLOSE.svg)