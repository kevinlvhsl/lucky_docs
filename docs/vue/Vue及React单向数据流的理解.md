其实Vue和React都是`单向数据流`，只是Vue提供了类似于`v-model`的方式做`双向绑定`。那么什么是单向数据流？个人理解如下：

![](/images/vue/data-flow.png)


## 理解React单选数据流

1. react是单向数据流，react中`属性是不允许更改`的，`状态是允许更改的`。react中组件不允许通过this.state这种方式直接更改组件的状态。自身设置的状态，可以通过setState来进行更改。在setState中，传入一个对象，就会将组件的状态中键值对的部分更改，还可以传入一个函数，这个回调函数必须向上面方式一样的一个对象函数可以接受prevState和props。通过调用this.setState去更新this.state,不能直接操作this.state，请把它当成不可变的。
2. 调用setState更新this.state，它不是马上就会生效的，它是异步的。所以不要认为调用完setState后可以立马获取到最新的值。多个顺序执行的setState不是同步的一个接着一个的执行，会加入一个异步队列，然后最后一起执行，即批处理。
3. `setState是异步的`，导致获取dom可能拿的还是之前的内容，所以我们需要在setState第二个参数（回调函数）中获取更新后的新的内容

## 理解Vue单选数据流

1. Vue也是`单向数据流`，经常在网上看一些文档，都会写Vue双向绑定，请注意区分`单向数据流`和`双向绑定`两者的概念。
2. 在Vue中父组件通过props的方式传递数据给子组价，子组件是不允许直接修改父组件的props的;当开发者尝试这样做的时候，vue 将会报错。这样做是为了组件间更好的解耦，在开发中可能有多个子组件依赖于父组件的某个数据，假如子组件可以修改父组件数据的话，一个子组件变化会引发所有依赖这个数据的子组件发生变化，所以 vue 不推荐子组件修改父组件的数据，直接修改 props 会抛出警告。

3. 我们在网上看到的`Vue双向绑定`概念，其实是Vue的一种语法糖,`v-model`的原理，其实是:

```html
<!-- 如果是input/checkout等组件 -->
<input v-model="something" />
<!-- 其实是这样的 -->
<input :value="something" @input="something = $event.target.value" />

<!-- 自定义组件 -->
<Child v-model="something"></Child>
<!-- 然后在child中使用$emit的方式更新something -->
this.$emit("input",newValue)
```
