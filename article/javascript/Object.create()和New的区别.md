> 引用官方的一句话：Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 
Object.create(proto, [propertiesObject])
- proto
新创建对象的原型对象。
- propertiesObject
可选。如果没有指定为 undefined，则是要添加到新创建对象的可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性）
对象的属性描述符以及相应的属性名称。这些属性对应Object.defineProperties()的第二个参数。

### Object.create()的polyfill实现
```js
if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        if (typeof propertiesObject != 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
        //核心是下面的代码
        function F() {}
        F.prototype = proto;
        return new F();
    };
}
```

### New和Object.create()的区别

**New**
> 语法： new constructor ( [aguments] ) 

由此我们可以看出，实际new创建对象，就是调用构造函数来实例化，在调用构造函数的时候会执行以下操作：
- 创建一个新的对象
- 将新对象执行原型操作，指向构造函数的原型
- 将this绑定到新对象上（可以使用 call 或者 apply 强制转换执行环境）
- 构造函数返回的对象就是实例化的结果，如果构造函数没有显示返回一个对象，则返回新的对象

**Object.create()**

> 语法：Object.create ( proto, [ propertiesObject ] ) 
> 该方法有两个参数，第一个 proto 是一个对象，作为新建对象的原型；第二个参数是一个对象，该对象的属性名称是新创建的对象的属性名称。如果 propertiesObject 参数不是 null 或者一个对象，则会抛错。使用该方法，创建对象会执行以下步骤：

- 方法内部定义一个新的空对象obj
- 将obj.__proto__的对象指向传入的参数proto
- 将传入的对象属性复制到obj并且返回obj

**区别**

| 比较 |	new |	Object.create
| --- | --- | --- |
| 构造函数 |	保留原构造函数属性	|丢失原构造函数属性(这就是为什么使用寄生式组合时需要重新设置构造函数)
|原型链	| 原构造函数prototype属性	| 原构造函数/（对象）本身
| 作用对象	| function	|function和object

参考：
[New 和 Object.create()的区别](https://blog.csdn.net/DepressedPrince/article/details/80909636)
