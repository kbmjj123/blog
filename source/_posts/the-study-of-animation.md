---
title: 我想要实现自由落体的球
description: 我想要实现自由落体的球
author: Zhenggl
date: 2022-06-09 08:12:01
categories:
    - [css, animation]
tags:
    - css
    - animation
cover_picture: 实现自由落体的球封面.jpeg
---

### 前言
> 我想要实现一个⚽️自由落体的过程动画？
> 在未接触到动画之前，我想除了度娘或者谷哥之外，别无选择，但是，我想自己利用动画，实现出这样子的一个效果出来，意味着我需要学习关于动画方面的相关知识点，才能够来实现这里提及到的效果。
>
> 那么，什么是动画？它与之前习🉐️的过渡有什么区别呢？我需要掌握哪些知识点，才能够实现这里说到的动画呢？
> 动画都有哪些属性呢？具体这些属性如何配合来使用的呢？下面一一道来！！

### 与过渡的区别
> **相同点：** css属性的值都在一段时间内发生变化！！
> **不同点：**
> 1. 动画对变化的方式有很大的控制权，尤其是通过关键帧实现的css动画能**设定是否以及如何重复动画，还能够深度控制整个动画的过程**；
> 2. 过渡触发的是属性值的隐式变化，而动画变化过程中用到的属性值要在关键帧中显式声明；
> 3. 动画改变的属性值可以不在元素的前后两个状态中，比如在它的默认状态下，或者根本没有。

### 动画的相关概念

#### 关键帧
> 若想要给元素添加动画效果，就必须要有一个关键帧，一个具有名字的关键帧，采用关键词`@keyframe`来定义可复用的css关键帧动画，然后将该名字赋予要设置动画的元素。

![关键帧的组成](关键帧的组成.jpg)

#### 关键帧选择符
> 关键帧选择符是动画持续时间内的时间点，可以是百分数，也可以是关键词`from`与`to`。
> 关键帧选择符指明声明的属性值应用到动画的哪个时间点，即动画播放到某个时刻希望属性为什么值。
> ⚠️选择符无需按照生序排序，只不过是建议按照这样的一个编码习惯来编写而已～

##### from与to选择符
```css
@keyframes fadeout{
    from{
        opacity: 1;
    }
    to{
        opacity: 0;
    }
}
```

##### 百分比选择符
```css
@keyframes color-pop {
    0%{
        background-color: black;
    }
    50%{
        background-color: #2aa198;
    }
    100%{
        background-color: white;
    }
}
```
✨ 有时候，我们不一定需要完全地设置每一个状态，我们可以是忽略起止状态下的关键帧选择符的，因为元素可以设置原本最初的一个属性值的，
而动画只不过是不同时间点下的属性值的变动而已，因此，相当于是🈶️以下的一个等式：
> 0% = 100% = from = to = 元素默认情况下的属性值，
> 与此同时，也就只需要定义中间状态的关键帧选择符即可！！

#### 支持动画的属性
> 与过渡类似，支持动画的属性，一般是可以被转变成**数值**的，可以通过"插值"的属性。

#### 不支持动画但不能被忽略的属性
> **visibility**与**animation-timing-function**
> 虽然visibility：hidden/visibility之间没有可以"插值"的操作，但是visibility属性支持动画，从两个值的切换时，可见性的值从
> 一个值直接跳到发生变化的下一个关键帧；
> 而`animation-timing-function`属性如果在关键帧中声明了，所在块中的属性值将使用它设定的时序函数，也就是到了对应的关键帧选择符
> 的时候，覆盖原本的动画时序函数，并在下一个关键帧时起作用。

#### 通过脚本编辑关键帧动画
> 关键帧规则在出现的那一刻还可以通过使用原生JSAPI来查找、追加和删除，见[链接](https://developer.mozilla.org/en-US/docs/Web/API/CSSKeyframesRule)
> 允许使用appendRule(n)、deleteRule(n)、findRule(n)来操作

```css
@keyframes color-pop {
    0%{
        background-color: black;
    }
    50%{
        background-color: #2aa198;
    }
    100%{
        background-color: white;
    }
}
```
```javascript
let myRules = document.styleSheets[0].cssRules;
let keyframes = myRules[0]; // a CSSKeyframesRule
let endFrame = keyframes.findRule('100%');
keyframes.appendRule('30%{...}');
keyframes.deleteRule('30%');
```

### 动画的使用
![css动画animation](css动画animation.png)
```html
<span>我是即将动画的元素</span>
```
```css
@keyframes color-ful{
  from{
    background: red;
  }
  to{
    background: green;
  }
}
span{
  padding: 20px;
  background: red;
  display: inline-block;
  cursor: pointer;
  animation-name: color-ful;
  animation-duration: 2s;
  animation-iteration-count: 10;
}
```
![背景变化的动画](背景变化的动画.gif)

上面👆这里是一个简单的动画使用，一般关于动画的设置使用步骤如下：
1. 声明关键帧名称；
2. 确定关键帧选择块的分界点；
3. 编写每个关键帧选择块中选择符以及对应的相关属性；
4. 对要赋予动画的元素指定动画名称(即关键帧名称，通过采用`animation-name`来指定)、指定动画持续时长等操作。

⚠️ 关键帧是没有指定动画的持续时间的，这个是由`animation-duration`属性来设定的，关键帧的作用是设置"由这个状态变成那个状态"，或者
"在播放动画的某个时刻呈现某个状态"！！！

#### 🈯️定动画名称(animation-name)
> `animation-name`属性的值为一个逗号分隔的列表，指定想应用的关键帧动画的*名称*，这里的名称🈯️的是使用`@keyframes`关键词声明的名称

| animation-name属性 | 描述 |
|---|---|
| 取值 | `<single-animation-name> | none` |
| 初始值 | none |
| 适用于 | 所有元素以及伪元素 |
| 继承性 | 否 |

✨ 如果想要应用多个动画效果，可以以逗号分开多个`@keyframes标识符`：
```css
div{
    animation-name: changeBgColor, round, W;
}
```
而如果🈯️定的上述几个关键帧标识符如果由一个不存在，将会不存在的动画直接被忽略，其他有效的动画仍然有效，并且，如果在后续的某一个状态下
又变成有效的动画了，那么将会在变成有效的那一刻开始应用对应的动画

#### 定义动画时长(animation-duration)
> animation-duration属性定义动画迭代一次用时多久，单位为秒(s)或者毫秒(ms)，如果没有声明该属性的或者该属性设置为0s的话，
> 将看不到实际的动画效果，但是也会触发对应的动画事件(animationstart、animationend)

✨ 如果同样的🈶️多个动画的话，可以分别为每一个动画设定持续时间，以逗号分隔开来，如下所示：
```css
div{
    animation-name: changeBgColor, round, W;
    animation-duration: 200ms, 300ms, 1s;
}
```
⚠️ 如果分组的动画时长中🈶️一个无效的话，比如没有设置单位为s/ms，那么整个声明都直接无效。

✨ 一般来说，animation-name🈶️多少个动画，就对应的需要🈶️多少个持续时间，假如持续时间的数量比动画的数量定义少了，那么持续的时间
将**成组**的复制出来，如下所示：
```css
div{
    animation-name: changeBgColor, round, W, E, F;
    animation-duration: 200ms, 300ms, 1s;// 200ms, 300ms, 1s, 200ms, 300ms;
}
```

#### 设置动画迭代次数(animation-iteration-count)
> animation-iteration-count属性设置动画迭代的次数，默认是1次，这里并没有明确说明次数必须是整数，🤔假如迭代的次数是带🈶️小数的话，那么动画将会在最后一次循环的
> 中途结束，也就是动画到一半的时候就结束了，比如🈶️以下的一个🌰：

```css
div{
    animation-duration: 8s;
    animation-iteration-count: 1.25;
}
```
上述👆这里迭代1.25次，在第二次迭代的25%处就终端了，也就是说第二次在8x25%=2s的时候就停止动画了

⚠️ 如果提供的值无效的话，那么将会重置为默认值1，也就是动画只迭代一次，而当设置为0⃣️的时候，动画还是会播放，只不过迭代零次，与`animation-duration: 0s`类似，这时
也会触发`animationstart`和`animationend`事件！！

✨ `animation-iteration-count`也与`animation-name`以及`animation-duration`类似，允许接收以逗号分隔的值列表，如下所示：
```css
div{
    animation-name: red, white, blue;
    animation-duration: 2s, 4s, 6s;
    animation-iteration-count: 3, 5;
}
```
上述👆这里`animation-iteration-count`也是与之前的`animation-duration`类似，缺失的部分，将按照分组来进行重复，这里各个动画的最终时长分别是：
> red = 2 x 3 = 6s;
> white = 4 x 5 = 20s;
> blue = 6 x 3 = 18s;

#### 设置动画播放方向(animation-direction)
> 使用`animation-direction`属性可以控制动画是从0%关键帧向100%关键帧播放，还是反过来，可以让所有的迭代都按照相同的方向播放，也可以每隔一个循环变换一次方向

| animation-direction属性 | 描述 |
|---|---|
| 取值 | `[normal|reverse|alternate|alternate-reverse]` |
| 初始值 | normal(0~>100%) |
| 适用于 | 所有元素以及伪元素 |
| 继承性 | 无 |

而关于每一个取值所对应的意义则分别如下：

| 取值 | 描述 |
|---|---|
| normal | 0~>100% |
| reverse | 100~>0%，同时也逆转了`animation-timing-function` |
| alternate | 奇数迭代从0~>100%，偶数迭代从100~>0% |
| alternate-reverse | 奇数迭代从100~>0%，偶数迭代从0~>100% |

```css
@keyframes ball{
  from{
    transform: translateY(0);
  }
  to{
    transform: translateY(200px);
  }
}

.ball{
  width: 80px;
  height: 80px;
  display: inline-block;
  border-radius: 40px;
  background: #CCF;
  animation-name: ball;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
```
![上下来回跳动的球](上下来回跳动的球.gif)
👆这里通过控制动画的方向为奇数/偶数之间切换，来达到来回动画的效果

#### 延迟播放动画(animation-delay)
> `animation-delay`属性定义浏览器把动画附加到元素上之后等待多久开始第一次迭代，单位为秒(s)/毫秒(ms)，正数代表需要等待对应秒数后执行动画，
> ⚠️而负数的延时，动画则立即开始播放，只不过动画从中途就直接开始播放的

#### 动画事件(animationstart、animationiteration、animationend)
> 与动画有关的事件分别为：
> 1. animationstart: 在动画开始播放时触发，如又延迟，则等待`animation-delay`设定的时间后触发；
> 2. animationend: 在动画播放结束时触发，✨如果将`animation-iteration-count: infinite`，且`animation-duration: >0s`，则该事件永远不会被触发；
> 3. animationiteration: 在两次迭代动画之间触发，如果只设置`animation-iteration-count: <=1`，则不会触发该事件

##### 动画链
> 我们可以利用`animation-delay`属性将多个动画串在一起，让下一个动画在上一个动画结束后立即开始，如下所示：

```css
@keyframes ball{
  from{
    transform: scale(0.5);
  }
  to{
    transform: scale(1);
  }
}
@keyframes y{
  from{
    transform: translateY(0);
  }
  to{
    transform: translateY(200px);
  }
}
@keyframes x{
  from{
    transform: translateX(0);
    transform: translateY(200px);
  }
  to{
    transform: translateX(200px);
  }
}
@keyframes m{
  from {
    transform: translateX(200px);
  }
  to{
    transform: translateX(0) scale(0.5);
  }
}


.ball{
  width: 80px;
  height: 80px;
  display: inline-block;
  border-radius: 40px;
  background: #CCF;
  transform: scale(0.5);
  animation-name: ball, y, x, m;
  animation-duration: 2s, 2s, 2s, 2s;
  animation-delay: 0s, 2s, 4s, 6s;

}
```
![延迟实现的连续动画](延迟实现的连续动画.gif)
上面👆这里我们通过对3个动画分别进行了延迟处理，可以实现到将元素在每执行完成一个动画的时候，自动执行另外一个动画。

##### 延迟动画中的迭代
> 有时，我们想要播放动画，并且想要在每次迭代之间加上一定的**等待时间**，这时，我们可以借助于已有的属性，来模拟这
> 一个场景
```css
@keyframes ball{
  80%{
    background-color: red;
    transform: scale(1);
  }
  80.1%{
    background-color: blue;
    transform: scale(0.5);
  }
  100%{
    background-color: yellow;
    transform: scale(1.5);
  }
}

.ball{
  width: 100px;
  height: 100px;
  border-radius: 20px;
  background-color: red;
  display: inline-block;
  transform: scale(1);
  animation-name: ball;
  animation-duration: 5s;
  animation-iteration-count: 3;
}

```
⚠️ 第一个关键帧选择符是80%，动画持续时长是5s，而且，80%关键帧选择的属性与元素默认的颜色一致，因此，前4s保持不变，
而在第5s的时候，颜色由蓝色变成黄色，然后继续这个循环，总共3次，因此，看起来就像是在不同的动画循环迭代中插入了4s的感觉。

✨ 多次应用同一个动画，配合设置不通的`animation-delay`
```css
@keyframes color-scale{
  from{
    background-color: green;
    transform: scale(0.5);
  }
  to{
    background-color: yellow;
    transform: scale(1.5);
  }
}
.ball{
  width: 100px;
  height: 100px;
  border-radius: 20px;
  background-color: red;
  display: inline-block;
  transform: scale(1);
  animation-name: color-scale, color-scale, color-scale;
  animation-duration: 1s;
  animation-delay: 0s, 4s, 8s; 
  transform-origin: top center;
}
```
![模拟插入一定时长的迭代](模拟插入一定时长的迭代.gif)

#### 改变动画的内部时序(animation-timing-function)
> `animation-timing-function`属性指明动画在一次循环中如何演进。
> 一般的，我们可以借助于[第三方的可视化贝塞尔曲线](https://cubic-bezier.com)来实现预览自己创建的贝塞尔曲线

✨ 回到最初的我们想要实现的自由落体的球，一般的自由落体的速度是刚开始慢，后面则快，这里采用`animation-timing-function: ease-in`
就可以满足到这个效果，而当反方向来播放的时候，对应的时序函数也是反过来的，自动变成了`ease-out`

##### 步进时序函数(step-start、step-end、steps)
> 步进时序函数，主要是定义的补间动画效果，steps()时序函数把动画分成一系列的步幅，接收两个参数，步数和变化点。
> 步数是一个参数，必须是正整数，动画时长将平均分成步数对应的段数，比如动画持续时长为1s，步数为4，则每一步时长250毫秒，元素将
> 在页面中绘制4次，间隔250毫秒，每次间隔播放动画的20%。🤔这有点类似于翻书实现电影片的效果，每一个页都有一幅图，每一页中的图
> 都有细微的差异。
> 听着可能有点懵，直接上这个代码已经对应的效果，来好好地说明这一切把！！！

```css
@keyframes dancer{
  from{
    background-position: 0 0;
  }
  to{
    background-position: -1229px 0;
  }
}
.dancer{
  height: 100px;
  width: 56px;
  background-image: url(https://meyerweb.github.io/csstdg4figs/18-animations/c/dancer.png);
  animation-duration: 4s;
  animation-timing-function: steps(22, end);
  animation-iteration-count: infinite;
  animation-name: dancer;
}
```
![步进时序函数实现的骑马舞](步进时序函数实现的骑马舞.gif)

![骑马舞动作解析](骑马舞动作解析.jpg)

🤔 关于这里的步进时序函数中的参数的计算：
1. 首先图片中总共有22个子图，确定了每个子图的尺寸都是56x100的，则可以对应的确定其步数为22；
2. 完整一张图片的宽度为1229px，最终的目标偏移值为1229px，由于反方向的，因此为负数的；
3. steps()步进函数的第二个参数为`*start或者end*`中的一个，默认值是end。

关于steps中的第二个参数的对比说明如下：

| steps第二个参数 | 描述 |
|---|---|
| start | 第一次变化在第一步的开头发生，即动画开始后立即变化 |
| end | 第一次变化在第一步的结尾发生 |

✨ 一句话：在动画正常的方向中，start相当于"跳过"0%关键帧，end相当于"跳过"100%关键帧

#### 设置动画的播放状态(animation-play-state)
> `animation-play-state`属性，可以定义动画是播放还是暂停的，通过属性值：`[running|paused]`来控制，
> ✨ 这里的running以及paused就相当于是停止和继续播放的效果切换。

#### 设置动画的填充模式(animation-fill-mode)
> `animation-fill-mode`属性定义动画播放结束后是否应用回原来的属性值，一般情况下动画所做的改动只会在动画播放的过程中有效，**一旦动画结束，属性将还原为动画之前的值**

| animation-fill-mode属性 | 描述 |
|---|---|
| 取值 | `[none | forwards | backwards | both]` |
| 默认值 | none |
| 适用于 | 所有节点元素以及伪元素 |
| 继承性 | 否 |

✨ 而关于这个不同取值所对应的效果描述如下：

| 取值 | 描述 |
|---|---|
| none | 默认值，表示动画所做的改动只在动画过程有效，一旦结束则还原为原来的值 |
| forwards | 动画结束时，这个时候的属性值将继续应用在元素上，一般是to/100%对应的值，但也要结合实际情况，有可能动画方向相反，但也有可能在中间值，依实际情况而定 |
| backwards | 0%或者from对应的属性值将在动画应用到元素的那一刻就作用，这里可以理解为替换元素的默认属性值，而无需等待`animation-delay`来控制 |
| both | both则同时具备`forwards`与`backwards`两者的效果，也就是一旦使用该值，则动画前与动画后都直接使用动画的from/to的值(相对的) |

### 动画简写(animation)
> animation简写属性，无需分别定义8个属性，在一行声明中就能为元素定义全部动画属性，animation属性的值是一个列表，以空格分隔，
> 分别对应于各个单独属性，如果需要在元素上应用多个动画，则在列出的各个动画之间加上逗号即可。

![animation的组成](animation的组成.png)

| animation属性 | 描述 |
|---|---|
| 取值 | 见上图 |
| 初始值 | 0s ease 0s 1 normal none running none |
| 适用于 | 所有元素以及伪元素 |
| 继承性 | 否 |

🤔 对于简写属性中这么多的8个属性，要一个个去记住，并且按照顺序来编写，个人觉得是有点不大现实的，好在它提供了一个机制：
**对于未编写出来的属性，则采用默认的值**，这个非常方便，比如我们有以下的一个编写方式：
```css
@keyframes xxx{}
div{
    animation: xxx 2s;
}
```
上面👆这里则代表的是
```css
div{
    animation-name: xxx;
    animation-duration: 2s;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: none;
    animation-play-state: running;
}
```

⚠️ 关于简写属性有两个需要注意的地方：
1. 其中有两个时间属性(animation-duration 以及 animation-delay)，如果只定义了1个属性，则表示只定义了duration，而delay为0s；
2. 假如不小心将animation-name定义为与某个属性值一样(实际编码上🈲️止这么定义)，那么animation-name放到最后。

✨ 综上所述，使用`animation`简写属性是个很不错的主意，但是需要记住的是：**持续时间、延迟时间和动画名称的位置很重要，而省略的值将会被设置为默认值，永远别使用关键词来作为动画的标识符！！！**

