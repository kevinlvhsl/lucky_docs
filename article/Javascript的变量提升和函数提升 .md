## Javascript的变量提升和函数提升 

> 在JavaScript执行代码的过程中是一段一段从上往下执行代码。执行代码之前是有一个预处理过程的，比如变量的提升和函数提升。

### 一、变量提升

通常我们会遇到如下的代码:

```js
console.log(a); //输出结果:undefined
var a="mr gao";
console.log(a);//输出结果:mr gao

function demo(){
  console.log(a);//输出结果:undefined
  var a="demo";
  console.log(a);//输出结果:demo

}
demo();

```

其实javascript在预处理过程时，会将声明的变量提升至对应作用域的顶端；所以上述的代码类似于:
```js
var a; //变量提升，如果当前作用域有相同的变量名，则会被提升至同一位置。
console.log(a); //输出结果:undefined
a="mr gao";
console.log(a);//输出结果:mr gao

function demo(){
  var a;
  console.log(a);//输出结果:undefined
  a="demo";
  console.log(a);//输出结果:demo

}
demo();
```

### 二、函数提升

在搞懂函数提升之前先要了解函数声明的几种方式:

```js
//1:函数声明方式
function funName(){

}

//2:函数表达式
}
var funName=function(){

}
//3:函数对象方式

var funcName=new Function();

```

> **只有函数声明方式采用函数作用域的提升**

例子：
```js

demo();//结果为:undefined
var age=20;//这个变量的声明会提升到变量使用之前
function demo() {
    console.log(age);//undefined
    var age=30;
}
//代码解析过程为
var age;
function demo() {
    var age;
    console.log(age);
    age=30;
}
demo();
age=20;
```

### 参考:
- [JavaScript 解析器、预解析、变量提升、函数提升](https://blog.csdn.net/weixin_42787326/article/details/81328757)
