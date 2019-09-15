**什么是函数柯里化**
> 只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。用公式表示就是我们要做的事情其实是
```js
fn(a,b,c,d)=>fn(a)(b)(c)(d)；

fn(a,b,c,d)=>fn(a，b)(c)(d)；

fn(a,b,c,d)=>fn(a)(b，c，d)；

......

再或者这样：

fn(a,b,c,d)=>fn(a)(b)(c)(d)()；

fn(a,b,c,d)=>fn(a)；fn(b)；fn(c)；fn(d)；fn()；

但不是这样：(下面为偏函数)

fn(a,b,c,d)=>fn(a)；

fn(a,b,c,d)=>fn(a，b)；
```


### 第一种方式：按照参数个数自动结束
```js
fn(a,b,c,d)=>fn(a)(b)(c)(d)；

fn(a,b,c,d)=>fn(a，b)(c)(d)；

fn(a,b,c,d)=>fn(a)(b，c，d)；

```

**代码实现**
```js
const curry = (fn, ...arg) => {
    let all = arg || [],
        length = fn.length;
    return (...rest) => {
        let _args = all.slice(0); //拷贝新的all，避免改动公有的all属性，导致多次调用_args.length出错
        _args.push(...rest);
        if (_args.length < length) {//在没有达到fn参数个数时，返回当前fn函数引用
            return curry.call(this, fn, ..._args);
        } else {//当达到了fn的参数，那么就调用fn函数
            return fn.apply(this, _args);
        }
    }
}

//测试

let test = curry(function(a, b, c) {
console.log(a + b + c);
})
test(1, 2, 3);
test(1, 2)(3);
test(1)(2)(3);
```


### 第二种手动结束

```js
fn(a,b,c,d)=>fn(a)(b)(c)(d)()；

fn(a,b,c,d)=>fn(a)；fn(b)；fn(c)；fn(d)；fn()；
```

```js
const curry=function(fn,...args){
    let all=args||[];
    let argsLen=fn.length;
    return function(...argsIn){
        let _args=all.slice(0);
        _args.push(argsIn);
        if(argsIn.length===0){
            all=[];
           return fn.apply(this,_args);
        }else{
          return  curry.call(this,fn,..._args);
        }
    }

}

//测试
let test = curry(function(...rest) {
    let args = rest.map(val => val * 10);
    console.log(args);
})
test(2);
test(2);
test(3);
test();
test(5);
test();
test(2)(2)(2)(3)(4)(5)(6)();
test(2, 3, 4, 5, 6, 7)();
```



### 偏函数
```js
fn(a,b,c,d)=>fn(a)；

fn(a,b,c,d)=>fn(a,b)；
```

```js
function part(fn, ...arg) {
    let all = arg || [];
    return (...rest) => {
        let args = all.slice(0);
        args.push(...rest);
        return fn.apply(this, args)
    }
}

function add(a = 0, b = 0, c = 0) {
    console.log(a + b + c);
}
let addPart = part(add);
addPart(9); //9
addPart(9, 11);//20
```



[参考：js高阶函数应用—函数柯里化和反柯里化](https://blog.csdn.net/shunfa888/article/details/80013170)
