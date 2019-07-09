
> this对象是在运行时基于函数的执行环境绑定的：在全局函数中，this等于window，而当函数被作为某个对象调用时，this等于那个对象。不过，匿名函数具有全局性，因此this对象同常指向window

## JavaScript中改变this指向有几种方式
> this 永远指向函数运行时所在的对象，而不是函数被创建时所在的对象。

（1）**作为函数名调用**
> 当函数不作为对象的属性被调用时候，也就是我们所说的普通函数方式，此时的this总是指向全局的对象。在浏览器的js里面，这个全局对象是window对象。
```js
function a(){
    var author = "lry";
    console.log(this.author); //undefined
    console.log(this); //Window
}
a(); //其实这是相当于 window.a()

//或者

window.name = "globalName";
var myObject = {
  name: "louis",
  getName: function () {
    return this.name;
  }
}
var getName = myObject.getName;
console.log(getName()); // "globalName"
```

（2）**作为对象方法调用**

> 函数作为对象中的一个属性，成为该对象的一个方法，this指向该对象

```js
var o = {
    author:"lry",
    fn:function(){
        console.log(this.author);  //lry
    }
}
o.fn(); //this => o
```
 

（3）**使用构造函数调用**

> 使用new调用的函数，则其中this将会被绑定到那个新构造的对象。（首先new关键字会创建一个空的对象，然后会自动调用一个函数方法(apply...)，将this指向这个空对象，这样的话函数内部的this就会被这个空的对象替代）

> 除了宿主提供的一些内置函数，大部分js函数都可以当成构造器使用，构造器的外表看起来和普通的函数没有什么区别，他们的区别在于调用方式，当使用new运算符调用函数的时候，该函数总是返回一个对象，通常情况下，构造器里面的this就是指向返回的这个对象。

```js
function Fn() {
    this.author = "lry"
}
var o = new Fn();
console.log(o.author); //lry
 
```
（4）**apply或call,bind调用**
> 自行改变this指向，函数this指向apply或call方法调用时的第一个参数

```js
var o = {
    author:"lry",
    fn:function(){
        console.log(this.author); //lry
    }
}
var b = o.fn;
b.call(o); //或者 b.apply(o)

var o = {
    a:10,
    b:{
        a:20,
        fn:function(){
            console.log(this.a); //20
        }
    }
}
o.b.fn();
```
 

> 这里的this为什么不是指向o？如果按照上面的理论，最终this指向的是调用它的对象，因为 如果一个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，this指向的也只是它上一级的对象。看下面例子：虽然对象b中没有属性a，但this仍然指向的是它的上一级对象b

```js
var o = {
    a:10,
    b:{
        //a:20,
        fn:function(){
            console.log(this.a); //undefined
        }
    }
}
o.b.fn();
```
 

特殊情况：

```js
var o = {
    a:10,
    b:{
        a:20,
        fn:function(){
            console.log(this.a); //undefined
            console.log(this); //window
        }
    }
}
var c = o.b.fn;
c();
```


## 丢失的this
下面看一个经常遇到的问题：
```js
var obj = {
  myName: "louis",
  getName: function () {
    return this.name;
  }
}

console.log(obj.getName()); // louis;
var getName2 = obj.getName;
console.log(getName2()) // undefined
```
> 当调用obj.getName时，getName方法是作为obj对象的属性被调用的，根据上文提到的规律，此时的this指向obj对象，所以obj.getName()输出'louis'。
> 当用另外一个变量getName2来引用obj.getName，并且调用getName2时，
此时是普通函数调用方式，this是指向全局window的，window上面并没有挂载任何属性所以程序的执行结果是undefined。


再看另一个例子，document.getElementById这个方法名实在有点过长，我们大概尝试过用一个短的函数来代替它，如同prototype.js等一些框架所做过的事情:
```js
var getId = function (id) {
  return document.getElementById(id);
};

getId('div1');
```
我们也许思考过为什么不能用下面这种更简单的方式
```js
var getId = document.getElementById;
getId( 'div1' );
```
现在不妨花1分钟时间，让这段代码在浏览器中运行一次
 ```js      
<div id="div1">我是一个div</div>

var getId = document.getElementById;
getId( 'div1' );
```
> 在chrome friefox IE10 中执行过后就会发现，这段代码抛出一个异常,这是因为很多引擎的document.getElementById 方法的内部实现中需要用到this，这个this本来被期望指向document，当getElementById方法作为document对象的属性被调用时，方法内部的this确实是指向document的。
但是当getId来引用document,getElementById之后，再调用getId，此时就成了普通的函数调用了，函数内部的this指向了window，而不是原来的document。
我们可以尝试利用apply把document当做this传递给getId函数，修正 this指向问题。
```js
document.getElementById = (function(func){
  return function(){
    return func.apply(document,arguments);
  }
})(document.getElementById);

var getId = document.getElementById;
var div = getId('div1');

alert(div.id);
```

> 参考：[深入学习js之——this](https://juejin.im/post/5ca07828e51d4501373839ec)
