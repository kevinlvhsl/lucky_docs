


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


> 类数组：有时需要将类数组（一组通过数字索引的值）转换为真正的数组。通常使用**Array.prototype.slice.call(类数组);和Array.from(类数组)**


### 字符串
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

- 字符串反正













[参考:精读《你不知道的javascript》中卷](https://juejin.im/post/5b2a07c16fb9a00e36425ef0)
