


## 第一章 类型

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



## 第二章  值
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



## 原生函数

![](https://user-gold-cdn.xitu.io/2018/6/20/1641c303afb22377?imageslim)
![](https://user-gold-cdn.xitu.io/2018/6/20/1641c306f032cf04?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

[参考:精读《你不知道的javascript》中卷](https://juejin.im/post/5b2a07c16fb9a00e36425ef0)
