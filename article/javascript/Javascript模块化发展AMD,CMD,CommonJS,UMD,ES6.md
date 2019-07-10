> 前端模块化的发展大致有如下：IIFE,CommonJS,AMD,CMD,UMD,Es6 Module

**模块化的好处**
- 避免命名冲突(减少命名空间污染)
- 更好的分离, 按需加载
- 更高复用性
- 高可维护性

## CommonJS 模块化
> **CommonJS是服务器端模块的规范**，**commonJS用同步的方式加载模块**,

> Node.js采用了这个规范。Node.JS首先采用了js模块化的概念。核心思想是通过
require方法来**同步地加载**依赖的其他模块，通过 module.exports 导出需要暴露的接口。

**特点**
- 1、根据CommonJS规范，一个单独的文件就是一个模块。
- 2、每一个模块都是一个单独的作用域，也就是说，在该模块内部定义的变量，无法被其他模块读取，除非定义为global对象的属性。
- 3、模块可以多次加载，但只会在第一次加载的时候运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果；模块的加载顺序，按照代码的出现顺序是同步加载的;
- 4、__dirname代表当前模块文件所在的文件夹路径，__filename代表当前模块文件所在的文件夹路径+文件名; 
- 5、require（同步加载）基本功能：读取并执行一个JS文件，然后返回该模块的exports对象，如果没有发现指定模块会报错; 
- 6、模块内的exports：为了方便，node为每个模块提供一个exports变量，其指向module.exports，相当于在模块头部加了这句话：var exports = module.exports，在对外输出时，可以给exports对象添加方法，PS：不能直接赋值（因为这样就切断了exports和module.exports的联系）;

```js
// 定义模块math.js
var basicNum = 0;
function add(a, b) {
  return a + b;
}
module.exports = { //在这里写上需要向外暴露的函数、变量
  add: add,
  basicNum: basicNum
}

// 引用自定义的模块时，参数包含路径，可省略.js
var math = require('./math');
math.add(2, 5);

// 引用核心模块时，不需要带路径
var http = require('http');
http.createService(...).listen(3000);


```
----
## AMD模块化
> AMD 是RequireJs在推广过程中对模块化定义的规范化产出。（异步模块）AMD 规范*主要是为了解决针对浏览器环境的模块化问题*。

### 特点
1. **AMD异步加载模块**。它的模块支持对象 函数 构造器 字符串 JSON等各种类型的模块。 

2. **AMD 推崇依赖前置、提前执行**;

3. 由于依赖的模块是异步加载的，那么**函数执行的时机为所有模块都加载完成了才执行。如果某个模块加载比较耗时，建议采用全局依赖的形式去加载顶层模块**。

4. requirejs 模块的加载顺序是不固定的，但执行顺序是固定的，按依赖声明的先后顺序执行.

### 优缺点
**AMD 的优点**
- 可在不转换代码的情况下直接在浏览器中运行
- 可加载多个依赖
- 代码可运行在浏览器环境和 Node.js 环境下

**AMD 的缺点**

- JavaScript 运行环境没有原生支持 AMD，需要先导入实现了 AMD 的库后才能正常使用。
- 由于依赖前置，那么及时在回调函数中没有使用依赖的模块，模块还是会被加载。

### AMD的库
- [requireJS](https://requirejs.org/) 
- [curl](https://github.com/cujojs/curl)


### requireJS的使用
> 使用requireJS:用require.config()指定引用路径等，用define()定义模块，用require()加载模块。
```js
//首先我们需要引入require.js文件和一个入口文件main.js。main.js中配置require.config()并规定项目中用到的基础模块。
/** 网页中引入require.js及main.js **/
<script src="js/require.js" data-main="js/main"></script>

/** main.js 入口文件/主模块 **/
// 首先用config()指定各模块路径和引用名
require.config({
  baseUrl: "js/lib",
  paths: {
    "jquery": "jquery.min",  //实际路径为js/lib/jquery.min.js
    "underscore": "underscore.min",
  }
});
// 执行基本操作
require(["jquery","underscore"],function($,_){
  // some code here
});

```
> 引用模块的时候，我们将模块名放在[]中作为reqiure()的第一参数；如果我们定义的模块本身也依赖其他模块,那就需要将它们放在[]中作为define()的第一参数。

```js
// 定义math.js模块
define(function () {
    var basicNum = 0;
    var add = function (x, y) {
        return x + y;
    };
    return {
        add: add,
        basicNum :basicNum
    };
});
// 定义一个依赖underscore.js的模块
define(['underscore'],function(_){
  var classify = function(list){
    _.countBy(list,function(num){
      return num > 30 ? 'old' : 'young';
    })
  };
  return {
    classify :classify
  };
})

// 引用模块，将模块放在[]内,模块的加载是异步，只有两者都加载完成才调用回调函数
require(['jquery', 'math'],function($, math){
  var sum = math.add(10,20);
  $("#sum").html(sum);
});

```


## CMD模块化
> CMD是另一种js模块化方案，它与AMD很类似，不同点在于：AMD 推崇依赖前置、提前执行，**CMD推崇依赖就近、延迟执行**。此规范其实是在sea.js推广过程中产生的。

### 特点
- 依赖就近，延时执行
- CMD是按需加载依赖，在用到那个模块再去require


### CMD & AMD间的区别
- AMD依赖前置，在定义模块时就声明其所要依赖的模块
- CMD是按需加载依赖，在用到那个模块再去require
- AMD在使用前就准备好，CMD是用到了再去准备模块

| | AMD | CMD |
| --- | --- | --- |
| 定义module时对依赖的处理 | 推崇依赖前置，在定义的时候就要声明其依赖的模块 | 推崇就近依赖，只有在用到这个module的时候才去require
| 加载方式 |  async | async |
| 执行module的方式 | 加载module完成后就会执行该module，所有module都加载执行完成后会进入require的回调函数，执行主逻辑。**依赖的执行顺序和书写的顺序不一定一致，谁先下载完谁先执行**，但是主逻辑 一定在所有的依赖加载完成后才执行(有点类似Promise.all)。 | 加载完某个依赖后并不执行，只是下载而已。在所有的module加载完成后进入主逻辑，遇到require语句的时候才会执行对应的module。**module的执行顺序和书写的顺序是完全一致的**。

```js
/** AMD写法 **/
define(["a", "b", "c", "d", "e", "f"], function(a, b, c, d, e, f) { 
     // 等于在最前面声明并初始化了要用到的所有模块
    a.doSomething();
    if (false) {
        // 即便没用到某个模块 b，但 b 还是提前执行了
        b.doSomething()
    } 
});

/** CMD写法 **/
define(function(require, exports, module) {
    var a = require('./a'); //在需要时申明
    a.doSomething();
    if (false) {
        var b = require('./b');
        b.doSomething();
    }
});

/** sea.js **/
// 定义模块 math.js
define(function(require, exports, module) {
    var $ = require('jquery.js');
    var add = function(a,b){
        return a+b;
    }
    exports.add = add;
});
// 加载模块
seajs.use(['math.js'], function(math){
    var sum = math.add(1+2);
});

```


### sea.js的使用
[sea.js](https://github.com/seajs/seajs/issues/242)
1. 引入sea.js的库
2. 如何变成模块？ - define - 
3. 如何调用模块？  -exports -sea.js.use 
4. 如何依赖模块？ -require

```js
 <script type="text/javascript">
        define(function (require,exports,module) {
            //exports : 对外的接口
            //requires : 依赖的接口
            require('./test.js');//如果地址是一个模块的话，那么require的返回值就是模块中的exports
        })
</script> 

```


## UMD 模块化
**UMD是AMD和CommonJS和 全局对象(Global Object)的融合**

> AMD模块以浏览器第一的原则发展，异步加载模块。

> CommonJS模块以服务器第一原则发展，选择同步加载，它的模块无需包装(unwrapped modules)。
这迫使人们又想出另一个更通用的模式UMD （Universal Module Definition）。希望解决跨平台的解决方案。

**UMD先判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。然后判断是否支持Node.js的模块（exports）是否存在，存在则使用Node.js模块模式。**

```js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['b'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('b'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.b);
    }
}(typeof self !== 'undefined' ? self : this, function (b) {
    // Use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {};
}));
```



## ES6模块化
> ECMAScript6 标准增加了 JavaScript 语言层面的模块体系定义，作为浏览器和服务器通用的模块解决方案它可以取代我们之前提到的 AMD ，CMD , UMD ,CommonJS。

> 关于 ES6 的 Module 相信大家每天的工作中都会用到，对于使用上有疑问可以看看 [ES6 Module 入门，阮一峰](http://es6.ruanyifeng.com/?search=import&x=0&y=0#docs/module);

### 特点
- ES6模块导入的变量(其实应该叫常量更准确)具有以下特点： **变量提升**、相当于被Object.freeze()包装过一样、import/export只能在顶级作用域


 ### ES6 模块与 CommonJS 模块的差异
1. *CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用*。
    - CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
    - ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个`只读引用`。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

2. *CommonJS 模块是运行时加载，ES6 模块是编译时输出接口*。
    - 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。
    - 编译时加载: ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。即在`import时可以指定加载某个输出值`，而不是加载整个模块，这种加载称为“编译时加载”。
3. ES6模块区别于CommonJS的运行时加载，import 命令会被JavaScript引擎静态分析，优先于模块内的其他内容执行(类似于函数声明优先于其他语句那样)， 也就是说在`文件的任何位置import引入模块都会被提前到文件顶部`。


4. *ES6的模块 自动开启严格模式，即使没有写'use strict';*
> 运行一个包含import声明的模块时，被引入的模块先导入并加载，然后根据依赖关系，`每个模块的内容会使用深度优先的原则进行遍历。跳过已经执行过的模块，避免依赖循环`
CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成

### 使用示例
```js
import { prop } from 'app';   //从app中导入prop
import { prop as newProp } from 'app';   // 功能和上面一样，不过是将导入的prop重命名为newProp

import App from 'App';   // 导入App的default
import * as App from 'App';  // 导入App的所有属性到App对象中

export const variable = 'value'; // 导出一个名为variable的常量
export {variable as newVar};   // 和import 的重命名类似，将variable作为newVar导出

export default variable = 'value';  // 将variable作为默认导出
export {variable as default};   //  和上面的写法基本一样

export {variable} from 'module';  // 导出module的variable ，该模块中无法访问
export {variable as newVar} from 'module';  // 下面的自己看  不解释了
export {variable as newVar} from 'module';
export * from 'module';


```



参考:

- [前端开发之模块化开发中的规范讲解--commonjs、AMD、CMD、ES6](https://juejin.im/post/5b4608faf265da0f98314133)
- [前端模块化：CommonJS,AMD,CMD,ES6](https://juejin.im/post/5aaa37c8f265da23945f365c)

- [AMD, CMD, CommonJS和UMD](https://segmentfault.com/a/1190000004873947)
