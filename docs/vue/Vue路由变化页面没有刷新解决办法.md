---
sidebar: false
---

> 在Vue使用router开发单页面过程中，我们会遇到多次进入同一页面，页面没有刷新的情况。

一个例子：
> 有一个列表页面和详情页面，当点击列表的每一项，显示详情。你会发现，如果我们单纯的使用this.$router.push({path:"/detail",query:{id:"your id",another:"asasaas"}})，跳转到详情页面，详情页面的数据并没有发生变化。


解决办法:

复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) $route 对象：

```js
export default{
    ...
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      if(to.path=="/detail"){
          this.initData();
      }
    }
  }
}

```
或者使用 2.2 中引入的 beforeRouteUpdate 导航守卫：

```js
<template>
  <div>
    <p>{{id}}</p>
    <p>{{another}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      another: ""
    };
  },
  methods: {
    initData(to) {
      let query = to.query;
      console.log("传递过来的数据", query,to);
      this.id = query.id;
      this.another = query.another;
    }
  },

  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.initData(to);
    next();
  },
  mounted(){
      this.initData(this.$route);
  }
};
</script>

<style>
</style>

```
