[文章部分参考与:中级前端工程师必须要掌握的 28 个 JavaScript 技巧](https://juejin.im/post/5cef46226fb9a07eaf2b7516#heading-23)

### instanceof 的 ployfill

```js
const selfInstanceOf = function(left, right) {
  let proto = Object.getPrototypeOf(left);
  while (true) {
    if (proto == null) {
      return false;
    } else if (proto === right.prototype) {
      return true;
    } else {
      proto = Object.getPrototypeOf(proto);
    }
  }
};
```

### 私有变量的实现

```js
const privateVar = function(obj) {
  return new Proxy(obj, {
    get(target, key) {
      if (key.startWith("_")) {
        throw new Error("private key");
      }
      return Reflect.get(target, key);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter(val => !val.startWith("_"));
    }
  });
};
```

### 单例设计模式

**使用闭包方式**

```js
// 单例对象
class SingleObject {
  login() {}
}
// 访问方法
SingleObject.getInstance = (function() {
  let instance;
  return function() {
    if (!instance) {
      instance = new SingleObject();
    }
    return instance;
  };
})();
const obj1 = SingleObject.getInstance();
const obj2 = SingleObject.getInstance();
console.log(obj1 === obj2); // true
```

**使用 Proxy 方式**

```js
//使用Proxy模式
function single(func) {
  let instance = null;
  let handler = {
    construct(target, arges) {
      if (!instance) {
        instance = Reflect.construct(target, arges);
      }
      return instance;
    }
  };
  return new Porxy(func, handler);
}
```

### promisify 将回调函数变为 promise

```js
function promisify(asynFunc) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      args.push(function callback(error, ...values) {
        if (error) {
          return reject(error);
        }
        return resolve(...values);
      });
      asynFunc.call(this, ...args);
    });
  };
}
```

### 优雅的捕获 async 的异常

```js
async function capture(func, ...args) {
  try {
    let res = await func(...args);
    return [null, res];
  } catch (error) {
    return [error, null];
  }
}

//使用的时候

let [error, res] = await capture(yourFun, yourArgs);
```

### 发布订阅 EventEmitter

```js
class EventEmitter {
  constructor() {
    this._events = {};
  }

  //发送事件
  emit(eventName, data) {
    let returns = [];
    //data.eventName = eventName;
    if (Array.isArray(this.handles[eventName])) {
      this.handles[eventName].forEach((val, index) => {
        let returnValue = this._events[eventName][i](data);
        returns.push(returnValue);
      });
    }
    return returns;
  }
  on(eventName, callback, target) {
    this._events[eventName] = this._events[eventName] || [];
    this._events[eventName].push(callback.bind(target));
  }
  off(eventName, offCb) {
    if (this._events[eventName]) {
      let index = this._events[eventName].findIndex(cb => cb === offCb);
      this._events[eventName].splice(index, 1);
      this._events[eventName] = [];
    }
  }
}
```
