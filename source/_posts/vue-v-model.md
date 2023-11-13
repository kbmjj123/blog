---
title: vue指令v-model的理解与使用
author: Zhenggl
date: 2021-03-25 09:59:51
categories:
    - [开发框架, vue, 指令]
tags:
    - vue
    - 指令
cover: vue-v-model.jpeg
---

### 自定义Vue中的v-model双向绑定
v-model双向绑定实际上就是通过自组件中的$emit方法转发input事件，父组件监听input事件中传递的value值，并存储在父组件data中，然后父组件通过prop的形式将value传递给子组件的value值，再由子组件绑定input的value属性即可。

v-model的本质就是语法糖，即
```vue
  <input type="text" v-model="name">
```
相当于
```vue
  <input type="text" :value="name" @input="name = $event.target.value">
```
➡️ 我们动手实现一波：

#### 子组件传值
首先，自组件需要一个input标签，这个input标签需要绑定input事件，$emit触发父组件的input事件，通过这种方法子组件传递值给父组件
```vue
  // my-comp.vue
  <input type="text" :value="name" @input="name = $event.target.value">
```
#### 父组件监听input并传递props属性
```vue
  <my-comp @input="value=$event" :value="value"/>
  <script>
    export default {
      data(){
        return {
          value: ''
        }
      }
    }
  </script>
```

### 直接使用v-model指令
```vue
  <my-comp v-model="value"/>
```
然后需要在my-comp.vue组件中修改v-model指令，制定prop和event：
```vue
  <script>
    export default {
      name: 'MyComp',
      props: {
        checked: {
          type: Boolean,
          default: false
        }
      },
      model: {
        prop: 'value',
        event: 'input'
      }
    }
  </script>
```
