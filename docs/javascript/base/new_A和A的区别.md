---
sidebar: false
---

```js
function Me(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;
}
//请问这以下两种实例化对象方式有什么区别呢？

var mefun1 = new Me('fei','20','it');
var mefun2 = Me('fei','20','it');

```

- 第一种是构造函数式，即通过new运算符调用构造函数Function来创建函数
- 第二种不是实例化，只是调用函数把返回值赋给变量。

JavaScript 中并没有真正的类，但JavaScript 中有构造函数和new 运算符。构造函数用来给实例对象初始化属性和值。任何JavaScript 函数都可以用做构造函数，构造函数必须使用new 运算符作为前缀来创建新的实例。

new 运算符改变了函数的执行上下文，同时改变了return 语句的行为。实际上，使用new和构造函数很类似于传统的实现了类的语言:
```js
// 实例化一个Me
var alice = new Me('alice', 18, 'Coder');
// 检查这个实例
assert( alice instanceof Me );
```
构造函数的命名通常使用驼峰命名法，首字母大写，以此和普通的函数区分开来，这是一种习惯用法。
```js
// 不要这么做!
Me('alice', 18, 'Coder'); //=> undefined
```
> 这个函数只会返回undefined，并且执行上下文是window（全局）对象，无意间创建了3个全局变量name,age,job。调用构造函数时不要丢掉new 关键字。

当使用new 关键字来调用构造函数时，执行上下文从全局对象（window）变成一个空的上下文，这个上下文代表了新生成的实例。
因此，this 关键字指向当前创建的实例。尽管理解起来有些绕，实际上其他语言内置类机制的实现也是如此。

默认情况下，如果你的构造函数中没有返回任何内容，就会返回this——当前的上下文。

要不然就返回任意非原始类型的值.

[转载：javascript中使用new与不使用实例化对象的区别](https://blog.csdn.net/weixin_34126557/article/details/85984016)
