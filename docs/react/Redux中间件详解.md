
**看完此篇文章你可以了解到**：

1. 中间件如何使用？
2. 如何自定义中间件？
3. redux-thunk异步执行action其实思想很简单
4. applyMiddleware是如何执行中间件的？

redux 的核心思想为：将需要修改的 state 都存入到 store 里，发起一个 action 用来描述发生了什么，用 reducers 描述 action 如何改变 state tree 。创建 store 的时候需要传入 reducer，真正能改变 store 中数据的是 store.dispatch API。

## 一、 概念

中间件是 dispatch 一个 action 到触发 reducer 之间做的一个额外操作，通常使用中间件 Middleware `来进行日志记录、创建崩溃报告、调用异步接口、路由、或者改变dispatch`;


## 二、 中间件的使用

```js
import { createStore, applyMiddleware, combineReducers } from "redux";
import rootReducer from "./reducers/index";
import thunk from "redux-thunk";
const store = createStore(
  combineReducers({ ...rootReducer }),
  applyMiddleware([thunk])
);
```

此处使用了异步 action 中间件 thunk，没错就是传入给 applyMiddleware 即可完成 dispatch 的增强。那么有两个问题？

1. `当有多个中间件时，每一个 middleware 是如何操作前一个中间件包装过的 dispatch?`
2. `如何编写自己的中间件？`

## 三、 applyMiddleware 的理解

> applyMiddleware 即可回答第 2 个问题，**applyMiddleware 函数接受一个中间件数组，并依次执行中间件，将上一个 middleware 包装过的 store.dispatch 传递给下一个中间件**。

### 1、 一个简单的 applyMiddleware

```js
//一个简单的 applyMiddleware 实现（非官方的 API,后面会介绍）
function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice();
  middlewares.reverse(); //为何要反序？

  /**
        由于是依次执行中间件，那么当前中间件执行完成肯定得执行下一个中间件，做到链式调用；
        之所以将列表反序的目的是为了在遍历的时候，让上一个中间件知道下一个中间件的dispatch是什么；(可能这里有点绕，下面讲述Redux API的时候会介绍)
    **/
  let dispatch = store.dispatch;
  middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)));

  return Object.assign({}, store, { dispatch });
}

//提前透露：一个简单的中间件，每一个中间件中需要有当前的store和下一个dispatch。

const logger = store => next => action => {
  console.log("dispatching", action);
  let result = next(action); //next为下一个dispatch；
  console.log("next state", store.getState());
  return result;
};
```

理解：

1. `中间件的执行是顺序执行的`，为了能够链式执行中间件，需要在每一个中间件中知道下一个 dispatch，这样就可以跳转到下一个中间件；

2. `每个中间件的dispatch生成其实是反序的`，因为 A 在调用时需要知道 B 的 dispatch，B 在执行时需要知道 C 的 dispatch，那么需要先知道 C 的 dispatch。（下面 Redux API 源码会验证这点）

3. 在每一个中间件中，都是可以使用 next 函数(也就是下一个的 dispatch 函数)；

## 2、 Redux 的 applyMiddleware 源码理解

```js
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args); //取到当前的store
    let dispatch = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. " +
          "Other middleware would not be applied to this dispatch."
      );
    };

    const middlewareAPI = {
      //每个 middleware 接受 Store 的 dispatch 和 getState 函数作为命名参数
      getState: store.getState, //返回应用当前的 state 树。
      dispatch: (...args) => dispatch(...args)
    };
    // 依次调用每一个中间件
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    //现在 此处的chain应该是一个函数数组[]，一个类似于
    /**
    [
        function(next){
            return function(action){

            }
        },
        function(next){
            return function(action){
                
            }
        }
    ]


    **/

    //compose(...functions)从右到左来组合多个函数
    //作用：compose(funcA, funcB, funcC) 形象为 compose(funcA(funcB(funcC())))；
    // 其效果类似于上一部分讲述的在循环中得到上一个dispatch
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };
  };
}
```

理解：

1. 上面简单例子讲到，`dispatch的生成其实是反序的`可以从 compose 中看出端倪：compose(funcA, funcB, funcC) 形象为 compose(funcA(funcB(funcC())))；

2. 看 conmpose 源码其实你会发现，最后 compose(...chain)的结果应该为:

```js
function(){
    funcA(funcB(funcC()))
}

```

所以在执行`compose(...chain)(store.dispatch)`的时候,内部其实先调用了 funcC 来生成 C 的 dispatch。

3. **最后一个中间件中不应该调用 next 函数，因为没有下一个中间件了，同理要是中间某个中间件没有调用 next(action)，那么后面所有的中间件将不会被调用。（这就是官方文章中写的：logger 中间件要放在最后一个的原因）**

### 3、 验证中间件是顺序执行，但是 dispatch 确实反序生成的

此处可能有点超前，如果您不知道如何编写中间件请先阅读下一节，再回到这里来看

```js
//第一个中间件
function createMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    console.log("第一个的下一个的dispatch", next);

    console.log("第一个action", action);
    const result = next(action);
    console.log("第一个state", getState());
    return result;
  };
}

const firstMid = createMiddleware();
export default firstMid;
```

```js
//第二个中间件
function createMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    console.log("第二个的下一个的dispatch", next);

    console.log("第二个action", action);
    const result = next(action);
    console.log("第二个state", getState());
    return result;
  };
}

const secondMid = createMiddleware();
export default secondMid;
```

```js
//中间件使用
const middlewares = [firstMid, secondMid]; //注意中间件的顺序

const store = createStore(
  combineReducers({ ...rootReducer }),
  composeWithDevTools(applyMiddleware(...middlewares))
);

//实际打印的结果
/**
第一个的下一个的dispatch ƒ (action) {
        console.log('第二个的下一个的dispatch', next);
        console.log('第二个action', action);
        var result = next(action);
        console.log('第二个state', getState());
        return resu…


第一个action {type: "GLOBAL_DATA", globalData: {…}}


第二个的下一个的dispatch ƒ dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'unde…

第二个action {type: "GLOBAL_DATA", globalData: {…}}

第二个state {routing: {…}, global: {…}, home: {…}}

第一个state {routing: {…}, global: {…}, home: {…}}

**/
```

## 四、 如何编写自己的中间件？

格式为:

```js
function yourMiddleware() {
  return ({ getState, dispatch }) => next => action => {};
}
```

> ...middlewares (arguments): 遵循 Redux middleware API 的函数。每个 middleware 接受 Store 的 dispatch 和 getState 函数作为命名参数，并返回一个函数。该函数会被传入 被称为 next 的下一个 middleware 的 dispatch 方法，并返回一个接收 action 的新函数;

> 这个函数可以直接调用 next(action)，或者在其他需要的时刻调用，甚至根本不去调用它。调用链中最后一个 middleware 会接受真实的 store 的 dispatch 方法作为 next 参数，并借此结束调用链。所以，middleware 的函数签名是 ({ getState, dispatch }) => next => action。

一个记录日志的中间件：

```js
function createLoggerkMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    console.log("will dispatch", action);
    // 调用 middleware 链中下一个 middleware 的 dispatch。
    let returnValue = next(action);

    console.log("state after dispatch", getState());

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue;
  };
}

const logger = createLoggerkMiddleware();
export default logger;
```

理解：

1. **Redux middleware 就像一个链表。每个 middleware 方法既能调用 next(action) 传递 action 到下一个 middleware，也可以调用 dispatch(action) 重新开始处理，或者什么都不做而仅仅终止 action 的处理进程。**

## 五、 异步 Action redux-thunk 的理解


### 1、redux-thunk的使用例子

```js
const middlewares = [thunk, middleware];
const store = createStore(

  combineReducers({ ...rootReducer }),
  composeWithDevTools(applyMiddleware(...middlewares))
);

//action中
//这是一个同步action
const receiveInfo = response => ({
  type: 'RECEIVE_HOME',
  homeInfo: response
});

//使用redux-thunk异步执行action
export const getInfo = () => async (dispatch, getState) => {
  try {
    const response = await new Promise((resolve, reject) => {
      /* 模拟异步操作成功，这样可以通过fetch调接口获取数据 */
      setTimeout(() => {
        resolve({ title: 'React App' });
      }, 1000);
    });
    await dispatch(receiveInfo (response));//使用dispatch触发同步action
    return response;
  } catch (error) {
    console.log('error: ', error);
    return error;
  }
};

//在react中
let {getInfo}=this.props;
getInfo().then({

})

```

### 2、redux-thunk源码解析

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
      //可以接受一个返回函数的action creator。如果这个action creator 返回的是一个函数，就将dispatch的决策权交给此函数，如果不是，就按照原来的next(action)执行。
    if (typeof action === "function") {
      return action(dispatch, getState, extraArgument);//这就是上面例子的函数为啥接受dispatch和getState两个参数的原因
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```
