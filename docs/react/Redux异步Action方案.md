> 本文主要讲述如何在 Redux 中使用异步 action，不追究其原理，如果需要了解原理，请移步[Redux 中间件详解](./Redux中间件详解.md)

在 Redux 中使用异步 action 有很多种方式，常用的有`redux-thunk`和`redux-promise`、`redux-promise-middleware`和`redux-saga`中间件

## 一、redux-thunk 使用

thunk 实现的异步 action`需要action返回一个函数`，且`函数的入参为(dispatch, getState)`；这样你就可以在此函数中根据自己的需要使用 dispatch 分发 action 了。

[redux-thunk 源码](https://github.com/reduxjs/redux-thunk/blob/master/src/index.js)

**thunk 的使用**

```js
//一个action creator返回一个action
let actionCreateDemo = response => ({
  type: "GET_INFO",
  info: response
});
//id为react调用getInfo的入参，
export const getInfo = id => async (dispatch, getState) => {
  try {
    const response = await new Promise((resolve, reject) => {
      /* 模拟异步操作成功，这样可以通过fetch调接口获取数据 */
      setTimeout(() => {
        resolve({ title: "React App" });
      }, 1000);
    });
    await dispatch(actionCreateDemo(response));
    return response;
  } catch (error) {
    // console.log('error: ', error);
    return error;
  }
};
```

## 二、react-promise 使用

[redux-promise 源码](https://github.com/redux-utilities/redux-promise/blob/master/src/index.js)

它自定义了一个 middleware，当检测到有 action 的 payload 属性是 Promise 对象时，就会：

- 若 resolve，触发一个此 action 的拷贝，但 payload 为 promise 的 value，并不设置error
- 若 reject，触发一个此 action 的拷贝，但 payload 为 promise 的 reason，并设 error为true

也就是 redux-primise 会将异步操作放在 payload 中

```js
//部分源码
return isPromise(action.payload)//action需要有一个payload属性
  ? action.payload
      .then(result => dispatch({ ...action, payload: result }))//如果为resolvapayload九尾promise的值
      .catch(error => {
        dispatch({ ...action, payload: error, error: true });//否则为异常
        return Promise.reject(error);
      })
  : next(action);
```
**使用**

```js
//action types
const GET_DATA = 'GET_DATA';

//action creator
const getData = function(id) {
    return {
        type: GET_DATA,
        payload: api.getData(id) //payload为promise对象
    }
}

//reducer
function reducer(oldState, action) {
    switch(action.type) {
    case GET_DATA: 
        if (action.error) {//需要增加额外的判断
            return errorState 
        } else {
		 	  return successState
        }
    }
}

```

**注意：**
`redux-promise相对于redux-thunk会有代码减少的提升`，但是任何能明显减少代码量的方案，都应该小心它`是否过度省略`了什么东西，减肥是好事，但是不可过度减肥。

redux-promise为了精简而做出的妥协非常明显：[无法处理乐观更新](https://github.com/redux-utilities/flux-standard-action/issues/7) 。

**`多数异步场景都是悲观更新`的，即`等到请求成功才渲染数据`。而与之相对的`乐观更新`，则是`不等待请求成功，在发送请求的同时立即渲染数据。`**


## 三、redux-promise-middleware使用

[redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware/blob/master/src/index.js)相比redux-promise，采取了更为温和和渐进式的思路

redux-promise-middleware提供了三个状态`PENDING`、`FULFILLED`和`REJECTED`这样就可以处理异步action失败的情况；

在action的区分上，它选择了回归type的"正途"，_PENDING、_FULFILLED、_REJECTED等后缀借用了promise规范 (当然它们是可配置的) 。

它的遗憾则是只在action层实现了简化，对reducer层则束手无策。另外，相比redux-thunk，它还多出了一个_PENDING的字符串模板代码(三个action却需要四个type)。

```js
//action types
const GET_DATA = 'GET_DATA',
    GET_DATA_PENDING = 'GET_DATA_PENDING',//必须在GET_DATA后面加上PENDING字符
    GET_DATA_FULFILLED = 'GET_DATA_FULFILLED',
    GET_DATA_REJECTED = 'GET_DATA_REJECTED';
    
//action creator
const getData = function(id) {
    return {
        type: GET_DATA,
        payload: {
        	promise: api.getData(id),
        	data: id//需要将数据放在data部分
        }
    }
}

//reducer
const reducer = function(oldState, action) {
    switch(action.type) {
    case GET_DATA_PENDING :
    	return oldState; // 可通过action.payload.data获取id
    case GET_DATA_FULFILLED : 
        return successState;
    case GET_DATA_REJECTED : 
        return errorState;
    }
}


```

如果不需要乐观更新，action creator可以使用和redux-promise完全一样的，更简洁的写法，即

```js
const getData = function(id) {
    return {
        type: GET_DATA,
        payload: api.getData(id) //等价于 {promise: api.getData(id)}
    }
}

```

## 四、react-saga 使用

[redux-saga 源码](https://github.com/redux-saga/redux-saga)

[redux-saga官方中文文档](https://redux-saga-in-chinese.js.org/)

上面的三种方案都是讲异步操作放在action中，而saga让异步行为成为架构中独立的一层，既不在action creator中，也不和reducer沾边。

> 的出发点是把副作用 (Side effect，异步行为就是典型的副作用) 看成"线程"，可以通过普通的action去触发它，当副作用完成时也会触发action作为输出。

其中一些函数包括:`takeEvery` `put` `call`等函数请查阅[Saga 辅助函数](https://redux-saga-in-chinese.js.org/docs/api/index.html#takeeverypattern-saga-args)

```js
import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
export function* loadUserData(uid) {
  try {
    yield put({ type: USERDATA_REQUEST });
    let { data } = yield call(userRequest, {data:""});//userRequest为一个一个 Generator 函数, 也可以是一个返回 Promise 或任意其它值的普通函数，第二个参数：传递给 fn 的参数数组。
    yield put({ type: USERDATA_SUCCESS, data });
  } catch(error) {
    yield put({ type: USERDATA_ERROR, error });
  }
}

```

## 最后

> 对于个人而言，较多的使用的是thunk的方式，如果项目较大可采用saga方式，但是会增加学习成本，这就看自己的取舍了。

[参考:Redux异步选型](http://react-china.org/t/redux/8761)
