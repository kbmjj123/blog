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
