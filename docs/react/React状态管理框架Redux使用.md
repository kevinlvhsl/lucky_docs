

**redux 的核心思想为：**
- 将需要修改的 state 都存入到 store 里，
- 发起一个 action 用来描述发生了什么，用 reducers 描述 action 如何改变 state 。
- 使用dispatch触发action



图片参考于这里
![](/images/react/react-redux.png)

## Action的理解

1. action是用来触发reducer修改state的，触发的方式是使用dispatch;
2. dispatch修改方式为{type:"唯一的type",...你的数据}
3. 默认情况只能使用同步方式dispatch，如果需要异步方式则需要引入第三方库redux-thunk;
4. 我们可以在react的component中调用action，来更新或者获取数据。
5. redux-thunk是异步action的一种解决方案，具体请看下面的例子，如果不了解为什么要使用一个函数嵌套，且为何传入参数为dispatch何getState，请查看[Redux中间件详解](./Redux中间件详解.md);

```js
//举个例子：global.js
//一个异步action 
export const setDemo = demo => (dispatch, state) => {
  dispatch({//执行一个action
    type: "GLOABLE_DEMO",
    demo: demo
  });
};

//home.js中一个action creator
const receiveInfo = response => ({
  type: 'RECEIVE_HOME',
  homeInfo: response
});

/**使用redux-thunk异步执行action:
thunk要求必须在一个函数中返回另一个函数,且另一个函数的入参为dispatch何getState
这样我们可以在异步执行完成之后触发reducer，并且可以在action中获取到state的值
**/
export const getInfo = () => async (dispatch, getState) => {
  try {
    const response = await new Promise((resolve, reject) => {
      /* 模拟异步操作成功，这样可以通过fetch调接口获取数据 */
      setTimeout(() => {
        resolve({ title: 'React App' });
      }, 1000);
    });
    await dispatch(receiveInfo (response));//在异步action调用dispatch()触发reducer更新state
    return response;
  } catch (error) {
    console.log('error: ', error);
    return error;
  }
};
```
## Reducer的理解

1. Reducer是一个纯函数，其作用就是通过返回一个新的state来达到修改state的目的；
2. Reducer函数入参有两个：state，action；切记不要直接修改state和action；
3. 如果需要在一个对象中添加/修改一个key可以使用Object.assign()函数，但是此函数在部分浏览器中不支持；需要安装babel-polifill;
4. Reducer中根据action的type不同来更新不同的state，所以建议将type抽离成一个单独的js文件，利于维护;
5. 每一个Reducer在没有state变化时必须返回默认的state;

```js
//一个例子 global.js
const initState = {
  userInfo: {},
  demo:"我是demo"
  
};

export const global = (state = initState, action) => {
  switch (action.type) {
    case 'CURRENT_USER':
      return {
        ...state,
        userInfo: action.userInfo
      };
    case 'GLOABLE_DEMO':
    return{
      ...state,
      demo:action.demo//action.demo就是上面action使用dispatch传递的demo数据
    }
    default:
      return state;//必须返回默认的state
  }
};

//Reducer可以拆分成多个模块，可以使用统一入口
import { home } from './home';
import { global } from './global';
const rootReducer = {
  home,
  global
};
export default rootReducer;

```
## 全局共享store
> 使用Reducer 创建全局唯一的store：将各个Reducer返回的state通过combineReducer合并在在一起（这就是下面【 如何在react中使用state和action】） //为什么使用@connect的第一参数可以使用...state.home来获取home的reducer的state；

> combineReducers 辅助函数的作用是，把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数;

理解：
1. createStore(reducer)，使用用来`创建全局唯一的store`，将各个Reducer返回的state通过combineReducer合并在在一起；
2. combineReducer({})的作用是将`多个Reducer合成一个Reducer函数`，也就是说我们`每次使用dispatch(action)的时候其实都会调用所有的reducer`,这就是为什么需要reducer在没有数据变化时直接返回默认的，如果不这样做将会造成死循环。`combineReducer接受一个reducer对象，建议将不同的reducer分开{home:homeReducer,global:globalReducer}，这样state也就按照home和global分开了`；
3. applyMiddleware([]),接受一个中间件数组，中间件是action到reducer中间的部分，你可以拦截dispatch的操作；详细请看[Redux中间件详解](./Redux中间件详解.md);
4. Provider是react-redux包中的，作用是全局注入store这样在每一个connect([mapStateToProps],[mapDispatchToProps])中即可获取到state


```js

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import App from './App';
import rootReducer from './reducers/index';

const history = createHistory();
const middleware = routerMiddleware(history);

const middlewares = [thunk, middleware];

//使用Reducer 创建全局唯一的store：将各个Reducer返回的state通过combineReducer合并在在一起（这就是下面【 如何在react中使用state和action】）
//为什么使用@connect的第一参数可以使用...state.home来获取home的reducer的state；
const store = createStore(
    //combineReducers 辅助函数的作用是，把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数;
  combineReducers({ routing: routerReducer, ...rootReducer }),
  composeWithDevTools(applyMiddleware(...middlewares))
);
//<Provider store> 使组件层级中的 connect() 方法都能够获得 Redux store。正常情况下，你的根组件应该嵌套在 <Provider> 中才能使用 connect() 方法
const render = Component => ReactDOM.render(
      <Provider store={store}>
        <Component />
      </Provider>
  document.getElementById('root')
);
render(App);
```

## 如何在react中使用state和action？
使用之前需要引入第三方库react-redux；

理解：
1. 要在react中使用redux，除开需要引入`redux`提供的createStore,combineReducer,applyMiddleware,bindActionCreators;也需要引入`react-redux`中的connect,Provider等；
2. 前面讲到Provider中会将全局store传递给组件，那么组件需要接收store需要使用connect();connect比较重要的有两个参数，`第一个：mapStateToProps就是讲reducer中返回的state会注入到此组件的props中`；（这就是为啥之前建议reducer要分模块，且在combineReducer传入{home:homeReducer,global:globalReducer}的格式），`这样注入props中的key就不至于由于可能不同的reducer返回相同key的state而混乱`;
3. `第二个参数为:mapDispatchToProps,就是将那些action注入到props中`。mapDispatchToProps其实可以有两种方式，`一种是：`对象的方式`(比如：{home:getInfo,global:getGlobalInfo},其中的getInfo和getGlobalInfo是一些action)；另外一种是 `函数的方式`(dispatch=>{})。

```js
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as home from "../actions/home";
import * as global from "../actions/global";

import "./index.less";

//connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])其作用为连接 React 组件与 Redux store；

@connect(
  //1、store 中的数据作为 props 绑定到组件上 ，...state.home是当前页面的状态管理，global则是全局state，如果需要多个
  //组件共享一些state，那么可以将state放在global中，比如demo
  //2、只有定义了此参数，组件将会监听 Redux store 的变化。任何时候，只要 Redux store 发生改变，
  //mapStateToProps 函数就会被调用。该回调函数必须返回一个纯对象，这个对象会与组件的 props 合并
  //3、state.home从哪里来？其实是上述总的reducer中的{home,global}中的home
  state => ({ ...state.home,...state.global }),
  //将 action 作为 props 绑定到组件上
  dispatch => bindActionCreators({ ...home, ...global }, dispatch)
)

//再获取传递给当前组件的state
//demo为全局global中的state，setDemo为全局的action
var {demo,setDemo,getInfo}=this.props;

<span>{demo}</span>
//调用action 修改state
<button onClick={()=>{ setDemo("我是新的demo"+(new Date()))}}>点击我修改state</button>
//获取数据
getInfo().then(res=>res.json()).then(da=>{
    
})
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
```

## 其他的理解

1、**mapStateToProps（state, ownProps）**

> mapStateToProps是一个函数，用于建立组件跟 store 的 state 的映射关系 作为一个函数，它可以传入两个参数，结果一定要返回一个 object
传入mapStateToProps之后，会订阅store的状态改变，在每次 store 的 state 发生变化的时候，都会被调用
ownProps代表组件本身的props，如果写了第二个参数ownProps，那么当prop发生变化的时候，mapStateToProps也会被调用。例如，当 props接收到来自父组件一个小小的改动，那么你所使用的 ownProps 参数，mapStateToProps 都会被重新计算）。
mapStateToProps可以不传，如果不传，组件不会监听store的变化，也就是说Store的更新不会引起UI的更新；

2、 **mapDispatchToProps(dispatch)**

> 如果mapDispatchToProps是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，对象所定义的方法名将作为属性名；每个方法将返回一个新的函数，函数中dispatch方法会将 action creator 的返回值作为参数执行。这些属性会被合并到组件的 props 中

> 如果mapDispatchToProps是函数类型的：该函数将接收一个 dispatch 函数，然后由你来决定如何返回一个对象，`这个对象通过 dispatch 函数与 action creator 以某种方式绑定在一起`（提示：你也许会用到 Redux 的辅助函数 bindActionCreators()。`如果你省略这个 mapDispatchToProps 参数`，默认情况下，`dispatch 会注入到你的组件 props 中`。如果指定了该回调函数中第二个参数 ownProps，该参数的值为传递到组件的 props，而且只要组件接收到新 props，mapDispatchToProps 也会被调用。


3、**bindActionCreators(actionCreators, dispatch)**

bindActionCreators通常和mapDispatchToProps一起使用

- actionCreators (Function or Object): 一个 action creator，或者一个 value 是 action creator 的对象。第一个参数可以接收一个action creator或者一个action creator的对象，这些action将会注入到对应组件的Props中
- dispatch (Function): 一个由 Store 实例提供的 dispatch 函数。`一般这个dispatch是由函数式的mapDispatchToProps的参数提供`

4、 **action creator是什么？**

一般情况一个action其实就是一个含有type属性的对象{type:"HONE_CHANGE",other:""}，
- `action creator其实是一个返回action的函数。`
- 不要混淆 action 和 action creator 这两个概念。Action 是一个信息的负载，而 action creator 是一个创建 action 的工厂。
- 调用 action creator 只会生产 action，但不分发。你需要调用 store 的 dispatch function 才会引起变化(dispatch(createActionCreator))

```js
//一个action creator
createActionCreator(info){
  return {
    type:"HONE_CHANGE",
    other:info
  }
}
```
