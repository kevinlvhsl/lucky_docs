---
sidebar: false
---

[MDN 闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

### 闭包的定义
- 闭包是指有权访问另一个函数作用域中的变量的函数 --《JavaScript高级程序设计》
- 闭包是函数和声明该函数的词法环境的组合。 -- 《MDN》

> Javascript允许使用内部函数---即函数定义和函数表达式位于另一个函数的函数体内。
> 而且，这些内部函数可以访问它们所在的外部函数中声明的所有局部变量、参数和声明的其他内部函数。
> 当其中一个这样的内部函数在包含它们的外部函数之外被调用时，就会形成闭包。

### 常见的闭包
```js
function makeFunc() {
    var name = "Mozilla";
    function displayName() {
        alert(name);
    }
    return displayName;
}

var myFunc = makeFunc();
myFunc();

//使用匿名函数
function makeAdder(x) {
  return function(y) {//匿名函数的闭包内部的this位windows，请见最后闭包的缺点
    return x + y;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);

console.log(add5(2));  // 7
console.log(add10(2)); // 12
```

### 闭包的用途

**1. 保护变量的安全-实现JS私有属性和私有方法**
> 利用闭包可以读取函数内部的变量，变量在函数外部不能直接读取到，从而达到保护变量安全的作用。因为私有方法在函数内部都能被访问到，从而实现了私有属性和方法的共享。
常见的模块模式就是利用闭包的这种特性建立的
```js
var Counter = (function() {
  //私有属性
  var privateCounter = 0; 
  //私有方法
  function changeBy(val) { 
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }   
})();
console.log(privateCounter); //privateCounter is not defined 
console.log(Counter.value()); // 0
Counter.increment();
Counter.increment();
console.log(Counter.value()); // 2
Counter.decrement();
console.log(Counter.value()); // 1
```

在jQuery框架的私有方法和变量也是这么设计的

```js
var $ = jQuery = function(){
    return jQuery.fn.init();
}
jQuery.fn = jQuery.prototype = {
    init:function(){
        return this;  //this指向jQuery.prototype
    },
    length: 1,
    size: function(){
        return this.length;
    }
}
console.log($().size()); // 1

```
**2. 将处理结果缓存**
```js
var mult = (function(){
    var cache = {};
    var calculate = function(){
        var a = 1;
        for(vari=0,l=arguments.length;i<l;i++){
            a = a*arguments[i];
        }
        return a;    
    };
    return function(){
        var args = Array.prototype.join.call(arguments,',');
        if(args in cache){
            return cache[args];
        }
        return cache[args] = calculate.apply(null,arguments);    
    }
})();
```
这样我们在第二次调用的时候，就会从缓存中读取到该对象。

**理解了闭包的原理我们发现闭包的这些用途都是利用了闭包保存了当前函数的活动对象的特点，
这样闭包函数在作用域之外被调用时依然能够访问其创建时的作用域**

### 闭包的缺点
- 闭包将函数的活动对象维持在内存中，过度使用闭包会导致内存占用过多，所以在使用完后需要将保存在内存中的活动对象解除引用；
- 闭包只能取得外部函数中任何变量的最后一个值，在使用循环且返回的函数中带有循环变量时会得到错误结果；(这就是为什么循环对节点绑定事件无效的原因)
- 当返回的函数为匿名函数时，注意匿名函数中的this指的是window对象。


[参考:对JavaScript中闭包的理解](https://www.cnblogs.com/jesse131/p/9079290.html)
