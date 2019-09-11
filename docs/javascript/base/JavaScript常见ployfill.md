[文章部分参考与:中级前端工程师必须要掌握的 28 个 JavaScript 技巧](https://juejin.im/post/5cef46226fb9a07eaf2b7516#heading-23)



## 私有变量的实现

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

## 单例设计模式

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

## promisify 将回调函数变为 promise

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

## 优雅的捕获 async 的异常

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

## 发布订阅 EventEmitter

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


## 实现 Promise.finally

```js
//finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作，使用方法如下
Promise
	.then(result => { ··· })
	.catch(error => { ··· })
	.finally(() => { ··· })

```

finally 特点：

- 不接收任何参数。
- finally 本质上是 then 方法的特例。

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}

```

## 实现 ES6 的 class 语法

```js
function _class_(subType, superType) {
  subType.prototype = Object.create(superType.prototype, {
    constructor: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: subType
    }
  });

  Object.setPrototypeOf(subType, superType);
}
```

> 而 Object.create 支持第二个参数，即给生成的空对象定义属性和属性描述符/访问器描述符，我们可以给这个空对象定义一个 constructor 属性更加符合默认的继承行为，同时它是不可枚举的内部属性（enumerable:false）

> 而 ES6 的 class 允许子类继承父类的静态方法和静态属性，而普通的寄生组合式继承只能做到实例与实例之间的继承，对于类与类之间的继承需要额外定义方法，这里使用 Object.setPrototypeOf 将 superType 设置为 subType 的原型，从而能够从父类中继承静态方法和静态属性

[来自：一个合格的中级前端工程师需要掌握的 28 个 JavaScript 技巧](https://juejin.im/post/5cef46226fb9a07eaf2b7516#heading-21)

## bind 函数的 polyfill

```js
Function.prototype.bind = function(fThis, ...bindArg) {
  let fToBind = this;
  if (typeof fToBind !== "function")
    throw new TypeError(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );

  let fBound = function(...args) {
    return fToBind.apply(
      this instanceof fBound ? this : fThis,
      bindArg.concat(args)
    );
  };
  fBound.prototype = Object.create(fToBind.prototype);
  fBound.prototype.constructor = fBound;
  return fBound;
};

//test
function bFun() {
  this.d = 10;
  return this.a;
}
var func = bFun.bind({ a: 20 });
console.log(func());

console.log(new func());
```

## call 函数的 ployfill

```js
/**
 * 原理就是将函数作为传入的上下文参数（context）的属性执行，这里为了防止属性冲突使用了 ES6 的 Symbol 类型
 * @param {*} context
 * @param  {...any} args
 */
Function.prototype.call = function(context, ...args) {
  context || (context = window); //如果context为null则在windos下运行
  let func = this;
  if (typeof func !== "function") {
    throw new TypeError("this is not function");
  }
  let caller = Symbol("caller");
  context[caller] = func;
  let res = context[caller](...args);
  delete context[caller];
  return res;
};
//测试
let demo = {
  a: 20
};
function b() {
  console.log(this.a);
}
b.call(demo); //20
```

## new 关键字的 polyfill

- 创建一个新的对象
- 将新对象执行原型操作，指向构造函数的原型
- 将 this 绑定到新对象上（可以使用 call 或者 apply 强制转换执行环境）
- 构造函数返回的对象就是实例化的结果，如果构造函数没有显示返回一个对象，则返回新的对象

```js
function _new_(fn, ...args) {
  let obj = {};
  obj.__proto__ = fn.prototype;
  let result = fn.apply(obj, args);
  return typeof result === "object" ? result : obj;
}

_new_(data => {
  console.log(this, data);
}, "你好");
```

## Object.assign 的 polyfill

> Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
> Object.assign 是浅拷贝,对于值是引用类型的属性,拷贝仍旧的是它的引用
> **Object.assign 特点**

- 可以拷贝 Symbol 属性
- 不能拷贝不可枚举的属性
- Object.assign 保证 target 始终是一个对象,如果传入一个基本类型,会转为基本包装类型,null/undefined 没有基本包装类型,所以传入会报错
- source 参数如果是不可枚举的数据类型会忽略合并(字符串类型被认为是可枚举的,因为内部有 iterator 接口)

```js
/**
 * Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
 * @param {*} param
 */
function isComplexType(obj) {
  return (typeof obj === "object" || typeof obj === "function") && obj != null;
}
function _asign_(target, ...source) {
  if (target == null) {
    throw new Error("Connot convert undefined or null to target");
  }

  return source.reduce((pre, curr, index) => {
    isComplexType(pre) || (pre = new Object(pre));
    if (curr == null) return pre;
    [...Object.keys(curr), ...Object.getOwnPropertySymbols(curr)].forEach(
      key => {
        pre[key] = curr[key];
      }
    );
    return pre;
  }, target);
}

console.log(_asign_({ a: 1 }, { b: 2 }, { c: 3 }));
```

## instanceof 关键字 polyfill

> 使用递归循环查找 left 原型链上是否存在 right

```js
function _instanceOf_(left, right) {
  let leftProto = Object.getPrototypeOf(left);
  while (true) {
    if (leftProto == null) return false;
    if (leftProto === right.prototype) {
      return true;
    }
    leftProto = Object.getPrototypeOf(leftProto);
  }
}

function a() {}

function b() {}
b.prototype = new a();

console.log(_instanceOf_({}, {})); //false
console.log(_instanceOf_(new b(), a)); //true
```

## 函数防抖 debounce

> 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。

```js
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
}
```

## 函数节流 throttle

> 所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。 节流会稀释函数的执行频率。

```js
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle(func, wait, type) {
  if (type === 1) {
    let previous = 0;
  } else if (type === 2) {
    let timeout;
  }
  return function() {
    let context = this;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();

      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    }
  };
}
```

## 函数柯里化

> 不了解函数柯里化的朋友请见[函数柯里化](https://github.com/MrGaoGang/lucky_docs/blob/master/article/javascript/Javascript%E6%9F%AF%E9%87%8C%E5%8C%96%E5%92%8C%E5%81%8F%E5%87%BD%E6%95%B0%E5%AE%9E%E7%8E%B0.md)

```js
const curry = (fn, ...arg) => {
  let all = arg || [],
    length = fn.length;
  return (...rest) => {
    let _args = all.slice(0); //拷贝新的all，避免改动公有的all属性，导致多次调用_args.length出错
    _args.push(...rest);
    if (_args.length < length) {
      //在没有达到fn参数个数时，返回当前fn函数引用
      return curry.call(this, fn, ..._args);
    } else {
      //当达到了fn的参数，那么就调用fn函数
      return fn.apply(this, _args);
    }
  };
};

//测试

let test = curry(function(a, b, c) {
  console.log(a + b + c);
});
test(1, 2, 3);
test(1, 2)(3);
test(1)(2)(3);
```

## 偏函数

> 不了解偏函数的朋友请见[偏函数](https://github.com/MrGaoGang/lucky_docs/blob/master/article/javascript/Javascript%E6%9F%AF%E9%87%8C%E5%8C%96%E5%92%8C%E5%81%8F%E5%87%BD%E6%95%B0%E5%AE%9E%E7%8E%B0.md)

```js
function part(fn, ...arg) {
  let all = arg || [];
  return (...rest) => {
    let args = all.slice(0);
    args.push(...rest);
    return fn.apply(this, args);
  };
}

function add(a = 0, b = 0, c = 0) {
  console.log(a + b + c);
}
let addPart = part(add);
addPart(9); //9
addPart(9, 11); //20
```

## 循环实现数组 map 方法

```js
Array.prototype.selfMap = function(fn, context) {
  let arr = Array.prototype.slice.call(this);

  let mapArr = new Array();
  for (let i = 0; i < arr.length; i++) {
    //判断稀疏数组情况
    if (!arr.hasOwnProperty(i)) continue;
    mapArr[i] = fn.call(context, arr[i], i, this);
  }
  return mapArr;
};

console.log(
  [1, 2, 3].selfMap(function(data) {
    return data + "v";
  })
); //[ '1v', '2v', '3v'
```

[来自：一个合格的中级前端工程师需要掌握的 28 个 JavaScript 技巧](https://juejin.im/post/5cef46226fb9a07eaf2b7516#heading-21)

## 使用 reduce 实现数组 map 方法

```js
Array.prototype.selfMap = function(fn, context) {
  let arr = Array.prototype.slice.call(this);
  return arr.reduce((pre, cur, index, array) => {
    return [...pre, fn.call(context, cur, index, this)];
  }, []);
};

console.log(
  [1, 2, 3].selfMap(function(data) {
    return data + "v";
  })
); //[ '1v', '2v', '3v'
```

## 循环实现数组 filter 方法

```js
Array.prototype.selfFilter = function(fn, context) {
  return this.reduce((pre, cur, index, array) => {
    return fn.call(context, cur, index, this) ? [...pre, cur] : [...pre];
  }, []);
};

console.log(
  [1, 2, 3].selfFilter(function(data) {
    return data % 2 === 0;
  })
);
```

[来自：一个合格的中级前端工程师需要掌握的 28 个 JavaScript 技巧](https://juejin.im/post/5cef46226fb9a07eaf2b7516#heading-21)

## 循环实现 filter

```js
Array.prototype.selfFilter = function(fn, context) {
  let arr = Array.prototype.slice.call(this);
  let filterArr = new Array();
  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue; //过滤稀疏数组情况
    fn.call(context, arr[i], i, this) && filterArr.push(arr[i]);
  }

  return filterArr;
};

console.log(
  [1, 2, 3].selfFilter(function(data) {
    return data % 2 !== 0;
  })
);
```

[来自：一个合格的中级前端工程师需要掌握的 28 个 JavaScript 技巧](https://juejin.im/post/5cef46226fb9a07eaf2b7516#heading-21)

## 循环实现数组的 reduce 方法

```js
Array.prototype.selfReduce = function(fn, initValue) {
  let arr = Array.prototype.slice.call(this);
  let startIndex = 0,
    res;
  if (initValue === undefined) {
    for (let i = 0; i < arr.length; i++) {
        //因为可能存在稀疏数组的关系，所以 reduce 需要保证跳过稀疏元素，遍历正确的元素和下标
      if (!arr.hasOwnProperty(i)) continue;
      startIndex = i;
      res = arr[i];
      break;
    }
  } else {
    res = initValue;
  }

  for (let i = ++startIndex; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue;
    res = fn.call(null, res, arr[i], i, this);
  }
  return res;
};

console.log(
  [1, 2, 3, 9].selfReduce(function(pre, curr) {
    return pre + curr;
  })
);
```

[来自：一个合格的中级前端工程师需要掌握的 28 个 JavaScript 技巧](https://juejin.im/post/5cef46226fb9a07eaf2b7516#heading-21)


## 使用 reduce 实现数组的 flat 方法

```js
let selfFlat = function(dept = 1) {
  let arr = Array.prototype.slice.call(this);
  if (dept === 0) {
    return arr;
  }
  return arr.reduce((pre, curr, index, array) => {
    if (Array.isArray(curr)) {
      return [...pre, ...selfFlat.call(curr, dept - 1)];
    } else {
      return [...pre, curr];
    }
  }, []);
};

Array.prototype.selfFlat = selfFlat;
console.log([1, [4, 5, 6], 3, [0, 10]].selfFlat());

```

[来自：一个合格的中级前端工程师需要掌握的 28 个 JavaScript 技巧](https://juejin.im/post/5cef46226fb9a07eaf2b7516#heading-21)





## 参考
- [近一万字的 ES6 语法知识点补充](https://juejin.im/post/5c6234f16fb9a049a81fcca5)
- [记录面试中一些回答不够好的题（Vue 居多） | 掘金技术征文](https://juejin.im/post/5a9b8417518825558251ce15)
- [中级前端工程师必须要掌握的 28 个 JavaScript 技巧](https://juejin.im/post/5cef46226fb9a07eaf2b7516#heading-23)
