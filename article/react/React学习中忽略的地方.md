

### Mobx中computed和autorun的区别

> 它们都是响应式调用的表达式，但是，如果你想响应式的产生一个可以被其它 observer 使用的值，请使用 @computed，如果你不想产生一个新值，而想要达到一个效果，请使用 autorun。 举例来说，效果是像打印日志、发起网络请求等这样命令式的副作用

**如果你有一个函数应该自动运行，但不会产生一个新的值，请使用autorun。 其余情况都应该使用 computed**


### Mobx中action和reaction的区别

> action是用来修改状态的，而reaction是autorun的变种。

`reaction(() => data, (data, reaction) => { sideEffect }, options?)`

> 它接收两个函数参数，第一个(数据 函数)是用来追踪并返回数据作为第二个函数(效果 函数)的输入。 不同于 autorun 的是当创建时效果 函数不会直接运行，只有在数据表达式首次返回一个新值后才会运行。 在执行 效果 函数时访问的任何 observable 都不会被追踪.

```js
const reaction2 = reaction(
    () => todos.map(todo => todo.title),
    titles => console.log("reaction 2:", titles.join(", "))
);
```

`action(fn)或者@action.bound classMethod() {}`

> (action.bound是自动绑定this)注意: action.bound 不要和箭头函数一起使用；箭头函数已经是绑定过的并且不能重新绑定。

```js
class Ticker {
    @observable tick = 0

    @action.bound
    increment() {
        this.tick++ // 'this' 永远都是正确的
    }
}

const ticker = new Ticker()
setInterval(ticker.increment, 1000)


```
