

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

> 如果要传递多个值，你就必须要把它们封装在单个值中传递，比如通过一个数组或对象。

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


### Promise 其他函数

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

[参考:精读《你不知道的javascript》中卷](https://juejin.im/post/5b2a07c16fb9a00e36425ef0)
