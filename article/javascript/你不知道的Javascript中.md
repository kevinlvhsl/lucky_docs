

此文章借阅了[精读《你不知道的javascript》中卷](https://juejin.im/post/5b2a07c16fb9a00e36425ef0)中的思维导图，十分感谢！

# 第一部分 类型和语法
## 第1章 类型

JavaScript 有七种内置类型：
- 空值（null ）
- 未定义（undefined ）
- 布尔值（boolean ）
- 数字（number ）
- 字符串（string ）
- 对象（object ）
- 符号（symbol ，ES6 中新增）

```js
typeof null === "object" 
typeof [] === "object"
//typeof 运算符总是会返回一个字符串：
typeof typeof 42; // "string"
```
> 在对变量执行 typeof 操作时，得到的结果并不是该变量的类型，而是该变量持有的`值的类型`，因为 JavaScript 中的变量没有类型.

![](https://user-gold-cdn.xitu.io/2018/6/20/1641c2f4d3ede46a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## 第2章  值
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c2f9fd654d30?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c2fbdebcded2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c2fdca914292?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 类数组：有时需要将类数组（一组通过数字索引的值）转换为真正的数组。通常使用**Array.prototype.slice.call(类数组);和Array.from(类数组)**


### 2.2 字符串
- `字符串不可变`是指字符串的成员函数不会改变其原始值，而是创建并返回一个新的字符串。而数组的成员函数都是在其原始值
上进行操作。

```js
c = a.toUpperCase();
a === c; // false
a; // "foo"
c; // "FOO"

```

- 过“借用”数组的非变更方法来处理字符串。
```js
var c = Array.prototype.join.call( a, "-" );
var d = Array.prototype.map.call( a, function(v){
    return v.toUpperCase() + ".";
} ).join( "" );
c; // "f-o-o"
d; // "F.O.O."
```

- 字符串反转
> 数组有反转函数reverse()而字符串没有，所以通常将字符串转换成数组。

```js
var a="foo";
var c = a
// 将a的值转换为字符数组 
.split( "" )
// 将数组中的字符进行倒转 
.reverse()
// 将数组中的字符拼接回字符串 
.join( "" );
c; // "oof"
```



#### 2.3 数字

0.1 + 0.2 === 0.3; // false

- 从数学角度来说，上面的条件判断应该为 true ，可结果为什么是 false 呢?

> 简单来说，二进制浮点数中的 0.1 和 0.2 并不是十分精确，它们相加的结果并非刚好等于 0.3 ，而是一个比较接近的数字 0.30000000000000004 ，所以条件判断结果为 false 。

- 那么应该怎样来判断0.1 + 0.2和0.3是否相等呢?

> 最常见的方法是设置一个误差范围值，通常称为“机器精度”(machine epsilon)，对 JavaScript 的数字来说，这个值通常是 2^-52 (2.220446049250313e-16)。

在es6中使用Number.EPSILON判断。
```js
if (!Number.EPSILON) {
    Number.EPSILON = Math.pow(2,-52);
}
```

1. 


#### 2.3.3 整数的安全范围
> 能够被“安全”呈现的最大整数是2^53 - 1，即`9007199254740991`，在ES6中被定义为 `Number.MAX_SAFE_INTEGER` 。最小整数是 `-9007199254740991` ，在 ES6 中被定义为 `Number.MIN_SAFE_INTEGER` 。

#### 2.3.4 整数的检测

> 可以使用 ES6 中的 `Number.isInteger(..)` 方法
```js
///Number.isInteger的polyfill
if (!Number.isInteger) { 
    Number.isInteger = function(num) {
        return typeof num == "number" && num % 1 == 0; 
    };
}

```

### 2.4 特殊值

- null 指空值(empty value)
- undefined 指没有值(missing value)

> **简单值(即标量基本类型值，scalar primitive)总是 通过值复制的方式来赋值 / 传递，包括 null 、undefined 、字符串、数 字、布尔和 ES6 中的 symbol**。

> **复合值(compound value)——对象(包括数组和封装对象，参见第 3 章)和函数，则总是 通过引用复制的方式来赋值 / 传 递**。



## 第3章 原生函数

![](https://user-gold-cdn.xitu.io/2018/6/20/1641c303afb22377?imageslim)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c306f032cf04?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



## 第4章 强制类型转换

**JSON**
- JSON.stringify(..) 在对象中遇到 undefined 、function 和 symbol 时会自动将其忽略，在数组中则会返回 null（以保证单元位置不变）。

```js
JSON.stringify( undefined ); // undefined
JSON.stringify( function(){} ); // undefined
JSON.stringify(
[1,undefined,function(){},4]
); // "[1,null,null,4]"
JSON.stringify(
{ a:2, b:function(){} }
); // "{"a":2}"

```
### 数字

- **其中 true 转换为 1 ，false 转换为 0 。undefined 转换为 NaN ，null 转换为 0** 。
```js

function onlyOne() {
    var sum = 0;
    for (var i=0; i < arguments.length; i++) {
        // 跳过假值，和处理0一样，但是避免了NaN
        if (arguments[i]) {
        sum += arguments[i];
        }
    }
    return sum == 1;
}
var a = true;
var b = false;
onlyOne( b, a ); // true
onlyOne( b, a, b, b, b ); // true

```
> 通过 sum += arguments[i] 中的隐式强制类型转换，将真值（true/truthy）转换为 1 并进行累加。如果有且仅有一个参数
为 true ，则结果为 1 ；否则不等于 1 ，sum == 1 条件不成立。

- 从 ES5 开始，使用 Object.create(null) 创建的对象 [[Prototype]] 属性为 null ，并且没有 valueOf() 和
toString() 方法，因此无法进行强制类型转换。

**数字解析和转换时不同的概念**


```js
var a = "42";
var b = "42px";
Number( a ); // 42
parseInt( a ); // 42
Number( b ); // NaN
parseInt( b ); // 42

```

`解析允许` 字符串中含有非数字字符，解析按从左到右的顺序，如果遇到非数字字符就停止。而转换不允许 出现非数字字符，
否则会失败并返回 NaN 。

`解析`和`转换`之间不是相互替代的关系。它们虽然类似，但各有各的用途。如果字符串右边的非数字字符不影响结果，就可以使
用解析。而转换要求字符串中所有的字符都是数字，像 "42px" 这样的字符串就不行。


- **不要忘了 parseInt(..) 针对的是字符串值。向 parseInt(..) 传递数字和其他类型的参数是没有用的，比如 true
、function(){...} 和 [1,2,3]** 。

- 

### 假与真

**假**
- JavaScript的**假值**:
    - undefined
    - null
    - false
    - +0 、-0 和 NaN
    - ""
- JavaScript的**假对象**:
```js
var a = new Boolean( false );
var b = new Number( 0 );
var c = new String( "" );
```
> 它们都是封装了假值的对象,其实结果都为true;

- document.all ，它是一个类数组对象，包含了页面上的所有元素，由 DOM（而不是 JavaScript 引擎）提供给 JavaScript 程序使用。它以前曾是一个真正意义上的对象，布尔强制类型转换结果为 true ，不过现在它是一个假值对象。    


**真**
```js
var a = "false";
var b = "0";
var c = "''";
var d = Boolean( a && b && c );
d;
```
> 答案是 true 。

- **所有字符串都是真值。不过 "" 除外，因为它是假值列表中唯一的字符串**。

- **同样的道理，[] 、{} 和 function(){} 都不在假值列表中，因此它们都是真值。**



### 字符串和数字的转换

> 除了 String(..) 和 Number(..) 以外，还有其他方法可以实现字符串和数字之间的显式转换：
```js
var a = 42;
var b = a.toString();
var c = "3.14";
var d = +c;
b; // "42"
d; // 3.14  
/**
+c 是 + 运算符的一元 （unary）形式（即只有一个操作数）。+ 运算符显式地将 c 转换为数字，而非数字加法运算
（也不是字符串拼接)
**/

var e = 5+ +c;
e; // 8.14 为什么？

```
> 一元运算符 - 和 + 一样，并且它还会反转数字的符号位。由于 -- 会被当作递减运算符来处理，所以我们不能使用 -- 来撤销反转，而应该像 - -"3.14" 这样，在**中间加一个空格**，才能得到正确结果 3.14 。



### 　隐式强制类型转换为布尔值
。下面的情况会发生布尔值隐式强制类型转换。
- (1) if (..) 语句中的条件判断表达式。
- (2) for ( .. ; .. ; .. ) 语句中的条件判断表达式（第二个）。
- (3) while (..) 和 do..while(..) 循环中的条件判断表达式。
- (4) ? : 中的条件判断表达式。
- (5) 逻辑运算符 || （逻辑或）和 && （逻辑与）左边的操作数（作为条件判断表达式）。
以

### || 和 &&的理解
> **它们的返回值是两个操作数中的一个（且仅一个）。即选择两个操作数中的一个，然后返回它的值**

```js
var a = 42;
var b = "abc";
var c = null;
a || b; // 42
a && b; // "abc"
c || b; // "abc"
c && b; // null
```
> **对于 || 来说，如果条件判断结果为 true 就返回第一个操作数（a 和 c ）的值，如果为 false 就返回第二个操作数（b ）的值。**

- || 运算符常常用来设置默认值

> **&& 则相反，如果条件判断结果为 true 就返回第二个操作数（b ）的值，如果为 false 就返回第一个操作数（a 和 c ）的值。**
- && 常用来代替if 运算符

```js
function foo() {
    console.log( a );
}
var a = 42;
a && foo(); // 42
/**
foo() 只有在条件判断 a 通过时才会被调用。如果条件判断未通过，a && foo() 就会悄然终止（也叫作“短路”，short
circuiting），foo() 不会被调用。
**/
```


```js
var a = 42;
var b = null;
var c = "foo";
if (a && (b || c)) {
    console.log( "yep" );
}

```
> 这里 a && (b || c) 的结果实际上是 "foo" 而非 true ，然后再由 if 将 foo 强制类型转换为布尔值，所以最后结果为
true 。


### 宽松相等和严格相等
常见的误区是“== 检查值是否相等，=== 检查值和类型是否相等”。
正确的解释是：**== 允许在相等比较中进行强制类型转换，而 === 不允许。**

#### 相比时的性能

- 如果进行比较的两个值类型相同，则 == 和 === 使用相同的算法，所以除了 JavaScript 引擎实现上的细微差别之外，它们之间并没有什么不同。
- 如果两个值的类型不同，我们就需要考虑有没有强制类型转换的必要，有就用 == ，没有就用 === ，不用在乎性能。


#### 其他类型和布尔类型之间的相等比较

**个人建议无论什么情况下都不要使用 == true 和 == false**   - 不要使用

#### null 和 undefined 之间的相等比较
> null 和 undefined 之间的 == 也涉及隐式强制类型转换。ES5 规范 11.9.3.2-3 规定：
- (1) 如果 x 为 null ，y 为 undefined ，则结果为 true。
- (2) 如果 x 为 undefined ，y 为 null ，则结果为 true。

**在 == 中 null 和 undefined 相等（它们也与其自身相等）**，除此之外其他值都不存在这种情况。
这也就是说在 == 中 null 和 undefined 是一回事，可以相互进行隐式强制类型转换：

```js
//建议使用
var a = doSomething();
if (a == null) {
// ..
}

```


#### 代码中不要使用的

```js
//假值的相等比较
"0" == null; // false
"0" == undefined; // false
"0" == false; // true -- 晕！
"0" == NaN; // false
"0" == 0; // true
"0" == ""; // false
false == null; // false
false == undefined; // false
false == NaN; // false
false == 0; // true -- 晕！
false == ""; // true -- 晕！
false == []; // true -- 晕！
false == {}; // false
"" == null; // false
"" == undefined; // false
"" == NaN; // false
"" == 0; // true -- 晕！
"" == []; // true -- 晕！
"" == {}; // false
0 == null; // false
0 == undefined; // false
0 == NaN; // false
0 == []; // true --
//极端情况
[] == ![] // true
//完整性检查
"0" == false; // true -- 晕！
false == 0; // true -- 晕！
false == ""; // true -- 晕！
false == []; // true -- 晕！
"" == 0; // true -- 晕！
"" == []; // true -- 晕！
0 == []; // true -- 晕！
```


## 第5章  语法
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c313229058fc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c315bee42707?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)




# 第二部分 异步和性能

## 第1章 异步(现在与将来)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c318a66b1032?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c31aeeeaae13?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


## 第2章  回调
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c31dc255b722?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

>

- 回调函数是 JavaScript 异步的基本单元。但是随着 JavaScript 越来越成熟,对于异步编程领域的发展,回调已经不够用了。
- 第一,大脑对于事情的计划方式是线性的、阻塞的、单线程的语义,但是回调表达异步流 程的方式是非线性的、非顺序的,这使得正确推导这样的代码难度很大。难于理解的代码 是坏代码,会导致坏 bug。

    我们需要一种更同步、更顺序、更阻塞的的方式来表达异步,就像我们的大脑一样。

- 第二,也是更重要的一点,回调会受到`控制反转`的影响,因为回调暗中把控制权交给第三 方(通常是不受你控制的第三方工具!)来调用你代码中的 continuation。 这种控制转移导 致一系列麻烦的`信任问题`,比如`回调被调用的次数是否会超出预期`,`是否有错误返回`,`调用回调过早（在追踪之前）`,`没有把所需的环境 / 参数成功传给你的回调函数`。

    可以发明一些特定逻辑来解决这些信任问题,但是其难度高于应有的水平,可能会产生更 笨重、更难维护的代码,并且缺少足够的保护,其中的损害要直到你受到 bug 的影响才会 被发现。

> 我们需要一个通用的方案来解决这些信任问题。不管我们创建多少回调,这一方案都应可 以复用,且没有重复代码的开销。

> 我们需要比回调更好的机制。到目前为止,回调提供了很好的服务,但是未来的 JavaScript 需要更高级、功能更强大的异步模式。本书接下来的几章会深入探讨这些新型技术。


## 第3章 Promise
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c3210ed1135d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c322b9dce156?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c32579139ed3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c3279bb0a8d7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c3299cc4a0d4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### Promise链式处理
决议 （resolve）、完成 （fulfill）和拒绝 （reject）；

> new Promise( function(..){ ..} ) 模式通常称为 revealing constructor（http://domenic.me/2014/02/13/the-revealing-constructor-pattern/ ）。**传入的函数会
立即执行**（不会像 then(..) 中的回调一样异步延迟），它有两个参数，在本例中我们将其分别称为 resolve
和 reject 。这些是 promise 的决议函数。 `resolve(..) 通常标识完成，而 reject(..) 则标识拒绝`。

**不可使用p instanceof Promise**
> 既然 Promise 是通过 new Promise(..) 语法创建的，那你可能就认为可以通过 p instanceof Promise 来检查。但遗
憾的是，这并不足以作为检查方法，原因有许多。

> 其中最主要的是，Promise 值可能是从其他浏览器窗口（iframe 等）接收到的。这个浏览器窗口自己的 Promise 可能和当前窗口
/frame 的不同，因此这样的检查无法识别 Promise 实例。


**resolve/reject只能传递一个值**

> 如果使用多个参数调用 resovle(..) 或者 reject(..) ，第一个参数之后的所有参数都会被默默忽略。

> 如果要传递多个值，你就必须要把它们`封装在单个值中传递`，比如通过一个数组或对象。

**特殊异常捕获**
> 如果在 Promise 的创建过程中或在查看其决议结果过程中的任何时间点上出现了一个JavaScript 异常错 误，比如一个 TypeError 或 ReferenceError ，那这个异常就会被捕捉，且会使这个 Promise 被拒绝。

```js
var p = new Promise( function(resolve,reject){
    foo.bar(); // foo未定义，所以会出错！
    resolve( 42 ); // 永远不会到达这里 :(
} );
p.then(
    function fulfilled(){
    // 永远不会到达这里 :(
    },
    function rejected(err){
    // err将会是一个TypeError异常对象来自foo.bar()这一行
    }
);
```

**调用 Promise 的 then(..) 会自动创建一个新的 Promise 从调用返回。**
> then 都是链式调用，默认情况下一个then都会接受到上一个then的默认promise返回；


**在完成或拒绝处理函数内部，如果返回一个值或抛出一个异常，新返回的（可链接的）Promise 就相应地决议(resolve)。**

```js
// 步骤1：request是thenable的
request( "http://some.url.1/" )
// 步骤2：
.then( function(response1){
    foo.bar(); // undefined，出错！
    // 永远不会到达这里
    return request( "http://some.url.2/?v=" + response1 );
} )
// 步骤3：
.then(
    function fulfilled(response2){
        // 永远不会到达这里
    },
    // 捕捉错误的拒绝处理函数
    function rejected(err){
        console.log( err );
        // 来自foo.bar()的错误TypeError
        return 42;
    }
) // 步
骤
4：
.then( function(msg){
console.
```

**如果完成或拒绝处理函数返回一个 Promise，它将会被展开，这样一来，不管它的决议值(resolve)是什么，都会成为当前then(..) 返回的链接 Promise 的决议(resolve)值**
> 如果需要步骤二，在步骤一处理完成处理，你可以在步骤一手动返回一个promise
```js
new Promise(function(resolve,reject){
    //do something
    resovle();
}).then(function(data){
    //do something
    return new Promise(function(resolve,reject){
        //do something
        resovle();
    })
}).
.then(function(data){
    //这个地方的值 就是上一个new Pormise的决议值(resolve)
})

```

**Promise.resolve(..) 会将传入的真正 Promise 直接返回，对传入的 `thenable 则会展开`。如果这个thenable 展开得到一个拒绝状态，那么从 Promise.resolve(..) 返回的 Promise 实际上就是这同一个拒绝状态.**

> reject(..) 不会像 resolve(..) 一样进行展开。如果向 reject(..) 传入一个 Promise/thenable 值，它会把
这个值原封不动地设置为拒绝理由。`后续的拒绝处理函数接收到的是你实际传给 reject(..) 的那个Promise/thenable，而不是其底层的立即值`。
```js
var rejec = new Promise( function(resolve,reject){
    // 用一个被拒绝的promise完成这个promise
    resolve( Promise.reject( "Oops" ) );
} );
rejec.then(
    function fulfilled(){
        // 永远不会到达这里
    },
    function rejected(err){
        console.log( err ); // "Oops"
    }
);
```


**Promise.catch捕获异常**
> 没有为 then(..) 传入拒绝处理函数，所以默认的处理函数被替换掉了，而这仅仅是把错误传递给了链中的下一个
promise。因此，进入 p 的错误以及 p 之后进入其决议(resolve)（就像 msg.toLowerCase() ）的错误都会传递到最后的

> 遗留的问题：要是在catch中还存在异常咋办
handleErrors(..)
```js
var p = Promise.resolve( 42 );
p.then(
    function fulfilled(msg){
    // 数字没有string函数，所以会抛出错误
        console.log( msg.toLowerCase() );
    }
) .
catch( handleErrors );
```



### Promise API (详解)

#### new Promise(..) 构造器
> 构造器 Promise(..) 必须和 new 一起使用，并且必须提供一个函数回调。这个回调是同步的或立即调用的。这
个函数接受两个函数回调，用以支持 promise 的决议。通常我们把这两个函数称为 resolve(..) 和 reject(..)

```js
var p = new Promise( function(resolve,reject){
// resolve(..)用于决议/完成这个promise
// reject(..)用于拒绝这个promise
} );
```

> reject(..) 就是拒绝这个 promise；但 `resolve(..) 既可能完成 promise，也可能拒绝`，要`根据传入参数而定`。
- **如果传给resolve(..) 的是一个非 Promise、非 thenable 的立即值，这个 promise 就会用这个值完成**。
- 如果传给 resolve(..) 的是一个真正的 Promise 或 thenable 值，`这个值就会被递归展开`，并且（要构造的）promise 将`取用其最终决议值或状态`。


#### Promise.resolve(..) 和 Promise.reject(..)

Promise.reject是使用new Pormise()中reject的快捷方式。
```js
//如下两种方式是等价的
var p1 = new Promise( function(resolve,reject){
reject( "Oops" );
} );
var p2 = Promise.reject( "Oops" );
```
> **Promise.resolve并不是完成，而是决议，有可能从pending到fulfilled或者rejected。**

> Promise.resolve返回一个状态由给定value决定的Promise对象。`如果该值是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定`；(见下面的then方法介绍)

> `否则的话(该value为空，基本类型或者不带then方法的对象),返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法`。**通常而言，如果你不知道一个值是否是Promise对象，使用Promise.resolve(value) 来返回一个Promise对象,这样就能将该value以Promise对象形式使用**。

> Promise.resolve和reject只能接收一个参数，如果需要传递多个参数请使用数组/对象包裹起来。

```js
// then(..) 接受一个或两个参数：第一个用于完成回调，第二个用于拒绝回调
var fulfilledTh = {
    then: function(cb) { cb( 42 ); }
};
var rejectedTh = {
    then: function(cb,errCb) {
        errCb( "Oops" );
    }
};
var p1 = Promise.resolve( fulfilledTh );
var p2 = Promise.resolve( rejectedTh );
// p1是完成的promise
```

#### then()和catch

> then(..) `接受一个或两个参数`：第一个用于完成`回调`，第二个用于`拒绝回调`。如果两者中的任何一个被省略或者作为非函数值传入的话，就会替换为相应的默认回调。`默认完成回调`只是`把消息传递下去`，而`默认拒绝回调则`只是`重新抛出`（传播）其接收到的`出错原因`。

```js
p.then( fulfilled );
p.then( fulfilled, rejected );
p.catch( rejected ); // 或者p.then( null, rejected )
```

- then和catch也会创建并返回一个新的promise，用于链式调用then，
- 如果then中的fulfilled函数或者rejected中`抛出异常` ，那么返回的promise将会到`下一个then的rejected函数中`;
- 如果then中返回一个`非thenable`(即带有then方法的对象),那么返回的值将会在`下一个then方法中的fulfilled中`；
- 如果then返回的是一个`thenable或者promise`，那么具体调用下一个then的哪个方法，由thenable或promsie决定。

```js
new Promise(function(resolve,reject){
    resolve("data");//非thenable，会到then的fulfilled中
})
.then(function fulfilled(res){
    return new Promise(function(resolve,reject){//返回的是thenable
        resolve("下一个");//调用下一个then的哪个方法由这个promise决定，此处为resolve，并且返回的是一个非thenable对象，那么就会调用下一个then方法的fulfilled，否则为thenable对象，会再次展开
    })
} ,function rejected(error){

})
.then(function fulfilled(){//到fulfilled还是rejected由上一个then决定

},function rejected(error){

})
```

#### 　Promise.all([ .. ])
> 多个任务并行执行，。它们的完成顺序并不重要，但是必须都要完成，都执行完成后回调。

> **Promise.all([ .. ]) 需要一个参数，是一个数组，通常由 Promise 实例组成。从 Promise.all([ .. ]) 调用返回的 promise 会收到一个完成消息（代码片段中的 msg ）。这是一个由所有传入 promise 的完成消息组成的数组，与指定的顺序一致（与完成顺序无关）。**

```js
// request(..)是一个Promise-aware Ajax工具
// 就像我们在本章前面定义的一样
var p1 = request( "http://some.url.1/" );
var p2 = request( "http://some.url.2/" );
Promise.all( [p1,p2] )
.then( function(msgs){
    // 这里，p1和p2完成并把它们的消息传入;msgs是一个数组
    return request(
    "http://some.url.3/?v=" + msgs.join(",")
    );
} )
.then( function(msg){
console.
```

- 从 Promise.all([ .. ]) 返回的主 promise 在有`且仅在所有的成员 promise 都完成后才会完成`。`如果这些 promise 中有任何一个被拒绝的话，主 Promise.all([ .. ]) promise 就会立即被拒绝`，并`丢弃`来自其他所有 promise 的全部`结果`。
- 永远要记住为每个 promise 关联一个拒绝 / 错误处理函数，特别是从 Promise.all([ .. ]) 返回的那一个。


#### Promise.race([ .. ])
>race为竞争，只有一个胜利者； Promise.race([ .. ]) 也接受单个数组参数。这个数组由一个或多个 Promise、thenable 或立即值组成

**与 Promise.all([ .. ]) 类似，一旦`有任何一个` Promise 决议为`完成`，Promise.race([ .. ]) 就会`完成`；一旦有任何一个 Promise 决议为`拒绝`，它就会`拒绝`**

**要注意，永远不要递送空数组。**


### Promise的局限性
- 顺序错误处理
> 在最后添加一个catch函数捕获异常
- 单一值
> resolve/rejected可以使用数组/对象包括；在fulfilled中使用对象解构{}或者数组解构[]获取值。
- 单决议

- 无法取消
> 单独的 Promise 不应该可取消，但是取消一个可序列是合理的，因为你不会像对待 Promise 那样把序列作为一个单独的不变值来传送。

### 以前的回调函数修改为Promise
//之前使用回调函数，达到异步效果

```js
function foo(x,y,cb) {
    ajax(
    "http://some.url.1/?x=" + x + "&y=" + y,
    cb
    );
}
foo( 11, 31, function(err,text) {
    if (err) {
        console.error( err );
    }
    else {
        console.log( text );
    }
} );

```

> 使用Promise封装一个包裹函数

```js
// polyfill安全的guard检查
if (!Promise.wrap) {
    Promise.wrap = function(fn) {
        return function() {
            var args = [].slice.call( arguments );
            return new Promise( function(resolve,reject){
                fn.apply(
                null,
                //args为实例调用时传入的所有参数，在最后加上一个回调函数，然后调用fn函数
                args.concat( function(err,v){
                    if (err) {
                        reject( err );
                    }
                    else {
                        resolve( v );
                    }
                } )
                );
            } );
        };
    };
}

//使用的时候，但是要求ajax回调函数必须为最后一个参数
var request = Promise.wrap( ajax );
request( "http://some.url.1/")//只传递需要的参数
.then( .. )
```


## 第6章 生成器
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c33279d14790?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c32dfa81cca0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c32feeacf0c8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


抱歉，此章看的是[阮一峰老师的es6 module](http://es6.ruanyifeng.com/?search=import&x=0&y=0#docs/generator)

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

```
里面重要的几个概念：
- 一是，function关键字与函数名之间有一个星号；
- 二是，函数体内部使用yield表达式
- 三是，next()函数

> 必须调用遍历器对象的next方法，使得指针移向下一个状态。也就是说，**每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止**;

```js
hw.next()
// { value: 'hello', done: false }
hw.next()
// { value: 'world', done: false }
hw.next()
// { value: 'ending', done: true }
hw.next()
// { value: undefined, done: true }
```
**每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束**

- 一个函数里面，只能执行一次（或者说一个）return语句，但是可以执行多次（或者说多个）yield表达式

- yield表达式`只能`用在 Generator 函数里面

- yield表达式`如果`用`在`另一个`表达式之中`，`必须放在圆括号里面`

```js
function* demo() {
  console.log('Hello' + yield); // SyntaxError
  console.log('Hello' + yield 123); // SyntaxError

  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}
```

### 生成器使用for ... of
> for...of循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法。

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5

```



## 第5章 程序性能
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c33279d14790?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c334668ebefc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


### Web Worker 启动多线程

#### Work使用场景

Web Worker 通常应用于哪些方面呢？
- 处理密集型数学计算
- 大数据集排序
- 数据处理（压缩、音频分析、图像处理等）
- 高流量网络通信

#### Work创建及终止

**实例化**

```js
//1. 实例化woker,
var w1 = new Worker( "http://some.url.1/mycoolworker.js" );
```

- 这个 URL 应该`指向一个 JavaScript 文件的位置（`而不是一个 HTML 页面！），这个文件将被加载到一个 Worker 中。然后浏览器`启动一个独立的线程`，让这个文件在这个线程中作为独立的程序运行。

- **如果浏览器中有两个或多个页面（或同一页上的多个 tab ！）试图从同一个文件 URL 创建 Worker，那么最终得到的实际上是完全独立的 Worker**

**数据收发**
> `Worke`r 之间以及它们和`主程序之间，`不会共享任何作用域或资源`，那会把所有多线程编程的噩梦带到前端领域，而是`通过`一个`基本的事件消息机制相互联系`;

```js
//2. 数据的获取（主线程发送消息给woker）
w1.addEventListener( "message", function(evt){
// evt.data
} );

//数据的发送(主线程收到woker的信息)
w1.postMessage( "something cool to say" );

// mydemo_woker.js
//在worker内部，监听主线程发给自己的信息
addEventListener( "message", function(evt){
// evt.data
} );
//发送数据给主线程
postMessage( "a really cool reply" );
```
**注意，专用 Worker 和创建它的程序之间是一对一的关系。**

> 通常由`主页面`应用程序`创建 Worke`r，但`若是需要`的话，`Worker` 也可以`实例化`它自己的`子 Worker`，称为 subworker。有时候，把这样的细节委托给一个“主”Worker，由它来创建其他 Worker 处理部分任务，这样很有用。`不幸的是`，到写作本书时为
止，`Chrome 还不支持 subworker`，不过 Firefox 支持。


**Work的终止**

```js
//主页面手动终止
w1.terminate();


```
>突然终止Worker 线程不会给它任何机会完成它的工作或者清理任何资源。这就类似于通过关闭浏览器标签页来关闭页面。



#### Work运行环境及外部脚本加载

> **Work不可以访问主程序的任何资源，不能访问dom或者其他资源，但是可以执行网络操 作（Ajax、WebSockets）以及设定定时 器。还 有，Worker 可以访问几个重要的全局变量和功能的本地复 本，包括 navigator 、location 、JSON 和 applicationCache**


**可以通过 importScripts(..) 向 Worker 加载额外的 JavaScript 脚本：**

```js
// 在Worker内部
importScripts( "foo.js", "bar.js" );
```
**这些脚本加载是同步的。也就是说，importScripts(..) 调用会阻塞余下 Worker 的执行，直到文件加载和执行完成。**

#### Work数据传递

在`早期`的 Worker 中，唯一的选择就是把`所有数据序列化到一个字符串值中`，然后使用postMessage发送并使用addEventListener("message")的方式获取数据

**方法一：使用Transferable对象**
> 特别是对于大数据集而言，就是`使用 Transferable 对象` （http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast ）。

- 这时发生的是对象所有权的转移，数据本身并没有移动。一旦你把对象传递到一个 Worker 中，在原来的位置上，它就变为空的或者是不可访问的，这样就消除了多线程编程作用域共享带来的混乱。当然，所有权传递是可以双
向进行的。
- 如果`选择 Transferable 对象`的话，其实不需要做什么。任何`实现了 Transferable 接口`（http://developer.mozilla.org/en-US/docs/Web/API/Transferable ）`的数据结构就自动按照这种方式传输`（Firefox 和 Chrome 都支持）。

**使用结构化克隆算法**

> 如果要传递一个对象，可以使用结构化克隆算法 （structured clone algorithm）（https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm ）把这个对象复制到另一边。这个`算法非常高级`，甚至`可以处理`要复制的对象有`循环引用`的情况。这样就不用付出 to-string 和 from-string 的性能损失了，但是这种方案还是要`使用双倍的内存`。`IE10 及更高版本以及所有其他主流浏览器都支持这种方案`。


#### 共享Worker
> 常见情况：前面已经讲过每一个worker是独立的，但为了节省系统资源（在这一方面最常见的有限资源就是 socket 网络连接，因为浏览器限制了到同一个主机的同时连接数目。（2-8个之间，通常为6个））


**主页面实例化共享Woker**
```js
//创建一个整个站点或 app 的所有页面实例都可以共享的中心 Worker
var w1 = new SharedWorker( "http://some.url.1/mycoolworker.js" );




/**
因为共享 Worker 可以与站点的多个程序实例或多个页面连接，所以这个 Worker 需要通过某种方式来得知消息来自于哪个程
序。这个唯一标识符称为端口 （port），可以类比网络 socket 的端口。因此，调用程序必须使用 Worker 的 port 对象用于通
信：
**/
w1.port.addEventListener( "message", handleMessages );
// ..
w1.port.postMessage( "something cool" );

// 端口连接必须要初始化
w1.port.start();

```
**共享Worker内部**

> 共享 Worker 内部，`必须要处理额外的一个事件："connect"` 。这个事件为这个特定的连接提供了端口对象。保持多个连接独立的最简单办法就是使用 port 上的闭包

```js
// 在共享Worker内部
addEventListener( "connect", function(evt){
    // 这个连接分配的端口
    var port = evt.ports[0];
    port.addEventListener( "message", function(evt){
        // ..
        port.postMessage( .. );
        // ..
    } );
    // 初始化端口连接
    port.start();
} );

```

**共享Worker和Worker的区别**

> **如果有某个端口连接终止而其他端口连接仍然活跃，那么共享 Worker 不会终止。而对专用 Worker 来说，只要到实例化它的程序的连接终止，它就会终止**


#### Worker的模拟

- http://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills#web-workers 上列出了一些实现

- https://gist.github.com/getify/1b26accb1a09aa53ad25


### 单指令多数据 SIMD
> 单指令多数据（SIMD）是一种数据并行 （data parallelism）方式，与 Web Worker 的任务并行 （task parallelism）相对，因为这
里的重点实际上不再是把程序逻辑分成并行的块，而是并行处理数据的多个位。
**应用在：做并行数学处理；数据密集型的应用（信号分析、关于图形的矩阵运算，等等）**
对于可用的 SIMD 功能（http://github.com/johnmccutchan/ecmascript_simd ），有一个官方的（有希望的、值得期待的、面向未来的）prolyfill，


### asm.js
> asm.js 描述了 JavaScript 的一个很小的子集，它避免了 JavaScript 难以优化的部分（比如垃圾收集和强制类型转换），并
且让 JavaScript 引擎识别并通过激进的优化运行这样的代码。可以手工编写 asm.js，但是会极端费力且容易出错，类似于手写
汇编语言（这也是其名字的由来）。实际上，asm.js 也是高度优化的程序语言交叉编译的一个很好的目标，比如 Emscripten 把
C/C++ 转换成 JavaScript（https://github.com/kripken/emscripten/wiki ）。


## 第6章 微性能测试和调优

![](https://user-gold-cdn.xitu.io/2018/6/20/1641c336f145c542?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
### 性能测试

1. 使用[Benchmark.js](http://benchmarkjs.com/)

与其打造你自己的统计有效的性能测试逻辑,不如直接使用 Benchmark.js 库,它已经为你 实现了这些。但是,编写测试要小心,因为我们很容易就会构造一个看似有效实际却有缺 陷的测试,即使是微小的差异也可能扭曲结果,使其完全不可靠。

> 如果你想要对你的代码进行功能测试和性能测试，这个库应该最优先考
虑。
//一个简单例子
```js

function foo() {
// 要测试的运算
}
var bench = new Benchmark(
    "foo test", // 测试名称
    foo, // 要测试的函数（也即内容）
    {
    // .. // 可选的额外选项（参见文档）
    }
);
bench.hz; // 每秒运算数
bench.stats.moe; // 出错边界
bench.stats.variance; // 样本方差
```


2. jsPerf.com

从尽可能多的环境中得到尽可能多的测试结果以消除硬件/ 设备的偏差, 这一点很重要。 jsPerf.com 是很好的网站,用于众包性能测试运行。

一个比较以下几种转换数字性能的例子:
[点击这里看代码测试例子](https://jsperf.com/js-test-demo)
```js
var x = "42"; // 需要数字42
// 选择1：让隐式类型转换自动发生
var y = x / 2;
// 选择2：使用parseInt(..)
var y = parseInt( x, 0 ) / 2;
// 选择3：使用Number(..)
var y = Number( x ) / 2;
// 选择4：使用一元运算符+
var y = +x / 2;
// 选项5：使用一元运算符|
var y = (x | 0) / 2;

```

尾调用优化是 ES6 要求的一种优化方法。它使 JavaScript 中原本不可能的一些递归模式变 得实际。 TCO 允许一个函数在结尾处调用另外一个函数来执行,不需要任何额外资源。这意味着,对递归算法来说,引擎不再需要限制栈深度。


[参考:精读《你不知道的javascript》中卷](https://juejin.im/post/5b2a07c16fb9a00e36425ef0)

[参考：ECMAScript6 入门](http://es6.ruanyifeng.com/?search=import&x=0&y=0#docs/generator)
