

### Mobx中computed和autorun的区别

> 它们都是响应式调用的表达式，但是，如果你想响应式的产生一个可以被其它 observer 使用的值，请使用 @computed，如果你不想产生一个新值，而想要达到一个效果，请使用 autorun。 举例来说，效果是像打印日志、发起网络请求等这样命令式的副作用

**如果你有一个函数应该自动运行，但不会产生一个新的值，请使用autorun。 其余情况都应该使用 computed**


### Mobx中action和reaction的区别

> action是用来修改状态的，而reaction是autorun的变种。

`reaction(() => data, (data, reaction) => { sideEffect }, options?)`

> 它接收两个函数参数，第一个(数据 函数)是用来追踪并返回数据作为第二个函数(效果 函数)的输入。 不同于 autorun 的是当创建时`效果函数不会直接运行`，只有在数据表达式首次返回一个新值后才会运行。 在`执行效果函数时访问的任何 observable 都不会被追踪`.

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

### 异步Action
> 如果 action 中存在 setTimeout、promise 的 then 或 async 语句，并且在回调函数中某些状态改变了，那么这些回调函数也应该包装在 action 中。创建异步 action 有几种方式;

#### Promises
> 使用action函数包裹promise的then函数；

```js
mobx.configure({ enforceActions: true }) // 不允许在动作之外进行状态修改
class Store {
    @observable githubProjects = []
    @observable state = "pending" // "pending" / "done" / "error"

    @action
    fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        fetchGithubProjectsSomehow().then(
            // 内联创建的动作
            action("fetchSuccess", projects => {
                const filteredProjects = somePreprocessing(projects)
                this.githubProjects = filteredProjects
                this.state = "done"
            }),
            // 内联创建的动作
            action("fetchError", error => {
                this.state = "error"
            })
        )
    }
}

```
**或者使用runInAction函数，而不是为每一个回调都创建一个action**

```js
mobx.configure({ enforceActions: true }) // 不允许在动作之外进行状态修改
class Store {
    @observable githubProjects = []
    @observable state = "pending" // "pending" / "done" / "error"

    @action
    fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        fetchGithubProjectsSomehow().then(
            projects => {
                const filteredProjects = somePreprocessing(projects)
                // 将‘“最终的”修改放入一个异步动作中
                runInAction(() => {
                    this.githubProjects = filteredProjects
                    this.state = "done"
                })
            },
            error => {
                // 过程的另一个结局:...
                runInAction(() => {
                    this.state = "error"
                })
            }
        )
    }
}

```

#### async / await
> async搭配runInAction函数，完成异步Action

```js
mobx.configure({ enforceActions: true })

class Store {
    @observable githubProjects = []
    @observable state = "pending" // "pending" / "done" / "error"

    @action
    async fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        try {
            const projects = await fetchGithubProjectsSomehow()
            const filteredProjects = somePreprocessing(projects)
            // await 之后，再次修改状态需要动作:
            runInAction(() => {
                this.state = "done"
                this.githubProjects = filteredProjects
            })
        } catch (error) {
            runInAction(() => {
                this.state = "error"
            })
        }
    }
}
```

#### 使用生成器
> flow 只能作为函数使用，不能作为装饰器使用。 flow 可以很好的与 MobX 开发者工具集成，所以很容易追踪 async 函数的过程。

```js
mobx.configure({ enforceActions: true })

class Store {
    @observable githubProjects = []
    @observable state = "pending"

    fetchProjects = flow(function * () { // <- 注意*号，这是生成器函数！
        this.githubProjects = []
        this.state = "pending"
        try {
            const projects = yield fetchGithubProjectsSomehow() // 用 yield 代替 await
            const filteredProjects = somePreprocessing(projects)
            // 异步代码块会被自动包装成动作并修改状态
            this.state = "done"
            this.githubProjects = filteredProjects
        } catch (error) {
            this.state = "error"
        }
    })
}


```
