---
sidebar: false
---

> 也许你可能在网上看到一大堆寄生式组合继承的样例，但是心中一直有困惑，为什么要这样做，此篇文章也许能帮你了解为什么这么实现。

一个寄生式组合继承的例子：

```js

function Foo(name) {
  this.name = name;
}
Foo.prototype.myName = function() {
  return this.name;
};
function Bar(name,label) {
  Foo.call( this, name );
  this.label = label;
}
// 我们创建了一个新的Bar.prototype 对象并关联到Foo.prototype
Bar.prototype = Object.create( Foo.prototype );
// 注意！现在没有Bar.prototype.constructor 了
// 如果你需要这个属性的话可能需要手动修复一下它
Bar.prototype.constructor=Bar;
Bar.prototype.myLabel = function() {
  return this.label;
};
var a = new Bar( "a", "obj a" );
a.myName(); // "a"
a.myLabel(); // "obj a"/

```
**疑问1：为什么this指向a?**
> 如果看了之前的this指向问题，那么就会明白new 一个对象，就会改变函数this执行到实例a上。


**Foo.call(this)的理解**
> 使用Foo.call(this)可以改变Foo函数内部的this指向，由于this执行的是a，那么在初始化Foo内部函数的操作时，相当于a.name=name;但是有一个缺点就是Foo的原型链并没有继承到。

如果不了解this指向问题，可以参考一下两个文章:
[JavaScript中改变this指向有几种方式](https://mrgaogang.github.io/article/javascript/JavaScript%E4%B8%AD%E6%94%B9%E5%8F%98this%E6%8C%87%E5%90%91%E6%9C%89%E5%87%A0%E7%A7%8D%E6%96%B9%E5%BC%8F.html)
[JavaScript中this绑定详解](https://mrgaogang.github.io/article/javascript/Javascript%E4%B8%ADthis%E7%BB%91%E5%AE%9A%E8%AF%A6%E8%A7%A3.html)



**为什么不使用Bar.prototype=Foo.prototype?**
> Bar.prototype = Foo.prototype 并不会创建一个关联到Bar.prototype 的新对象，它只是让Bar.prototype 直接引用Foo.prototype 对象。因此当你执行类似Bar.prototype.myLabel = ... 的赋值语句时会直接修改Foo.prototype 对象本身。

> 简单来说：**如果使用这样的形式，那么修改Bar.prototype就会影响到Foo.prototype，会影响到Foo关联的对象**；

**为什么使用Object.create(Foo.prototype)而不是new Foo（）**
> 上面讲了，Foo.call()可以解决实例a，继承Foo函数内部的属性，但是无法继承Foo的原型链；所以需要修改Bar.prototype；
> 使用Bar.prototype=new Foo();理论上是可以的，但是会造成两个副作用
1. **Foo函数被重复调用**。使用Foo.call已经调用了一次，再次使用new Foo，其构造函数会再次被调用；
2. 如果函数Foo 有一些副作用（比如写日志、修改状态、注册到其他对象、给this 添加数据属性，等等）的话，就会影响到Bar() 的“后代”，后果不堪设想。


**为什么使用Object.create?**
> 使用Object.create()可以创建一个新对象来提供prototype，如果你看过Object.create的polyfill就会明白，Object.create只继承了prototype并没有调用Foo构造函数。

> Object.create()会造成的一个问题：Bar.prototype.constructor会改变，为什么会改变？引用`你不知道的JavaScript上`中的一句话**如果你创建了一个新对象并替换了函数默认的.prototype 对象引用，那么新对象并不会自动获.constructor 属性。**

[Object.create()的理解](https://mrgaogang.github.io/article/javascript/%E5%AF%B9Object.create%E5%92%8C%E7%B1%BB%E5%BC%8F%E7%BB%A7%E6%89%BF%E7%9A%84%E7%90%86%E8%A7%A3.html)

> 那么如何解决这个问题 呢？直接使用Bar.prototype.constructor=Bar就可以了。

