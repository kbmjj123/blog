---
title: vue中关于组件的透传机制
description: vue中关于组件的透传机制
author: Zhenggl
date: 2022-03-28 08:01:19
categories:
    - [vue, 技巧]
tags:
    - vue
    - 编程技巧
cover_picture: vue中的透传机制封面.jpeg
---

### 需求背景
> 平时在开发过程中，需要针对一些三方UI库进行定制，想要使用三方库的某个控件，然后想在它的基础上，进行一些自有的逻辑的追加，变成自己团队内部使用的控件。
> 达到既使用到三方库原本提供的属性/方法，又能够使用自己额外追加的属性/方法。

### 目标
使用三方控件的同时，又能够补充上自己的控件额外的属性/方法

### 方案设计
> 官方提供了一个vue选项属性：inheritAttrs，对于它的一个解释是：默认情况下父作用域的不被认作props的attribute绑定将会"回退"且作为普通的HTML attribute应用在子组件的根元素上。
> 当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置inheritAttrs为false，这些默认行为将会去掉。
> 而通过实例属性$attrs可以让这些attribute生效，且可以通过`v-bind`显式地绑定到非根元素上。

![节点属性示例代码](节点属性示例代码.png)

![节点属性输出结果](节点属性输出结果.png)

🤔 啥意思呢？就是说平时我们普通编写的vue组件中，如果该组件的并无定义任何的自定义属性props的时候，与此同时，如果我们直接往这个自定义属性上添加属性attribute时，将会作为普通的未被
html识别的html节点属性加入到dom中，这个时候，我们可以通过设置组件的inheritAttrs=false，让根节点不识别这个自定义属性，而是传透到其孩子节点中。

### 关键原理 + 实现代码
✨ inheritAttrs + vm.$attrs + vm.$listener

一个组件一旦被配置了这个inheritAttrs=false的时候，则本身将不会接收到未定义的attribute属性在html节点中，如下图：
![定义了inheritAttrs为false](定义了inheritAttrs为false.png)

🤔 那么，我想要让子组件接收到穿透传递进来的属性，应当利用$attrs如何来操作呢？
![捕获并透传属性](捕获并透传属性.png)

🤔 如果我们也想将点击事件也一同穿透传递过去呢？
👉 这里可以是使用vm.$listener实例属性来实现
> 官方对于vm.$listener的一个解释是：包含了父作用于中的(不含.native修复器的)v-on事件监听器，它可以通过v-on="$listener"传入内部组件--在创建更高层次的组件时非常有用。

🤔 啥意思呢？
👉 就是通过将自定义的事件监听可以通过`vm.$listener`通过`v-on`指令穿透传递给子组件
![穿透$listener](穿透$listener.png)

而原本父组件自身所定义的属性则可以正常直接使用，完整的代码如下所示：

```vue
<!-- 父组件Parent.vue -->
<template>
  <div>
    {{ yy }}
    <child v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
import Child from './Child';
export default {
  name: 'Parent',
  inheritAttrs: false,
  data() {
    return {}
  },
  components: {
    Child
  },
  props: {
    yy: {
      type: 'String',
      default: ''
    }
  },
}
</script>
```

```vue
  <!-- 孩子组件Child.vue -->
  <template>
  <div @click="clickMe">
    孩子组件：{{ xx }}
  </div>
</template>

<script>
export default {
  name: 'Child',
  data() {
    return {}
  },
  props: {
    xx: {
      type: 'String',
      default: ''
    }
  },
  methods: {
    clickMe(){
      this.$emit('on-click-me', this.xx);
    }
  }
}
</script>

```

```vue
<!-- 示例代码 -->
  <template>
  <div>
    <parent xx="123" @on-click-me="testClickMe" yy="456"/>
  </div>
</template>

<script>
import Parent from './components/Parent';
export default {
  name: 'App5',
  data() {
    return {}
  },
  components: {
    Parent
  },
  methods: {
    testClickMe(detail){
      alert(detail);
    }
  }
}
</script>
```

### 总结
将上述例子中的Child.vue组件，替换成三方库的组件，则可以达到对三方的控件进行追加自身的属性，使用三方控件的同时，也能够追加到自己的属性。
