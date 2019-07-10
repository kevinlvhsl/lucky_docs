

### bind函数polyfill的理解
> bind()方法创建一个新的函数，在bind()被调用时，这个新函数的this被bind的第一个参数指定，其余的参数将作为新函数的参数供调用时使用。

**一个例子**
```js
function bFun(){
  this.d=10;
  return this.a;
}
var func=bFun.bind({a:20});
func();//20
new func();//bFun {d:10} ，使用new 构造函数 方式创建，this指向为对象实例，而不是传入的{a:20}
```

**Polyfill**
```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {//oThis为需要绑定的对象也就是上例中的{a:20}
    // this为上例中的bFun，要求必须为函数类型
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    //将bind函数传入的参数从第1个(index从0开始)开始转换成数组，因为第0个为传入的绑定对象。arguments为类数组
    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
          // 由于使用new 方式创建的对象，this指向为对象的实例，此处判断如果使用new方式创建那么this应该为对象实例的this
          // 否则使用上下文绑定为传入的对象
          return fToBind.apply(this instanceof fBound
                 ? this
                 : oThis,
                 // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                 // 函数的参数：应该为bind时传入的参数+调用生成的函数时传入的参数和
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 维护原型关系
    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP();

    return fBound;
  };
}

```
> 其中如下代码作用和fBound.prototype=Object.create(this.prototype)作用一样，
效果为：**生成的新函数(func)应该继承于原有函数(bFun)原型链**
```js

 fNOP    = function() {},
 if (this.prototype) {
   fNOP.prototype = this.prototype; 
 }
 fBound.prototype = new fNOP();
```
