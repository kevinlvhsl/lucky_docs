本文主要记录自己在使用vue开发过程中的一些心得吧。可能是我们平时比较少注意的点。


## 一、 Vue混入策略
我们可能在项目 中大量使用到vue的混入，但是你真的清楚vue混入的策略吗？这边我简单记录一下我所了解的。

1.  data对象在内部会进行递归合并，并在发生冲突时以组件数据优先。

2. 同名钩子（生命周期）函数将合并为一个数组，因此都将被调用。另外，**混入对象的钩子将在组件自身钩子之前调用**。

3. 值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。

> 注意：Vue.extend() 也使用同样的策略进行合并。

**其实两个都可以理解为继承，mixins接收对象数组（可理解为多继承），extends接收的是对象或函数（可理解为单继承）。**

> 优先调用mixins和extends继承的父类，**extends触发的优先级更高**，相对于是队列push(extend, mixin1, minxin2, 本身的钩子函数)


## 二、 Vue的data属性为何为一个函数?

> **重复创建实例造成多实例共享一个数据对象**;vue文件经过babel编译，将导出的对象直接替换成了一个对象变量，然后将这个变量传入到对应的组件构造函数中。因此，也就产生了引用共享的问题(所有js对象皆引用)

- 每个组件都是 Vue 的实例。
- 组件共享 data 属性，当 data 的值是同一个引用类型的值时，改变其中一个会影响其他。

## 三、 异步组件
项目过大就会导致加载缓慢,所以异步组件实现按需加载就是必须要做的事.

```js
//1. 工厂函数执行 resolve 回调
Vue.component('example-component', function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包, 这些包
  // 会通过 Ajax 请求加载
  require(['./my-async-component'], resolve)
})

//2. 工厂函数返回 Promise
Vue.component(
  'example-component',
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)

// 3.工厂函数返回一个配置化组件对象
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./example-component.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})

```

## 四、 使用require.context批量注册组件
传统的方式，我们使用`import`导入一个组件，然后使用`Vue.component`去注册一个组件，但是当我的一个目录下面有多个组件，想批量注册，我们就可以使用到`require.context`。

**API**

```js
 let data= require.context(directory, useSubdirectories = false, regExp = /^\.\//)
```
参数介绍：

- 要搜索的文件夹目录
- 是否还应该搜索它的子目录，
- 以及一个匹配文件的正则表达式。

其中导出的`data`有三个属性，`resolve`和`keys`,`id`

- resolve 是一个函数，它返回请求被解析后得到的模块 id。
- keys 也是一个函数，它返回一个数组，由所有可能被上下文模块处理的请求组成。
- id 是上下文模块里面所包含的模块 id. 它可能在你使用 module.hot.accept 的时候被用到

Vue 全局组件：
[参考:require.context](https://juejin.im/post/5ab8bcdb6fb9a028b77acdbd)

```js

module.exports.install = function (Vue) {
 /*
   所有在./components目录下的.vue组件自动注册为全局组件
   以<mv-***></mv-***>为组件标签名，***是组件的.name，没有name的时候是组件的文件名
  */
 const requireAll = context => context.keys().map(context);
 const component = require.context('./components', false, /\.vue$/);
 requireAll(component).forEach((item) => {
   const name = (item.name || /(\S+\/)(\S+)\.vue/.exec(item.hotID)[2]).toLowerCase();
   Vue.component(`mv-${name}`, item);
 });
};

```

## 五、 函数式组件
[参考：搞懂并学会运用 Vue 中的无状态组件](https://juejin.im/post/5dd5d1f8f265da4796659baf)

因为函数式组件只是函数，所以渲染开销也低很多，这也意味着它们是非常高效的，不需要花太多时间渲染。同时，考虑高阶组件，它们不需要任何状态，它们所要做的就是用额外的逻辑或样式包装给定的子组件。

Vue 提供了一种定义函数组件的简单方法。咱们只需要给个 functional 关键字就可以。在 2.5.0 及以上版本中，如果使用了单文件组件，那么基于模板的函数式组件可以这样声明：

```html
<template functional>
  <div> 函数/无状态组件 </div>
</template>

```

或者

```js
export default {
  functional: true,
  props: {
    // ...
  },
  render(createElement, context) {
    return createElement(
      'div', '函数/无状态组件'
    )
  }
}

```

**需要注意**的是，*传递给函数组件的惟一数据是`props`*。这些组件是完全无状态的(没有响应数据)，它们忽略传递给它们的任何状态，并且不触发任何生命周期方法(created、mounted等等)。
而且，咱们也*不能通过使用 `this` 关键字来访问实例*，因为这些组件也是不实例化的。相反，*组件需要的所有东西都是通过context提供的*。在render函数中，它作为createElement方法的第二个参数传递。
组件需要的一切都是通过 context 参数传递，它是一个包括如下字段的对象：

- props：提供所有 prop 的对象
- children: VNode 子节点的数组
- slots: 一个函数，返回了包含所有插槽的对象
- scopedSlots: (2.6.0+) 一个暴露传入的作用域插槽的对象。也以函数形式暴露普通插槽。
- data：传递给组件的整个数据对象，作为 createElement 的第二个参数传入组件
- parent：对父组件的引用
- listeners: (2.3.0+) 一个包含了所有父组件为当前组件注册的事件监听器的对象。这是 data.on 的一个别名。
- injections: (2.3.0+) 如果使用了 inject 选项，则该对象包含了应当被注入的属性。


## 六、 Vue父子组件生命周期调用次序

Vue 的父组件和子组件生命周期钩子函数执行顺序可以归类为以下 4 部分：

- **加载渲染过程**
父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

- **子组件更新过程**
父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

- **父组件更新过程**
父 beforeUpdate -> 父 updated

- **销毁过程**
父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed





