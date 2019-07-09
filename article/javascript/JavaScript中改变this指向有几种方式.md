
##JavaScript中改变this指向有几种方式
> this 永远指向函数运行时所在的对象，而不是函数被创建时所在的对象。

（1）**作为函数名调用**

  函数作为全局对象调用，this指向全局对象
```js
function a(){
    var author = "lry";
    console.log(this.author); //undefined
    console.log(this); //Window
}
a(); //其实这是相当于 window.a()
```

（2）**作为方法调用**

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
