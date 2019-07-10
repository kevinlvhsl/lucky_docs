
### 对类式继承的理解
**疑问1？实现类式继承时为啥是 B.prototype = new A(); 而不是 B.prototype = A or B.prototype = A.prototype？**

> 1. __proto__ 与 prototype 的区别prototype是类(构造函数)才有的!! __proto__是对象拥有的! 因为函数也是对象, 
所有函数也有__proto__.__proto__是为了实现继承, prototype是为了定义一些公用属性和方法.

```js
var b = new B();
// 解释:那么 
b.__proto__ == B.prototype == A
A.__proto__ == Function.prototype
Function.prototype.__proto__ == Object.prototype
Object.prototype.__proto__ == null
//所以通过__proto__永远找不到A.prototype, 所以 B 不能继承 A
```

**疑问2? 这里为啥是 B.prototype = new A(); 而不是B.prototype == A.prototype**
> 继承的目的

- **1. 复用父类方法**
- **2. 有权添加/重写父的方法但继承决不允许改变父的方法和属性, 对于父子是只读的.**
```js
//所以 B.prototype == A.prototype使得两者成为一体, 一旦修改 全部都修改了, 所以不行
//而 B.prototype == new A() 
//假设 var a = new A()那么向上链起来:B.protype == a
var b = new B();
b.__proto__ == B.prototype == a
a.__proto__ == A.prototype 
// 这一步也证明B继承了A  B.prototype.xxx= function() {} 这里添加的xxx方法只是改变了a而已(一个局部变量),不会影响到A.prototype
```

### 对Object.create()的理解
> Object.create()的作用：Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
> 简单理解为：创建一个新的对象，来实现原型链的继承。

**Polyfill的实现**
```js
Object.create=function(proto){
  function F() {}
  F.prototype = proto;
  return new F();

}
//demo
 var prototype = Object.create(superType.prototype); // 创建对象
 prototype.constructor = subType; // 增强对象
 subType.prototype = prototype; // 指定对象

```
> **使用Object.create()方式实现原型链集成，其构造函数没有继承**。这就是为什么你会发现在使用寄生式组合集成时使用Object.create()之后还需要
> 指定构造函数。

> 看了前面的类式继承的理解，再来看Object的polyfill实现，为什么要使用一个中转函数来实现原型链的集成。
- 如果直接使用 subType.prototype=new superType();会将superType的构造函数也会继承；这就违背了Object.create()的定义：实现原型链的集成
- 如果使用subType.prototype=supertype.prototype;实现原型链集成，会导致对subType.prototype原型链的修改影响到supertype的原型链。
