---
title: vue插槽的使用
author: Zhenggl
date: 2021-03-22 17:08:35
categories:
    - [开发框架, vue, 组件]
tags:
    - vue
    - javascript
cover_picture: https://img.91temaichang.com/blog/vue-slots.jpeg
---

### 前言
slot通俗一点的理解就是"占坑"，在组件模版中占好了位置，当使用该组件标签的时候，组件标签里面的内容就会自动填坑(*替换组件模版中的slot位置*)

---
在vue2.6.0中，具名插槽和作用域插槽引入了一个新的统一的语法(v-slot的指令)，它取代了slot和slot-scope。
[官方](https://cn.vuejs.org/v2/guide/components-slots.html)的文档对插槽的描述已经足够详细，我们这边主要是来深入这个作用域插槽，加深对作用域插槽的理解与使用
### 一、作用域插槽
按照官方的文档，*插槽跟模版其他地方一样都可以访问相同的实例属性(也就是相同的作用域)，而不能访问test的作用域*
```vue
  // container.vue
  <template>
    <div>
      <slot></slot>
    </div>
  </template>
  <script>
    export default {
      data(){
        return {
          userInfo: {
            name: 'zgl'
          }
        }
      },
      property: {
        url: {
          type: String,
          default: ''
        }
      }
    }
  </script>
```
👆定义了一插槽模版组件，并且该组件接收了一个属性:url，我们这里自己将这个组件称之为`容器组件`
```vue
  // test.vue
  <template>
    <container :url="testUrl">
      <div>我是插槽的内容{{url}}</div>
    </container>
  </template>
  <script>
    export default{
      data(){
        return {
          testUrl: 'https://www.baidu.com'
        }
      }
    }
  </script>
```
👆定义了一个引用container.vue容器组件，并传递属性url给container.vue容器组件，正常情况下插槽是访问不到url属性的，因为
> 父级模版里的所有内容都是在父级作用域中编译的；子模版里的所有内容都是在子作用域中编译的

❓那么，如果这个插槽要访问这个容器组件中的作用域的话，应该怎么整呢？

-->我们把需要传递的内容绑定到插槽<slot>上，然后在容器组件中用`v-slot`设置一个值来定义我们提供插槽的名字：
```vue
    <template>
      <div>
        <slot v-bind:use="user">{{ user.lastName }}</slot>
      </div>
    </template>
    <script>
      export default {
        data(){
          return {
          }
        }
      }
    </script>
```
然后在宿主组件test.vue中，接收传递过来的值：
```vue
    <template>
      <div>
        <container v-slot:default="slotProps">
          {{ slotProps.user.firstName }}
        </container>
      </div>
    </template>
```
这样子插槽就可以获取容器组件中值了

-->上述v-bind:user="user"，这里的attribute属性user被称为`插槽prop`，在容器组件用的v-slot定义的是插槽prop的名字

-->容器组件中v-slot:default="defaultProp"，这里的意思是给容器组件的默认插槽的插槽prop命名为defaultProp，所以，我们才可以在插槽中直接使用`defaultProp.user.fisrtName`

在上述情况下，如果容器组件只有默认一个插槽的话，可以简写为以下方式：
```vue
    <template>
      <div>
        <container v-slot="slotProps">
          {{ slotProps.user.firstName }}
        </container>
      </div>
    </template>
```
⚠️默认的插槽的缩写语法不能与具名插槽混用，因为它会导致作用域不明确：
```vue
  <!-- 无效，会导致警告 -->
    <container v-slot="slotProps">
      {{ slotProps.user.firstName }}
      <template v-slot:other="otherSlotProps">
        slotProps is NOT available here
      </template>
    </container>
```
-->因此，只要容器组件有多个插槽，都必须始终为所有的插槽使用完整的基于<template>的语法：
```vue
    <container v-slot="slotProps">
      <template v-slot:default="slotProps">
        {{ slotProps.user.firstName }}
      </template>
      <template v-slot:other="otherSlotProps">
        ...
      </template>
    </container>
```
### 二、解构插槽Prop
作用域插槽的内部工作原理是将插槽内容包裹在一个拥有单个参数的函数里：
```js
  function xxx(slotProps){
	//插槽内容
  }
```
👆组件用函数表示，这也就是为毛可以通过slotProps访问到slot的插槽属性了。同时也意味着可用将slotProps替换为其他的js表达式，比如：
1. 比如对象属性解构，这样子使得模版更简洁，尤其是在该插槽使用了多个插槽prop的时候
```vue
  <container v-slot="{user}">
    {{ user.firstName }}
  </container>
```
2. prop重命名机制
```vue
  <container v-slot="{user: person}">
    {{ person.firstName }}
  </container>
```
3. 后备内容，用于当插槽prop是undefined的情况：
```vue
  <container v-slot="{ user = {firstName: 'Guest'} }">
    {{ user.firstName }}
  </container>
```
### 三、作用域插槽有什么用处呢？
当容器组件需要访问到插槽内容里面的作用域的时候，作用域插槽就派上用场了

> 假设有这样子一个场景，有一个商品列表，商品列表中的每个商品item均是图文方式展示，点击每个商品item都能够跳转到商品详情

-->首先每个商品item就是一个组件product-item.vue，然后商品列表是另外一个组件product-list.vue
```vue
  <product-item v-for="(item, index) in productList" @clickItem="onItemClick"></product-item>
```
product-item.vue通过$emit方式，将item的数据往product-list.vue传递，这样子就完成了由子到父的数据传递

> 如果是由多个不同product-list.vue来组成不同的区域，也就是由product-item.vue组成product-list.vue，然后再由product-list.vue组成product-area.vue，那么，
> 就需要将product-list.vue也抽出来，假如有这样子一场景，点击product-item.vue的时候，需要由product-area.vue来处理这个点击时间，那么应该怎么处理？

--> 正常情况是product-item.vue通过$emit通知product-list.vue，然后product-list.vue再通过$emit来通知product-area.vue。

😌可以直接利用作用域插槽来优雅的处理这个问题，通过作用域插槽将本应该由product-list.vue处理的商品点击业务onItemClick提升到product-area.vue处理
```vue
// product-area.vue
  <template>
    <div v-for="(areaItem, areaIndex) in areaList" :key="areaIndex">
      <div slot="header">{{ areaItem.headerName }}</div>
      <product-list :product-list="areaItem.productList">
        <template v-slot="{item}">
          <product-item :item="item" @clickItem="onItemClick(item)"></product-item>
        </template>
      </product-list>
    </div>
  </template>
// product-list.vue
  <template>
    <div>
      <div v-for="(item, index) in productList" :key="index">
        <slot v-bind:row="item"></slot>
      </div>
    </div>
  </template>  
```
👆这里将product-list.vue给抽象出来，通过对product-list.vue中的slot添加一个插槽prop，然后在product-area.vue宿主中对该插槽prop进行指向，这里采用对象解构的
方式，获取到item，然后对product-item.vue进行赋值，并在点击事件中将item给传递出来，最终实现了组件与业务的剥离
