## Redux结构:

![image](https://images2015.cnblogs.com/blog/593627/201604/593627-20160418100233882-504389266.png)

图片参考于[这里](https://www.cnblogs.com/wilber2013/p/5403350.html)

### Action的理解:  
    1、action是用来触发reducer修改state的，触发的方式是使用dispatch;
    2、dispatch修改方式为{type:"唯一的type",...你的数据}
    3、默认情况只能使用同步方式dispatch，如果需要异步方式则需要引入第三方库redux-thunk;
    4、我们可以在react的component中调用action，来更新或者获取数据。

```
//举个例子：global.js
export const setDemo = demo => (dispatch, state) => {
  dispatch({
    type: "GLOABLE_DEMO",
    demo: demo
  });
};

//home.js中使用异步方式请求
const receiveInfo = response => ({
  type: 'RECEIVE_HOME',
  homeInfo: response
});

export const getInfo = () => async (dispatch, getState) => {
  try {
    const response = await new Promise((resolve, reject) => {
      /* 模拟异步操作成功，这样可以通过fetch调接口获取数据 */
      setTimeout(() => {
        resolve({ title: 'React App' });
      }, 1000);
    });
    await dispatch(receiveHome(response));
    return response;
  } catch (error) {
    console.log('error: ', error);
    return error;
  }
};

```


### Reducer的理解

    1、Reducer是一个纯函数，其作用就是通过返回一个新的state来达到修改state的目的；
    2、Reducer函数入参有两个：state，action；切记不要直接修改state和action；
    3、如果需要在一个对象中添加/修改一个key可以使用Object.assign()函数，但是此函数在部分浏览器中不支持；需要安装babel-polifill;
    4、Reducer中根据action的type不同来更新不同的state，所以建议将type抽离成一个单独的js文件，利于维护;


```
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
      return state;
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

### 如何将state挂载到全局中

```

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

//使用Reducer 创建store
const store = createStore(
  combineReducers({ routing: routerReducer, ...rootReducer }),
  composeWithDevTools(applyMiddleware(...middlewares))
);
//使用Provider包
const render = Component => ReactDOM.render(
      <Provider store={store}>
        <Component />
      </Provider>
  document.getElementById('root')
);
render(App);

```


### 如何在react中使用state和action？

> 使用之前需要引入第三方库react-redux；

```
import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as home from "../actions/home";
import * as global from "../actions/global";

import "./index.less";

@connect(
  //那些state是需要传递给当前页面的，...state.home是当前页面的状态管理，global则是全局state，如果需要多个
  //组件共享一些state，那么可以将state放在global中，比如demo
  state => ({ ...state.home,...state.global }),
  //需要传递给当前页面的action
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
```
